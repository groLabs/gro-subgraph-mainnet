import { setUser } from '../setters/users'
// import { setStakerWithdrawalTx } from '../setters/withdrawals';
import { setDepoWithdrawTx, setStakerDepoWithdrawTx } from '../setters/depowithdraw';
import { DepoWithdraw } from '../types/depowithdraw';
import { Log } from '../types/log';
import { setTotals } from '../setters/totals';


// Manage core withdrawals
export const manageCoreWithdrawal = (
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

export const manageStakerWithdrawal = (
    ev: DepoWithdraw,
): void => {
    // Step 1: Manage User
    setUser(ev.userAddress);

    //Step 2: Manage Transaction
    setStakerDepoWithdrawTx(ev);
}