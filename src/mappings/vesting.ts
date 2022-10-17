import { LogVest as LogVestV1 } from '../../generated/GROVestingV1/GROVesting';
import { LogVest as LogVestV2 } from '../../generated/GROVestingV2/GROVesting';
import { LogExit as LogExitV1 } from '../../generated/GROVestingV1/GROVesting';
import { LogExit as LogExitV2 } from '../../generated/GROVestingV2/GROVesting';
import { LogInstantExit as LogInstantExitV2 } from '../../generated/GROVestingV2/GROVesting';
import { LogExtend as LogExtendV1 } from '../../generated/GROVestingV1/GROVesting';
import { LogExtend as LogExtendV2 } from '../../generated/GROVestingV2/GROVesting';
import {
    updateVest,
    updateExit,
    updateTotalBonus,
    updateTotalGroove,
} from '../setters/vestingBonus';
import { tokenToDecimal } from '../utils/tokens';
import {
    NUM,
    DECIMALS
} from '../utils/constants';


export function handleVestV1(event: LogVestV1): void {
    // TODO: check (event.params.vesting.length === 2)
    updateVest(
        event.params.user.toHexString(),
        tokenToDecimal(event.params.amount, 18, DECIMALS),
        event.params.vesting.startTime
    );
    updateTotalGroove(
        tokenToDecimal(event.params.totalLockedAmount, 18, DECIMALS),
        event.address,
    )
}

export function handleVestV2(event: LogVestV2): void {
    updateVest(
        event.params.user.toHexString(),
        tokenToDecimal(event.params.amount, 18, DECIMALS),
        event.params.vesting.startTime
    );
    updateTotalGroove(
        tokenToDecimal(event.params.totalLockedAmount, 18, DECIMALS),
        event.address,
    );
}

export function handleExitV1(event: LogExitV1): void {
    updateExit(
        event.params.user.toHexString(),
        tokenToDecimal(event.params.vesting, 18, DECIMALS),
    );
    updateTotalGroove(
        tokenToDecimal(event.params.totalLockedAmount, 18, DECIMALS),
        event.address,
    );
    updateTotalBonus(
        tokenToDecimal(event.params.penalty, 18, DECIMALS),
    );
}

export function handleExitV2(event: LogExitV2): void {
    updateExit(
        event.params.user.toHexString(),
        tokenToDecimal(event.params.amount, 18, DECIMALS),
    );
    updateTotalGroove(
        tokenToDecimal(event.params.totalLockedAmount, 18, DECIMALS),
        event.address,
    );
    updateTotalBonus(
        tokenToDecimal(event.params.penalty, 18, DECIMALS),
    );
}

export function handleInstantExitV2(event: LogInstantExitV2): void {
    updateTotalBonus(
        tokenToDecimal(event.params.penalty, 18, DECIMALS),
    );
}

export function handleExtendV1(event: LogExtendV1): void {
    updateTotalGroove(
        NUM.ZERO,
        event.address,
    )
}

export function handleExtendV2(event: LogExtendV2): void {
    updateTotalGroove(
        NUM.ZERO,
        event.address,
    )
}