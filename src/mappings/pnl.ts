import {
  LogPnLExecution as LogPnLExecutionEvent,
} from '../../generated/PnL/PnL';
import { setGvtPrice } from '../setters/price';
import {
  setPwrdFactor,
  setGvtFactor
} from '../setters/factors';


export function handlePnLExecution(event: LogPnLExecutionEvent): void {
  setGvtPrice();
  setPwrdFactor();
  setGvtFactor();
}
