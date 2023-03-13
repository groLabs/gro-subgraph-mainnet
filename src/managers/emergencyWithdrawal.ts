import { Log } from '../types/log';
import { setTotals } from '../setters/totals';
import { TOKEN as Token } from '../utils/constants';
import { DepoWithdraw } from '../types/depowithdraw';
import { TX_TYPE as TxType } from '../utils/constants';
import { updateTotalSupply } from '../setters/coreData';
import { setEmergencyWithdrawTx } from '../setters/depowithdraw';
import {
    setGvtFactor,
    setPwrdFactor
} from '../setters/factors';


/// @notice Manages emergency core withdrawals from EmergencytHandler (pre-G2)
/// @param ev the parsed withdrawal event
/// @param logs the logs within the withdrawal transaction
export const manageEmergencyCoreWithdrawal = (
    ev: DepoWithdraw,
    logs: Log[],
): void => {
    // Stores withdrawal tx in entity <TransferTx>
    const tx = setEmergencyWithdrawTx(ev, logs);

    // Updates user totals in entity <Totals>
    setTotals(
        tx.type,
        tx.token,
        ev.userAddress,
        tx.coin_amount,
        tx.usd_amount,
        tx.factor,
    );

    // Updates total supply in entity <CoreData>
    updateTotalSupply(
        TxType.CORE_WITHDRAWAL,
        tx.coin_amount,
        tx.token,
    );

    // Updates GToken factor in entity <Factor>
    if (tx.token === Token.PWRD) {
        setPwrdFactor();
    } else if (tx.token === Token.GVT) {
        setGvtFactor();
    }
}
