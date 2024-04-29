export type CoinflowTest = {
  "version": "0.1.0",
  "name": "coinflow_test",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "depositTa",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "escrow_deposit_ta"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "deposit_mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "depositMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payerTa",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "amountDecimals",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "mockEscrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "amountDecimals",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": "publicKey"
          }
        ]
      }
    }
  ]
};

export const IDL: CoinflowTest = {
  "version": "0.1.0",
  "name": "coinflow_test",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "depositTa",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "escrow_deposit_ta"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "deposit_mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "depositMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payerTa",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "amountDecimals",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "mockEscrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "amountDecimals",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": "publicKey"
          }
        ]
      }
    }
  ]
};
