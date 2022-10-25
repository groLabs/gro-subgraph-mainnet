import { parseLogEvent } from '../parsers/log';
import { tokenToDecimal } from '../utils/tokens';
import { isStakerTransfer } from '../utils/contracts';
import { manageApproval } from '../managers/approvals';
import { manageTransfer } from '../managers/transfers';
import { updateTotalSupply } from '../setters/coreData';
import { parseApprovalEvent } from '../parsers/approval';
import { parseTransferEvent } from '../parsers/transfer';
import {
    BigInt,
    Address,
} from '@graphprotocol/graph-ts';
import {
    Approval,
    Transfer,
} from '../../generated/Gvt/ERC20';
import {
    ADDR,
    DECIMALS,
    LOG_DEPOSIT_SIG_V1,
    LOG_DEPOSIT_SIG_V23,
    DEPOSIT_HANDLER_ADDRESSES,
} from '../utils/constants';


export function handleApproval(event: Approval): void {
    const ev = parseApprovalEvent(event);
    manageApproval(ev, 'gvt');
}

// Discard any deposit and withdrawal except if the minted amount belongs
// to a non deposit handler event (i.e.: harvest event)
export function handleTransfer(event: Transfer): void {
    const from = event.params.from;
    const to = event.params.to;
    const value = event.params.value;

    if (
        !isDepositOrWithdrawalGVT(event, from, to, value)
        && !isStakerTransfer(from, to)
    ) {
        const ev = parseTransferEvent(event);
        manageTransfer(ev, 'gvt');
    }
}

const isDepositOrWithdrawalGVT = (
    event: Transfer,
    from: Address,
    to: Address,
    amount: BigInt,
): bool => {
    const receipt = event.receipt;
    if (to == ADDR.ZERO) {
        return true;
    } else if (from == ADDR.ZERO) {
        if (receipt) {
            const logs = parseLogEvent(event.receipt!.logs);
            for (let i = 0; i < logs.length; i++) {
                if (
                    DEPOSIT_HANDLER_ADDRESSES.includes(logs[i].address)
                    && (logs[i].topics[0].toHexString() == LOG_DEPOSIT_SIG_V1
                        || logs[i].topics[0].toHexString() == LOG_DEPOSIT_SIG_V23)
                ) {
                    return true;
                }
            }
            // gvt minted out of deposit handler (aka harvest) -> update totalSupply
            updateTotalSupply(
                'deposit',
                tokenToDecimal(amount, 18, DECIMALS),
                'gvt',
            )
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

// export function handleTransfer(event: Transfer): void {
//     const from = event.params.from;
//     const to = event.params.to;
//     if (
//         !isDepositOrWithdrawal(from, to)
//         && !isStakerTransfer(from, to)
//     ) {
//         const ev = parseTransferEvent(event);
//         manageTransfer(ev, 'gvt');
//     }
// }

// export function handleTransfer(event: Transfer): void {
//     const from = event.params.from;
//     const to = event.params.to;
//     const amount = event.params.value;

//     // deposits & withdrawals are managed by its handlers
//     // if (isDepositOrWithdrawal(from, to)) {
//     //     // updateTotalSupply(
//     //     //     from,
//     //     //     amount,
//     //     //     'gvt',
//     //     // );
//     // } else if (!isStakerTransfer(from, to)) {
//     //     const ev = parseTransferEvent(event);
//     //     manageTransfer(ev, 'gvt');
//     // }
// }