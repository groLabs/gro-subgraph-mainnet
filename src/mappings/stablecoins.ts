// import { Transfer as TransferDAI } from '../../generated/Dai/ERC20';
// import { Transfer as TransferUSDC } from '../../generated/Usdc/ERC20';
// import { Transfer as TransferUSDT } from '../../generated/Usdt/ERC20';
// import { getAdaptersByCoin } from '../utils/strats';
// import { tokenToDecimal } from '../utils/tokens';
// import { DECIMALS } from '../utils/constants';


// export function handleTransferDAI(event: TransferDAI): void {
//     const adapters = getAdaptersByCoin('dai');
//     if (adapters.includes(event.params.from.toHexString())
//         || adapters.includes(event.params.to.toHexString())
//     ) {
//         setSwap(
//             tokenToDecimal(event.params.value, 18, DECIMALS),
//             'dai',
//         );
//     }
// }

// export function handleTransferUSDC(event: TransferUSDC): void {
//     const adapters = getAdaptersByCoin('usdc');
//     if (adapters.includes(event.params.from.toHexString())
//         || adapters.includes(event.params.to.toHexString())
//     ) {
//         setSwap(
//             tokenToDecimal(event.params.value, 6, DECIMALS),
//             'usdc',
//         );
//     }
// }

// export function handleTransferUSDT(event: TransferUSDT): void {
//     const adapters = getAdaptersByCoin('usdt');
//     if (adapters.includes(event.params.from.toHexString())
//         || adapters.includes(event.params.to.toHexString())
//     ) {
//         setSwap(
//             tokenToDecimal(event.params.value, 6, DECIMALS),
//             'usdt',
//         );
//     }
// }

