import { BigInt, Bytes, BigDecimal } from "@graphprotocol/graph-ts"
import {
  Approval as GvtApprovalEvent,
  Transfer as GvtTransferEvent
} from '../../generated/Gvt/ERC20'
import {
  Approval as PwrdApprovalEvent,
  Transfer as PwrdTransferEvent
} from '../../generated/Pwrd/ERC20'
import { Gvt } from '../../generated/Gvt/Gvt';
// import {} from '../../generated/Pwrd/';
import {
  User,
  CoreTx,
  Totals,
} from "../../generated/schema"
import {
  NO_ADDR,
  ZERO_ADDR
} from '../utils/constants'
import { tokenToDecimal } from '../utils/tokens'

// export function handleGvtApproval(event: GvtApprovalEvent): void {
//   let entity = new GvtApproval(
//     event.transaction.hash.toHex() + "-" + event.logIndex.toString()
//   )
//   entity.owner = event.params.owner
//   entity.spender = event.params.spender
//   entity.value = event.params.value
//   entity.save()
// }

function calcUsdValue<T>(
  event: T,
  coin: string,
): BigDecimal {
  let price: BigDecimal
  if (coin === 'gvt') {
    let contract = Gvt.bind(event.address)
    price = tokenToDecimal(contract.try_getPricePerShare().value, 18)
  } else if (coin === 'pwrd') {
    price = BigDecimal.fromString('1')
  } else {
    price = BigDecimal.fromString('0')
  }
  return price
}

function parseTx<T>(
  event: T,
  userAddress: string,
  spenderAddress: Bytes,
  type: string,
  coin: string,
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

  let coinAmount = tokenToDecimal(event.params.value, 18)
  let price = calcUsdValue(event, coin)
  
  tx.userAddress = userAddress
  tx.contractAddress = event.address
  tx.block = event.block.number.toI32()
  tx.timestamp = event.block.timestamp.toI32()
  tx.token = coin
  tx.type = type
  tx.coinAmount = coinAmount // event.params.value
  tx.usdAmount = coinAmount.times(price) // event.params.value.times(price)
  tx.spenderAddress = spenderAddress
  tx.save()

  //Step 3: update Total
  let total = Totals.load(userAddress)
  if (!total) {
    total = new Totals(userAddress)
    total.userAddress = userAddress
    total.eth_amount_added_gvt = BigDecimal.fromString('0')
  }
  if (type === 'transfer_in') {
    total.eth_amount_added_gvt += coinAmount
  }
  total.save()

}

// case A -> if from == 0x, deposit
// case B -> if to == 0x, withdrawal
// case C -> else, transfer between users (transfer_in & transfer_out)
export function handleTransfer<T>(
  event: T,
  coin: string): void {

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
    parseTx(event, userAddress, NO_ADDR, type, coin)
  } else {
    parseTx(event, userAddressIn, NO_ADDR, 'transfer_in', coin)
    parseTx(event, userAddressOut, NO_ADDR, 'transfer_out', coin)
  }
}

export function handleGvtTransfer(event: GvtTransferEvent): void {
  handleTransfer(event, 'gvt')
}

export function handlePwrdTransfer(event: PwrdTransferEvent): void {
  handleTransfer(event, 'pwrd')
}

export function handleGvtApproval(event: GvtApprovalEvent): void {
  const userAddress = event.params.owner.toHexString()
  const spenderAddress = event.params.spender
  parseTx(event, userAddress, spenderAddress, 'approval', 'gvt')
}

export function handlePwrdApproval(event: PwrdApprovalEvent): void {
  const userAddress = event.params.owner.toHexString()
  const spenderAddress = event.params.spender
  parseTx(event, userAddress, spenderAddress, 'approval', 'pwrd')
}
