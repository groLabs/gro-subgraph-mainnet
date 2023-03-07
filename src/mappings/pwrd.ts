import { parseLogEvent } from '../parsers/log';
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


export function handleApproval(event: Approval): void {
    if (isUniqueApproval(event)) {
        const ev = parseApprovalEvent(event);
        manageApproval(ev, 'pwrd');
    }
}

// Exclude Approval events that update the spend amount during Deposits or Withdrawals
// From UX perspective, we want to see only Approvals requested by Users
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
        manageTransfer(ev, 'pwrd');
    }
}
