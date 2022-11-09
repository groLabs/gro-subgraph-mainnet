// import { Approval as DaiApprovalEvent } from '../../generated/Dai/Dai';
// import { parseDaiApprovalEvent } from '../parsers/approval';
// import { manageApproval } from '../managers/approvals';
// import { DEPOSIT_HANDLER_ADDRESSES } from '../utils/constants';


// export function handleApproval(event: DaiApprovalEvent): void {
//   if (DEPOSIT_HANDLER_ADDRESSES.includes(event.params.guy)) {
//     const ev = parseDaiApprovalEvent(event);
//     manageApproval(ev, 'dai');
//   }
// }

// export function handleTransfer(event: )