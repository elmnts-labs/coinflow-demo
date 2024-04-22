// Here we export some useful types and functions for interacting with the Anchor program.
import { PublicKey } from '@solana/web3.js';
import type { CoinflowTest } from '../target/types/coinflow_test';
import { IDL as CoinflowTestIDL } from '../target/types/coinflow_test';

// Re-export the generated IDL and type
export { CoinflowTest, CoinflowTestIDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const programId = new PublicKey(
  '3nYFYeGungM4L5WZ9BJLsieUrmXPSrmtmmihfUyMA2Vj'
);
