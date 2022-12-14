import { setUser } from '../setters/users';
import { setTotals } from '../setters/totals';
import { Address } from '@graphprotocol/graph-ts';
import { TransferEvent } from '../types/transfer';
import { initCoreData } from '../setters/coreData';
import { setTransferTx } from '../setters/transfers';
import { initVestingBonus } from '../setters/vestingBonus';


function buildTransfer(
    ev: TransferEvent,
    userAddress: string,
    type: string,
    token: string,
): void {
    // Step 1: Manage User
    setUser(userAddress);

    //Step 2: Manage Transaction
    const tx = setTransferTx(
        ev,
        userAddress,
        type,
        token,
    );

    //Step 3: Manage Totals
    setTotals(
        type,
        token,
        userAddress,
        tx.coinAmount,
        tx.usdAmount,
        tx.factor,
    );

    // Step 4: Create VestingBonus
    initVestingBonus(userAddress, true);

    initCoreData(true);
}

export const manageTransfer = (
    ev: TransferEvent,
    token: string
): void => {
    let type: string = '';
    let userAddressIn: string = '';
    let userAddressOut: string = '';

    // Determine event type (deposit, withdrawal or transfer):
    // case A -> if from == 0x, deposit (mint)
    // case B -> if to == 0x, withdrawal (burn)
    // case C -> else, transfer between users (transfer_in & transfer_out)
    if (ev.fromAddress == Address.zero()) {
        userAddressIn = ev.toAddress.toHexString();
        type = 'core_deposit';
    } else if (ev.toAddress == Address.zero()) {
        userAddressOut = ev.fromAddress.toHexString();
        type = 'core_withdrawal';
    } else {
        userAddressIn = ev.toAddress.toHexString();
        userAddressOut = ev.fromAddress.toHexString();
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