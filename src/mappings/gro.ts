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
///     - Handles <Approval> & <Transfer> events from Gro contract
///     - Transfers from/to Staker contract are excluded
/// @dev
///     - Gro: 0x3ec8798b81485a254928b70cda1cf0a2bb0b74d7

import { tokenToDecimal } from '../utils/tokens';
import { parseApprovalEvent } from '../parsers/approval';
import { manageApproval } from '../managers/approvals';
import { parseTransferEvent } from '../parsers/transfer';
import { manageTransfer } from '../managers/transfers';
import { isStakerTransfer } from '../utils/contracts';
import { updateTotalSupply } from '../setters/coreData';
import {
    ADDR,
    DECIMALS,
} from '../utils/constants';
import {
    Approval,
    Transfer,
} from '../../generated/Gvt/ERC20';


/// @notice Handles <Approval> events from gro contract
/// @param event the approval event
export function handleApproval(event: Approval): void {
    // Parses the approval into class <ApprovalEvent>
    const ev = parseApprovalEvent(event);

    // Manages the approval
    manageApproval(ev, 'gro');
}

/// @notice Handles <Transfer> events from gro contract
/// @param event the transfer event
/// @dev Excludes transfers from/to the Staker contract
export function handleTransfer(event: Transfer): void {
    const from = event.params.from;
    const to = event.params.to;
    const value = tokenToDecimal(event.params.value, 18, DECIMALS);
    if (!isStakerTransfer(
        from,
        to,
    )) {
        // Parses the transfer into class <TransferEvent>
        const ev = parseTransferEvent(event);

        // Manages the transfer
        manageTransfer(ev, 'gro');

        // Updates total supply in entity <CoreData>
        if (from == ADDR.ZERO) {
            updateTotalSupply(
                'deposit',
                value,
                'gro',
            );
        } else if (to == ADDR.ZERO) {
            updateTotalSupply(
                'withdrawal',
                value,
                'gro',
            );
        }
    }
}
