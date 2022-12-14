
import { contracts } from '../../addresses';
import { tokenToDecimal } from '../utils/tokens';
import { setPoolSwap } from '../setters/poolSwaps';
import { setTotalSupply } from '../setters/coreData';
import { setCurvePwrd3crvPrice } from '../setters/price';
import { Vyper_contract as MetaPool } from '../../generated/CurveMetapool3CRV/Vyper_contract';
import {
    log,
    Address,
    BigDecimal,
} from '@graphprotocol/graph-ts';
import {
    Transfer,
    TokenExchange,
    TokenExchangeUnderlying,
} from '../../generated/CurveMetapool3CRV/Vyper_contract';
import {
    NUM,
    DECIMALS,
} from '../utils/constants';


export function handleTokenExchange(event: TokenExchange): void {
    setCurvePwrd3crvPrice();
    setPoolSwap(
        event.block.timestamp.toString() + '-4',
        4,
        event.block.timestamp.toI32(),
        event.block.number.toI32(),
        event.params.buyer,
        NUM.ZERO,
        tokenToDecimal(event.params.tokens_bought, 18, DECIMALS),
        NUM.ZERO,
        tokenToDecimal(event.params.tokens_sold, 18, DECIMALS),
        Address.zero(),
        getVirtualPrice()
    );
}

export function handleTokenExchangeUnderlying(event: TokenExchangeUnderlying): void {
    setCurvePwrd3crvPrice();
    setPoolSwap(
        event.transaction.hash.toHex() + "-" + event.logIndex.toString(),
        4,
        event.block.timestamp.toI32(),
        event.block.number.toI32(),
        event.params.buyer,
        NUM.ZERO,
        tokenToDecimal(event.params.tokens_bought, 18, DECIMALS),
        NUM.ZERO,
        tokenToDecimal(event.params.tokens_sold, 18, DECIMALS),
        Address.zero(),
        getVirtualPrice(),
    );
}

const getVirtualPrice = (): BigDecimal => {
    const contractAddress = Address.fromString(contracts.CurveMetapool3CRVAddress);
    const contract = MetaPool.bind(contractAddress);
    const virtualPrice = contract.try_get_virtual_price();
    if (virtualPrice.reverted) {
        log.error('getVirtualPrice(): try_get_virtual_price() reverted in /mappings/curveMetapool3CRV.ts', []);
    } else {
        return tokenToDecimal(virtualPrice.value, 18, DECIMALS);
    }
    return NUM.ZERO;
}

export function handleTransfer(event: Transfer): void {
    setTotalSupply(
        event.params.sender,
        event.params.receiver,
        event.params.value,
        'curve_pwrd3crv',
    );
}
