import {
  Approval,
  Transfer,
} from '../../generated/Gvt/ERC20';
import { parseApprovalEvent } from '../parsers/approval';
import { manageApproval } from '../managers/approvals';
import { parseTransferEvent } from '../parsers/transfer';
import { manageTransfer } from '../managers/transfers';
import {
  isStakerTransfer,
  isDepositOrWithdrawal
} from '../utils/contracts';


export function handleApproval(event: Approval): void {
  const ev = parseApprovalEvent(event);
  manageApproval(ev, 'pwrd');
}

export function handleTransfer(event: Transfer): void {
  if (
    !isDepositOrWithdrawal(
      event.params.from,
      event.params.to
    )
    && (!isStakerTransfer(
      event.params.from,
      event.params.to
    )
    )
  ) {
    const ev = parseTransferEvent(event);
    manageTransfer(ev, 'pwrd');
  }
}
