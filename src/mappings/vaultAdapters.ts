import { Transfer as TransferDAI, } from '../../generated/VaultAdapterDAI/Vyper_contract';
import { Transfer as TransferUSDC, } from '../../generated/VaultAdapterUSDC/Vyper_contract';
import { Transfer as TransferUSDT } from '../../generated/VaultAdapterUSDT/Vyper_contract';
import {
    setSwap,
    // setStrategyReportedUSDC,
    // setStrategyReportedUSDT,
} from '../setters/adapters';
import { tokenToDecimal } from '../utils/tokens';
import { DECIMALS } from '../utils/constants';


export function handleTransferDAI(event: TransferDAI): void {
//     setSwap(
//         event.address.toHexString(),
//         event.params.sender.toHexString(),
//         event.params.receiver.toHexString(),
//         tokenToDecimal(event.params.value, 6, DECIMALS),
//         event.block.number.toI32(),
//     );
}

export function handleTransferUSDC(event: TransferUSDC): void {
    // setTransferUSDC(
    //     event.address,
    //     event.params.strategy,
    //     event.params.totalDebt,
    //     event.block.number,
    // );
}

export function handleTransferUSDT(event: TransferUSDT): void {
    // setTransferUSDT(
    //     event.address,
    //     event.params.strategy,
    //     event.params.totalDebt,
    //     event.block.number,
    // );
}
