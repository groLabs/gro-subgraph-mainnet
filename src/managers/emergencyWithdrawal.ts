import { Log } from '../types/log';
import { setTotals } from '../setters/totals';
import { DepoWithdraw } from '../types/depowithdraw';
import { updateTotalSupply } from '../setters/coreData';
import { initVestingBonus } from '../setters/vestingBonus';
import { setEmergencyWithdrawTx } from '../setters/depowithdraw';
import {
    setGvtFactor,
    setPwrdFactor
} from '../setters/factors';


// Manage core withdrawals
export const manageEmergencyCoreWithdrawal = (
    ev: DepoWithdraw,
    logs: Log[],
): void => {

    //Step 1: Manage Transaction
    const tx = setEmergencyWithdrawTx(ev, logs);

    //Step 2: Manage Totals
    setTotals(
        tx.type,
        tx.token,
        ev.userAddress,
        tx.coin_amount,
        tx.usd_amount,
        tx.factor,
    );

    // Step 3: Create VestingBonus
    initVestingBonus(ev.userAddress, true);

    // Step 4: Update total supply
    updateTotalSupply(
        'withdrawal',
        tx.coin_amount,
        tx.token,
    );

    // Step 5: Update factor
    if (tx.token === 'pwrd') {
        setPwrdFactor();
    } else if (tx.token === 'gvt') {
        setGvtFactor();
    }
}
