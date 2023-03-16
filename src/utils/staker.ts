// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Retrieves reward debt from staker contract

import { tokenToDecimal } from '../utils/tokens';
import {
    NUM,
    DECIMALS,
} from '../utils/constants';
import {
    log,
    Bytes,
    BigInt,
    Address,
    BigDecimal,
} from '@graphprotocol/graph-ts';


/// @notice Gets the current reward debt from the Staker for a given user & pool
/// @param stakerContract the staker contract
/// @param userAddress the user address
/// @param poolId the pool identifier
/// @return reward debt if user found in the staker; 0 otherwise
export function getRewardDebt<T>(
    stakerContract: T,
    userAddress: Bytes,
    poolId: i32,
): BigDecimal {
    let currentRewardDebt = NUM.ZERO;
    // @ts-ignore
    const userInfo = stakerContract.try_userInfo(
        BigInt.fromI32(poolId),
        Address.fromBytes(userAddress),
    );
    if (userInfo.reverted) {
        const data = `on userAddress: {} poolId: {}`;
        log.error(
            `getRewardDebt(): try_userInfo reverted for Staker ${data} in /utils/staker.ts`,
            [userAddress.toHexString(), poolId.toString()]
        );
    } else {
        currentRewardDebt = tokenToDecimal(userInfo.value.getRewardDebt(), 18, DECIMALS);
    }
    return currentRewardDebt;
}
