import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Approval as ApprovalEvent,
  Transfer as TransferEvent
} from '../../generated/Gvt/ERC20'
import {
  User,
  CoreTx
} from "../../generated/schema"
import {
  NO_ADDR,
  ZERO_ADDR
} from '../utils/constants'

// export function handleGvtApproval(event: GvtApprovalEvent): void {
//   let entity = new GvtApproval(
//     event.transaction.hash.toHex() + "-" + event.logIndex.toString()
//   )
//   entity.owner = event.params.owner
//   entity.spender = event.params.spender
//   entity.value = event.params.value
//   entity.save()
// }

function parseTx<T>(
  event: T,
  userAddress: string,
  spenderAddress: Bytes,
  type: string
): void {

  // Step 1: create User if first transaction
  let user = User.load(userAddress)
  if (!user) {
    user = new User(userAddress)
    user.save()
  }

  //Step 2: create Transaction
  const id = (type == 'transfer_in')
    ? '_in'
    : (type == 'transfer_out')
      ? '_out'
      : ''
  let tx = new CoreTx(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString() + id
  )
  tx.userAddress = userAddress
  tx.contractAddress = event.address
  tx.block = event.block.number.toI32()
  tx.timestamp = event.block.timestamp.toI32()
  tx.token = 'gvt'
  tx.type = type
  tx.coinAmount = event.params.value
  tx.usdAmount = BigInt.fromI32(0)
  tx.spenderAddress = spenderAddress
  tx.save()
}

// case A -> if from == 0x, deposit
// case B -> if to == 0x, withdrawal
// case C -> else, transfer between users (transfer_in & transfer_out)
export function handleTransfer(event: TransferEvent): void {
  let type: string = ''
  let userAddressIn: string = ''
  let userAddressOut: string = ''

  // Determine event type (mint, burn or transfer)
  if (event.params.from.toHexString() == ZERO_ADDR) {
    userAddressIn = event.params.to.toHexString()
    type = 'deposit'
  } else if (event.params.to.toHexString() == ZERO_ADDR) {
    userAddressOut = event.params.from.toHexString()
    type = 'withdrawal'
  } else {
    userAddressIn = event.params.to.toHexString()
    userAddressOut = event.params.from.toHexString()
  }

  // Create one tx (mint OR burn) or two txs (transfer_in AND transfer_out)
  if (type !== '') {
    const userAddress = (type == 'deposit')
      ? userAddressIn
      : userAddressOut
    parseTx(event, userAddress, NO_ADDR, type)
  } else {
    parseTx(event, userAddressIn, NO_ADDR, 'transfer_in')
    parseTx(event, userAddressOut, NO_ADDR, 'transfer_out')
  }
}

export function handleApproval(event: ApprovalEvent): void {
  const userAddress = event.params.owner.toHexString()
  const spenderAddress = event.params.spender
  parseTx(event, userAddress, spenderAddress, 'approval')
}
