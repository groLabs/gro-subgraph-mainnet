import {
    Bytes, 
    ethereum,
    BigDecimal,
    log as showLog,
} from '@graphprotocol/graph-ts';
import { TransferTx } from '../../generated/schema';
import { DepoWithdraw } from '../types/depowithdraw';
import { Log } from '../types/log';
import {
    getFactor,
    tokenToDecimal
} from '../utils/tokens';
import {
    ZERO,
    DECIMALS,
    ZERO_ADDR,
    GVT_ADDRESS,
    PWRD_ADDRESS,
    ERC20_TRANSFER_SIG,
} from '../utils/constants';


export const setDepoWithdrawTx = (
    ev: DepoWithdraw,
    logs: Log[],
    token: string,
): TransferTx => {
    let tx = new TransferTx(ev.id);
    tx.contractAddress = ev.contractAddress;
    tx.block = ev.block;
    tx.timestamp = ev.timestamp;
    tx.token = token;
    tx.type = ev.type;
    tx.hash = Bytes.fromHexString(ev.id.split('-')[0]);
    tx.userAddress = ev.userAddress;
    tx.fromAddress = ev.fromAddress;
    tx.toAddress = ev.toAddress;
    tx.coinAmount = getCoinAmount(logs, tx);
    tx.usdAmount = tokenToDecimal(ev.usdAmount, 18, DECIMALS);
    tx.factor = getFactor(token);
    tx.save();
    return tx;
}

// Given a deposit or withdrawal event, search the Transfer event 
// via transaction receipt to get the coin amount
export function getCoinAmount(
    logs: Log[],
    tx: TransferTx
): BigDecimal {
    for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        if (
            (log.address == GVT_ADDRESS
                || log.address == PWRD_ADDRESS)
            && log.topics[0].toHexString() == ERC20_TRANSFER_SIG
            && log.topics.length === 3
        ) {
            const from = ethereum.decode('address', log.topics[1])!.toAddress();
            const to = ethereum.decode('address', log.topics[2])!.toAddress();
            if ((tx.type === 'deposit' && from == ZERO_ADDR)
                || (tx.type === 'withdrawal' && to == ZERO_ADDR)) {
                const value = ethereum.decode('uin256', log.data)!.toBigInt();
                return tokenToDecimal(value, 18, 7);
            }
        }
    }
    showLog.error(
        '{} coin amount not found from Transfer event through tx {}', [
        tx.token,
        tx.hash.toHexString()
    ]);
    return ZERO;
}
