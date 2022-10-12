import { User } from '../../generated/schema';
import { setMasterData } from '../setters/masterdata';
let isMasterDataInitialised = false;


export const setUser = (userAddress: string): User => {
  if (!isMasterDataInitialised) {
    setMasterData();
    isMasterDataInitialised = true;
  }
  let user = User.load(userAddress)
  if (!user) {
    user = new User(userAddress);
    user.save();
  }
  return user;
}
