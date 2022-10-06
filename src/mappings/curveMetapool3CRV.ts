import {
    TokenExchange,
    TokenExchangeUnderlying,
} from '../../generated/CurveMetapool3CRV/Vyper_contract'
import { setCurvePwrd3crvPrice } from '../setters/price';


export function handleTokenExchange(event: TokenExchange): void {
    setCurvePwrd3crvPrice();
}

export function handleTokenExchangeUnderlying(event: TokenExchangeUnderlying): void {
    setCurvePwrd3crvPrice();
}
