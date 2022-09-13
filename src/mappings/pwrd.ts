import {
  Approval as GvtApprovalEvent,
  Transfer as GvtTransferEvent
} from '../../generated/Gvt/ERC20';
import { parseApprovalEvent } from '../parsers/approval';
import { manageApproval } from '../managers/approvals';
import { parseTransferEvent } from '../parsers/transfer';
import { manageTransfer } from '../managers/transfers';
import { isDepositOrWithdrawal } from '../utils/contracts';

export function handleTransfer(event: GvtTransferEvent): void {
  if (!isDepositOrWithdrawal(
    event.params.from,
    event.params.to
  )) {
    const ev = parseTransferEvent(event);
    manageTransfer(ev, 'pwrd');
  }

}

export function handleApproval(event: GvtApprovalEvent): void {
  const ev = parseApprovalEvent(event);
  manageApproval(ev, 'pwrd');
}