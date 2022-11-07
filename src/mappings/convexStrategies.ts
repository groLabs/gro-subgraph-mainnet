import { DECIMALS } from '../utils/constants';
import { setHarvest } from '../setters/strats';
import { tokenToDecimal } from '../utils/tokens';
import { Harvested as HarvestedPrimaryDAI } from '../../generated/PrimaryStratDAI/StableConvexXPool';
import { Harvested as HarvestedSecondaryDAI } from '../../generated/SecondaryStratDAI/StableConvexXPool';
import { Harvested as HarvestedPrimaryUSDC } from '../../generated/PrimaryStratUSDC/StableConvexXPool';
import { Harvested as HarvestedSecondaryUSDC } from '../../generated/SecondaryStratUSDC/StableConvexXPool';
import { Harvested as HarvestedPrimaryUSDT } from '../../generated/PrimaryStratUSDT/StableConvexXPool';


export function handleHarvestedPrimaryDAI(event: HarvestedPrimaryDAI): void {
    setHarvest(
        event.address,
        tokenToDecimal(event.params.profit, 18, DECIMALS),
        tokenToDecimal(event.params.loss, 18, DECIMALS),
        event.block.timestamp.toI32(),
    );
}

export function handleHarvestedSecondaryDAI(event: HarvestedSecondaryDAI): void {
    setHarvest(
        event.address,
        tokenToDecimal(event.params.profit, 18, DECIMALS),
        tokenToDecimal(event.params.loss, 18, DECIMALS),
        event.block.timestamp.toI32(),
    );
}

export function handleHarvestedPrimaryUSDC(event: HarvestedPrimaryUSDC): void {
    setHarvest(
        event.address,
        tokenToDecimal(event.params.profit, 6, DECIMALS),
        tokenToDecimal(event.params.loss, 6, DECIMALS),
        event.block.timestamp.toI32(),
    );
}

export function handleHarvestedSecondaryUSDC(event: HarvestedSecondaryUSDC): void {
    setHarvest(
        event.address,
        tokenToDecimal(event.params.profit, 6, DECIMALS),
        tokenToDecimal(event.params.loss, 6, DECIMALS),
        event.block.timestamp.toI32(),
    );
}

export function handleHarvestedPrimaryUSDT(event: HarvestedPrimaryUSDT): void {
    setHarvest(
        event.address,
        tokenToDecimal(event.params.profit, 6, DECIMALS),
        tokenToDecimal(event.params.loss, 6, DECIMALS),
        event.block.timestamp.toI32(),
    );
}

