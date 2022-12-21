import { initMD } from './masterdata';
import { NUM } from '../utils/constants';
import { contracts } from '../../addresses';
import { tokenToDecimal } from '../utils/tokens';
import { GTranche } from '../../generated/GTranche/GTranche';
import {
    log,
    Address,
    BigDecimal,
} from '@graphprotocol/graph-ts';
// contracts
const gTrancheAddress = Address.fromString(contracts.GTrancheAddress);


export const setUtilizationRatio = (
    value: BigDecimal,
): void => {
    let md = initMD();
    if (value != NUM.ZERO) {
        md.util_ratio = value;
    } else {
        const contract = GTranche.bind(gTrancheAddress);
        const utilization = contract.try_utilization();
        if (utilization.reverted) {
            log.error('setUtilizationRatio(): try_utilization() reverted in /setters/gtranche.ts', []);
        } else {
            md.util_ratio = tokenToDecimal(utilization.value, 4, 4);
        }
    }
    md.save();
}

export const setUtilizationRatioLimit = (
    value: BigDecimal,
): void => {
    let md = initMD();
    md.util_ratio_limit = value;
    md.save();
}
