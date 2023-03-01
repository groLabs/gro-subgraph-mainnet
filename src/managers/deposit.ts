import { Log } from '../types/log';
import { setUser } from '../setters/users'
import { setPools } from '../setters/pools';
import { setTotals } from '../setters/totals';
import { initTotals } from '../setters/totals';
import { DepoWithdraw } from '../types/depowithdraw';
import {
    initCoreData,
    updateTotalSupply,
} from '../setters/coreData';
import {
    setDepoWithdrawTx,
    setStakerDepoWithdrawTx,
} from '../setters/depowithdraw';


// Manage core deposit
export const manageCoreDeposit = (
    ev: DepoWithdraw,
    logs: Log[],
    token: string
): void => {
    // Step 1: Manage User
    setUser(ev.userAddress);

    // Step 2: Manage Transaction
    const tx = setDepoWithdrawTx(ev, logs, token);

    // Step 3: Manage Totals
    setTotals(
        tx.type,
        token,
        ev.userAddress,
        tx.coin_amount,
        tx.usd_amount,
        tx.factor,
    );

    // Step 4: Update total supply
    updateTotalSupply(
        'deposit',
        tx.coin_amount,
        token,
    );
}

export const manageStakerDeposit = (
    ev: DepoWithdraw,
): void => {
    // Step 1: Manage User
    setUser(ev.userAddress);

    // Step 2: Manage Transaction
    setStakerDepoWithdrawTx(ev);

    // Step 3: Manage Pools
    setPools(
        ev.type,
        ev.userAddress,
        ev.poolId,
        ev.contractAddress,
        ev.coinAmount,
    );

    // Step 4: Create Totals for Staker-only users
    initTotals(ev.userAddress, true);

    initCoreData(true);
}
