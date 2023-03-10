import { setUser } from '../setters/users';
import { initTotals } from '../setters/totals';
import { ApprovalEvent } from '../types/approval';
import { setApprovalTx } from '../setters/approvals';


/// @notice Manages approval events 
/// @param ev the approval event
/// @param token the approval token (gro, gvt or pwrd)
/// @dev only handles approvals confirmed by users, but not approval
///      updates (e.g.: during deposits and withdrawals)
export const manageApproval = (
    ev: ApprovalEvent,
    token: string
): void => {
    // Creates user if not existing yet
    setUser(ev.ownerAddress);

    // Stores approval tx
    setApprovalTx(ev, token);

    // Creates user totals if not existing yet
    initTotals(ev.ownerAddress, true);
}
