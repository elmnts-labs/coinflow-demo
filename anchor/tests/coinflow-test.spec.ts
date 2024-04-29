import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { CoinflowTest } from '../target/types/coinflow_test';
import {
  getOrCreateAssociatedTokenAccount,
  createMint,
  mintTo,
} from '@solana/spl-token';
import { initializeKeypair } from '@solana-developers/helpers';
import { LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';

describe('coinflow-test', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const connection = anchor.getProvider().connection;

  const program = anchor.workspace.CoinflowTest as Program<CoinflowTest>;

  it('should run the program', async () => {
    const payer = await initializeKeypair(connection, {
      airdropAmount: 2 * LAMPORTS_PER_SOL,
      minimumBalance: 1,
    });

    const balance = await connection.getBalance(payer.publicKey);
    console.log(balance);

    const depositMint = anchor.web3.Keypair.generate();

    await createMint(
      connection,
      payer,
      payer.publicKey,
      payer.publicKey,
      2,
      depositMint
    );

    console.log(2);

    const payerTa = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      depositMint.publicKey,
      payer.publicKey
    );

    console.log(3);

    await mintTo(
      connection,
      payer,
      depositMint.publicKey,
      payerTa.address,
      payer,
      100
    );

    console.log(4);

    // Add your test here.
    try {
      const tx = await program.methods
        .initialize(new anchor.BN(1), 2)
        .accounts({
          depositMint: depositMint.publicKey,
          payerTa: payerTa.address,
          user: anchor.web3.Keypair.generate().publicKey,
          signer: payer.publicKey,
        })
        .signers([payer])
        .rpc();
      console.log('Your transaction signature', tx);
    } catch (err) {
      console.error(err);
    }
  }, 100000);
});
