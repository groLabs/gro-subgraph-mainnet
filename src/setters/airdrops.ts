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
///     - Stores claims into entity <AirdropClaimTx>
///     - Stores new drops into entity <Airdrop>

import { DECIMALS } from '../utils/constants';
import { tokenToDecimal } from '../utils/tokens';
import { AirdropClaimEvent } from '../types/airdropClaim';
import { AirdropNewDropEvent } from '../types/airdropNewDrop';
import {
    Airdrop,
    AirdropClaimTx,
} from '../../generated/schema';


/// @notice Stores airdrop claims into entity <AirdropClaimTx>
/// @dev Triggered by event <LogClaim> from Airdrop contracts
/// @param ev the parsed claim event
/// @return claim object from entity <AirdropClaimTx>
export const setAirdropClaimTx = (
    ev: AirdropClaimEvent,
): AirdropClaimTx => {
    let tx = new AirdropClaimTx(ev.id);
    const coinAmount = tokenToDecimal(ev.amount, 18, DECIMALS);
    tx.contract_address = ev.contractAddress;
    tx.block_number = ev.block;
    tx.block_timestamp = ev.timestamp;
    tx.hash = ev.hash;
    tx.user_address = ev.userAddress;
    tx.vest = ev.vest;
    tx.tranche_id = ev.tranche_id;
    tx.amount = coinAmount;
    tx.save();
    return tx;
}

/// @notice Stores new drops into entity <Airdrop>
/// @dev Triggered by event <LogNewDrop> from Airdrop contracts
/// @param ev the new airdrop event
/// @return new drop object from entity <Airdrop>
export const setNewAirdrop = (
    ev: AirdropNewDropEvent,
): void => {
    let airdrop = Airdrop.load(ev.id);
    if (!airdrop) {
        airdrop = new Airdrop(ev.id);
        airdrop.contract_address = ev.contractAddress;
        airdrop.tranche_id = ev.tranche_id;
        airdrop.merkle_root = ev.merkle_root;
        airdrop.total_amount = tokenToDecimal(ev.amount, 18, DECIMALS);
        airdrop.save();
    }
}
