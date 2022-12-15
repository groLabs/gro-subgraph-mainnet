import { TS_LAUNCH, NUM, ADDR } from '../utils/constants';
import { MasterData } from '../../generated/schema';
import { GTranche } from '../../generated/GTranche/GTranche';
import { log } from '@graphprotocol/graph-ts';
import { tokenToDecimal } from '../utils/tokens';

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
		md.gtoken_utilization = NUM.ZERO;
	}
	return md;
}

export const updateGTokenUtilization = (): void => {
	const contract = GTranche.bind(ADDR.GTRANCHE);
    const utilization = contract.try_utilization();
    if (utilization.reverted) {
        log.error('updateGTokenUtilization() reverted in src/setters/masterdata.ts', []);
    } else {
        let md = initMD();
        md.gtoken_utilization = tokenToDecimal(utilization.value, 4, 4);
        md.save();
    }
}
