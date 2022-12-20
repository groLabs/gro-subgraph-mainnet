import { initMD } from './masterdata';
import { contracts } from '../../addresses';
import { tokenToDecimal } from '../utils/tokens';
import { GTranche } from '../../generated/GTranche/GTranche';
import {
    log,
    Address,
} from '@graphprotocol/graph-ts';
// contracts
const gTrancheAddress = Address.fromString(contracts.GTrancheAddress);


export const updateGTokenUtilization = (): void => {
    const contract = GTranche.bind(gTrancheAddress);
    const utilization = contract.try_utilization();
    if (utilization.reverted) {
        log.error('updateGTokenUtilization(): try_utilization() reverted in /setters/gtranche.ts', []);
    } else {
        let md = initMD();
        md.gtoken_utilization = tokenToDecimal(utilization.value, 4, 4);
        md.save();
    }
}
