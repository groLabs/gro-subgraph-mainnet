import { Bytes, BigDecimal } from "@graphprotocol/graph-ts"
import {
  Approval as GvtApprovalEvent,
  Transfer as GvtTransferEvent
} from '../../generated/Gvt/ERC20'
import { Gvt } from '../../generated/Gvt/Gvt';
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


function parseTx(
  event: GvtTransferEvent,
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
  let contract = Gvt.bind(event.address)
  let price: BigDecimal = tokenToDecimal(contract.try_getPricePerShare().value, 18)

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

  //Step 3: update Totals
  let total = Totals.load(userAddress)
  if (!total) {
    total = new Totals(userAddress)
    total.userAddress = userAddress
    total.eth_amount_added_gvt = BigDecimal.fromString('0')
    total.eth_amount_added_pwrd = BigDecimal.fromString('0')
    total.eth_amount_added_total = BigDecimal.fromString('0')
    total.eth_amount_removed_gvt = BigDecimal.fromString('0')
    total.eth_amount_removed_pwrd = BigDecimal.fromString('0')
    total.eth_amount_removed_total = BigDecimal.fromString('0')
  }
  if (type === 'deposit' || type === 'transfer_in') {
    total.eth_amount_added_gvt = total.eth_amount_added_gvt.plus(tx.usdAmount)
    total.eth_amount_added_total = total.eth_amount_added_total.plus(tx.usdAmount)
  } else if (type === 'withdrawal' || type === 'transfer_out') {
    total.eth_amount_removed_gvt = total.eth_amount_removed_gvt.plus(tx.usdAmount)
    total.eth_amount_removed_total = total.eth_amount_removed_total.plus(tx.usdAmount)
  }
  total.save()
}

export function handleGvtTransfer(event: GvtTransferEvent): void {
  let type: string = ''
  let userAddressIn: string = ''
  let userAddressOut: string = ''
  const coin = 'gvt'

  // Determine event type (deposit, withdrawal or transfer):
  // case A -> if from == 0x, deposit (mint)
  // case B -> if to == 0x, withdrawal (burn)
  // case C -> else, transfer between users (transfer_in & transfer_out)
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

// export function handleGvtApproval(event: GvtApprovalEvent): void {
//   const userAddress = event.params.owner.toHexString()
//   const spenderAddress = event.params.spender
//   parseTx(event, userAddress, spenderAddress, 'approval', 'gvt')
// }
