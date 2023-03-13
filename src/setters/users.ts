import { User } from '../../generated/schema';
import { Bytes } from '@graphprotocol/graph-ts';
import { initVestingBonus } from '../setters/vestingBonus';
import { initVestingAirdrop } from '../setters/vestingAirdrop';


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
