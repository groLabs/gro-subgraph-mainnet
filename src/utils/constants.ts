import {
    Bytes,
    Address,
    BigDecimal,
} from "@graphprotocol/graph-ts";

// Numbers
export const DECIMALS = 7;
export const ZERO = BigDecimal.fromString('0');
export const ONE = BigDecimal.fromString('1');

// Addresses
export const NO_ADDR = Bytes.empty();
export const ZERO_ADDR = Address.fromString('0x0000000000000000000000000000000000000000');
export const ZERO_ADDRESS_HEX = '0x0000000000000000000000000000000000000000000000000000000000000000';

// Contract addresses
export const GVT_ADDRESS = Address.fromString('0x3ADb04E127b9C0a5D36094125669d4603AC52a0c');
export const PWRD_ADDRESS = Address.fromString('0xF0a93d4994B3d98Fb5e3A2F90dBc2d69073Cb86b');
export const UNISWAPV2_GRO_USDC_ADDRESS = Address.fromString('0x21C5918CcB42d20A2368bdCA8feDA0399EbfD2f6');
export const UNISWAPV2_USDC_WETH_ADDRESS = Address.fromString('0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc');
export const STAKER_V1_ADDRESS = Address.fromString('0x001C249c09090D79Dc350A286247479F08c7aaD7');
export const STAKER_V2_ADDRESS = Address.fromString('0x2E32bAd45a1C29c1EA27cf4dD588DF9e68ED376C');
export const STAKERS = [
    STAKER_V1_ADDRESS,
    STAKER_V2_ADDRESS
];

// Signatures
export const ERC20_TRANSFER_SIGNATURE = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';