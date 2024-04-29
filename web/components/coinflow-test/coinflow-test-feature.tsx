'use client';

import {
  useConnection,
  useWallet,
  useAnchorWallet,
} from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import { ExplorerLink } from '../cluster/cluster-ui';
import { WalletButton } from '../solana/solana-provider';
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
import { useEffect, useState } from 'react';
import idl from '../../../anchor/target/idl/coinflow_test.json';
import { Program, Idl, AnchorProvider, setProvider } from '@coral-xyz/anchor';

export default function CoinflowTestFeature() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const [transaction, setTransaction] = useState<Transaction | undefined>(
    undefined
  );

  const amount = 1; // 1 usdc

  useEffect(() => {
    if (!wallet) return;
    const provider = new AnchorProvider(connection, wallet, {});
    setProvider(provider);

    const programId = new PublicKey(
      '3nYFYeGungM4L5WZ9BJLsieUrmXPSrmtmmihfUyMA2Vj'
    );

    const program = new Program(idl as Idl, programId);

    // Create a transaction that mints usdc
    async function createTx() {
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
          .transaction();

        setTransaction(tx);
      } catch (err) {
        console.error(err);
      }
    }

    createTx();
  }, [amount, wallet.publicKey]);

  return wallet.publicKey ? (
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
