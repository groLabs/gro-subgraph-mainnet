import { setUser } from '../setters/users';
import { setTotals } from '../setters/totals';
import { Bytes } from '@graphprotocol/graph-ts';
import { TransferEvent } from '../types/transfer';
import { setTransferTx } from '../setters/transfers';
import {
    ADDR,
    TX_TYPE as TxType,
} from '../utils/constants';


/// @notice Builds the transfer tx
/// @param ev the parsed transfer event
/// @param userAddress the user address
/// @param type the transfer type (deposit, withdrawal, transfer_in & transfer_out)
/// @param token the transfer token (gvt, pwrd & gro)
function buildTransfer(
    ev: TransferEvent,
    userAddress: Bytes,
    type: string,
    token: string,
): void {
    // Creates user if not existing yet in entity <User>
    setUser(userAddress);

    // Stores transfer tx in entity <TransferTx>
    const tx = setTransferTx(
        ev,
        userAddress,
        type,
        token,
    );

    // Updates user totals in entity <Totals>
    setTotals(
        type,
        token,
        userAddress,
        tx.coin_amount,
        tx.usd_amount,
        tx.factor,
    );
}

/// @notice Manages transfers
/// @param ev the parsed transfer event
/// @param token the transfer token (gvt, pwrd or gro)
/// @dev this function mainly handles non deposit & withdrawal transfers,
///      however, there are mint txs that create gvt out of a deposit tx
///      i.e.: harvest event
export const manageTransfer = (
    ev: TransferEvent,
    token: string
): void => {
    let type: string = '';
    let userAddressIn = ADDR.ZERO;
    let userAddressOut = ADDR.ZERO;

    // Determines event type (deposit, withdrawal or transfer):
    // case A -> if from == 0x, deposit (mint)
    // case B -> if to == 0x, withdrawal (burn)
    // case C -> else, transfer between users (transfer_in & transfer_out)
    if (ev.fromAddress == ADDR.ZERO) {
        userAddressIn = ev.toAddress;
        type = TxType.CORE_DEPOSIT;
    } else if (ev.toAddress == ADDR.ZERO) {
        userAddressOut = ev.fromAddress;
        type = TxType.CORE_WITHDRAWAL;
    } else {
        userAddressIn = ev.toAddress;
        userAddressOut = ev.fromAddress;
    }

    // Creates one tx (mint OR burn) or two txs (transfer_in AND transfer_out)
    if (type !== '') {
        let userAddress = (type == TxType.CORE_DEPOSIT)
            ? userAddressIn
            : userAddressOut;
        buildTransfer(ev, userAddress, type, token);
    } else {
        buildTransfer(ev, userAddressIn, TxType.TRANSFER_IN, token);
        buildTransfer(ev, userAddressOut, TxType.TRANSFER_OUT, token);
    }
}
