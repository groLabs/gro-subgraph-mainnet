import { ADDR } from '../utils/constants';
import { setUser } from '../setters/users';
import { setTotals } from '../setters/totals';
import { Bytes } from '@graphprotocol/graph-ts';
import { TransferEvent } from '../types/transfer';
import { setTransferTx } from '../setters/transfers';


function buildTransfer(
    ev: TransferEvent,
    userAddress: Bytes,
    type: string,
    token: string,
): void {
    // Step 1: Manage User
    setUser(userAddress);

    // Step 2: Manage Transaction
    const tx = setTransferTx(
        ev,
        userAddress,
        type,
        token,
    );

    // Step 3: Manage Totals
    setTotals(
        type,
        token,
        userAddress,
        tx.coin_amount,
        tx.usd_amount,
        tx.factor,
    );
}

export const manageTransfer = (
    ev: TransferEvent,
    token: string
): void => {
    let type: string = '';
    let userAddressIn = ADDR.ZERO;
    let userAddressOut = ADDR.ZERO;

    // Determine event type (deposit, withdrawal or transfer):
    // case A -> if from == 0x, deposit (mint)
    // case B -> if to == 0x, withdrawal (burn)
    // case C -> else, transfer between users (transfer_in & transfer_out)
    // if (ev.fromAddress == Address.zero()) {
    if (ev.fromAddress == ADDR.ZERO) {
        userAddressIn = ev.toAddress;
        type = 'core_deposit';
    // } else if (ev.toAddress == Address.zero()) {
    } else if (ev.toAddress == ADDR.ZERO) {
        userAddressOut = ev.fromAddress;
        type = 'core_withdrawal';
    } else {
        userAddressIn = ev.toAddress;
        userAddressOut = ev.fromAddress;
    }

    // Create one tx (mint OR burn) or two txs (transfer_in AND transfer_out)
    if (type !== '') {
        let userAddress = (type == 'core_deposit')
            ? userAddressIn
            : userAddressOut;
        buildTransfer(ev, userAddress, type, token);
    } else {
        buildTransfer(ev, userAddressIn, 'transfer_in', token);
        buildTransfer(ev, userAddressOut, 'transfer_out', token);
    }
}