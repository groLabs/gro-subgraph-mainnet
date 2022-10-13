import { LogVest as LogVestV1 } from '../../generated/GROVestingV1/GROVesting';
import { LogVest as LogVestV2 } from '../../generated/GROVestingV2/GROVesting';
import { LogExit as LogExitV1 } from '../../generated/GROVestingV1/GROVesting';
import { LogExit as LogExitV2 } from '../../generated/GROVestingV2/GROVesting';
import { updateVestingGro } from '../setters/vestingBonus';
import { tokenToDecimal } from '../utils/tokens';
import { NUM} from '../utils/constants';


export function handleVestV1(event: LogVestV1): void {
    updateVestingGro(
        event.params.user.toHexString(),
        tokenToDecimal(event.params.amount, 18, 7),
    )
}

export function handleVestV2(event: LogVestV2): void {
    updateVestingGro(
        event.params.user.toHexString(),
        tokenToDecimal(event.params.amount, 18, 7),
    )
}

export function handleExitV1(event: LogExitV1): void {
    updateVestingGro(
        event.params.user.toHexString(),
        tokenToDecimal(event.params.vesting, 18, 7).times(NUM.MINUS_ONE), //TODO: TBC event.params.vesting
    )
}

export function handleExitV2(event: LogExitV2): void {
    updateVestingGro(
        event.params.user.toHexString(),
        tokenToDecimal(event.params.amount, 18, 7).times(NUM.MINUS_ONE),
    )
}
