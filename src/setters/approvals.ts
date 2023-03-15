// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Stores approvals into entity <ApprovalTx>

import { ApprovalEvent } from '../types/approval';
import { ApprovalTx } from '../../generated/schema';
import {
    tokenToDecimal,
    getPricePerShare,
} from '../utils/tokens';
import {
    DECIMALS,
    TOKEN as Token,
    TX_TYPE as TxType,
} from '../utils/constants';


/// @notice Stores approvals into entity <ApprovalTx>
/// @dev Triggered by <Approval> events from Gvt, Pwrd & Gro contracts
/// @param ev the parsed approval event
/// @param token the approval token
/// @return approval object from entity <ApprovalTx>
export const setApprovalTx = (
    ev: ApprovalEvent,
    token: string,
): ApprovalTx => {
    let tx = new ApprovalTx(ev.id);
    const base = (token === Token.USDC || token === Token.USDT)
        ? 6
        : 18;
    const coinAmount = tokenToDecimal(ev.value, base, DECIMALS);
    const pricePerShare = getPricePerShare(token);
    tx.owner_address = ev.ownerAddress;
    tx.contract_address = ev.contractAddress;
    tx.block_number = ev.block.toI32();
    tx.block_timestamp = ev.timestamp.toI32();
    tx.token = token;
    tx.type = TxType.APPROVAL;
    tx.hash = ev.hash;
    tx.coin_amount = coinAmount;
    tx.usd_amount = coinAmount.times(pricePerShare);
    tx.spender_address = ev.spenderAddress;
    tx.save();
    return tx;
}
