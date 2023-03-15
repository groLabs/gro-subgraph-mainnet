// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Stores deposits & withdrawals into entity <TransferTx>

import { Log } from '../types/log';
import { TransferDataFromTx } from '../types/tx'
import { TransferTx } from '../../generated/schema';
import { DepoWithdraw } from '../types/depowithdraw';
import {
    gvtAddress,
    pwrdAddress,
} from '../utils/contracts';
import {
    getFactor,
    getStoredFactor
} from './factors';
import {
    Address,
    ethereum,
    BigDecimal,
    log as showLog,
} from '@graphprotocol/graph-ts';
import {
    tokenToDecimal,
    getTokenByPoolId,
    getPricePerShare,
} from '../utils/tokens';
import {
    NUM,
    DECIMALS,
    G2_START_BLOCK,
    TOKEN as Token,
    TX_TYPE as TxType,
    ERC20_TRANSFER_SIG,
} from '../utils/constants';


/// @notice Stores core deposits & withdrawals into entity <TransferTx>
/// @dev:
///     - The USD value is not provided by Deposit/Withdrawal handlers,
///       so ev.coinAmount is zero and needs to be calculated through the
///       Transfer event within the same deposit or withdrawal tx
///     - On the other hand, USD value is provided by GRouter events and
///       is already available in ev.coinAmount
///     - Triggered by the following events:
///         <LogNewDeposit> from DepositHandlers
///         <LogDeposit> from GRouter
///         <LogNewWithdrawal> from WithdrawHandlers
///         <LogWithdrawal> from GRouter
/// @param ev the parsed deposit or withdrawal event
/// @params logs all logs from the deposit or withdrawal transaction
/// @return deposit or withdrawal object from entity <TransferTx>
export const setDepoWithdrawTx = (
    ev: DepoWithdraw,
    logs: Log[],
    token: string,
): TransferTx => {
    let tx = new TransferTx(ev.id);
    tx.contract_address = ev.contractAddress;
    tx.block_number = ev.block;
    tx.block_timestamp = ev.timestamp;
    tx.token = token;
    tx.type = ev.type;
    tx.hash = ev.hash;
    tx.user_address = ev.userAddress;
    tx.from_address = ev.fromAddress;
    tx.to_address = ev.toAddress;
    tx.coin_amount = ev.coinAmount.isZero()
        ? getTransferDataFromTx(logs, tx).amount
        : tokenToDecimal(ev.coinAmount, 18, DECIMALS);
    tx.usd_amount = tokenToDecimal(ev.usdAmount, 18, DECIMALS);
    tx.factor = getFactorForOldProtocol(ev.block, token);
    tx.pool_id = ev.poolId;
    tx.save();
    return tx;
}

/// @notice Stores core emergency withdrawals into entity <TransferTx>
/// @dev:
///     - Emergency withdrawal events come empty, so both the coin amount
///       and value need to be retrieved from the Transfer log within the
///       withdrawal transaction
///     - Can affect both Gvt & Pwrd
///     - Triggered by <LogEmergencyWithdrawal> event from EmergencyWithdrawal
/// @param ev the parsed withdrawal event
/// @params logs all logs from the withdrawal transaction
/// @return withdrawal object from entity <TransferTx>
export const setEmergencyWithdrawTx = (
    ev: DepoWithdraw,
    logs: Log[],
): TransferTx => {
    let tx = new TransferTx(ev.id);
    tx.type = ev.type;
    tx.hash = ev.hash;
    tx.contract_address = ev.contractAddress;
    tx.block_number = ev.block;
    tx.block_timestamp = ev.timestamp;
    const transferData = getTransferDataFromTx(logs, tx);
    tx.coin_amount = transferData.amount;
    tx.user_address = transferData.from;
    tx.from_address = transferData.from;
    tx.to_address = Address.zero();
    tx.token = transferData.token;
    const pricePerShare = getPricePerShare(transferData.token);
    tx.usd_amount = (tx.coin_amount.times(pricePerShare)).truncate(DECIMALS);
    tx.factor = (transferData.token === Token.PWRD)
        ? getStoredFactor(transferData.token)
        : getFactor(transferData.token);
    tx.pool_id = ev.poolId;
    tx.save();
    return tx;
}

