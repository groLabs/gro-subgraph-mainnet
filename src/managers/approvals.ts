import { ApprovalEvent } from '../utils/types';
import { setUser } from '../utils/users';
import { setApprovalTx } from '../utils/transactions';

export const manageApproval = (
    ev: ApprovalEvent,
    token: string
): void => {

    // Step 1: Manage User
    setUser(ev.ownerAddress);

    //Step 2: Manage Transaction
    setApprovalTx(ev, token);
}
