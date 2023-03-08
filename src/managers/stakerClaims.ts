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
    const tx = setClaimTx(ev);

    // Step 3: Manage Pools
    for (let i = 0; i < ev.pid.length; i++) {
        setPools(
            tx.type,
            tx.user_address,
            ev.pid[i],
            tx.contract_address,
            tx.amount,
        );
    }

    // Step 4: Create Totals for staker-only users
    initTotals(ev.userAddress, true);
}
