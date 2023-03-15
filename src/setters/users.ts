// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Initialises entity <User>, <VestingBonus> & <VestingAirdrop>

import { User } from '../../generated/schema';
import { Bytes } from '@graphprotocol/graph-ts';
import { initVestingBonus } from '../setters/vestingBonus';
import { initVestingAirdrop } from '../setters/vestingAirdrop';


/// @notice Initialises entities <User>, <VestingBonus> & <VestingAirdrop>
///			with default values if not created yet
/// @dev This function is called every time there is a Gro interaction, as it is not
///		 possible to determine which users are already created in the subgraph
/// @param userAddress the user address
/// @return user object for a given address
export const setUser = (userAddress: Bytes): User => {
	let user = User.load(userAddress)
	if (!user) {
		user = new User(userAddress);
		user.save();
		initVestingBonus(userAddress, true);
		initVestingAirdrop(userAddress, true);
	}
	return user;
}
