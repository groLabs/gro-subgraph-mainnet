import { ClaimEvent } from '../types/claim';
import { DECIMALS } from '../utils/constants';
import { ClaimTx } from '../../generated/schema';
import { tokenToDecimal } from '../utils/tokens';


export const setClaimTx = (
    ev: ClaimEvent,
): ClaimTx => {
    let tx = new ClaimTx(ev.id);
    const coinAmount = tokenToDecimal(ev.amount, 18, DECIMALS);
    tx.contract_address = ev.contractAddress;
    tx.block_number = ev.block;
    tx.block_timestamp = ev.timestamp;
    tx.hash = ev.hash;
    tx.type = (ev.pid.length > 1)
        ? 'multiclaim'
        : 'claim';
    tx.user_address = ev.userAddress;
    tx.pool_id = ev.pid;
    tx.vest = ev.vest;
    tx.amount = coinAmount;
    tx.save();
    return tx;
}
