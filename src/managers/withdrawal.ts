import { setUser } from '../setters/users'
import { setStakerWithdrawalTx } from '../setters/withdrawals';
import { setDepoWithdrawTx } from '../setters/depowithdraw';
import { WithdrawalEvent } from '../types/withdrawal';
import { DepoWithdraw } from '../types/depowithdraw';
import { Log } from '../types/log';


// Manage core withdrawals
export const manageCoreWithdrawal = (
    ev: DepoWithdraw,
    logs: Log[],
    token: string
): void => {

    // Step 1: Manage User
    setUser(ev.userAddress);

    //Step 2: Manage Transaction
    setDepoWithdrawTx(ev, logs, token);
}


// Manage staker withdrawals
export const manageStakerWithdrawal = (
    ev: WithdrawalEvent,
): void => {

    // Step 1: Manage User
    setUser(ev.userAddress);

    //Step 2: Manage Transaction
    setStakerWithdrawalTx(ev);
}
