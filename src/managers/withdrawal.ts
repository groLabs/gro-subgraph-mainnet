import { Log } from '../types/log';
import { setUser } from '../setters/users'
import { setPools } from '../setters/pools';
import { setTotals } from '../setters/totals';
import { initTotals } from '../setters/totals';
import { TOKEN as Token } from '../utils/constants';
import { DepoWithdraw } from '../types/depowithdraw';
import { TX_TYPE as TxType } from '../utils/constants';
import { updateTotalSupply } from '../setters/coreData';
import {
    setGvtFactor,
    setPwrdFactor
} from '../setters/factors';
import {
    setDepoWithdrawTx,
    setStakerDepoWithdrawTx
} from '../setters/depowithdraw';


/// @notice Manages core withdrawals from WithdrawtHandler (pre-G2) and GRouter (post-G2)
/// @param ev the parsed withdrawal event
/// @param logs the logs within the withdrawal transaction
/// @param token the withdrawal token (gvt or pwrd)
export const manageCoreWithdrawal = (
    ev: DepoWithdraw,
    logs: Log[],
    token: string
): void => {
    // Creates user if not existing yet in entity <User>
    setUser(ev.userAddress);

    // Stores withdrawal tx in entity <TransferTx>
    const tx = setDepoWithdrawTx(ev, logs, token);

    // Updates user totals in entity <Totals>
    setTotals(
        tx.type,
        token,
        ev.userAddress,
        tx.coin_amount,
        tx.usd_amount,
        tx.factor,
    );

    // Updates total supply in entity <CoreData>
    updateTotalSupply(
        TxType.CORE_WITHDRAWAL,
        tx.coin_amount,
        token,
    );

    // Updates GToken factor in entity <Factor>
    if (token === Token.PWRD) {
        setPwrdFactor();
    } else if (token === Token.GVT) {
        setGvtFactor();
    }
}

/// @notice Manages staker withdrawals
/// @param ev the parsed withdrawal event
export const manageStakerWithdrawal = (
    ev: DepoWithdraw,
    isEmergencyWithdrawal: boolean
): void => {
    // Creates user if not existing yet in entity <User>
    setUser(ev.userAddress);

    // Stores staker withdrawal tx in entity <TransferTx>
    const tx = setStakerDepoWithdrawTx(ev, isEmergencyWithdrawal);

    // Updates user-related pool data in entity <Pool>
    setPools(
        tx.type,
        tx.user_address,
        tx.pool_id,
        tx.contract_address,
        tx.coin_amount,
    );

    // Creates user totals if not existing yet in entity <Totals>
    // (e.g.: a user that didn't do any deposit/withdrawal before staking)
    initTotals(ev.userAddress, true);
}
