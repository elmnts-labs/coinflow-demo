import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { CoinflowTest } from '../target/types/coinflow_test';
import {
  getOrCreateAssociatedTokenAccount,
  createMint,
  mintTo,
  getAccount as getTokenAccount,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { initializeKeypair } from '@solana-developers/helpers';
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  clusterApiUrl,
} from '@solana/web3.js';
import assert from 'assert';
import base58 from 'bs58';

describe('coinflow-test', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const connection = anchor.getProvider().connection;

  const user = anchor.getProvider().publicKey;
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

    const user = anchor.web3.Keypair.generate().publicKey;

    // Add your test here.
    const tx = await program.methods
      .initializeEscrow(new anchor.BN(1), 2)
      .accounts({
        depositMint: depositMint.publicKey,
        user: user,
        signer: payer.publicKey,
      })
      .signers([payer])
      .rpc();

    const [escrowPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from('escrow_deposit'),
        depositMint.publicKey.toBuffer(),
        user.toBuffer(),
      ],
      program.programId
    );

    const escrowAccount = await program.account.mockEscrow.fetch(escrowPda);
    console.log(escrowAccount);

    const [depositTaPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from('escrow_deposit_ta'),
        depositMint.publicKey.toBuffer(),
        user.toBuffer(),
      ],
      program.programId
    );

    const depositTaBefore = await getTokenAccount(connection, depositTaPDA);
    console.log(depositTaBefore);

    const fundEscrowTx = await program.methods
      .fundEscrow()
      .accounts({
        depositMint: depositMint.publicKey,
        payerTa: payerTa.address,
        user: user,
        signer: payer.publicKey,
      })
      .signers([payer])
      .rpc();

    const depositTa = await getTokenAccount(connection, depositTaPDA);
    console.log(depositTa);
  }, 100000);

  // Run on devnet
  it('Log transaction to use in Coinflow demo', async () => {
    // Set up constants for USDC, coinflow USDC token account and wallet account placeholders
    // Coinflow replaces these with actual accounts when they execute the transaction
    const usdcMint = new PublicKey(
      '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
    );
    const coinflowTokenAccount = new PublicKey(
      '33333333333333333333333333333333333333333333'
    );
    const coinflowWalletAccount = new PublicKey(
      '22222222222222222222222222222222222222222222'
    );

    // Generate fake test user
    const user = Keypair.generate().publicKey;

    // Initialize the escrow account for the test user
    const tx = await program.methods
      .initializeEscrow(new anchor.BN(2000000), 6)
      .accounts({
        depositMint: usdcMint,
        user: user,
      })
      .rpc();

    // Create the Fund Escrow transaction but DO NOT SEND IT
    const fundEscrowTx = await program.methods
      .fundEscrow()
      .accounts({
        depositMint: usdcMint,
        payerTa: coinflowTokenAccount,
        user: user,
        signer: coinflowWalletAccount,
      })
      .transaction();

    let blockhash = (await connection.getLatestBlockhash('finalized'))
      .blockhash;
    fundEscrowTx.recentBlockhash = blockhash;
    fundEscrowTx.feePayer = coinflowWalletAccount;

    // Call Coinflow's `/checkout/ach/elmnts` endpoint with the transaction
    // Use this CURL:
    // curl--request POST \
    //      --url https://api-sandbox.coinflow.cash/api/checkout/ach/elmnts \
    //      --header 'accept: application/json' \
    //      --header 'content-type: application/json' \
    //      --header 'x-coinflow-auth-blockchain: solana' \
    //      --header 'x-coinflow-auth-wallet: 2yWZ1iUyhmUUWfwKVXnSLXAFx4YhWWc8Lr129xQDVudw' \
    //      --data '
    // {
    //   "subtotal": {
    //     "cents": 200
    //   },
    //   "transaction": "3pXoteFUb2ngizro8oKVM6f9aJ1PCMwWhfGCdQ8TQ1Ei3pZvTvTRe42a749kU2fpdzo3PbH5GCL17rAWjeKbujqGN72mA3uSSoz7Y2r9M9PKDRjjBPph2o9hD8jJ3TxbmDC8iuSLG5LDaDahoy8sEvQJ99tBoTmKDNxbv8o5HKBfV7gP6eu5quaHcPxVjmQDUnZmPWQkwPKxg4xt2Jy2BnD7bD1NQcx3FeJnofXSzcwAf4Q5Zab5f8ZNj8Dpmq5qbEA3EtWZMoUsQBTN1T3zJ1myScDhynx2vq1CW3vmqW9VHgX6QFD34Z7kZT7vACHDMG4Ztx8cFJEZJcQpaWr685BCbJvevytpvSLh26Axq7M1KTr3jWrk971CdXceS1BU8Q45kpBu4jFLttC34qeaw4RwPLS3abHMydSt3MzPLJCxkETRTjNsgedW4CMi6tbNagmRFSfFicLr4wr24NAPjCC1PC46Uk2RCiUyM2geKmC2uYMmjVLy8ZfkpuYft6J8L5Q3Ns1M89UxsG2NMwAZ2gV3uhwszMx8xBRj9W5SPk7LDjQ5dofu7T71nqtWxFxzmRQN44aShokrmxGTPRH8Y8iZMbN",
    //   "token": "d040c801-c739-4d81-b62b-4200ceb0dee2"
    // }
    // '
    const res = await fetch(
      'https://api-sandbox.coinflow.cash/api/checkout/ach/elmnts',
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'x-coinflow-auth-blockchain': 'solana',
          // This should actually be the user's address but for testing I'm using this
          // because it has a corresponding test bank account already
          'x-coinflow-auth-wallet':
            '2yWZ1iUyhmUUWfwKVXnSLXAFx4YhWWc8Lr129xQDVudw',
        },
        body: JSON.stringify({
          subtotal: {
            cents: 10000 * 100,
          },
          transaction: base58.encode(
            fundEscrowTx.serialize({ verifySignatures: false })
          ),
          // This is a test bank account - see my comment in headers about the wallet address
          token: 'd040c801-c739-4d81-b62b-4200ceb0dee2',
        }),
      }
    );

    const json = await res.json();
    console.log('Coinflow response:', json);

    // Some logs to help you debug
    const [depositTaPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('escrow_deposit_ta'), usdcMint.toBuffer(), user.toBuffer()],
      program.programId
    );

    console.group('To finish the flow, perform the following:');
    console.log(
      "1. Log into your Coinflow admin panel and click 'Settle' on the purchase"
    );
    console.log(
      '2. Refresh the page and inspect the transaction using the explorer link on the purchase'
    );
    console.log(
      '3. Verify that the USDC ended up in the correct escrow token account by inspecting it. The account is',
      depositTaPDA.toBase58()
    );
  });
});
