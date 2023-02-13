import { Tx } from '../types/tx';
import { updatePoolData } from './poolData';
import { contracts } from '../../addresses';
import { Price } from '../../generated/schema';
import {
    getPricePerShare,
    tokenToDecimal
} from '../utils/tokens';
import {
    log,
    BigInt,
    Address,
    BigDecimal,
} from '@graphprotocol/graph-ts';
import {
    NUM,
    DECIMALS,
    GENESIS_POOL_GRO_WETH,
    BALANCER_GRO_WETH_POOLID,
} from '../utils/constants';
// contracts
import { ThreePool } from '../../generated/ChainlinkAggregator/ThreePool';
import { UniswapV2Pair } from '../../generated/UniswapV2PairGvtGro/UniswapV2Pair';
import { Vault as BalancerGroWethVault } from '../../generated/BalancerGroWethVault/Vault';
import { WeightedPool as BalancerGroWethPool } from '../../generated/BalancerGroWethPool/WeightedPool';
import { Vyper_contract as CurveMetapool3CRV } from '../../generated/CurveMetapool3CRV/Vyper_contract';
import {
    AccessControlledOffchainAggregator as ChainlinkAggregator
} from '../../generated/ChainlinkAggregator/AccessControlledOffchainAggregator';
// contract addresses
const threePoolAddress = Address.fromString(contracts.ThreePoolAddress);
const uni2GvtGroAddress = Address.fromString(contracts.UniswapV2GvtGroAddress);
const uni2GroUsdcAddress = Address.fromString(contracts.UniswapV2GroUsdcAddress);
const uni2UsdcWethAddress = Address.fromString(contracts.UniswapV2UsdcWethAddress);
const curveMetapoolAddress = Address.fromString(contracts.CurveMetapool3CRVAddress);
const balGroWethVaultAddress = Address.fromString(contracts.BalancerGroWethVaultAddress);
const balGroWethPoolAddress = Address.fromString(contracts.BalancerGroWethPoolAddress);
const chainlinkDaiUsdAddress = Address.fromString(contracts.ChainlinkDaiUsdAddress);
const chainlinkUsdcUsdAddress = Address.fromString(contracts.ChainlinkUsdcUsdAddress);
const chainlinkUsdtUsdAddress = Address.fromString(contracts.ChainlinkUsdtUsdAddress);



export const initPrice = (): Price => {
    let price = Price.load('0x');
    if (!price) {
        price = new Price('0x');
        price.pwrd = NUM.ONE;
        price.gvt = NUM.ZERO;
        price.gro = NUM.ZERO;
        price.weth = NUM.ZERO;
        price.dai = NUM.ZERO;
        price.usdc = NUM.ZERO;
        price.usdt = NUM.ZERO;
        price.threeCrv = NUM.ZERO;
        price.balancer_gro_weth = NUM.ZERO;
        price.uniswap_gvt_gro = NUM.ZERO;
        price.uniswap_gro_usdc = NUM.ZERO;
        price.curve_pwrd3crv = NUM.ZERO;
    }
    return price;
}

// Triggered by PnLExecution events
export const setGvtPrice = (): void => {
    let price = initPrice();
    price.gvt = getPricePerShare('gvt');
    price.save();
}

export const set3CrvPrice = (): void => {
    const contract = ThreePool.bind(threePoolAddress);
    const virtualPrice = contract.try_get_virtual_price();
    if (virtualPrice.reverted) {
        log.error('set3CrvPrice(): try_get_virtual_price() reverted in /setters/price.ts', []);
    } else {
        const crvPrice = tokenToDecimal(virtualPrice.value, 18, DECIMALS);
        let price = initPrice();
        price.threeCrv = crvPrice;
        price.save();
    }
}

