// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice
///     - Handles <LogClaim> & <LogNewDrop> events from Airdrop v1 & v2 contracts
///     - Handles <LogClaim> & <LogInitialClaim> events from GMerkleVestor contract
/// @dev
///     - Airdrop v1: 0x6b1bff72f00cc147b5dc7a5b156fe7a6fd206dda
///     - Airdrop v2: 0xf3d39a7feba9be0c1d18b355e7ed01070ee2c561
///     - GMerkleVestor: 0x02c133b9fbffb8d2e8cb7b7a94c7c880b331c720

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
    setAirdropClaimTx,
} from '../setters/airdrops';
import {
    setClaim,
    setInitialClaim,
} from '../setters/vestingAirdrop';
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


/// @notice Handles <LogClaim> events from Airdrop v1 contract
/// @param event the claim event
export function handleLogClaimV1(event: LogClaimV1): void {
    // Parses the claim into class <AirdropClaimEvent>
    const ev = parseAirdropClaimEventV1(event);

    // Creates user if not existing yet in entity <User>
    // (e.g.: airdrop for a user without any previous Gro interaction)
    setUser(ev.userAddress);

    // Creates user totals if not existing yet in entity <Totals>
    initTotals(ev.userAddress, true);

    // Stores the claim in entity <AirdropClaimTx>
    setAirdropClaimTx(ev);
}

/// @notice Handles <LogClaim> events from Airdrop v2 contract
/// @param event the claim event
export function handleLogClaimV2(event: LogClaimV2): void {
    // Parses the claim into class <AirdropClaimEvent>
    const ev = parseAirdropClaimEventV2(event);

    // Creates user if not existing yet in entity <User>
    setUser(ev.userAddress);

    // Creates user totals if not existing yet in entity <Totals>
    initTotals(ev.userAddress, true);

    // Stores the claim in entity <AirdropClaimTx>
    setAirdropClaimTx(ev);
}

/// @notice Handles <LogNewDrop> events from Airdrop v1 contract
/// @param event the new drop event
export function handleLogNewDropV1(event: LogNewDropV1): void {
    // Parses the new airdrop into class <AirdropNewDropEvent>
    const ev = parseAirdropNewDropEvent(event);

    // Stores the new airdrop in entity <Airdrop>
    setNewAirdrop(ev);
}

/// @notice Handles <<LogNewDrop>> events from Airdrop v2 contract
/// @param event the new airdrop event
export function handleLogNewDropV2(event: LogNewDropV2): void {
    // Parses the new airdrop event into class <AirdropNewDropEvent>
    const ev = parseAirdropNewDropEvent(event);

    // Stores the new airdrop in entity <Airdrop>
    setNewAirdrop(ev);
}

/// @notice Handles <LogClaim> events from GMerkleVestor contract
/// @param event the claim event
/// @dev Creates user & totals if not existing yet (e.g.: airdrop
///      for a user without any previous Gro interaction)
export function handleUstClaim(event: LogClaim): void {
    const user = event.params.user;

    // Creates user if not existing yet in entity <User>
    setUser(user);

    // Creates user totals if not existing yet in entity <Totals>
    initTotals(user, true);

    // Stores the claim in entity <VestingAirdrop>
    setClaim(
        user,
        tokenToDecimal(event.params.amount, 18, DECIMALS),
    );
}

/// @notice Handles <LogInitialClaim> events from GMerkleVestor contract
/// @param event the initial claim event
/// @dev Creates user & totals if not existing yet (e.g.: airdrop
///      for a user without any previous Gro interaction)
export function handleUstInitialClaim(event: LogInitialClaim): void {
    const user = event.params.user;

    // Creates user if not existing yet in entity <User>
    setUser(user);

    // Creates user totals if not existing yet in entity <Totals>
    initTotals(user, true);

    // Stores the initial claim in entity <VestingAirdrop>
    setInitialClaim(
        user,
        tokenToDecimal(event.params.totalClaim, 18, DECIMALS),
        tokenToDecimal(event.params.claimAmount, 18, DECIMALS),
    );
}
