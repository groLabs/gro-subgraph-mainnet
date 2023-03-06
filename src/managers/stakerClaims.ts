import { setUser } from '../setters/users';
import { setPools } from '../setters/pools';
import { StakerClaimEvent } from '../types/stakerClaim';
import { initTotals } from '../setters/totals';
import { setClaimTx } from '../setters/staker';


// Claim from Staker
export const manageClaim = (
    ev: StakerClaimEvent,
): void => {

    // Step 1: Manage User
    setUser(ev.userAddress);

    // Step 2: Manage Transaction
    setClaimTx(ev);

    // Step 3: Manage Pools
    for (let i = 0; i < ev.pid.length; i++) {
        setPools(
            ev.type,
            ev.userAddress,
            ev.pid[i],
            ev.contractAddress,
            ev.amount,
        );
    }

    // Step 4: Create Totals for staker-only users
    initTotals(ev.userAddress, true);
}
