import { Log } from '../types/log';
import { setUser } from '../setters/users'
import { setPools } from '../setters/pools';
import { setTotals } from '../setters/totals';
import { initTotals } from '../setters/totals';
import { DepoWithdraw } from '../types/depowithdraw';
import { updateTotalSupply } from '../setters/coreData';
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
    const tx = setStakerDepoWithdrawTx(ev, false);

    // Step 3: Manage Pools
    setPools(
        tx.type,
        tx.user_address,
        tx.pool_id,
        tx.contract_address,
        tx.coin_amount,
    );

    // Step 4: Create Totals for Staker-only users
    initTotals(ev.userAddress, true);
}
