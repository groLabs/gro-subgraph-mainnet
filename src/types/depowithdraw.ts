import {
    Address,
    BigInt,
} from '@graphprotocol/graph-ts';


// Core deposit or withdrawal
export class DepoWithdraw {
    id: string
    block: i32
    timestamp: i32
    contractAddress: Address
    type: string
    userAddress: string
    fromAddress: Address
    toAddress: Address
    coinAmount: BigInt
    usdAmount: BigInt

    constructor(
        id: string,
        block: i32,
        timestamp: i32,
        contractAddress: Address,
        type: string,
        userAddress: string,
        fromAddress: Address,
        toAddress: Address,
        coinAmount: BigInt,
        usdAmount: BigInt,
    ) {
        this.id = id
        this.block = block
        this.timestamp = timestamp
        this.contractAddress = contractAddress
        this.type = type
        this.userAddress = userAddress
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.coinAmount = coinAmount
        this.usdAmount = usdAmount
    }
}