// TODO: update gro price as well (knowing gvt price, we can update gro)
export const setUniswapGvtGroPrice = (): void => {
    const contract = UniswapV2Pair.bind(uni2GvtGroAddress);
    const reserves = contract.try_getReserves();
    const _totalSupply = contract.try_totalSupply();
    if (reserves.reverted) {
        log.error('setUniswapGvtGroPrice(): try_getReserves() reverted in /setters/price.ts', []);
    } else if (_totalSupply.reverted) {
        log.error('setUniswapGvtGroPrice(): try_totalSupply() reverted in /setters/price.ts', []);
    } else {
        const totalSupply = tokenToDecimal(_totalSupply.value, 18, 12);
        const gvtReserve = tokenToDecimal(reserves.value.get_reserve0(), 18, DECIMALS);
        const groReserve = tokenToDecimal(reserves.value.get_reserve1(), 18, DECIMALS);

        // update Pool data
        updatePoolData(
            1,
            uni2GvtGroAddress,
            gvtReserve,
            groReserve,
            totalSupply,
        );

        // update GRO price
        // TODO: chainlink to calc the USD price of USDC.

        // update lpToken price
        const price = initPrice();
        const oneGvt = (NUM.ONE.div(totalSupply)).times(gvtReserve);
        const oneGro = (NUM.ONE.div(totalSupply)).times(groReserve);
        const oneGvtValue = oneGvt.times(price.gvt);
        const oneGroValue = oneGro.times(price.gro);
        const oneLpValue = oneGvtValue.plus(oneGroValue);
        price.uniswap_gvt_gro = oneLpValue.truncate(DECIMALS);
        price.save();

        // log.error(`HELLLOOO on setUniswapGvtGroPrice !!!(): oneGvt {} oneGro {} gvt price {} gro price {} oneGvtValue {} oneGroValue {} oneLpValue {}`,
        // [
        //     oneGvt.toString(),
        //     oneGro.toString(),
        //     price.gvt.toString(),
        //     price.gro.toString(),
        //     oneGvtValue.toString(),
        //     oneGroValue.toString(),
        //     oneLpValue.toString(),
        // ]);
    }
}

export const setUniswapGroUsdcPrice = (): void => {
    const contract = UniswapV2Pair.bind(uni2GroUsdcAddress);
    const reserves = contract.try_getReserves();
    const _totalSupply = contract.try_totalSupply();
    if (reserves.reverted) {
        log.error('setUniswapGroUsdcPrice(): try_getReserves() reverted in /setters/price.ts', []);
    } else if (_totalSupply.reverted) {
        log.error('setUniswapGroUsdcPrice(): try_totalSupply() reverted in /setters/price.ts', []);
    } else {
        const totalSupply = tokenToDecimal(_totalSupply.value, 18, 12);
        const groReserve = tokenToDecimal(reserves.value.get_reserve0(), 18, DECIMALS);
        const usdcReserve = tokenToDecimal(reserves.value.get_reserve1(), 6, DECIMALS);

        // update Pool data
        updatePoolData(
            2,
            uni2GroUsdcAddress,
            groReserve,
            usdcReserve,
            totalSupply,
        );

        // update GRO price
        const price = initPrice();
        const usdReserve = usdcReserve.times(price.usdc)
        const groPricePerShare = usdReserve.div(groReserve).truncate(DECIMALS);
        price.gro = groPricePerShare;

        // update lpToken price
        const oneGroAmount = (NUM.ONE.div(totalSupply)).times(groReserve);
        const oneUsdcAmount = (NUM.ONE.div(totalSupply)).times(usdcReserve);
        const oneGroValue = oneGroAmount.times(price.gro);
        const oneUsdcValue = oneUsdcAmount.times(price.usdc);
        const lpPricePerShare = oneGroValue.plus(oneUsdcValue);
        price.uniswap_gro_usdc = lpPricePerShare.truncate(DECIMALS);
        price.save();
    }
}

export const setCurvePwrd3crvPrice = (): void => {
    const contract = CurveMetapool3CRV.bind(curveMetapoolAddress);
    const reserves = contract.try_get_balances();
    const totalSupply = contract.try_totalSupply();
    const virtualPrice = contract.try_get_virtual_price();
    if (reserves.reverted) {
        log.error('setCurvePwrd3crvPrice(): try_get_balances() reverted in /setters/price.ts', []);
    } else if (totalSupply.reverted) {
        log.error('setCurvePwrd3crvPrice(): try_totalSupply() reverted in /setters/price.ts', []);
    } else if (virtualPrice.reverted) {
        log.error('setCurvePwrd3crvPrice(): try_get_virtual_price() reverted in /setters/price.ts', []);
    } else {
        const total_supply = tokenToDecimal(totalSupply.value, 18, 12);
        const crv_reserve = tokenToDecimal(reserves.value[0], 18, DECIMALS);
        const pwrd_reserve = tokenToDecimal(reserves.value[1], 18, DECIMALS);

        // update Pool data
        updatePoolData(
            4,
            curveMetapoolAddress,
            crv_reserve,
            pwrd_reserve,
            total_supply,
        );

        // update lpToken price
        const price = initPrice();
        const lpPricePerShare = tokenToDecimal(virtualPrice.value, 18, DECIMALS);
        price.curve_pwrd3crv = lpPricePerShare;
        price.save();
    }
}

