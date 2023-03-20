// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Stores Gvt, Pwrd & Gro transfers in entity <TransferTx>

import { getFactor } from '../setters/factors';
import { Bytes } from '@graphprotocol/graph-ts';
import { TransferEvent } from '../types/transfer';
import { TransferTx } from '../../generated/schema';
import {
    NO_POOL,
    DECIMALS,
    TX_TYPE as TxType,
} from '../utils/constants';
import {
    tokenToDecimal,
    getPricePerShare,
} from '../utils/tokens';


/// @notice Stores transfers in entity <TransferTx>
/// @dev Staker transfers are excluded, as they are considered 'intra' operations
///      within Gro Protocol and kept in users balance
/// @param ev the parsed transfer event
/// @param userAddress the user address
/// @param type the transfer type (core_deposit, core_withdrawal, transfer_in, transfer_out)
/// @param token the transfer token (gvt, pwrd, gro)
/// @return transfer object from entity <TransferTx>
export const setTransferTx = (
    ev: TransferEvent,
    userAddress: Bytes,
    type: string,
    token: string,
): TransferTx => {
    const transfer_tag = (type == TxType.TRANSFER_IN)
        ? 0
        : (type == TxType.TRANSFER_OUT)
            ? 1
            : 2;
    const id = ev.id.concatI32(transfer_tag);  
    let tx = new TransferTx(id);
    const coinAmount = tokenToDecimal(ev.value, 18, DECIMALS);
    const pricePerShare = getPricePerShare(token);
    tx.contract_address = ev.contractAddress;
    tx.block_number = ev.block.toI32();
    tx.block_timestamp = ev.timestamp.toI32();
    tx.token = token;
    tx.type = type;
    tx.hash = ev.hash;
    tx.user_address = userAddress;
    tx.from_address = ev.fromAddress;
    tx.to_address = ev.toAddress;
    tx.coin_amount = coinAmount;
    tx.usd_amount = (coinAmount.times(pricePerShare)).truncate(DECIMALS);
    tx.factor = getFactor(token);
    tx.pool_id = NO_POOL;
    tx.save();
    return tx;
}