/// @notice Stores staker deposits, withdrawals & emergency withdrawals into 
///         entity <TransferTx>
/// @dev:
///     - Emergency withdrawals only affect Pwrd, in which case the factor needs 
///       to be applied
///     - Triggered by the following events:
///         <LogDeposit> from Staker
///         <LogWithdraw> from Staker
///         <LogEmergencyWithdraw> from Staker
/// @return staker deposit or withdrawal object from entity <TransferTx>
export const setStakerDepoWithdrawTx = (
    ev: DepoWithdraw,
    isEmergencyWithdrawal: boolean
): TransferTx => {
    const token = getTokenByPoolId(ev.poolId);
    const factor = getFactor(token);
    const cointAmount = tokenToDecimal(ev.coinAmount, 18, DECIMALS);
    let tx = new TransferTx(ev.id);
    tx.contract_address = ev.contractAddress;
    tx.block_number = ev.block;
    tx.block_timestamp = ev.timestamp;
    tx.token = token;
    tx.type = ev.type;
    tx.hash = ev.hash;
    tx.user_address = ev.userAddress;
    tx.from_address = ev.fromAddress;
    tx.to_address = ev.toAddress;
    tx.coin_amount = isEmergencyWithdrawal
        ? cointAmount.times(factor)
        : cointAmount;
    tx.usd_amount = tokenToDecimal(ev.usdAmount, 18, DECIMALS);
    tx.factor = factor;
    tx.pool_id = ev.poolId;
    tx.save();
    return tx;
}

/// @notice Retrieves coin amount and from address from a gvt or pwrd <Transfer>
///         event within a deposit or withdrawal transaction
/// @param logs the logs from the deposit or withdrawal transaction
/// @param tx the (partly) transfer object from entity <TransferTx>
/// @return a <TransferDataFromTx> object with the following fields:
///         - from: the from address from the transfer event
///         - amount: the amount from the transfer event
///         - token: the transfer token (gvt or pwrd)
function getTransferDataFromTx(
    logs: Log[],
    tx: TransferTx,
): TransferDataFromTx {
    let from = Address.zero();
    let amount = NUM.ZERO;
    let token = Token.UNKNOWN;
    for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        if (
            (log.address == gvtAddress
                || log.address == pwrdAddress)
            && log.topics[0].toHexString() == ERC20_TRANSFER_SIG
        ) {
            const _from = ethereum.decode('address', log.topics[1])!.toAddress();
            const _to = ethereum.decode('address', log.topics[2])!.toAddress();
            if ((tx.type === TxType.CORE_DEPOSIT && _from == Address.zero())
                || (tx.type === TxType.CORE_WITHDRAWAL && _to == Address.zero())) {
                const _amount = ethereum.decode('uin256', log.data)!.toBigInt();
                const result = new TransferDataFromTx(
                    _from,
                    tokenToDecimal(_amount, 18, DECIMALS),
                    (log.address == gvtAddress) ? Token.GVT : Token.PWRD
                )
                return result;
            }
        }
    }
    showLog.error(
        'getTransferDataFromTx(): Transfer event not found in tx {} in /setters/depowithdraw.ts',
        [tx.hash.toHexString()]
    );
    const result = new TransferDataFromTx(
        from,
        amount,
        token,
    )
    return result;
}

/// @return:
///     - stored factor if it's pre-G2 and pwrd token
///     - current factor otherwise
function getFactorForOldProtocol(
    blockNumber: number,
    token: string
): BigDecimal {
    if (token == Token.PWRD
        && blockNumber < G2_START_BLOCK
    ) {
        return getStoredFactor(token);
    } else {
        return getFactor(token);
    }
}
