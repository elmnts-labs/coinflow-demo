'use client';

import {
  useConnection,
  useWallet,
  useAnchorWallet,
} from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import { ExplorerLink } from '../cluster/cluster-ui';
import { WalletButton, useAnchorProvider } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { useCoinflowTestProgram } from './coinflow-test-data-access';
import { CoinflowTestCreate, CoinflowTestProgram } from './coinflow-test-ui';
import { CoinflowEnvs, CoinflowPurchase } from '@coinflowlabs/react';
import {
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { useEffect, useMemo, useState } from 'react';
import idl from '../../../anchor/target/idl/coinflow_test.json';
import { Program, Idl, AnchorProvider, setProvider } from '@coral-xyz/anchor';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import base58 from 'bs58';

export default function CoinflowTestFeature() {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const wallet = useWallet();
  const provider = useAnchorProvider();

  const [transaction, setTransaction] = useState<Transaction | undefined>(
    undefined
  );

  const programId = useMemo(() => {
    return new PublicKey('3nYFYeGungM4L5WZ9BJLsieUrmXPSrmtmmihfUyMA2Vj');
  }, []);

  const amount = 1; // 1 usdc

  const usdcMint = useMemo(() => {
    return new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
  }, []);

  const program = useMemo(() => {
    return new Program(idl as Idl, programId);
  }, [programId]);

  const user = useMemo(async () => {
    const user = anchor.web3.Keypair.generate().publicKey;

    let decodedSecretKey: Uint8Array;
    try {
      decodedSecretKey = Buffer.from([
        161, 68, 42, 20, 84, 105, 221, 92, 198, 224, 128, 248, 123, 65, 84, 114,
        138, 75, 200, 202, 69, 130, 240, 225, 240, 47, 167, 93, 131, 39, 89,
        157, 135, 47, 221, 171, 1, 36, 137, 215, 107, 46, 68, 253, 142, 241,
        176, 36, 35, 241, 31, 105, 220, 128, 114, 26, 90, 173, 9, 151, 43, 188,
        168, 34,
      ]);

      const payer = anchor.web3.Keypair.fromSecretKey(decodedSecretKey);
      const tx = await program.methods
        .initializeEscrow(new anchor.BN(2), 6)
        .accounts({
          depositMint: usdcMint,
          user: user,
          signer: payer.publicKey,
        })
        .signers([payer])
        .transaction();

      const sig = await connection.sendTransaction(tx, [payer]);

      console.log('Initialize:', sig);
      const [escrowPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('escrow_deposit'), usdcMint.toBuffer(), user.toBuffer()],
        program.programId
      );

      const escrowAccount = await program.account.mockEscrow.fetch(escrowPda);
      setEscrowAccount(escrowAccount);
    } catch (throwObject) {
      const error = throwObject as Error;
      if (!error.message.includes('Non-base58 character')) {
        throw new Error(`Invalid secret key!`);
      }
      console.log(throwObject);
    }

    return user;
  }, []);

  const [escrowAccount, setEscrowAccount] = useState<any | undefined>(
    undefined
  );

  useEffect(() => {}, [user]);

  useEffect(() => {
    if (!escrowAccount) return;
    if (!anchorWallet) return;

    const provider = new AnchorProvider(connection, anchorWallet, {});
    setProvider(provider);

    const spenderTokenAccount = new PublicKey(
      '33333333333333333333333333333333333333333333'
    );
    const spenderWalletAccount = new PublicKey(
      '22222222222222222222222222222222222222222222'
    );

    // Create a transaction that mints usdc
    async function createTx() {
      const userResolved = await user;
      try {
        const tx = await program.methods
          .fundEscrow()
          .accounts({
            depositMint: usdcMint,
            payerTa: spenderTokenAccount,
            user: userResolved,
            signer: spenderWalletAccount,
          })
          .transaction();

        let blockhash = (await connection.getLatestBlockhash('finalized'))
          .blockhash;
        tx.recentBlockhash = blockhash;
        tx.feePayer = spenderWalletAccount;
        setTransaction(tx);
        console.log(
          'TX:',
          bs58.encode(tx.serialize({ verifySignatures: false }))
        );
      } catch (err) {
        console.error(err);
      }
    }

    createTx();
  }, [amount, wallet]);

  return wallet ? (
    <div>
      <AppHero
        title="CoinflowTest"
        subtitle={'Run the program by clicking the "Run program" button.'}
      >
        <p className="mb-6">
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </p>
        <CoinflowTestCreate />
      </AppHero>
      <CoinflowTestProgram />
      <div style={{ height: '1000px', overflow: 'visible' }}>
        <CoinflowPurchase
          wallet={wallet}
          merchantId={process.env.NEXT_PUBLIC_REACT_APP_MERCHANT_ID as string}
          env={process.env.NEXT_PUBLIC_REACT_APP_ENV as CoinflowEnvs}
          connection={connection}
          onSuccess={() => {
            console.log('Purchase Success');
          }}
          blockchain={'solana'}
          webhookInfo={{ item: 'test token purchase' }}
          email={'user-email@email.com'}
          transaction={transaction}
          amount={1}
          chargebackProtectionData={[
            {
              productName: 'test product',
              productType: 'inGameProduct',
              quantity: 1,
            },
          ]}
        />
      </div>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="text-center hero-content">
          <WalletButton className="btn btn-primary" />
        </div>
      </div>
    </div>
  );
}
