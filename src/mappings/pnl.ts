import {
  LogPnLExecution as LogPnLExecutionEvent,
} from '../../generated/PnL/PnL';
import { setGvtPrice } from '../setters/price';


export function handlePnLExecution(event: LogPnLExecutionEvent): void {
  setGvtPrice();
}
