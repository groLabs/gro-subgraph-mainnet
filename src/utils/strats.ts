// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Contains all static data referring to Convex strategies plus
///         strategy-related util functions
/// @dev Most of the names/descriptions are to be used in the front-end

import { TOKEN as Token } from '../utils/constants';
import { Strategy as Strat } from '../types/strats';
import {
    log,
    Bytes,
    Address,
} from '@graphprotocol/graph-ts';


/// @notice Contains the static data from all Convex strategies
export const getGVaultStrategies = (): Strat[] => {
    const strats = [
        new Strat(
            Address.fromHexString('0x60a6a86ad77ef672d93db4408d65cf27dd627050'),   // strategy address
            Address.fromHexString('0x1402c1caa002354fc2c4a4cd2b4045a5b9625ef3'),   // vault address (GVault)
            'Convex FRAX 3CRV primary',     // strategy name
            'Convex-FRAX-3CRV',             // strategy display name
            '3CRV',             // vault name
            '3CRV yVault',      // vault display name
            Token.THREE_CRV,    // coin
            'frax',             // metacoin
            'convex',           // protocol
            true,               // active
            6,                  // queue id [see log <LogStrategyAdded>]
        ),
        new Strat(
            Address.fromHexString('0xa522b13fef6161c570ff765c986cb9992a89c786'), // strategy address
            Address.fromHexString('0x1402c1caa002354fc2c4a4cd2b4045a5b9625ef3'), // vault address (GVault)
            'Convex TUSD 3CRV primary',     // strategy name
            'Convex-TUSD-3CRV',             // strategy display name
            '3CRV',             // vault name
            '3CRV yVault',      // vault display name
            Token.THREE_CRV,    // coin
            'tusd',             // metacoin
            'convex',           // protocol
            true,               // active
            7,                  // queue id [see log <LogStrategyAdded>]
        ),
        new Strat(
            Address.fromHexString('0x73703f0493c08ba592ab1e321bead695ac5b39e3'), // strategy address
            Address.fromHexString('0x1402c1caa002354fc2c4a4cd2b4045a5b9625ef3'), // vault address (GVault)
            'Convex OUSD 3CRV primary',     // strategy name
            'Convex-OUSD-3CRV',             // strategy display name
            '3CRV',             // vault name
            '3CRV yVault',      // vault display name
            Token.THREE_CRV,    // coin
            'ousd',             // metacoin
            'convex',           // protocol
            true,               // active
            8,                  // queue id [see log <LogStrategyAdded>]
        ),
        new Strat(
            Address.fromHexString('0x4d81d0c2655d8d5fdee83dbb16e6b899ec276fac'), // strategy address
            Address.fromHexString('0x1402c1caa002354fc2c4a4cd2b4045a5b9625ef3'), // vault address (GVault)
            'Convex LUSD 3CRV primary',      // strategy name
            'Convex-LUSD-3CRV',              // strategy display name
            '3CRV',             // vault name
            '3CRV yVault',      // vault display name
            Token.THREE_CRV,    // coin
            'lusd',             // metacoin
            'convex',           // protocol
            true,               // active
            9,                  // queue id [see log <LogStrategyAdded>]
        ),
    ];
    return strats;
}

/// @return strategy address given a queue identifier
export const getStrategyAddressByQueueId = (queueId: number): Bytes => {
    const strats = getGVaultStrategies();
    for (let i = 0; i < strats.length; i++) {
        if (strats[i].queueId == queueId) {
            return strats[i].id;
        }
    }
    return Address.zero();
}

/// @return true if the strategy address exists and is active; false otherwise
export const isActiveStrategy = (stratAddress: Bytes): bool => {
    const strats = getGVaultStrategies();
    for (let i = 0; i < strats.length; i++) {
        if (strats[i].id.equals(stratAddress) && strats[i].active) {
            return true;
        }
    }
    return false;
};

// G2 production v1
/*
export const getGVaultStrategies = (): Strat[] => {
    const strats = [
        new Strat(
            Address.fromHexString('0xd18415e9bc188f113cb54a9edd86df21898555c7'),   // strategy address
            Address.fromHexString('0x1402c1caa002354fc2c4a4cd2b4045a5b9625ef3'),   // vault address (GVault)
            'Convex FRAX 3CRV primary',     // strategy name
            'Convex-FRAX-3CRV',             // strategy display name
            '3CRV',             // vault name
            '3CRV yVault',      // vault display name
            Token.THREE_CRV,    // coin
            'frax',             // metacoin
            'convex',           // protocol
            true,               // active
            1,                  // queue id [see log <LogStrategyAdded>]
        ),
        new Strat(
            Address.fromHexString('0x708d0089d52d57e911024465e841774634466608'), // strategy address
            Address.fromHexString('0x1402c1caa002354fc2c4a4cd2b4045a5b9625ef3'), // vault address (GVault)
            'Convex LUSD 3CRV primary',      // strategy name
            'Convex-LUSD-3CRV',              // strategy display name
            '3CRV',             // vault name
            '3CRV yVault',      // vault display name
            Token.THREE_CRV,    // coin
            'lusd',             // metacoin
            'convex',           // protocol
            true,               // active
            2,                  // queue id [see log <LogStrategyAdded>]
        ),
        new Strat(
            Address.fromHexString('0xd947957dea1112cc9d7a5111ea6459432737e4c2'), // strategy address
            Address.fromHexString('0x1402c1caa002354fc2c4a4cd2b4045a5b9625ef3'), // vault address (GVault)
            'Convex OUSD 3CRV primary',     // strategy name
            'Convex-OUSD-3CRV',             // strategy display name
            '3CRV',             // vault name
            '3CRV yVault',      // vault display name
            Token.THREE_CRV,    // coin
            'ousd',             // metacoin
            'convex',           // protocol
            true,               // active
            3,                  // queue id [see log <LogStrategyAdded>]
        ),
        new Strat(
            Address.fromHexString('0xd849d8551ec988a59d4e411b1ed7b5b40bf97159'), // strategy address
            Address.fromHexString('0x1402c1caa002354fc2c4a4cd2b4045a5b9625ef3'), // vault address (GVault)
            'Convex TUSD 3CRV primary',     // strategy name
            'Convex-TUSD-3CRV',             // strategy display name
            '3CRV',             // vault name
            '3CRV yVault',      // vault display name
            Token.THREE_CRV,    // coin
            'tusd',             // metacoin
            'convex',           // protocol
            true,               // active
            4,                  // queue id [see log <LogStrategyAdded>]
        ),
        new Strat(
            Address.fromHexString('0xa1327c0cd1e04e82fd99e68b46ab8a6eb15b17ae'), // strategy address
            Address.fromHexString('0x1402c1caa002354fc2c4a4cd2b4045a5b9625ef3'), // vault address (GVault)
            'Convex GUSD 3CRV primary',     // strategy name
            'Convex-GUSD-3CRV',             // strategy display name
            '3CRV',             // vault name
            '3CRV yVault',      // vault display name
            Token.THREE_CRV,    // coin
            'gusd',             // metacoin
            'convex',           // protocol
            true,               // active
            5,                  // queue id [see log <LogStrategyAdded>]
        ),
    ];
    return strats;
}
*/
