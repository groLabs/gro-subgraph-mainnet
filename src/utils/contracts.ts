import { Address } from '@graphprotocol/graph-ts';
import {
    ZERO_ADDR,
    STAKER_ADDRESSES
} from '../utils/constants';


// check if Transfer is a deposit or withdrawal
const isDepositOrWithdrawal = (
    from: Address,
    to: Address,
): bool => {
    return (from == ZERO_ADDR || to == ZERO_ADDR)
        ? true
        : false;
}

// check if Transfer comes in or out of a staker contract
const isStakerTransfer = (
    from: Address,
    to: Address,
): bool => {
    return (STAKER_ADDRESSES.includes(from) || STAKER_ADDRESSES.includes(to))
        ? true
        : false;
}

export {
    isDepositOrWithdrawal,
    isStakerTransfer,
}










