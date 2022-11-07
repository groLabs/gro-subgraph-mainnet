import { DECIMALS } from '../utils/constants';
import { tokenToDecimal } from '../utils/tokens';
import { setStrategyHarvest } from '../setters/strats';
import { Harvested as HarvestedPrimaryDAI } from '../../generated/PrimaryStratDAI/StableConvexXPool';
import { Harvested as HarvestedSecondaryDAI } from '../../generated/SecondaryStratDAI/StableConvexXPool';
import { Harvested as HarvestedPrimaryUSDC } from '../../generated/PrimaryStratUSDC/StableConvexXPool';
import { Harvested as HarvestedSecondaryUSDC } from '../../generated/SecondaryStratUSDC/StableConvexXPool';
import { Harvested as HarvestedPrimaryUSDT } from '../../generated/PrimaryStratUSDT/StableConvexXPool';


export function handleHarvestedPrimaryDAI(event: HarvestedPrimaryDAI): void {
    setStrategyHarvest(
        event.transaction.hash.toHex() + "-" + event.logIndex.toString(),
        event.address.toHexString(),
        tokenToDecimal(event.params.profit, 18, DECIMALS),
        tokenToDecimal(event.params.loss, 18, DECIMALS),
        event.block.timestamp,
    );
}

export function handleHarvestedSecondaryDAI(event: HarvestedSecondaryDAI): void {
    setStrategyHarvest(
        event.transaction.hash.toHex() + "-" + event.logIndex.toString(),
        event.address.toHexString(),
        tokenToDecimal(event.params.profit, 18, DECIMALS),
        tokenToDecimal(event.params.loss, 18, DECIMALS),
        event.block.timestamp,
    );
}

export function handleHarvestedPrimaryUSDC(event: HarvestedPrimaryUSDC): void {
    setStrategyHarvest(
        event.transaction.hash.toHex() + "-" + event.logIndex.toString(),
        event.address.toHexString(),
        tokenToDecimal(event.params.profit, 6, DECIMALS),
        tokenToDecimal(event.params.loss, 6, DECIMALS),
        event.block.timestamp,
    );
}

export function handleHarvestedSecondaryUSDC(event: HarvestedSecondaryUSDC): void {
    setStrategyHarvest(
        event.transaction.hash.toHex() + "-" + event.logIndex.toString(),
        event.address.toHexString(),
        tokenToDecimal(event.params.profit, 6, DECIMALS),
        tokenToDecimal(event.params.loss, 6, DECIMALS),
        event.block.timestamp,
    );
}

export function handleHarvestedPrimaryUSDT(event: HarvestedPrimaryUSDT): void {
    setStrategyHarvest(
        event.transaction.hash.toHex() + "-" + event.logIndex.toString(),
        event.address.toHexString(),
        tokenToDecimal(event.params.profit, 6, DECIMALS),
        tokenToDecimal(event.params.loss, 6, DECIMALS),
        event.block.timestamp,
    );
}

