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
    isDepositOrWithdrawal
} from '../utils/contracts';


export function handleApproval(event: Approval): void {
    const ev = parseApprovalEvent(event);
    manageApproval(ev, 'pwrd');
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
    ) {
        const ev = parseTransferEvent(event);
        manageTransfer(ev, 'pwrd');
    }
}
