import { BigDecimal } from '@graphprotocol/graph-ts';
import { Totals } from '../../generated/schema';


export const setTotals = (
    type: string,
    coin: string,
    userAddress: string,
    coinAmount: BigDecimal,
    usdAmount: BigDecimal
): void => {
    let total = Totals.load(userAddress);

    if (!total) {
        total = new Totals(userAddress);
        total.userAddress = userAddress;
        total.amount_added_gvt = BigDecimal.fromString('0');
        total.amount_added_pwrd = BigDecimal.fromString('0');
        total.amount_added_total = BigDecimal.fromString('0');
        total.amount_removed_gvt = BigDecimal.fromString('0');
        total.amount_removed_pwrd = BigDecimal.fromString('0');
        total.amount_removed_total = BigDecimal.fromString('0');
        total.value_added_gvt = BigDecimal.fromString('0');
        total.value_added_pwrd = BigDecimal.fromString('0');
        total.value_added_total = BigDecimal.fromString('0');
        total.value_removed_gvt = BigDecimal.fromString('0');
        total.value_removed_pwrd = BigDecimal.fromString('0');
        total.value_removed_total = BigDecimal.fromString('0');
        total.net_value_gvt = BigDecimal.fromString('0');
        total.net_value_pwrd = BigDecimal.fromString('0');
        total.net_value_total = BigDecimal.fromString('0');
        // total.current_balance_pwrd = BigDecimal.fromString('0');
        // total.current_balance_gvt = BigDecimal.fromString('0');
        // total.current_balance_total = BigDecimal.fromString('0');
        // total.net_returns_pwrd = BigDecimal.fromString('0');
        // total.net_returns_gvt = BigDecimal.fromString('0');
        // total.net_returns_total = BigDecimal.fromString('0');
    }

    if (coin === 'gro') {
        // do nothing for now (required to initialise non-null amounts to 0)
    } else if (type === 'deposit' || type === 'transfer_in') {
        if (coin === 'gvt') {
            total.amount_added_gvt = total.amount_added_gvt.plus(coinAmount);
            total.value_added_gvt = total.value_added_gvt.plus(usdAmount);
            total.net_value_gvt = total.net_value_gvt.plus(usdAmount);
        } else if (coin === 'pwrd') {
            total.amount_added_pwrd = total.amount_added_pwrd.plus(coinAmount);
            total.value_added_pwrd = total.value_added_pwrd.plus(usdAmount);
            total.net_value_pwrd = total.net_value_pwrd.plus(usdAmount);
        }
        total.amount_added_total = total.amount_added_total.plus(coinAmount);
        total.value_added_total = total.value_added_total.plus(usdAmount);
        total.net_value_total = total.net_value_total.plus(usdAmount);
    } else if (type === 'withdrawal' || type === 'transfer_out') {
        if (coin === 'gvt') {
            total.amount_removed_gvt = total.amount_removed_gvt.plus(coinAmount);
            total.value_removed_gvt = total.value_removed_gvt.plus(usdAmount);
            total.net_value_gvt = total.net_value_gvt.minus(usdAmount);
        } else if (coin === 'pwrd') {
            total.amount_removed_pwrd = total.amount_removed_pwrd.plus(coinAmount);
            total.value_removed_pwrd = total.value_removed_pwrd.plus(usdAmount);
            total.net_value_pwrd = total.net_value_pwrd.minus(usdAmount);
        }
        total.amount_removed_total = total.amount_removed_total.plus(coinAmount);
        total.value_removed_total = total.value_removed_total.plus(usdAmount);
        total.net_value_total = total.net_value_total.minus(usdAmount);
    }

    total.save();
}
