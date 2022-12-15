import {
 LogNewTrancheBalance
} from '../../generated/GTranche/GTranche';
import { TrancheBalance } from "../../generated/schema"
import { tokenToDecimal } from '../utils/tokens';
import { DECIMALS } from '../utils/constants';
import { initMD } from "../setters/masterdata";

export function handleNewTrancheBalance(event: LogNewTrancheBalance): void {
    const id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    let balance = TrancheBalance.load(id);
    const utilization = tokenToDecimal(event.params._utilization, 4, 4);
    if(!balance){
      balance = new TrancheBalance(id);
      balance.timestamp = event.block.timestamp.toI32();
      balance.junior_tranche_balance = tokenToDecimal(event.params.balances[0], 18, DECIMALS);
      balance.senior_tranche_balance = tokenToDecimal(event.params.balances[1], 18, DECIMALS);
      balance.utilization = utilization;
      balance.save()
    }

    // update GToken utilization
    let masterdata = initMD();
    masterdata.gtoken_utilization = utilization;
    masterdata.save();
}

