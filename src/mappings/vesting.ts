import {
    LogVest as LogVestV1,
    LogExit as LogExitV1,
    LogExtend as LogExtendV1,
} from '../../generated/GROVestingV1/GROVesting';
import {
    LogVest as LogVestV2,
    LogExit as LogExitV2,
    LogInstantExit as LogInstantExitV2,
    LogExtend as LogExtendV2,
    LogNewInitUnlockedPercent as LogNewInitUnlockedPercentV2
} from '../../generated/GROVestingV2/GROVesting';
import {
    updateVest,
    updateExit,
    updateStartTime,
    updateGlobalTimeStamp,
    updateTotalLockedAmount,
    updateInitUnlockedPercent,
} from '../setters/vestingBonus';
import { tokenToDecimal } from '../utils/tokens';
import {
    NUM,
    DECIMALS,
} from '../utils/constants';
import { initMD } from '../setters/masterdata';


export function handleVestV1(event: LogVestV1): void {
    // TODO: check (event.params.vesting.length === 2)
    updateVest(
        event.params.user,
        tokenToDecimal(event.params.amount, 18, DECIMALS),
        event.params.vesting.startTime
    );
    let md = initMD();
    md = updateTotalLockedAmount(
        md,
        tokenToDecimal(event.params.totalLockedAmount, 18, DECIMALS),
        false,
    );
    updateGlobalTimeStamp(
        md,
        event.address,
        true,
    );
}

export function handleVestV2(event: LogVestV2): void {
    updateVest(
        event.params.user,
        tokenToDecimal(event.params.amount, 18, DECIMALS),
        event.params.vesting.startTime
    );
    let md = initMD();
    md = updateTotalLockedAmount(
        md,
        tokenToDecimal(event.params.totalLockedAmount, 18, DECIMALS),
        false,
    );
    updateGlobalTimeStamp(
        md,
        event.address,
        true,
    );
}

export function handleExitV1(event: LogExitV1): void {
    updateExit(
        event.params.user,
        event.address,
        tokenToDecimal(event.params.vesting, 18, DECIMALS),
        tokenToDecimal(event.params.totalLockedAmount, 18, DECIMALS),
        tokenToDecimal(event.params.penalty, 18, DECIMALS),
        false,
    );
}

export function handleExitV2(event: LogExitV2): void {
    updateExit(
        event.params.user,
        event.address,
        tokenToDecimal(event.params.amount, 18, DECIMALS),
        tokenToDecimal(event.params.totalLockedAmount, 18, DECIMALS),
        tokenToDecimal(event.params.penalty, 18, DECIMALS),
        false,
    );
}

// @dev: no amount & totalLockedAmount in LogInstantExit
export function handleInstantExitV2(event: LogInstantExitV2): void {
    updateExit(
        event.params.user,
        event.address,
        NUM.ZERO,
        NUM.ZERO,
        tokenToDecimal(event.params.penalty, 18, DECIMALS),
        true,
    );
}

export function handleExtendV1(event: LogExtendV1): void {
    let md = initMD();
    updateGlobalTimeStamp(
        md,
        event.address,
        true,
    );
    updateStartTime(
        event.params.user,
        event.params.newPeriod,
    );
}

export function handleExtendV2(event: LogExtendV2): void {
    let md = initMD();
    updateGlobalTimeStamp(
        md,
        event.address,
        true,
    );
    updateStartTime(
        event.params.user,
        event.params.newPeriod,
    );
}

export function handleLogNewInitUnlockedPercentV2(
    event: LogNewInitUnlockedPercentV2
): void {
    updateInitUnlockedPercent(
        event.params.initUnlockedPercent.toBigDecimal(),
    );
}
