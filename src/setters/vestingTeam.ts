import { BigDecimal } from '@graphprotocol/graph-ts';
import { initTotals } from './totals';


export const updateTeamVesting = (
    userAddress: string,
    amount: BigDecimal,
    add: boolean
): void => {
    const totals = initTotals(userAddress, false);
    if (add) {
        totals.amount_added_gro_team = totals.amount_added_gro_team.plus(amount);
        totals.amount_total_gro_team = totals.amount_total_gro_team.plus(amount);
    } else {
        totals.amount_removed_gro_team = totals.amount_removed_gro_team.plus(amount);
        totals.amount_total_gro_team = totals.amount_total_gro_team.minus(amount);
    }
    totals.save();
}
