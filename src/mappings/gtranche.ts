import { tokenToDecimal } from '../utils/tokens';
import { 
    setUtilizationRatio,
    setUtilizationRatioLimit,
} from '../setters/gtranche';
import {
    LogNewTrancheBalance,
    LogNewUtilizationThreshold,
} from '../../generated/GTranche/GTranche';


export function handleNewTrancheBalance(event: LogNewTrancheBalance): void {
    const utilRatio = tokenToDecimal(event.params._utilization, 4, 4);
    setUtilizationRatio(utilRatio);
}

export function handleLogNewUtilizationThreshold(event: LogNewUtilizationThreshold): void {
    const utilRatioLimit = tokenToDecimal(event.params.newThreshold, 4, 4);
    setUtilizationRatioLimit(utilRatioLimit);
}
