import { setUser } from '../setters/users'
import { setStakerDepositTx } from '../setters/deposits';
import { setDepoWithdrawTx } from '../setters/depowithdraw';
import { DepositEvent } from '../types/deposit';
import { DepoWithdraw } from '../types/depowithdraw';
import { Log } from '../types/log';
import { setTotals } from '../setters/totals';


// Manage core deposit
export const manageCoreDeposit = (
    ev: DepoWithdraw,
    logs: Log[],
    token: string
): void => {

    // Step 1: Manage User
    setUser(ev.userAddress);

    //Step 2: Manage Transaction
    const tx = setDepoWithdrawTx(ev, logs, token);

    //Step 3: Manage Totals
    setTotals(
        tx.type,
        token,
        ev.userAddress,
        tx.coinAmount,
        tx.usdAmount,
        tx.factor,
    );
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
