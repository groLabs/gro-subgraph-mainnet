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
///     - Handles <Approval> & <Transfer> events from Pwrd contract
///     - Transfers from/to Staker contract are excluded
///     - Deposits are excluded (already managed by DepositHandler & GRouter)
///     - Withdrawals are excluded (already managed by WithdrawHandler & GRouter)
/// @dev
///     - Pwrd: 0xf0a93d4994b3d98fb5e3a2f90dbc2d69073cb86b

import { parseLogEvent } from '../parsers/log';
import { TOKEN as Token } from '../utils/constants';
import { manageApproval } from '../managers/approvals';
import { manageTransfer } from '../managers/transfers';
import { parseApprovalEvent } from '../parsers/approval';
import { parseTransferEvent } from '../parsers/transfer';
import {
    Approval,
    Transfer,
} from '../../generated/Gvt/ERC20';
import {
    isStakerTransfer,
    isDepositOrWithdrawal,
    isTransferToGRouter
} from '../utils/contracts';


/// @notice Handles <Approval> events from pwrd contract
/// @param event the approval event
/// @dev Handles only approvals confirmed by Users; therefore, excluding approval
///      updates during deposits or withdrawals
export function handleApproval(event: Approval): void {
    if (isUniqueApproval(event)) {
        const ev = parseApprovalEvent(event);
        manageApproval(ev, Token.PWRD);
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

/// @notice Handles <Transfer> events from pwrd contract
/// @param event the transfer event
///     - Excludes transfers from/to the Staker contract
///     - Excludes deposits (already managed by DepositHandler or GRouter)
///     - Excludes withdrawals (already managed by WithdrawalHandler or GRouter)
export function handleTransfer(event: Transfer): void {
    const from = event.params.from;
    const to = event.params.to;
    if (
        !isDepositOrWithdrawal(
            from,
            to
        )
        && !isStakerTransfer(
            from,
            to,
        )
        && !isTransferToGRouter(to)
    ) {
        const ev = parseTransferEvent(event);
        manageTransfer(ev, Token.PWRD);
    }
}
