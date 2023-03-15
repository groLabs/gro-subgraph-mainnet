// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Initialises entities <MasterData>, <CoreData> & <GVaultStrategy>
/// @dev There is one single MasterData record & CoreData record with 0x address
///		 that get updated

import {
	NUM,
	ADDR,
} from '../utils/constants';
import { TS_LAUNCH } from '../utils/constants';
import { initCoreData } from '../setters/coreData';
import { MasterData } from '../../generated/schema';
import { initAllGVaultStrategies } from '../setters/stratsGVault';


/// @notice Initialises entity <MasterData> with default values if not created yet
/// @return MasterData object
export const initMD = (): MasterData => {
	let md = MasterData.load(ADDR.ZERO);
	if (!md) {
		md = new MasterData(ADDR.ZERO);
		md.status = 'ok';
		md.network_id = i32(1);
		md.network_name = 'mainnet';
		md.launch_timestamp = i32(TS_LAUNCH);
		md.gro_per_block = NUM.ZERO;
		md.total_alloc = NUM.ZERO;
		md.total_locked_amount = NUM.ZERO;
		md.total_bonus = NUM.ZERO;
		md.total_bonus_in = NUM.ZERO;
		md.total_bonus_out = NUM.ZERO;
		md.global_start_time = i32(0);
		md.init_unlocked_percent = NUM.ZERO;
		md.util_ratio = NUM.ZERO;
		md.util_ratio_limit = NUM.ONE;
	}
	return md;
}

/// @notice Initialises entities <MasterData>, <CoreData> & <GVaultStrategy>
///			once (i.e.: this function just needs to be called one time)
/// @dev - Triggered by the following contract events:
///			 <OwnershipTransferred> from Pwrd -> first block pre G2
///			 <LogStrategyTotalChanges> from GVault -> first block post G2
///		 - When publishing the subgraph with full data (production), the Pwrd
///		   trigger will initialise the MasterData
///		 - When publishing the subgraph with partial data (test), the GVault
///		   trigger will initialise the MasterData

export const initMasterDataOnce = (): void => {
	let md = MasterData.load(ADDR.ZERO);
	if (!md) {
		md = initMD();
		md.save;
		initCoreData(true);
		initAllGVaultStrategies();
	}
}
