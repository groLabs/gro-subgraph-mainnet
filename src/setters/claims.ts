import { Bytes } from '@graphprotocol/graph-ts';
import { ClaimTx } from '../../generated/schema';
import {
    tokenToDecimal,
    getPricePerShare,
} from '../utils/tokens';
import { ClaimEvent } from '../utils/types';


export const setClaimTx = (
    ev: ClaimEvent,
): ClaimTx => {
    let tx = new ClaimTx(ev.id);
    const coinAmount = tokenToDecimal(ev.amount, 18, 7);
    // const pricePerShare = getPricePerShare(
    //     ev.contractAddress,
    //     token,
    // );
    tx.contractAddress = ev.contractAddress;
    tx.block = ev.block;
    tx.timestamp = ev.timestamp;
    tx.hash = Bytes.fromHexString(ev.id.split('-')[0]);
    tx.type = (ev.pid.length > 1)
        ? 'multiclaim'
        : 'claim';
    tx.userAddress = ev.userAddress;
    tx.poolId = ev.pid;
    tx.vest = ev.vest;
    tx.amount = coinAmount; // coinAmount.times(pricePerShare);
    tx.save();
    return tx;
}