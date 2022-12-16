import { initMD } from './masterdata';
import { ADDR } from '../utils/constants';
import { log } from '@graphprotocol/graph-ts';
import { tokenToDecimal } from '../utils/tokens';
import { GTranche } from '../../generated/GTranche/GTranche';


export const updateGTokenUtilization = (): void => {
    const contract = GTranche.bind(ADDR.GTRANCHE);
    const utilization = contract.try_utilization();
    if (utilization.reverted) {
        log.error('updateGTokenUtilization() reverted in src/setters/gtranche.ts', []);
    } else {
        let md = initMD();
        md.gtoken_utilization = tokenToDecimal(utilization.value, 4, 4);
        md.save();
    }
}
