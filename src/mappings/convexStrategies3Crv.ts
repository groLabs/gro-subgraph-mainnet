import { Harvested } from '../../generated/ConvexStrategyFrax/ConvexStrategy';


/// @dev Convex contract is only used via calls, but a handler is still
//       needed to enable reading from it
export function handleHarvested(event: Harvested): void {
    // do nothing ;)
}
