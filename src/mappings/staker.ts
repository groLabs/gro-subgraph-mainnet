import {
    LogClaim as LogClaimV1,
    LogDeposit as LogDepositV1,
    LogWithdraw as LogWithdrawV1,
} from '../../generated/LpTokenStakerV1/LpTokenStaker';
import {
    LogClaim as LogClaimV2,
    LogMultiClaim as LogMultiClaimV2,
    LogDeposit as LogDepositV2,
    LogWithdraw as LogWithdrawV2,
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

