// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Updates gvt and pwrd factors in entity <Factor>
/// @dev There is one single Factor record with 0x address that gets updated

import { Gvt } from '../../generated/Gvt/Gvt';
import { Factor } from '../../generated/schema';
import { tokenToDecimal } from '../utils/tokens';
import { Pwrd } from '../../generated/Pwrd/Pwrd';
import {
    gvtAddress,
    pwrdAddress,
} from '../utils/contracts';
import {
    log,
    BigDecimal,
} from '@graphprotocol/graph-ts';
import {
    NUM,
    ADDR,
    TOKEN as Token,
} from '../utils/constants';


/// @notice Initialises entity <Factor> with default values if not created yet
/// @param save stores the entity if true; doesn't store it otherwise
/// @return Factor object (there can only be one that gets updated)
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

/// @notice Updates factor/s in entity <Factor>
/// @dev Triggered by the following contract events:
///         - <LogNewWithdrawal> from withdrawHandler
///         - <LogEmergencyWithdrawal> from emergencyHandler
///         - <LogPnLExecution> from PnL
///         - <LogWithdrawal> from GRouter
///         - <LogStrategyHarvestReport> from GVault
/// @param token the token to update its factor: gvt, pwrd or both if unknown token
export const updateFactor = (token: string): void => {
    const factor = initFactor(false);
    if (token == Token.GVT || token == Token.UNKNOWN) {
        const gvtContract = Gvt.bind(gvtAddress);
        const gvtFactor = gvtContract.try_factor();
        if (gvtFactor.reverted) {
            log.error('updateFactor(): try_factor() on gvt reverted in /setters/factors.ts', []);
        } else {
            factor.gvt = tokenToDecimal(gvtFactor.value, 18, 12);
        }
    }
    if (token == Token.PWRD || token == Token.UNKNOWN) {
        const pwrdContract = Pwrd.bind(pwrdAddress);
        const pwrdFactor = pwrdContract.try_factor();
        if (pwrdFactor.reverted) {
            log.error('updateFactor(): try_factor() on pwrd reverted in /setters/factors.ts', []);
        } else {
            factor.pwrd = tokenToDecimal(pwrdFactor.value, 18, 12);
        }
    }
    factor.save();
}

/// @return the gvt or pwrd factor depending on the token param
export const getFactor = (token: string): BigDecimal => {
    if (token === Token.GVT) {
        const contract = Gvt.bind(gvtAddress);
        const gvtFactor = contract.try_factor();
        if (gvtFactor.reverted) {
            log.error('getFactor(): try_factor() on gvt reverted in /setters/factors.ts', []);
            return NUM.ZERO;
        } else {
            return tokenToDecimal(gvtFactor.value, 18, 12);
        }
    } else if (token === Token.PWRD) {
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

/// @return the latest stored gvt or pwrd factor (before a tx)
export const getStoredFactor = (token: string): BigDecimal => {
    const factor = initFactor(true);
    return (token === Token.PWRD)
        ? factor.pwrd
        : factor.gvt;
}
