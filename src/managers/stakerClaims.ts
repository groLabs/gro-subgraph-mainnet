import { setUser } from '../setters/users';
import { setPools } from '../setters/pools';
import { StakerClaimEvent } from '../types/stakerClaim';
import { initTotals } from '../setters/totals';
import { setClaimTx } from '../setters/staker';


/// @notice Manages staker claims
/// @param ev the parsed claim event
export const manageClaim = (
    ev: StakerClaimEvent,
): void => {
    // Creates user if not existing yet
    setUser(ev.userAddress);

    // Stores claim tx
    const tx = setClaimTx(ev);

    // Updates user-related pool data (can be multiple pools in case
    // of <LogMultiClaim> event)
    for (let i = 0; i < ev.pid.length; i++) {
        setPools(
            tx.type,
            tx.user_address,
            ev.pid[i],
            tx.contract_address,
            tx.amount,
        );
    }

    // Creates user totals if not existing yet (e.g.: a user that didn't do
    // any deposit or withdrawal before claiming)
    initTotals(ev.userAddress, true);
}
