import {
	User,
	MasterData,
} from '../../generated/schema';
import { initMD } from '../setters/masterdata';
import { initAllStrategies } from '../setters/strats';

const initMasterDataOnce = (): void => {
	let md = MasterData.load('0x');
	if (!md) {
		md = initMD();
		md.save;
		initAllStrategies();
	}
}

export const setUser = (userAddress: string): User => {
	initMasterDataOnce();
	let user = User.load(userAddress)
	if (!user) {
		user = new User(userAddress);
		user.save();
	}
	return user;
}
