import { contracts } from '../../addresses';
import { parseLogEvent } from '../parsers/log';
import { tokenToDecimal } from '../utils/tokens';
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
    isStakerTransfer,
    isTransferToGRouter
} from '../utils/contracts';
import {
    DECIMALS,
    LOG_DEPOSIT_SIG_V1,
    LOG_DEPOSIT_SIG_V23,
    LOG_GROUTER_DEPOSIT_SIG,
    LOG_GROUTER_LEGACY_DEPOSIT_SIG,
    DEPOSIT_HANDLER_ADDRESSES,
} from '../utils/constants';


export function handleApproval(event: Approval): void {
    if (isUniqueApproval(event)) {
        const ev = parseApprovalEvent(event);
        manageApproval(ev, 'gvt');
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

// Discard any deposit and withdrawal except if the minted amount belongs
// to a non deposit handler event (i.e.: harvest event)
export function handleTransfer(event: Transfer): void {
    const from = event.params.from;
    const to = event.params.to;
    const value = event.params.value;
    if (
        !isDepositOrWithdrawalGVT(
            event,
            from,
            to,
            value,
        )
        && !isStakerTransfer(
            from,
            to,
        )
        && !isTransferToGRouter(to)
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
    if (to == Address.zero()) {
        return true;
    } else if (from == Address.zero()) {
        if (receipt) {
            const logs = parseLogEvent(event.receipt!.logs);
            const gRouterAddress = Address.fromString(contracts.GRouterAddress);
            for (let i = 0; i < logs.length; i++) {
                if (
                    DEPOSIT_HANDLER_ADDRESSES.includes(logs[i].address)
                    && (logs[i].topics[0].toHexString() == LOG_DEPOSIT_SIG_V1
                        || logs[i].topics[0].toHexString() == LOG_DEPOSIT_SIG_V23)
                ) {
                    return true;
                }
                if (
                    gRouterAddress.equals(logs[i].address)
                    && (logs[i].topics[0].toHexString() == LOG_GROUTER_DEPOSIT_SIG
                        || logs[i].topics[0].toHexString() == LOG_GROUTER_LEGACY_DEPOSIT_SIG)
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
