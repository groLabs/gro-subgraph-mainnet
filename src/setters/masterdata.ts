import {
	NUM,
	ADDR,
} from '../utils/constants';
import { TS_LAUNCH } from '../utils/constants';
import { initCoreData } from '../setters/coreData';
import { MasterData } from '../../generated/schema';
import { initAllGVaultStrategies } from '../setters/stratsGVault';


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

export const initMasterDataOnce = (): void => {
	let md = MasterData.load(ADDR.ZERO);
	if (!md) {
		md = initMD();
		md.save;
		initCoreData(true);
		initAllGVaultStrategies();
	}
}
