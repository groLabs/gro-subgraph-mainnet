import { parseLogEvent } from '../parsers/log';
import { manageClaim } from '../managers/stakerClaims';
import { parseStakerDepositEvent } from '../parsers/deposit';
import { parseStakerWithdrawalEvent } from '../parsers/withdrawals';
import { manageStakerDeposit } from '../managers/deposit';
import { manageStakerWithdrawal } from '../managers/withdrawal';
import {
    parseClaimV1Event,
    parseClaimV2Event,
    parseMultiClaimV2Event,
} from '../parsers/stakerClaim';
import {
    updateStakerSupply,
    updateStakerAllocation,
    updateStakerGroPerBlock,
} from '../setters/staker';
import {
    LogClaim as LogClaimV1,
    LogDeposit as LogDepositV1,
    LogWithdraw as LogWithdrawV1,
    LogAddPool as LogAddPoolV1,
    LogSetPool as LogSetPoolV1,
    LogUpdatePool as LogUpdatePoolV1,
    LogGroPerBlock as LogGroPerBlockV1,
} from '../../generated/LpTokenStakerV1/LpTokenStaker';
import {
    LogClaim as LogClaimV2,
    LogMultiClaim as LogMultiClaimV2,
    LogDeposit as LogDepositV2,
    LogWithdraw as LogWithdrawV2,
    LogAddPool as LogAddPoolV2,
    LogSetPool as LogSetPoolV2,
    LogUpdatePool as LogUpdatePoolV2,
    LogGroPerBlock as LogGroPerBlockV2,
} from '../../generated/LpTokenStakerV2/LpTokenStaker';


export function handleClaimV1(event: LogClaimV1): void {
    const ev = parseClaimV1Event(event);
    manageClaim(ev);
}

export function handleClaimV2(event: LogClaimV2): void {
    const ev = parseClaimV2Event(event);
    manageClaim(ev);
}

export function handleMultiClaimV2(event: LogMultiClaimV2): void {
    const ev = parseMultiClaimV2Event(event);
    manageClaim(ev);
}

export function handleDepositV1(event: LogDepositV1): void {
    const ev = parseStakerDepositEvent(event);
    manageStakerDeposit(ev);
}

export function handleDepositV2(event: LogDepositV2): void {
    const ev = parseStakerDepositEvent(event);
    manageStakerDeposit(ev);
}

export function handleWithdrawV1(event: LogWithdrawV1): void {
    const ev = parseStakerWithdrawalEvent(event);
    manageStakerWithdrawal(ev);
}

export function handleWithdrawV2(event: LogWithdrawV2): void {
    const ev = parseStakerWithdrawalEvent(event);
    manageStakerWithdrawal(ev);
}

export function handleAddPoolV1(event: LogAddPoolV1): void {
    updateStakerAllocation(
        event.params.pid,
        event.params.allocPoint,
    );
}

export function handleAddPoolV2(event: LogAddPoolV2): void {
    updateStakerAllocation(
        event.params.pid,
        event.params.allocPoint,
    );
}

export function handleSetPoolV1(event: LogSetPoolV1): void {
    updateStakerAllocation(
        event.params.pid,
        event.params.allocPoint,
    );
}

export function handleSetPoolV2(event: LogSetPoolV2): void {
    updateStakerAllocation(
        event.params.pid,
        event.params.allocPoint,
    );
}

export function handleUpdatePoolV1(event: LogUpdatePoolV1): void {
    const logs = parseLogEvent(event.receipt!.logs);
    updateStakerSupply(
        event.params.pid,
        event.params.lpSupply,
        event.params.accGroPerShare,
        event.block.number,
        event.block.timestamp,
        logs,
    );
}

export function handleUpdatePoolV2(event: LogUpdatePoolV2): void {
    const logs = parseLogEvent(event.receipt!.logs);
    updateStakerSupply(
        event.params.pid,
        event.params.lpSupply,
        event.params.accGroPerShare,
        event.block.number,
        event.block.timestamp,
        logs,
    );
}

export function handleGroPerBlockV1(event: LogGroPerBlockV1): void {
    updateStakerGroPerBlock(
        event.params.newGro
    );
}

export function handleGroPerBlockV2(event: LogGroPerBlockV2): void {
    updateStakerGroPerBlock(
        event.params.newGro
    );
}
