import {
    Address,
    BigDecimal,
} from "@graphprotocol/graph-ts";


export class Num {
    public ZERO: BigDecimal;
    public ONE: BigDecimal;
    public MINUS_ONE: BigDecimal;
    public THIRTY_PERCENT: BigDecimal;
}

export class Addr {
    public ZERO: Address;
    public GVT: Address;
    public PWRD: Address;
    public UNISWAPV2_GVT_GRO: Address;
    public UNISWAPV2_GRO_USDC: Address;
    public UNISWAPV2_USDC_WETH: Address;
    public CURVE_PWRD_3CRV: Address;
    public BALANCER_GRO_WETH_VAULT: Address;
    public BALANCER_GRO_WETH_POOL: Address;
    public STAKER_V1: Address;
    public STAKER_V2: Address;
    public DEPOSIT_HANDLER_V1: Address;
    public DEPOSIT_HANDLER_V2: Address;
    public DEPOSIT_HANDLER_V3: Address;
    public CHAINLINK_DAI_USD: Address;
    public CHAINLINK_USDC_USD: Address;
    public CHAINLINK_USDT_USD: Address;
    public GRO_VESTING_V1: Address;
    public GRO_VESTING_V2: Address;
}