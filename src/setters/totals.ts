import { BigDecimal } from '@graphprotocol/graph-ts';
import { Totals } from '../../generated/schema';


export const setTotals = (
    type: string,
    coin: string,
    userAddress: string,
    usdAmount: BigDecimal
): void => {
    let total = Totals.load(userAddress);

    if (!total) {
        total = new Totals(userAddress);
        total.userAddress = userAddress;
        total.eth_amount_added_gvt = BigDecimal.fromString('0');
        total.eth_amount_added_pwrd = BigDecimal.fromString('0');
        total.eth_amount_added_total = BigDecimal.fromString('0');
        total.eth_amount_removed_gvt = BigDecimal.fromString('0');
        total.eth_amount_removed_pwrd = BigDecimal.fromString('0');
        total.eth_amount_removed_total = BigDecimal.fromString('0');
    }

    if (coin === 'gro') {
        // no nothing for now (required to initialised non-null amounts to 0)
    } else if (type === 'deposit' || type === 'transfer_in') {
        if (coin === 'gvt') {
            total.eth_amount_added_gvt = total.eth_amount_added_gvt.plus(usdAmount);
        } else if (coin === 'pwrd') {
            total.eth_amount_added_pwrd = total.eth_amount_added_pwrd.plus(usdAmount);
        }
        total.eth_amount_added_total = total.eth_amount_added_total.plus(usdAmount);
    } else if (type === 'withdrawal' || type === 'transfer_out') {
        if (coin === 'gvt') {
            total.eth_amount_removed_gvt = total.eth_amount_removed_gvt.plus(usdAmount);
        } else if (coin === 'pwrd') {
            total.eth_amount_removed_pwrd = total.eth_amount_removed_pwrd.plus(usdAmount);
        }
        total.eth_amount_removed_total = total.eth_amount_removed_total.plus(usdAmount);
    }

    total.save();
}
