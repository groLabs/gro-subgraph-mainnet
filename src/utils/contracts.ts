import { contracts } from '../../addresses';
import { Address } from '@graphprotocol/graph-ts';
import { STAKER_ADDRESSES } from '../utils/constants';
// contract addresses
const gRouterAddress = Address.fromString(contracts.GRouterAddress);


// check if Transfer is a deposit or withdrawal
export const isDepositOrWithdrawal = (
    from: Address,
    to: Address,
): bool => {
    return (from == Address.zero() || to == Address.zero())
        ? true
        : false;
}

// check if Transfer comes in or out of a staker contract
export const isStakerTransfer = (
    from: Address,
    to: Address,
): bool => {
    return (STAKER_ADDRESSES.includes(from) || STAKER_ADDRESSES.includes(to))
        ? true
        : false;
}

export const isTransferToGRouter = (to: Address): bool => {
    return  gRouterAddress.equals(to);
}
