import { initMD } from "../setters/masterdata";
import { tokenToDecimal } from '../utils/tokens';
import { LogNewTrancheBalance } from '../../generated/GTranche/GTranche';


export function handleNewTrancheBalance(event: LogNewTrancheBalance): void {
    const utilization = tokenToDecimal(event.params._utilization, 4, 4);
    // update GToken utilization
    let masterdata = initMD();
    masterdata.gtoken_utilization = utilization;
    masterdata.save();
}
