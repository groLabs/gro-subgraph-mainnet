import {
    Address,
    BigDecimal,
    Bytes,
} from "@graphprotocol/graph-ts";

// Numbers
export const ZERO = BigDecimal.fromString('0');
export const ONE = BigDecimal.fromString('1');

// Addresses
export const NO_ADDR = Bytes.empty();
export const ZERO_ADDR = Address.fromString('0x0000000000000000000000000000000000000000');

// Contract addresses
export const GVT_ADDRESS = Address.fromString('0x3adb04e127b9c0a5d36094125669d4603ac52a0c');