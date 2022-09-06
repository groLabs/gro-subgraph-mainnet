import { setUser } from '../setters/users'
import { setWithdrawalTx } from '../setters/withdrawals';
import { WithdrawalEvent } from '../types/withdrawal';


// Withdrawal from Staker
export const manageWithdrawal = (
    ev: WithdrawalEvent,
): void => {

    // Step 1: Manage User
    setUser(ev.userAddress);

    //Step 2: Manage Transaction
    setWithdrawalTx(ev);
}
