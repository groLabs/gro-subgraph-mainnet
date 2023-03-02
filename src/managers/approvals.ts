import { setUser } from '../setters/users';
import { initTotals } from '../setters/totals';
import { ApprovalEvent } from '../types/approval';
import { setApprovalTx } from '../setters/approvals';


export const manageApproval = (
    ev: ApprovalEvent,
    token: string
): void => {

    // Step 1: Manage User
    setUser(ev.ownerAddress);

    // Step 2: Manage Transaction
    setApprovalTx(ev, token);

    // Step 3: Create Totals
    initTotals(ev.ownerAddress, true);
}
