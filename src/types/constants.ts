import {
    Bytes,
    BigDecimal,
} from '@graphprotocol/graph-ts';


export class Addr {
    public ZERO: Bytes;
}

export class Num {
    public ZERO: BigDecimal;
    public ONE: BigDecimal;
    public MINUS_ONE: BigDecimal;
    public THIRTY_PERCENT: BigDecimal;
    public PWRD_START_FACTOR: BigDecimal;
    public GVT_START_FACTOR: BigDecimal;
}

// @dev: should be aligned with enum <Token> in entities
export class Token {
    public UNKNOWN: string;
	public PWRD: string;
	public GVT: string;
	public GRO: string;
	public DAI: string;
	public USDC: string;
	public USDT: string;
    public THREE_CRV: string;
	public UNISWAP_GVT_GRO: string;
	public UNISWAP_GRO_USDC: string;
	public CURVE_PWRD3CRV: string;
	public BALANCER_GRO_WETH: string;
}

// @dev: should be aligned with enum <TxType> in entities
export class TxType {
    public CORE_DEPOSIT: string;
	public CORE_WITHDRAWAL: string;
	public STAKER_DEPOSIT: string;
	public STAKER_WITHDRAWAL: string;
	public TRANSFER_IN: string;
	public TRANSFER_OUT: string;
	public CLAIM: string;
	public MULTICLAIM: string;
	public VEST: string;
	public APPROVAL: string;
}

export class Contracts {
    public network: string;
    public GvtAddress: string;
    public GvtStartBlock: number;
    public PwrdAddress: string;
    public PwrdStartBlock: number;
    public GroAddress: string;
    public GroStartBlock: number;
    public LpTokenStakerV1Address: string;
    public LpTokenStakerV1StartBlock: number;
    public LpTokenStakerV2Address: string;
    public LpTokenStakerV2StartBlock: number;
    public HodlerV1Address: string;
    public HodlerV1StartBlock: number;
    public HodlerV2Address: string;
    public HodlerV2StartBlock: number;
    public HodlerV3Address: string;
    public HodlerV3StartBlock: number;
    public VestingV1Address: string;
    public VestingV1StartBlock: number;
    public VestingV2Address: string;
    public VestingV2StartBlock: number;
    public VestingTeamAddress: string;
    public VestingTeamStartBlock: number;
    public PnLAddress: string;
    public PnLStartBlock: number;
    public UniswapV2GvtGroAddress: string;
    public UniswapV2GvtGroStartBlock: number;
    public UniswapV2GroUsdcAddress: string;
    public UniswapV2GroUsdcStartBlock: number;
    public UniswapV2UsdcWethAddress: string;
    public UniswapV2UsdcWethStartBlock: number;
    public CurveMetapool3CRVAddress: string;
    public CurveMetapool3CRVStartBlock: number;
    public BalancerGroWethVaultAddress: string;
    public BalancerGroWethVaultStartBlock: number;
    public BalancerGroWethPoolAddress: string;
    public BalancerGroWethPoolStartBlock: number;
    public DepositHandlerV1Address: string;
    public DepositHandlerV1StartBlock: number;
    public DepositHandlerV2Address: string;
    public DepositHandlerV2StartBlock: number;
    public DepositHandlerV3Address: string;
    public DepositHandlerV3StartBlock: number;
    public WithdrawHandlerV1Address: string;
    public WithdrawHandlerV1StartBlock: number;
    public WithdrawHandlerV2Address: string;
    public WithdrawHandlerV2StartBlock: number;
    public WithdrawHandlerV3Address: string;
    public WithdrawHandlerV3StartBlock: number;
    public EmergencyHandlerV3Address: string;
    public EmergencyHandlerV3StartBlock: number;
    public ChainlinkAggregatorAddress: string;
    public ChainlinkAggregatorStartBlock: number;
    public ChainlinkDaiUsdAddress: string;
    public ChainlinkDaiUsdStartBlock: number;
    public ChainlinkUsdcUsdAddress: string;
    public ChainlinkUsdcUsdStartBlock: number;
    public ChainlinkUsdtUsdAddress: string;
    public ChainlinkUsdtUsdStartBlock: number;
    public GRouterAddress: string;
    public GRouterStartBlock: number;
    public GVaultAddress: string;
    public GVaultStartBlock: number;
    public GTrancheAddress: string;
    public GTrancheStartBlock: number;
    public PnLG2Address: string;
    public PnLG2StartBlock: number;
    public StopLossLogicAddress: string;
    public StopLossLogicStartBlock: number;
    public ThreePoolAddress: string;
    public ThreePoolStartBlock: number;
    public AirdropV1Address: string;
    public AirdropV1StartBlock: number;
    public AirdropV2Address: string;
    public AirdropV2StartBlock: number;
    public GMerkleVestorAddress: string;
    public GMerkleVestorStartBlock: number;
}
