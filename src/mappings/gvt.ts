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
///     - Handles <Approval> & <Transfer> events from Gvt contract
///     - Transfers from/to Staker contract are excluded
///     - Deposits are excluded (already managed by DepositHandler & GRouter)
///     - Withdrawals are excluded (already managed by WithdrawHandler & GRouter)
/// @dev
///     - Gvt: 0x3adb04e127b9c0a5d36094125669d4603ac52a0c

import { contracts } from '../../addresses';
import { parseLogEvent } from '../parsers/log';
import { tokenToDecimal } from '../utils/tokens';
import { manageApproval } from '../managers/approvals';
import { manageTransfer } from '../managers/transfers';
import { updateTotalSupply } from '../setters/coreData';
import { parseApprovalEvent } from '../parsers/approval';
import { parseTransferEvent } from '../parsers/transfer';
import {
    BigInt,
    Address,
} from '@graphprotocol/graph-ts';
import {
    Approval,
    Transfer,
} from '../../generated/Gvt/ERC20';
import {
    isStakerTransfer,
    isTransferToGRouter
} from '../utils/contracts';
import {
    DECIMALS,
    TOKEN as Token,
    LOG_DEPOSIT_SIG_V1,
    LOG_DEPOSIT_SIG_V23,
    LOG_GROUTER_DEPOSIT_SIG,
    LOG_GROUTER_LEGACY_DEPOSIT_SIG,
    DEPOSIT_HANDLER_ADDRESSES,
} from '../utils/constants';


/// @notice Handles <Approval> events from gvt contract
/// @param event the approval event
/// @dev Handles only approvals confirmed by Users; therefore, excluding approval
///      updates during deposits or withdrawals
export function handleApproval(event: Approval): void {
    if (isUniqueApproval(event)) {
        const ev = parseApprovalEvent(event);
        manageApproval(ev, Token.GVT);
    }
}

/// @return True if approval confirmed by User, so there are no other logs within
///         the same approval transactions (i.e: LogDeposit, LogWithdrawal)
const isUniqueApproval = (
    ev: Approval
): bool => {
    const receipt = ev.receipt;
    if (receipt) {
        const logs = parseLogEvent(ev.receipt!.logs);
        if (logs.length > 1)
            return false;
    }
    return true;
}

/// @notice Handles <Transfer> events from gvt contract
/// @param event the transfer event
/// @dev
///     - Excludes transfers from/to the Staker contract
///     - Excludes deposits (already managed by DepositHandler or GRouter)
///     - Excludes withdrawals (already managed by WithdrawalHandler or GRouter)
///     - Includes minting transfers (i.e.: harvest events)
export function handleTransfer(event: Transfer): void {
    const from = event.params.from;
    const to = event.params.to;
    const value = event.params.value;
    if (
        !isDepositOrWithdrawalGVT(
            event,
            from,
            to,
            value,
        )
        && !isStakerTransfer(
            from,
            to,
        )
        && !isTransferToGRouter(to)
    ) {
        const ev = parseTransferEvent(event);
        manageTransfer(ev, Token.GVT);
    }
}

/// @notice Updates total supply if minting transfer from a harvest event
/// @param event the transfer event (used to extract the transaction log)
/// @param from the from address in the transfer event
/// @param to the to address in the transfer event
/// @param amount the amount in the transfer event
/// @dev Considering that:
///     - Deposits will always have a transfer event with from: 0x => mint
///     - Withdrawals will always have a transfer event with to: 0x => burn
///     then...
/// @return True if burn transfer or mint transfer from DepositHandler or GRouter
///         False otherwise
const isDepositOrWithdrawalGVT = (
    event: Transfer,
    from: Address,
    to: Address,
    amount: BigInt,
): bool => {
    const receipt = event.receipt;
    if (to == Address.zero()) {
        return true;
    } else if (from == Address.zero()) {
        // Look for deposit signatures from DepositHandler or GRouter in tx logs
        if (receipt) {
            const logs = parseLogEvent(event.receipt!.logs);
            const gRouterAddress = Address.fromString(contracts.GRouterAddress);
            for (let i = 0; i < logs.length; i++) {
                if (
                    DEPOSIT_HANDLER_ADDRESSES.includes(logs[i].address)
                    && (logs[i].topics[0].toHexString() == LOG_DEPOSIT_SIG_V1
                        || logs[i].topics[0].toHexString() == LOG_DEPOSIT_SIG_V23)
                ) {
                    return true;
                }
                if (
                    gRouterAddress.equals(logs[i].address)
                    && (logs[i].topics[0].toHexString() == LOG_GROUTER_DEPOSIT_SIG
                        || logs[i].topics[0].toHexString() == LOG_GROUTER_LEGACY_DEPOSIT_SIG)
                ) {
                    return true;
                }
            }
            // Update total supply in entity <CoreData>
            // Means gvt minted out of deposit handler (aka harvest) 
            updateTotalSupply(
                'deposit',
                tokenToDecimal(amount, 18, DECIMALS),
                Token.GVT,
            )
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}
