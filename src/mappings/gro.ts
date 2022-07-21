import {
    Approval as GvtApprovalEvent,
    Transfer as GvtTransferEvent
  } from '../../generated/Gvt/ERC20';
  import { parseApprovalEvent } from '../parsers/approval';
  import { manageApproval } from '../managers/approvals';
  import { manageTransfer } from '../managers/transactions';
  import { parseTransferEvent } from '../parsers/transfer';


export function handleTransfer(event: GvtTransferEvent): void {
    const ev = parseTransferEvent(event);
    manageTransfer(ev, 'gro');
  }
  
  export function handleApproval(event: GvtApprovalEvent): void {
    const ev = parseApprovalEvent(event);
    manageApproval(ev, 'gro');
  }
  