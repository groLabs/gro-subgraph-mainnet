import { ethereum } from "@graphprotocol/graph-ts"
import {
	updateGTokenFactor as updateFactor
} from '../setters/factors';

export function updateGTokenFactor(block: ethereum.Block): void {
    updateFactor()
  }