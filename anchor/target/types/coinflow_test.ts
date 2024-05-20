export type CoinflowTest = {
  "version": "0.1.0",
  "name": "coinflow_test",
  "instructions": [
    {
      "name": "initializeEscrow",
      "accounts": [
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "escrow_deposit"
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
    },
    {
      "name": "fundEscrow",
      "accounts": [
        {
          "name": "escrow",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "escrow_deposit"
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
      "args": []
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
      "name": "initializeEscrow",
      "accounts": [
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "escrow_deposit"
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
    },
    {
      "name": "fundEscrow",
      "accounts": [
        {
          "name": "escrow",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "escrow_deposit"
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
      "args": []
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
          }
        ]
      }
    }
  ]
};
