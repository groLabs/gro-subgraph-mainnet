import {
    LogClaim as LogClaimV1Event,
    LogDeposit as LogDepositV1Event,
} from '../../generated/LpTokenStakerV1/LpTokenStaker';
import {
    LogClaim as LogClaimV2Event,
    LogMultiClaim as LogMultiClaimV2Event,
    LogDeposit as LogDepositV2Event,
} from '../../generated/LpTokenStakerV2/LpTokenStaker';
import {
    parseClaimV2Event,
    parseMultiClaimV2Event,
} from '../parsers/claim';
import { parseDepositEvent } from '../parsers/deposit';
import { manageClaim } from '../managers/claims';
import { manageDeposit } from '../managers/deposit';


export function handleClaimV1(event: LogClaimV1Event): void {
    // const ev = parseClaimEvent(event);
    // manageClaim(ev);
}

export function handleClaimV2(event: LogClaimV2Event): void {
    const ev = parseClaimV2Event(event);
    manageClaim(ev);
}

export function handleMultiClaimV2(event: LogMultiClaimV2Event): void {
    const ev = parseMultiClaimV2Event(event);
    manageClaim(ev);
}

export function handleDepositV2(event: LogDepositV2Event): void {
    const ev = parseDepositEvent(event);
    manageDeposit(ev);
}