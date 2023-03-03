import { NUM } from '../utils/constants';
import { VestingAirdrop } from '../../generated/schema';
import { 
    Bytes,
    BigDecimal,
} from '@graphprotocol/graph-ts';


export const initVestingAirdrop = (
    userAddress: Bytes,
    save: boolean,
): VestingAirdrop => {
    const id = userAddress;
    let vestingBonus = VestingAirdrop.load(id);
    if (!vestingBonus) {
        vestingBonus = new VestingAirdrop(id);
        vestingBonus.user_address = userAddress;
        vestingBonus.claim_initialized = false;
        vestingBonus.total_claim_amount = NUM.ZERO;
        vestingBonus.claimed_amount = NUM.ZERO;
        if (save)
            vestingBonus.save();
    }
    return vestingBonus;
}

export const setInitialClaim = (
    userAddress: Bytes,
    totalClaim: BigDecimal,
    claimAmount: BigDecimal,
): void => {
    let vestingAirdrop = initVestingAirdrop(userAddress, false);
    vestingAirdrop.claim_initialized = true;
    vestingAirdrop.total_claim_amount = totalClaim;
    vestingAirdrop.claimed_amount = claimAmount;
    vestingAirdrop.save();
}

export const setClaim = (
    userAddress: Bytes,
    claimAmount: BigDecimal,
): void => {
    let vestingAirdrop = initVestingAirdrop(userAddress, false);
    vestingAirdrop.claimed_amount = vestingAirdrop.claimed_amount.plus(claimAmount);
    vestingAirdrop.save();
}
