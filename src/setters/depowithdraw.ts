import { Log } from '../types/log';
import { contracts } from '../../addresses';
import { TransferTx } from '../../generated/schema';
import { DepoWithdraw } from '../types/depowithdraw';
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
    getFactor,
    getStoredFactor
} from '../setters/factors';
import {
    NUM,
    ADDR,
    DECIMALS,
    G2_START_BLOCK,
    TOKEN as Token,
    TX_TYPE as TxType,
    ERC20_TRANSFER_SIG,
} from '../utils/constants';

// global vars to manage emergency <token> and <from>
let emergencyToken = '';
let emergencyFrom = ADDR.ZERO;


// core deposits & withdrawals
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
        ? getCoinAmount(logs, tx, false)
        : tokenToDecimal(ev.coinAmount, 18, DECIMALS);
    tx.usd_amount = tokenToDecimal(ev.usdAmount, 18, DECIMALS);
    tx.factor = getFactorForOldProtocol(ev.block, token);
    tx.pool_id = ev.poolId;
    tx.save();
    return tx;
}

// core emergency withdrawals
export const setEmergencyWithdrawTx = (
    ev: DepoWithdraw,
    logs: Log[],
): TransferTx => {
    let tx = new TransferTx(ev.id);
    tx.contract_address = ev.contractAddress;
    tx.block_number = ev.block;
    tx.block_timestamp = ev.timestamp;
    tx.type = ev.type;
    tx.hash = ev.hash;
    tx.coin_amount = getCoinAmount(logs, tx, true);
    tx.user_address = emergencyFrom;
    tx.from_address = emergencyFrom;
    tx.to_address = Address.zero();
    tx.token = emergencyToken;
    const pricePerShare = getPricePerShare(emergencyToken);
    tx.usd_amount = (tx.coin_amount.times(pricePerShare)).truncate(DECIMALS);
    tx.factor = (emergencyToken === Token.PWRD)
        ? getStoredFactor(emergencyToken)
        : getFactor(emergencyToken);
    tx.pool_id = ev.poolId;
    tx.save();
    return tx;
}

// staker deposits & withdrawals
// emergencyWithdrawals only affect PWRD: in this case, the factor needs to be applied
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
    tx.token = token
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

export function getCoinAmount(
    logs: Log[],
    tx: TransferTx,
    isEmergency: boolean
): BigDecimal {
    const gvtAddress = Address.fromString(contracts.GvtAddress);
    const pwrdAddress = Address.fromString(contracts.PwrdAddress);
    for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        if (
            (log.address == gvtAddress
                || log.address == pwrdAddress)
            && log.topics[0].toHexString() == ERC20_TRANSFER_SIG
            && log.topics.length === 3
        ) {
            const from = ethereum.decode('address', log.topics[1])!.toAddress();
            const to = ethereum.decode('address', log.topics[2])!.toAddress();
            if ((tx.type === TxType.CORE_DEPOSIT && from == Address.zero())
                || (tx.type === TxType.CORE_WITHDRAWAL && to == Address.zero())) {
                if (isEmergency) {
                    emergencyToken = (log.address == gvtAddress) ? Token.GVT : Token.PWRD;
                    emergencyFrom = from;
                }
                const value = ethereum.decode('uin256', log.data)!.toBigInt();
                return tokenToDecimal(value, 18, DECIMALS);
            }
        }
    }
    showLog.error(
        'getCoinAmount():{} coin amount not found from Transfer event through tx {} in /setters/depowithdraw.ts',
        [
            tx.token,
            tx.hash.toHexString()
        ]);
    return NUM.ZERO;
}

function getFactorForOldProtocol(blockNumber: number, token: string): BigDecimal {
    if (token == Token.PWRD && blockNumber < G2_START_BLOCK)
        return getStoredFactor(token);

    return getFactor(token);
}
