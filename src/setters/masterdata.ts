import { NUM } from '../utils/constants';
import { TS_LAUNCH } from '../utils/constants';
import { MasterData } from '../../generated/schema';


export const initMD = (): MasterData => {
	let md = MasterData.load('0x');
	if (!md) {
		md = new MasterData('0x');
		md.status = 'ok';
		md.networkId = i32(1);
		md.networkName = 'mainnet';
		md.launchTimestamp = i32(TS_LAUNCH);
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
		md.gvault_release_factor = i32(86400);
	}
	return md;
}
