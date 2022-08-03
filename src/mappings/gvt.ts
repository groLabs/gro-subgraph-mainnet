import {
  Approval as GvtApprovalEvent,
  Transfer as GvtTransferEvent
} from '../../generated/Gvt/ERC20';
import { parseApprovalEvent } from '../parsers/approval';
import { manageApproval } from '../managers/approvals';
import { parseTransferEvent } from '../parsers/transfer';
import { manageTransfer } from '../managers/transfers';


export function handleTransfer(event: GvtTransferEvent): void {
  const ev = parseTransferEvent(event);
  manageTransfer(ev, 'gvt');
}

export function handleApproval(event: GvtApprovalEvent): void {
  const ev = parseApprovalEvent(event);
  manageApproval(ev, 'gvt');
}
