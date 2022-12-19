import {
    Address,
    BigDecimal,
} from "@graphprotocol/graph-ts";


export class Num {
    public ZERO: BigDecimal;
    public ONE: BigDecimal;
    public MINUS_ONE: BigDecimal;
    public THIRTY_PERCENT: BigDecimal;
    public PWRD_START_FACTOR: BigDecimal;
    public GVT_START_FACTOR: BigDecimal;
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
    public WITHDRAWAL_HANDLER_V1: Address;
    public WITHDRAWAL_HANDLER_V2: Address;
    public WITHDRAWAL_HANDLER_V3: Address;
    public CHAINLINK_DAI_USD: Address;
    public CHAINLINK_USDC_USD: Address;
    public CHAINLINK_USDT_USD: Address;
    public GRO_VESTING_V1: Address;
    public GRO_VESTING_V2: Address;
    public THREE_POOL: Address;
    public GROUTER: Address;
    public GTRANCHE: Address;
}

export class Contracts {
    public network: string;
    GvtAddress: string;
    GvtStartBlock: number;
    PwrdAddress: string;
    PwrdStartBlock: number;
    GroAddress: string;
    GroStartBlock: number;
    LpTokenStakerV1Address: string;
    LpTokenStakerV1StartBlock: number;
    LpTokenStakerV2Address: string;
    LpTokenStakerV2StartBlock: number;
    HodlerV1Address: string;
    HodlerV1StartBlock: number;
    HodlerV2Address: string;
    HodlerV2StartBlock: number;
    VestingV1Address: string;
    VestingV1StartBlock: number;
    VestingV2Address: string;
    VestingV2StartBlock: number;
    VestingTeamAddress: string;
    VestingTeamStartBlock: number;
    PnLAddress: string;
    PnLStartBlock: number;
    UniswapV2GvtGroAddress: string;
    UniswapV2GvtGroStartBlock: number;
    UniswapV2GroUsdcAddress: string;
    UniswapV2GroUsdcStartBlock: number;
    CurveMetapool3CRVAddress: string;
    CurveMetapool3CRVStartBlock: number;
    BalancerGroWethVaultAddress: string;
    BalancerGroWethVaultStartBlock: number;
    BalancerGroWethPoolAddress: string;
    BalancerGroWethPoolStartBlock: number;
    DepositHandlerV1Address: string;
    DepositHandlerV1StartBlock: number;
    DepositHandlerV2Address: string;
    DepositHandlerV2StartBlock: number;
    DepositHandlerV3Address: string;
    DepositHandlerV3StartBlock: number;
    WithdrawHandlerV1Address: string;
    WithdrawHandlerV1StartBlock: number;
    WithdrawHandlerV2Address: string;
    WithdrawHandlerV2StartBlock: number;
    WithdrawHandlerV3Address: string;
    WithdrawHandlerV3StartBlock: number;
    EmergencyHandlerV3Address: string;
    EmergencyHandlerV3StartBlock: number;
    DaiAddress: string;
    DaiStartBlock: number;
    UsdcAddress: string;
    UsdcStartBlock: number;
    UsdtAddress: string;
    UsdtStartBlock: number;
    ChainlinkAggregatorAddress: string;
    ChainlinkAggregatorStartBlock: number;
    VaultAddress: string;
    VaultStartBlock: number;
    VaultDAIAddress: string;
    VaultDAIStartBlock: number;
    VaultUSDCAddress: string;
    VaultUSDCStartBlock: number;
    VaultUSDTAddress: string;
    VaultUSDTStartBlock: number;
    VaultAdapterAddress: string;
    VaultAdapterStartBlock: number;
    ConvexStrategyAddress: string;
    ConvexStrategyStartBlock: number;
    PrimaryStratDAIAddress: string;
    PrimaryStratDAIStartBlock: number;
    SecondaryStratDAIAddress: string;
    SecondaryStratDAIStartBlock: number;
    PrimaryStratUSDCAddress: string;
    PrimaryStratUSDCStartBlock: number;
    SecondaryStratUSDCAddress: string;
    SecondaryStratUSDCStartBlock: number;
    PrimaryStratUSDTAddress: string;
    PrimaryStratUSDTStartBlock: number;
    GRouterAddress: string;
    GRouterStartBlock: number;
    GVaultAddress: string;
    GVaultStartBlock: number;
    GTrancheAddress: string;
    GTrancheStartBlock: number;
    PnLG2Address: string;
    PnLG2StartBlock: number;
    StopLossLogicAddress: string;
    StopLossLogicStartBlock: number;
    ConvexFraxAddress: string;
    ConvexFraxStartBlock: number;
}
