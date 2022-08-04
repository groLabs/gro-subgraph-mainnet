import { setUser } from '../setters/users'
import { setDepositTx } from '../setters/deposits';
import { DepositEvent } from '../types/deposit';

export const manageDeposit = (
    ev: DepositEvent,
): void => {

    // Step 1: Manage User
    setUser(ev.userAddress);

    //Step 2: Manage Transaction
    setDepositTx(ev);
}
