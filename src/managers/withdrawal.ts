import { setUser } from '../setters/users'
import { setDepoWithdrawTx, setStakerDepoWithdrawTx } from '../setters/depowithdraw';
import { DepoWithdraw } from '../types/depowithdraw';
import { Log } from '../types/log';
import { setTotals } from '../setters/totals';
import { setPools } from '../setters/pools';
import { initTotals } from '../setters/totals';
import { initVestingBonus } from '../setters/vestingBonus';
import { initCoreData } from '../setters/coreData';


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

    // Step 4: Create VestingBonus
    initVestingBonus(ev.userAddress, true);

    initCoreData();
}

export const manageStakerWithdrawal = (
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
        ev.contractAddress,
        ev.coinAmount,
    );

    // Step 4: Create Totals for Staker-only users
    initTotals(ev.userAddress, true);

    // Step 5: Create VestingBonus
    initVestingBonus(ev.userAddress, true);

}