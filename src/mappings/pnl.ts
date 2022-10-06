import {
  LogPnLExecution,
} from '../../generated/PnL/PnL';
import { setGvtPrice } from '../setters/price';
import {
  setPwrdFactor,
  setGvtFactor
} from '../setters/factors';


export function handlePnLExecution(event: LogPnLExecution): void {
  setGvtPrice();
  setPwrdFactor();
  setGvtFactor();
}
