import {
    Address,
    BigDecimal,
    Bytes,
} from "@graphprotocol/graph-ts";

// Numbers
export const DECIMALS = 7;
export const ZERO = BigDecimal.fromString('0');
export const ONE = BigDecimal.fromString('1');

// Addresses
export const NO_ADDR = Bytes.empty();
export const ZERO_ADDR = Address.fromString('0x0000000000000000000000000000000000000000');

// Contract addresses
export const GVT_ADDRESS = Address.fromString('0x3ADb04E127b9C0a5D36094125669d4603AC52a0c');
export const PWRD_ADDRESS = Address.fromString('0xF0a93d4994B3d98Fb5e3A2F90dBc2d69073Cb86b');
export const UNISWAPV2_GRO_USDC_ADDRESS = Address.fromString('0x21C5918CcB42d20A2368bdCA8feDA0399EbfD2f6');
export const UNISWAPV2_USDC_WETH_ADDRESS = Address.fromString('0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc');
