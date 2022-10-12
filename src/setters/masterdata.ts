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
      md.save();
    }
    return md;
}
