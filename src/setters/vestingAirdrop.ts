// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Initialises entity <VestingAirdrop> and updates claim amounts
///         from GMerkleVestor contract

import { NUM } from '../utils/constants';
import { VestingAirdrop } from '../../generated/schema';
import { 
    Bytes,
    BigDecimal,
} from '@graphprotocol/graph-ts';


/// @notice Initialises entity <VestingAirdrop> with default values if not created yet
/// @param userAddress the user address
/// @param save stores the entity if true; doesn't store it otherwise
/// @return VestingAirdrop object for a given user address
export const initVestingAirdrop = (
    userAddress: Bytes,
    save: boolean,
): VestingAirdrop => {
    const id = userAddress;
    let vestingBonus = VestingAirdrop.load(id);
    if (!vestingBonus) {
        vestingBonus = new VestingAirdrop(id);
        vestingBonus.user_address = userAddress;
        vestingBonus.claim_initialized = false;
        vestingBonus.total_claim_amount = NUM.ZERO;
        vestingBonus.claimed_amount = NUM.ZERO;
        if (save)
            vestingBonus.save();
    }
    return vestingBonus;
}

/// @notice Stores the initial claim in entity <VestingAirdrop>
/// @dev Triggered by event <LogInitialClaim> from GMerkleVestor contract
/// @param userAddress the user address
/// @param totalClaim the total claim
/// @param claimAmount the claim amount
export const setInitialClaim = (
    userAddress: Bytes,
    totalClaim: BigDecimal,
    claimAmount: BigDecimal,
): void => {
    let vestingAirdrop = initVestingAirdrop(userAddress, false);
    vestingAirdrop.claim_initialized = true;
    vestingAirdrop.total_claim_amount = totalClaim;
    vestingAirdrop.claimed_amount = claimAmount;
    vestingAirdrop.save();
}

/// @notice Updates the claim amount in entity <VestingAirdrop>
/// @dev Triggered by event <LogClaim> from GMerkleVestor contract
/// @param userAddress the user address
/// @param claimAmount the claim amount
export const setClaim = (
    userAddress: Bytes,
    claimAmount: BigDecimal,
): void => {
    let vestingAirdrop = initVestingAirdrop(userAddress, false);
    vestingAirdrop.claimed_amount = vestingAirdrop.claimed_amount.plus(claimAmount);
    vestingAirdrop.save();
}
