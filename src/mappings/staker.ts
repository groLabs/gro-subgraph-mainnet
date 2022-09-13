import {
    LogClaim as LogClaimV1Event,
    LogDeposit as LogDepositV1Event,
    LogWithdraw as LogWithdrawV1Event,
} from '../../generated/LpTokenStakerV1/LpTokenStaker';
import {
    LogClaim as LogClaimV2Event,
    LogMultiClaim as LogMultiClaimV2Event,
    LogDeposit as LogDepositV2Event,
    LogWithdraw as LogWithdrawV2Event,
} from '../../generated/LpTokenStakerV2/LpTokenStaker';
import {
    parseClaimV1Event,
    parseClaimV2Event,
    parseMultiClaimV2Event,
} from '../parsers/claim';
import { parseStakerDepositEvent } from '../parsers/deposit';
import { parseStakerWithdrawalEvent } from '../parsers/withdrawals';
import { manageClaim } from '../managers/claims';
import { manageStakerDeposit } from '../managers/deposit';
import { manageStakerWithdrawal } from '../managers/withdrawal';



export function handleClaimV1(event: LogClaimV1Event): void {
    const ev = parseClaimV1Event(event);
    manageClaim(ev);
}

export function handleClaimV2(event: LogClaimV2Event): void {
    const ev = parseClaimV2Event(event);
    manageClaim(ev);
}

export function handleMultiClaimV2(event: LogMultiClaimV2Event): void {
    const ev = parseMultiClaimV2Event(event);
    manageClaim(ev);
}

export function handleDepositV1(event: LogDepositV1Event): void {
    const ev = parseStakerDepositEvent(event);
    manageStakerDeposit(ev);
}

export function handleDepositV2(event: LogDepositV2Event): void {
    const ev = parseStakerDepositEvent(event);
    manageStakerDeposit(ev);
}

export function handleWithdrawV1(event: LogWithdrawV1Event): void {
    const ev = parseStakerWithdrawalEvent(event);
    manageStakerWithdrawal(ev);
}

export function handleWithdrawV2(event: LogWithdrawV2Event): void {
    const ev = parseStakerWithdrawalEvent(event);
    manageStakerWithdrawal(ev);
}

