
import { Gvt } from '../../generated/Gvt/Gvt';
import { Factor } from '../../generated/schema';
import { tokenToDecimal } from '../utils/tokens';
import { Pwrd } from '../../generated/Pwrd/Pwrd';
import {
    log,
    BigDecimal,
} from '@graphprotocol/graph-ts';
import {
    NUM,
    ADDR,
} from '../utils/constants';


const initFactor = (save: boolean): Factor => {
    let factor = Factor.load('0x');
    if (!factor) {
        factor = new Factor('0x');
        factor.pwrd = NUM.PWRD_START_FACTOR;
        factor.gvt = NUM.GVT_START_FACTOR;
        if (save)
            factor.save();
    }
    return factor;
}

export const setGvtFactor = (): void => {
    const factor = initFactor(false);
    const contract = Gvt.bind(ADDR.GVT);
    const gvtFactor = contract.try_factor();
    if (gvtFactor.reverted) {
        log.error('setGvtFactor() reverted in src/setters/factors.ts', []);
    } else {
        factor.gvt = tokenToDecimal(gvtFactor.value, 18, 12);
    }
    factor.save();
}

export const setPwrdFactor = (): void => {
    const factor = initFactor(false);
    const contract = Pwrd.bind(ADDR.PWRD);
    const pwrdFactor = contract.try_factor();
    if (pwrdFactor.reverted) {
        log.error('getPwrdFactor() reverted in src/setters/factors.ts', []);
    } else {
        factor.pwrd = tokenToDecimal(pwrdFactor.value, 18, 12);
    }
    factor.save();
}

// Retrieves gvt or pwrd factor at the time of tx
export const getFactor = (token: string): BigDecimal => {
    if (token === 'gvt') {
        const contract = Gvt.bind(ADDR.GVT);
        const gvtFactor = contract.try_factor();
        if (gvtFactor.reverted) {
            log.error('getFactor() on gvt reverted in src/utils/tokens.ts', []);
            return NUM.ZERO;
        } else {
            return tokenToDecimal(gvtFactor.value, 18, 12);
        }
    } else if (token === 'pwrd') {
        const contract = Pwrd.bind(ADDR.PWRD);
        const pwrdFactor = contract.try_factor();
        if (pwrdFactor.reverted) {
            log.error('getFactor() on pwrd reverted in src/utils/tokens.ts', []);
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
