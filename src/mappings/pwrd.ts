import { Bytes } from '@graphprotocol/graph-ts';
import {
  Approval as PwrdApprovalEvent,
  Transfer as PwrdTransferEvent
} from '../../generated/Pwrd/ERC20';
import {
  NO_ADDR,
  ZERO_ADDR
} from '../utils/constants';
import { setUser } from '../utils/users';
import {
  setCoreTx,
  setTotals
} from '../utils/transactions';


function parseTransfer(
  event: PwrdTransferEvent,
  userAddress: string,
  type: string,
): void {

  // Step 1: Manage User
  setUser(userAddress);

  //Step 2: Manage Transaction
  const tx = setCoreTx(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString(), // id
    type, // type
    'pwrd', // coin
    userAddress, // userAddress
    event.address, // contractAddress
    NO_ADDR, // spenderAddress
    event.block.number, // block
    event.block.timestamp, // timestamp
    event.params.value, // value
  );

  //Step 3: Manage Totals
  setTotals(
    type, // type
    'pwrd', // coin
    userAddress, // userAddress
    tx.usdAmount // value
  );
}

function parseApproval(
  event: PwrdApprovalEvent,
  userAddress: string,
  spenderAddress: Bytes,
): void {
  
  // Step 1: Manage User
  setUser(userAddress);

  //Step 2: Manage Transaction
  const tx = setCoreTx(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString(), // id
    'approval', // type
    'pwrd', // coin
    userAddress, // userAddress
    event.address, // contractAddress
    spenderAddress, // spenderAddress
    event.block.number, // block
    event.block.timestamp, // timestamp
    event.params.value, // value
  );
}

export function handleTransfer(event: PwrdTransferEvent): void {
  let type: string = '';
  let userAddressIn: string = '';
  let userAddressOut: string = '';

  // Determine event type (deposit, withdrawal or transfer):
  // case A -> if from == 0x, deposit (mint)
  // case B -> if to == 0x, withdrawal (burn)
  // case C -> else, transfer between users (transfer_in & transfer_out)
  if (event.params.from.toHexString() == ZERO_ADDR) {
    userAddressIn = event.params.to.toHexString();
    type = 'deposit';
  } else if (event.params.to.toHexString() == ZERO_ADDR) {
    userAddressOut = event.params.from.toHexString();
    type = 'withdrawal';
  } else {
    userAddressIn = event.params.to.toHexString();
    userAddressOut = event.params.from.toHexString();
  }

  // Create one tx (mint OR burn) or two txs (transfer_in AND transfer_out)
  if (type !== '') {
    const userAddress = (type == 'deposit')
      ? userAddressIn
      : userAddressOut;
    parseTransfer(event, userAddress, type);
  } else {
    parseTransfer(event, userAddressIn, 'transfer_in');
    parseTransfer(event, userAddressOut, 'transfer_out');
  }
}

export function handleApproval(event: PwrdApprovalEvent): void {
  const userAddress = event.params.owner.toHexString();
  const spenderAddress = event.params.spender;
  parseApproval(event, userAddress, spenderAddress);
}
