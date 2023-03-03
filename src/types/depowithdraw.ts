import {
    Bytes,
    BigInt,
} from '@graphprotocol/graph-ts';


// Core deposit or withdrawal
export class DepoWithdraw {
    id: Bytes
    block: i32
    timestamp: i32
    hash: Bytes
    contractAddress: Bytes
    type: string
    userAddress: Bytes
    fromAddress: Bytes
    toAddress: Bytes
    coinAmount: BigInt
    usdAmount: BigInt
    poolId: i32

    constructor(
        id: Bytes,
        block: i32,
        timestamp: i32,
        hash: Bytes,
        contractAddress: Bytes,
        type: string,
        userAddress: Bytes,
        fromAddress: Bytes,
        toAddress: Bytes,
        coinAmount: BigInt,
        usdAmount: BigInt,
        poolId: i32,
    ) {
        this.id = id
        this.block = block
        this.timestamp = timestamp
        this.hash = hash
        this.contractAddress = contractAddress
        this.type = type
        this.userAddress = userAddress
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.coinAmount = coinAmount
        this.usdAmount = usdAmount
        this.poolId = poolId
    }
}
