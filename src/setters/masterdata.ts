import { MasterData } from '../../generated/schema';
import { NUM } from '../utils/constants';
import { LAUNCH_TIMESTAMP } from '../utils/constants';


export const setMasterData = (): MasterData => {
    let md = MasterData.load('0x');
    if (!md) {
      md = new MasterData('0x');
      md.status = 'ok';
      md.networkId = i32(1);
      md.networkName = 'mainnet';
      md.launchTimestamp = i32(LAUNCH_TIMESTAMP);
      md.gro_per_block = NUM.ZERO;
      md.total_alloc = NUM.ZERO;
      md.total_locked_amount = NUM.ZERO;
      md.total_bonus = NUM.ZERO;
      md.total_bonus_in = NUM.ZERO;
      md.total_bonus_out = NUM.ZERO;
      md.global_start_time = i32(0);
      md.save();
    }
    return md;
}
