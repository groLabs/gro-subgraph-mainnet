// @dev: setUser & initTotals in case it's an airdrop for a user
//       without any previous interaction with Gro
import { setUser } from '../setters/users';
import { DECIMALS } from '../utils/constants';
import { initTotals } from '../setters/totals';
import { tokenToDecimal } from '../utils/tokens';
import { parseAirdropNewDropEvent } from '../parsers/airdropNewDrop';
import {
    parseAirdropClaimEventV1,
    parseAirdropClaimEventV2,
} from '../parsers/airdropClaim';
import {
    setNewAirdrop,
    setAirdropClaimTx
} from '../setters/airdrops';
import {
    LogClaim as LogClaimV1,
    LogNewDrop as LogNewDropV1,
} from '../../generated/AirdropV1/Airdrop';
import {
    LogClaim as LogClaimV2,
    LogNewDrop as LogNewDropV2,
} from '../../generated/AirdropV2/Airdrop';
import {
    LogClaim,
    LogInitialClaim,
} from '../../generated/GMerkleVestor/GMerkleVestor';
import {
    setClaim,
    setInitialClaim,
} from '../setters/vestingAirdrop';


export function handleLogClaimV1(event: LogClaimV1): void {
    const ev = parseAirdropClaimEventV1(event);
    setUser(ev.userAddress);
    initTotals(ev.userAddress, true);
    setAirdropClaimTx(ev);
}

export function handleLogClaimV2(event: LogClaimV2): void {
    const ev = parseAirdropClaimEventV2(event);
    setUser(ev.userAddress);
    initTotals(ev.userAddress, true);
    setAirdropClaimTx(ev);
}

export function handleLogNewDropV1(event: LogNewDropV1): void {
    const ev = parseAirdropNewDropEvent(event);
    setNewAirdrop(ev);
}

export function handleLogNewDropV2(event: LogNewDropV2): void {
    const ev = parseAirdropNewDropEvent(event);
    setNewAirdrop(ev);
}

export function handleUstClaim(event: LogClaim): void {
    const user = event.params.user;
    setUser(user);
    initTotals(user, true);
    setClaim(
        user,
        tokenToDecimal(event.params.amount, 18, DECIMALS),
    );
}

export function handleUstInitialClaim(event: LogInitialClaim): void {
    const user = event.params.user;
    setUser(user);
    initTotals(user, true);
    setInitialClaim(
        user,
        tokenToDecimal(event.params.totalClaim, 18, DECIMALS),
        tokenToDecimal(event.params.claimAmount, 18, DECIMALS),
    );
}
