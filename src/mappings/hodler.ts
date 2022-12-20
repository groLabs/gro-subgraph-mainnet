import {
    NUM,
    DECIMALS,
} from '../utils/constants';
import { initMD } from '../setters/masterdata';
import { tokenToDecimal } from '../utils/tokens';
import { LogBonusClaimed as LogBonusClaimedV1 } from '../../generated/GROHodlerV1/GROHodler';
import { LogBonusClaimed as LogBonusClaimedV2 } from '../../generated/GROHodlerV2/GROHodler';
import {
    updateNetReward,
    updateTotalBonus,
} from '../setters/vestingBonus';


export function handleBonusClaimedV1(event: LogBonusClaimedV1): void {
    updateNetReward(
        event.params.user.toHexString(),
        tokenToDecimal(event.params.amount, 18, DECIMALS),
        true,
    );
    let md = initMD();
    updateTotalBonus(
        md,
        tokenToDecimal(event.params.amount, 18, DECIMALS).times(NUM.MINUS_ONE),
        true,
    );
}

export function handleBonusClaimedV2(event: LogBonusClaimedV2): void {
    updateNetReward(
        event.params.user.toHexString(),
        tokenToDecimal(event.params.amount, 18, DECIMALS),
        event.params.vest,
    );
    let md = initMD();
    updateTotalBonus(
        md,
        tokenToDecimal(event.params.amount, 18, DECIMALS).times(NUM.MINUS_ONE),
        true,
    );
}
