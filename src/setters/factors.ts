import { Gvt } from '../../generated/Gvt/Gvt';
import { Factor } from '../../generated/schema';
import { tokenToDecimal } from '../utils/tokens';
import { Pwrd } from '../../generated/Pwrd/Pwrd';
import {
    NUM,
    ADDR,
} from '../utils/constants';
import {
    gvtAddress,
    pwrdAddress,
} from '../utils/contracts';
import {
    log,
    BigDecimal,
} from '@graphprotocol/graph-ts';


const initFactor = (save: boolean): Factor => {
    let factor = Factor.load(ADDR.ZERO);
    if (!factor) {
        factor = new Factor(ADDR.ZERO);
        factor.pwrd = NUM.PWRD_START_FACTOR;
        factor.gvt = NUM.GVT_START_FACTOR;
        if (save)
            factor.save();
    }
    return factor;
}

export const setGvtFactor = (): void => {
    const factor = initFactor(false);
    const contract = Gvt.bind(gvtAddress);
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
    const contract = Pwrd.bind(pwrdAddress);
    const pwrdFactor = contract.try_factor();
    if (pwrdFactor.reverted) {
        log.error('setPwrdFactor(): try_factor() reverted in /setters/factors.ts', []);
    } else {
        factor.pwrd = tokenToDecimal(pwrdFactor.value, 18, 12);
    }
    factor.save();
}

export const updateFactors = (): void => {
    const factor = initFactor(false);
    const gvtContract = Gvt.bind(gvtAddress);
    const gvtFactor = gvtContract.try_factor();
    if (gvtFactor.reverted) {
        log.error('updateFactors(): try_factor() on gvt reverted in /setters/factors.ts', []);
    } else {
        factor.gvt = tokenToDecimal(gvtFactor.value, 18, 12);
    }
    const pwrdContract = Pwrd.bind(pwrdAddress);
    const pwrdFactor = pwrdContract.try_factor();
    if (pwrdFactor.reverted) {
        log.error('updateFactors(): try_factor() on pwrd reverted in /setters/factors.ts', []);
    } else {
        factor.pwrd = tokenToDecimal(pwrdFactor.value, 18, 12);
    }
    factor.save();
}

// Retrieves gvt or pwrd factor at the time of tx
export const getFactor = (token: string): BigDecimal => {
    if (token === 'gvt') {
        const contract = Gvt.bind(gvtAddress);
        const gvtFactor = contract.try_factor();
        if (gvtFactor.reverted) {
            log.error('getFactor(): try_factor() on gvt reverted in /setters/factors.ts', []);
            return NUM.ZERO;
        } else {
            return tokenToDecimal(gvtFactor.value, 18, 12);
        }
    } else if (token === 'pwrd') {
        const contract = Pwrd.bind(pwrdAddress);
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
