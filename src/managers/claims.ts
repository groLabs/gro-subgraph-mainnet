import { setUser } from '../setters/users'
import { setClaimTx } from '../setters/claims';
import { setPools } from '../setters/pools';
import { ClaimEvent } from '../types/claim';


// Claim from Staker
export const manageClaim = (
    ev: ClaimEvent,
): void => {

    // Step 1: Manage User
    setUser(ev.userAddress);

    //Step 2: Manage Transaction
    setClaimTx(ev);

    //Step 3: Manage Pools
    for (let i = 0; i < ev.pid.length; i++) {
        setPools(
            ev.type,
            ev.userAddress,
            ev.pid[i],
            ev.contractAddress,
            ev.amount,
        );
    }
}
