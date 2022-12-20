import { NUM } from '../utils/constants';
import { contracts } from '../../addresses';
import { Gvt } from '../../generated/Gvt/Gvt';
import { Factor } from '../../generated/schema';
import { tokenToDecimal } from '../utils/tokens';
import { Pwrd } from '../../generated/Pwrd/Pwrd';
import {
    log,
    Address,
    BigDecimal,
} from '@graphprotocol/graph-ts';
// contracts
const gvtContractAddress = Address.fromString(contracts.GvtAddress);
const pwrdContractAddress = Address.fromString(contracts.PwrdAddress);


const initFactor = (save: boolean): Factor => {
    let factor = Factor.load('0x');
    if (!factor) {
        factor = new Factor('0x');
        factor.timestamp = 0;
        factor.pwrd = NUM.PWRD_START_FACTOR;
        factor.gvt = NUM.GVT_START_FACTOR;
        if (save)
            factor.save();
    }
    return factor;
}

export const setGvtFactor = (): void => {
    const factor = initFactor(false);
    const contract = Gvt.bind(gvtContractAddress);
    const gvtFactor = contract.try_factor();
    if (gvtFactor.reverted) {
        log.error('setGvtFactor(): try_factor() reverted in /setters/factors.ts', []);
    } else {
        factor.gvt = tokenToDecimal(gvtFactor.value, 18, 12);
    }
    factor.save();
}

export const setPwrdFactor = (): void => {
    const factor = initFactor(false);
    
    const contract = Pwrd.bind(pwrdContractAddress);
    const pwrdFactor = contract.try_factor();
    if (pwrdFactor.reverted) {
        log.error('setPwrdFactor(): try_factor() reverted in /setters/factors.ts', []);
    } else {
        factor.pwrd = tokenToDecimal(pwrdFactor.value, 18, 12);
    }
    factor.save();
}

export const updateGTokenFactor = (timestamp: i32): void => {
    const factor = initFactor(false);
    const gvtContract = Gvt.bind(gvtContractAddress);
    const gvtFactor = gvtContract.try_factor();
    if (gvtFactor.reverted) {
        log.error('updateGTokenFactor(): try_factor() on gvt reverted in /setters/factors.ts', []);
    } else {
        factor.gvt = tokenToDecimal(gvtFactor.value, 18, 12);
    }
    const pwrdContract = Pwrd.bind(pwrdContractAddress);
    const pwrdFactor = pwrdContract.try_factor();
    if (pwrdFactor.reverted) {
        log.error('updateGTokenFactor(): try_factor() on pwrd reverted in /setters/factors.ts', []);
    } else {
        factor.pwrd = tokenToDecimal(pwrdFactor.value, 18, 12);
    }
    factor.timestamp = timestamp;
    factor.save();
}

// Retrieves gvt or pwrd factor at the time of tx
export const getFactor = (token: string): BigDecimal => {
    if (token === 'gvt') {
        const contract = Gvt.bind(gvtContractAddress);
        const gvtFactor = contract.try_factor();
        if (gvtFactor.reverted) {
            log.error('getFactor(): try_factor() on gvt reverted in /setters/factors.ts', []);
            return NUM.ZERO;
        } else {
            return tokenToDecimal(gvtFactor.value, 18, 12);
        }
    } else if (token === 'pwrd') {
        const contract = Pwrd.bind(pwrdContractAddress);
        const pwrdFactor = contract.try_factor();
        if (pwrdFactor.reverted) {
            log.error('getFactor(): try_factor() on pwrd reverted in /setters/factors.ts', []);
            return NUM.ZERO;
        } else {
            return tokenToDecimal(pwrdFactor.value, 18, 12);
        }
    } else {
        return NUM.ZERO;
    }
}

// Retrieves latest stored gvt or pwrd factor (before a tx)
export const getStoredFactor = (token: string): BigDecimal => {
    const factor = initFactor(true);
    return (token === 'pwrd')
        ? factor.pwrd
        : factor.gvt;
}
