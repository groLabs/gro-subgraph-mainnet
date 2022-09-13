import { Address } from '@graphprotocol/graph-ts';
import { ZERO_ADDR } from '../utils/constants';

const isDepositOrWithdrawal = (
    from: Address,
    to: Address,
): bool => {
    const res = (from == ZERO_ADDR || to == ZERO_ADDR)
        ? true
        : false;

    return res;
}

export {
    isDepositOrWithdrawal,
}










