import { setUser } from '../setters/users'
// import { setStakerDepositTx } from '../setters/deposits';
import { setDepoWithdrawTx, setStakerDepoWithdrawTx } from '../setters/depowithdraw';
import { DepoWithdraw } from '../types/depowithdraw';
import { Log } from '../types/log';
import { setTotals } from '../setters/totals';
import { setPools } from '../setters/pools';


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

export const manageStakerDeposit = (
    ev: DepoWithdraw,
): void => {
    // Step 1: Manage User
    setUser(ev.userAddress);

    //Step 2: Manage Transaction
    setStakerDepoWithdrawTx(ev);

    //Step 3: Manage Pools
    setPools(
        ev.type,
        ev.userAddress,
        ev.poolId,
        ev.contractAddress
    );
}
