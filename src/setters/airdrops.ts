import { DECIMALS } from '../utils/constants';
import { tokenToDecimal } from '../utils/tokens';
import { AirdropClaimEvent } from '../types/airdropClaim';
import { AirdropNewDropEvent } from '../types/airdropNewDrop';
import {
    Airdrop,
    AirdropClaimTx,
} from '../../generated/schema';


export const setAirdropClaimTx = (
    ev: AirdropClaimEvent,
): AirdropClaimTx => {
    let tx = new AirdropClaimTx(ev.id);
    const coinAmount = tokenToDecimal(ev.amount, 18, DECIMALS);
    tx.contract_address = ev.contractAddress;
    tx.block_number = ev.block;
    tx.block_timestamp = ev.timestamp;
    tx.hash = ev.hash;
    tx.user_address = ev.userAddress;
    tx.vest = ev.vest;
    tx.tranche_id = ev.tranche_id;
    tx.amount = coinAmount;
    tx.save();
    return tx;
}

export const setNewAirdrop = (
    ev: AirdropNewDropEvent,
): void => {
    let airdrop = Airdrop.load(ev.id);
    if (!airdrop) {
        airdrop = new Airdrop(ev.id);
        airdrop.contract_address = ev.contractAddress;
        airdrop.tranche_id = ev.tranche_id;
        airdrop.merkle_root = ev.merkle_root;
        airdrop.total_amount = tokenToDecimal(ev.amount, 18, DECIMALS);
        airdrop.save();
    }
}
