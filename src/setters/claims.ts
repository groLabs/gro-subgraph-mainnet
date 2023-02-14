import { ClaimEvent } from '../types/claim';
import { DECIMALS } from '../utils/constants';
import { Bytes } from '@graphprotocol/graph-ts';
import { ClaimTx } from '../../generated/schema';
import { tokenToDecimal } from '../utils/tokens';


export const setClaimTx = (
    ev: ClaimEvent,
): ClaimTx => {
    let tx = new ClaimTx(ev.id);
    const coinAmount = tokenToDecimal(ev.amount, 18, DECIMALS);
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
    tx.amount = coinAmount;
    tx.save();
    return tx;
}