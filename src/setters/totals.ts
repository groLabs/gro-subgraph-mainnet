import { BigDecimal } from '@graphprotocol/graph-ts';
import { Totals } from '../../generated/schema';
import { ZERO } from '../utils/constants';


export const initTotals = (userAddress: string): Totals => {
    let total = Totals.load(userAddress);
    if (!total) {
        total = new Totals(userAddress);
        total.userAddress = userAddress;
        total.amount_added_gvt = ZERO;
        total.amount_added_pwrd = ZERO;
        total.amount_added_total = ZERO;
        total.amount_removed_gvt = ZERO;
        total.amount_removed_pwrd = ZERO;
        total.amount_removed_total = ZERO;
        total.value_added_gvt = ZERO;
        total.value_added_pwrd = ZERO;
        total.value_added_total = ZERO;
        total.value_removed_gvt = ZERO;
        total.value_removed_pwrd = ZERO;
        total.value_removed_total = ZERO;
        total.net_value_gvt = ZERO;
        total.net_value_pwrd = ZERO;
        total.net_value_total = ZERO;
        total.net_amount_gvt = ZERO;
        total.net_based_amount_pwrd = ZERO;
    }
    return total;
}

export const setTotals = (
    type: string,
    coin: string,
    userAddress: string,
    coinAmount: BigDecimal,
    usdAmount: BigDecimal,
    factor: BigDecimal,
): void => {
    let total = initTotals(userAddress);

    if (coin === 'gro') {
        // do nothing for now (required to initialise non-null amounts to 0)
    } else if (type === 'deposit' || type === 'transfer_in') {
        if (coin === 'gvt') {
            total.amount_added_gvt = total.amount_added_gvt.plus(coinAmount);
            total.value_added_gvt = total.value_added_gvt.plus(usdAmount);
            total.net_amount_gvt = total.net_amount_gvt.plus(coinAmount);
            total.net_value_gvt = total.net_value_gvt.plus(usdAmount);
        } else if (coin === 'pwrd') {
            total.amount_added_pwrd = total.amount_added_pwrd.plus(coinAmount);
            total.value_added_pwrd = total.value_added_pwrd.plus(usdAmount);
            total.net_based_amount_pwrd = total.net_based_amount_pwrd.plus(coinAmount).times(factor); // based pwrd amount
            total.net_value_pwrd = total.net_value_pwrd.plus(usdAmount);
        }
        total.amount_added_total = total.amount_added_total.plus(coinAmount);
        total.value_added_total = total.value_added_total.plus(usdAmount);
        total.net_value_total = total.net_value_total.plus(usdAmount);
    } else if (type === 'withdrawal' || type === 'transfer_out') {
        if (coin === 'gvt') {
            total.amount_removed_gvt = total.amount_removed_gvt.plus(coinAmount);
            total.value_removed_gvt = total.value_removed_gvt.plus(usdAmount);
            total.net_amount_gvt = total.net_amount_gvt.minus(coinAmount);
            total.net_value_gvt = total.net_value_gvt.minus(usdAmount);
        } else if (coin === 'pwrd') {
            total.amount_removed_pwrd = total.amount_removed_pwrd.plus(coinAmount);
            total.value_removed_pwrd = total.value_removed_pwrd.plus(usdAmount);
            total.net_based_amount_pwrd = total.net_based_amount_pwrd.minus(coinAmount).times(factor); // based pwrd amount
            total.net_value_pwrd = total.net_value_pwrd.minus(usdAmount);
        }
        total.amount_removed_total = total.amount_removed_total.plus(coinAmount);
        total.value_removed_total = total.value_removed_total.plus(usdAmount);
        total.net_value_total = total.net_value_total.minus(usdAmount);
    }

    total.save();
}
