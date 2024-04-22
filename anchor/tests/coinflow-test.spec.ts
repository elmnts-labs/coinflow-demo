import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { CoinflowTest } from '../target/types/coinflow_test';

describe('coinflow-test', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.CoinflowTest as Program<CoinflowTest>;

  it('should run the program', async () => {
    // Add your test here.
    const tx = await program.methods.greet().rpc();
    console.log('Your transaction signature', tx);
  });
});
