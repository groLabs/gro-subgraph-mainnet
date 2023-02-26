import { Log } from '../types/log';
import { contracts } from '../../addresses';
import { TransferTx } from '../../generated/schema';
import { DepoWithdraw } from '../types/depowithdraw';
import {
    Bytes,
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
    DECIMALS,
    ERC20_TRANSFER_SIG,
    G2_START_BLOCK
} from '../utils/constants';

// global vars to manage emergency <token> and <from>
let emergencyToken = '';
let emergencyFrom = Address.zero();


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
    tx.hash = Bytes.fromHexString(ev.id.split('-')[0]);
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
    tx.hash = Bytes.fromHexString(ev.id.split('-')[0]);
    tx.coin_amount = getCoinAmount(logs, tx, true);
    tx.user_address = emergencyFrom.toHexString();
    tx.from_address = emergencyFrom;
    tx.to_address = Address.zero();
    tx.token = emergencyToken;
    const pricePerShare = getPricePerShare(emergencyToken);
    tx.usd_amount = (tx.coin_amount.times(pricePerShare)).truncate(DECIMALS);
    tx.factor = (emergencyToken === 'pwrd')
        ? getStoredFactor(emergencyToken)
        : getFactor(emergencyToken);
    tx.pool_id = ev.poolId;
    tx.save();
    return tx;
}

// staker deposits & withdrawals
export const setStakerDepoWithdrawTx = (
    ev: DepoWithdraw,
): TransferTx => {
    const token = getTokenByPoolId(ev.poolId);
    let tx = new TransferTx(ev.id);
    tx.contract_address = ev.contractAddress;
    tx.block_number = ev.block;
    tx.block_timestamp = ev.timestamp;
    tx.token = token
    tx.type = ev.type;
    tx.hash = Bytes.fromHexString(ev.id.split('-')[0]);
    tx.user_address = ev.userAddress;
    tx.from_address = ev.fromAddress;
    tx.to_address = ev.toAddress;
    tx.coin_amount = tokenToDecimal(ev.coinAmount, 18, DECIMALS);
    tx.usd_amount = tokenToDecimal(ev.usdAmount, 18, DECIMALS);
    tx.factor = getFactor(token);
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
            if ((tx.type === 'core_deposit' && from == Address.zero())
                || (tx.type === 'core_withdrawal' && to == Address.zero())) {
                if (isEmergency) {
                    emergencyToken = (log.address == gvtAddress) ? 'gvt' : 'pwrd';
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
    if (token == 'pwrd' && blockNumber < G2_START_BLOCK)
        return getStoredFactor(token);

    return getFactor(token);
}
