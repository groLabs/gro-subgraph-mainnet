import { LogBonusClaimed as LogBonusClaimedV1 } from '../../generated/GROHodlerV1/GROHodler';
import { LogBonusClaimed as LogBonusClaimedV2 } from '../../generated/GROHodlerV2/GROHodler';
import { updateNetReward } from '../setters/vestingBonus';
import { tokenToDecimal } from '../utils/tokens';

export function handleBonusClaimedV1(event: LogBonusClaimedV1): void {
    updateNetReward(
        event.params.user.toHexString(),
        tokenToDecimal(event.params.amount, 18, 7),
        true,
    );
}

export function handleBonusClaimedV2(event: LogBonusClaimedV2): void {
    updateNetReward(
        event.params.user.toHexString(),
        tokenToDecimal(event.params.amount, 18, 7),
        event.params.vest,
    );
}
