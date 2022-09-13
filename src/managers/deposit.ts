import { setUser } from '../setters/users'
import { setStakerDepositTx } from '../setters/deposits';
import { setDepoWithdrawTx } from '../setters/depowithdraw';
import { DepositEvent } from '../types/deposit';
import { DepoWithdraw } from '../types/depowithdraw';
import { Log } from '../types/log';


// Manage core deposit
export const manageCoreDeposit = (
    ev: DepoWithdraw,
    logs: Log[],
    token: string
): void => {

    // Step 1: Manage User
    setUser(ev.userAddress);

    //Step 2: Manage Transaction
    setDepoWithdrawTx(ev, logs, token);
}


// Manage staker deposit
export const manageStakerDeposit = (
    ev: DepositEvent,
): void => {

    // Step 1: Manage User
    setUser(ev.userAddress);

    //Step 2: Manage Transaction
    setStakerDepositTx(ev);
}