//@dev: Gro token was circulating before the GRO/WETH pool creation,
//      so any tx before this creation must be ignored
export const setBalancerGroWethPrice = (tx: Tx): void => {
    const contractVault = BalancerGroWethVault.bind(balGroWethVaultAddress);
    const contractPool = BalancerGroWethPool.bind(balGroWethPoolAddress);
    const _totalSupply = contractPool.try_totalSupply();
    const poolTokens = contractVault.try_getPoolTokens(BALANCER_GRO_WETH_POOLID);
    if (tx.block < GENESIS_POOL_GRO_WETH) {
        log.warning(
            `setBalancerGroWethPrice(): GRO/WETH Vault updates before its pool creation ${tx.msg} in setters/price.ts`,
            tx.data
        )
    } else if (_totalSupply.reverted) {
        log.error(
            `setBalancerGroWethPrice(): try_totalSupply() reverted ${tx.msg} in /setters/price.ts`,
            tx.data
        );
    } else if (poolTokens.reverted) {
        log.error(
            `setBalancerGroWethPrice(): try_getPoolTokens() reverted ${tx.msg} in /setters/price.ts`,
            tx.data
        );
    } else {
        const totalSupply = tokenToDecimal(_totalSupply.value, 18, 12);
        const reserves = poolTokens.value.getBalances().map<BigDecimal>((item: BigInt) => tokenToDecimal(item, 18, DECIMALS));
        if (reserves.length !== 2) {
            log.error(
                `setBalancerGroWethPrice(): wrong reserves pair ${tx.msg} in /setters/price.ts`,
                tx.data
            );
        } else {
            const groReserve = reserves[0];
            const wethReserve = reserves[1];

            // update Pool data
            updatePoolData(
                5,
                balGroWethPoolAddress,
                groReserve,
                wethReserve,
                totalSupply,
            );

            // update lpToken price
            const price = initPrice();
            const oneGro = (NUM.ONE.div(totalSupply)).times(groReserve);
            const oneWeth = (NUM.ONE.div(totalSupply)).times(wethReserve);
            const oneGroValue = oneGro.times(price.gro);
            const oneWethValue = oneWeth.times(price.weth);
            const lpPricePerShare = oneGroValue.plus(oneWethValue);
            price.balancer_gro_weth = lpPricePerShare.truncate(DECIMALS);
            price.save();
        }
    }
}

export const setWethPrice = (): void => {
    const contract = UniswapV2Pair.bind(uni2UsdcWethAddress);
    const reserves = contract.try_getReserves();
    if (reserves.reverted) {
        log.error('setWethPrice(): try_getReserves() reverted in /setters/price.ts', []);
    } else {
        const usdcReserve = tokenToDecimal(reserves.value.get_reserve0(), 6, DECIMALS);
        const wethReserve = tokenToDecimal(reserves.value.get_reserve1(), 18, DECIMALS);
        // update WETH price
        // TODO: chainlink to calc the USD price of USDC.
        const price = initPrice();
        price.weth = usdcReserve.div(wethReserve).truncate(DECIMALS);
        price.save();
    }
}

export const setStableCoinPrice = (
    contractAddress: Address,
): void => {
    const contract = ChainlinkAggregator.bind(contractAddress);
    const latestRound = contract.try_latestRoundData();
    if (latestRound.reverted) {
        log.error('setStableCoinPrice(): try_latestRoundData() reverted in /setters/price.ts', []);
    } else {
        const usdPrice = tokenToDecimal(latestRound.value.getAnswer(), 8, DECIMALS);
        const price = initPrice();
        if (contractAddress == chainlinkDaiUsdAddress) {
            price.dai = usdPrice;
        } else if (contractAddress == chainlinkUsdcUsdAddress) {
            price.usdc = usdPrice;
        } else if (contractAddress == chainlinkUsdtUsdAddress) {
            price.usdt = usdPrice;
        } else {
            log.error(
                'setStableCoinPrice(): unknown chainlink feed address {} in /setters/price.ts',
                [contractAddress.toHexString()]
            );
        }
        price.save();
    }
}

