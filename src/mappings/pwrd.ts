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
import { updateTotalSupply } from '../setters/coreData';


export function handleApproval(event: Approval): void {
  const ev = parseApprovalEvent(event);
  manageApproval(ev, 'pwrd');
}

export function handleTransfer(event: Transfer): void {
  const from = event.params.from;
  const to = event.params.to;
  const amount =  event.params.value;

  if (isDepositOrWithdrawal(from, to)) {
    updateTotalSupply(
      from,
      amount,
      'pwrd',
    );
  } else if (!isStakerTransfer(from, to)) {
    const ev = parseTransferEvent(event);
    manageTransfer(ev, 'pwrd');
  }
  // if (
  //   !isDepositOrWithdrawal(
  //     event.params.from,
  //     event.params.to
  //   )
  //   && (!isStakerTransfer(
  //     event.params.from,
  //     event.params.to
  //   )
  //   )
  // ) {
  //   const ev = parseTransferEvent(event);
  //   manageTransfer(ev, 'pwrd');
  // }
}
