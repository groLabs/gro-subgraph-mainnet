import { LogBonusClaimed as LogBonusClaimedV1 } from '../../generated/GROHodlerV1/GROHodler';
import { LogBonusClaimed as LogBonusClaimedV2 } from '../../generated/GROHodlerV2/GROHodler';
import {
    updateNetReward,
    updateTotalBonus,
} from '../setters/vestingBonus';
import { tokenToDecimal } from '../utils/tokens';
import { NUM } from '../utils/constants';


export function handleBonusClaimedV1(event: LogBonusClaimedV1): void {
    updateNetReward(
        event.params.user.toHexString(),
        tokenToDecimal(event.params.amount, 18, 7),
        true,
    );
    updateTotalBonus(
        tokenToDecimal(event.params.amount, 18, 7).times(NUM.MINUS_ONE),
    );

}

export function handleBonusClaimedV2(event: LogBonusClaimedV2): void {
    updateNetReward(
        event.params.user.toHexString(),
        tokenToDecimal(event.params.amount, 18, 7),
        event.params.vest,
    );
    updateTotalBonus(
        tokenToDecimal(event.params.amount, 18, 7).times(NUM.MINUS_ONE),
    );
}
