import {
    Approval,
    Transfer,
} from '../../generated/Gvt/ERC20';
import { DECIMALS } from '../utils/constants';
import { tokenToDecimal } from '../utils/tokens';
import { Address } from '@graphprotocol/graph-ts';
import { parseApprovalEvent } from '../parsers/approval';
import { manageApproval } from '../managers/approvals';
import { parseTransferEvent } from '../parsers/transfer';
import { manageTransfer } from '../managers/transfers';
import { isStakerTransfer } from '../utils/contracts';
import { updateTotalSupply } from '../setters/coreData';


export function handleApproval(event: Approval): void {
    const ev = parseApprovalEvent(event);
    manageApproval(ev, 'gro');
}

export function handleTransfer(event: Transfer): void {
    const from = event.params.from;
    const to = event.params.to;
    const value = tokenToDecimal(event.params.value, 18, DECIMALS);

    if (!isStakerTransfer(
        from,
        to,
    )) {
        const ev = parseTransferEvent(event);
        manageTransfer(ev, 'gro');
        if (from == Address.zero()) {
            updateTotalSupply(
                'deposit',
                value,
                'gro',
            );
        } else if (to == Address.zero()) {
            updateTotalSupply(
                'withdrawal',
                value,
                'gro',
            );
        }
    }
}
