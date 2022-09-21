import { Bytes } from '@graphprotocol/graph-ts';
import { DepositTx } from '../../generated/schema';
import {
    tokenToDecimal,
    getPricePerShare,
} from '../utils/tokens';
import { DepositEvent } from '../types/deposit';


//TODO: base depends on token?
export const setStakerDepositTx = (
    ev: DepositEvent,
): DepositTx => {
    let tx = new DepositTx(ev.id);
    const coinAmount = tokenToDecimal(ev.amount, 18, 7);
    // const pricePerShare = getPricePerShare(
    //     ev.contractAddress,
    //     token,
    // );
    tx.contractAddress = ev.contractAddress;
    tx.block = ev.block;
    tx.timestamp = ev.timestamp;
    tx.hash = Bytes.fromHexString(ev.id.split('-')[0]);
    tx.type = 'staker_deposit'
    tx.userAddress = ev.userAddress;
    tx.poolId = ev.pid;
    tx.amount = coinAmount; // coinAmount.times(pricePerShare);
    tx.save();
    return tx;
}

