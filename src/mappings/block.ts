// import { ethereum } from "@graphprotocol/graph-ts"
// import { Block } from "../../generated/schema"


// export function handleBlock(block: ethereum.Block): void {
//     let entity = Block.load('last')
//     if (!entity) {
//         entity = new Block('last')
//     }
//     entity.number = block.number.toI32()
//     entity.timestamp = block.timestamp.toI32()
//     entity.save()
// }
