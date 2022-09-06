import { log } from '@graphprotocol/graph-ts';
import { Gvt } from '../../generated/Gvt/Gvt';
import { Pwrd } from '../../generated/Pwrd/Pwrd';
import { Factor } from '../../generated/schema';
import {
    ZERO,
    GVT_ADDRESS,
    PWRD_ADDRESS,
} from '../utils/constants';
import { tokenToDecimal } from '../utils/tokens';


const initFactor = (): Factor => {
    let factor = Factor.load('0x');
    if (!factor) {
        factor = new Factor('0x');
        factor.pwrd = ZERO;
        factor.gvt = ZERO;
    }
    return factor;
}

const setGvtFactor = (): void => {
    const factor = initFactor();
    const contract = Gvt.bind(GVT_ADDRESS);
    const gvtFactor = contract.try_factor();
    if (gvtFactor.reverted) {
        log.error('setGvtFactor() reverted in src/setters/factors.ts', []);
    } else {
        factor.gvt = tokenToDecimal(gvtFactor.value, 18, 12);
    }
    factor.save();
}

const setPwrdFactor = (): void => {
    const factor = initFactor();
    const contract = Pwrd.bind(PWRD_ADDRESS);
    const pwrdFactor = contract.try_factor();
    if (pwrdFactor.reverted) {
        log.error('getPwrdFactor() reverted in src/setters/factors.ts', []);
    } else {
        factor.pwrd = tokenToDecimal(pwrdFactor.value, 18, 12);
    }
    factor.save();
}

export {
    setGvtFactor,
    setPwrdFactor,
}