// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Updates the utilisation ratio & utilisation ratio limit in entity <MasterData>

import { initMD } from './masterdata';
import { NUM } from '../utils/constants';
import { tokenToDecimal } from '../utils/tokens';
import { gTrancheAddress } from '../utils/contracts';
import { GTranche } from '../../generated/GTranche/GTranche';
import {
    log,
    BigDecimal,
} from '@graphprotocol/graph-ts';


/// @notice Updates the utilisation ratio in entity <MasterData>
/// @dev
///     - If called from GVault during a strategy harvest, the utilisation is unknown and
///       needs to be retrieved from GTranche contract. In this case, param <value> = 0
///     - If called from GTranche during a <LogNewTrancheBalance> event, the utilisation
///       is known and sent through param <value>
/// @param value the utilisation ratio if function is called from GTranche; 0 otherwise
export const setUtilizationRatio = (
    value: BigDecimal,
): void => {
    let md = initMD();
    if (value != NUM.ZERO) {
        md.util_ratio = value;
    } else {
        const contract = GTranche.bind(gTrancheAddress);
        const utilization = contract.try_utilisation();
        if (utilization.reverted) {
            log.error('setUtilizationRatio(): try_utilization() reverted in /setters/gtranche.ts', []);
        } else {
            md.util_ratio = tokenToDecimal(utilization.value, 4, 4);
        }
    }
    md.save();
}

/// @notice Updates the utilisation ratio limit in entity <MasterData>
/// @dev Triggered by <LogNewUtilisationThreshold> event from GTranche contract
/// @param value the utilisation ration limit value
export const setUtilizationRatioLimit = (
    value: BigDecimal,
): void => {
    let md = initMD();
    md.util_ratio_limit = value;
    md.save();
}
