import { MasterData } from '../../generated/schema';


export const setMasterData = (): void => {
    let md = MasterData.load('0x');
    if (!md) {
      md = new MasterData('0x');
      md.status = 'ok';
      md.networkId = i32(1);
      md.networkName = 'mainnet';
      md.launchTimestamp = i32(1622204347);
      md.save();
    }
}
