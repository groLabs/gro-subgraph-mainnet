import { Bytes } from '@graphprotocol/graph-ts';
import { WithdrawalTx } from '../../generated/schema';
import { tokenToDecimal } from '../utils/tokens';
import { WithdrawalEvent } from '../types/withdrawal';


export const setWithdrawalTx = (
    ev: WithdrawalEvent,
): WithdrawalTx => {
    let tx = new WithdrawalTx(ev.id);
    const coinAmount = tokenToDecimal(ev.amount, 18, 7);
    tx.contractAddress = ev.contractAddress;
    tx.block = ev.block;
    tx.timestamp = ev.timestamp;
    tx.hash = Bytes.fromHexString(ev.id.split('-')[0]);
    tx.type = 'withdrawal'
    tx.userAddress = ev.userAddress;
    tx.poolId = ev.pid;
    tx.amount = coinAmount; // coinAmount.times(pricePerShare);
    tx.save();
    return tx;
}