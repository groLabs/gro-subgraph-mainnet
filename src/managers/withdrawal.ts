import { Log } from '../types/log';
import { setUser } from '../setters/users'
import { setPools } from '../setters/pools';
import { setTotals } from '../setters/totals';
import { initTotals } from '../setters/totals';
import { DepoWithdraw } from '../types/depowithdraw';
import { updateTotalSupply } from '../setters/coreData';
import { initVestingBonus } from '../setters/vestingBonus';
import {
    setGvtFactor,
    setPwrdFactor
} from '../setters/factors';
import { 
    setDepoWithdrawTx,
    setStakerDepoWithdrawTx
} from '../setters/depowithdraw';


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

    // initCoreData(true);

    // Update total supply
    updateTotalSupply(
        'withdrawal',
        tx.coinAmount,
        token,
    );

    // Update factor
    if (token === 'pwrd') {
        setPwrdFactor();
    } else if (token === 'gvt') {
        setGvtFactor();
    }
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