import { initMD } from '../setters/masterdata';
import { initVestingBonus } from '../setters/vestingBonus';
import { initVestingAirdrop } from '../setters/vestingAirdrop';
import { initAllGVaultStrategies } from '../setters/stratsGVault';
import {
	User,
	MasterData,
} from '../../generated/schema';

// TODO: ENHANCEMENT -> link this to the very first event in Gro Protocol (eg: transfer ownership)
const initMasterDataOnce = (): void => {
	let md = MasterData.load('0x');
	if (!md) {
		md = initMD();
		md.save;
		initAllGVaultStrategies();
	}
}

export const setUser = (userAddress: string): User => {
	initMasterDataOnce();
	let user = User.load(userAddress)
	if (!user) {
		user = new User(userAddress);
		user.save();
		initVestingBonus(userAddress, true);
		initVestingAirdrop(userAddress, true);
	}
	return user;
}
