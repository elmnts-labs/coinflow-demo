use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount, TransferChecked, transfer_checked};

declare_id!("3nYFYeGungM4L5WZ9BJLsieUrmXPSrmtmmihfUyMA2Vj");

#[program]
pub mod coinflow_test {
    use super::*;

    pub fn initialize_escrow(_ctx: Context<InitializeEscrow>, amount: u64, amount_decimals: u8) -> Result<()> {
        _ctx.accounts.escrow.amount = amount;
        _ctx.accounts.escrow.amount_decimals = amount_decimals;

        Ok(())
    }

    pub fn fund_escrow(_ctx: Context<FundEscrow>) -> Result<()> {
        let transfer_accounts = TransferChecked {
            from: _ctx.accounts.payer_ta.to_account_info(),
            to: _ctx.accounts.deposit_ta.to_account_info(),
            mint: _ctx.accounts.deposit_mint.to_account_info(),
            authority: _ctx.accounts.signer.to_account_info(),
        };

        let transfer_context = CpiContext::new(
            _ctx.accounts.token_program.to_account_info(),
            transfer_accounts,
        );

        transfer_checked(transfer_context, _ctx.accounts.escrow.amount, _ctx.accounts.escrow.amount_decimals)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeEscrow<'info> {
    #[account(
        init,
        payer = signer,
        seeds = [b"escrow_deposit", deposit_mint.key().as_ref(), user.key().as_ref()],
        bump,
        space = 17
    )]
    pub escrow: Account<'info, MockEscrow>,
    #[account(
        init,
        payer = signer,
        token::mint = deposit_mint,
        token::authority = user,
        seeds = [b"escrow_deposit_ta", deposit_mint.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub deposit_ta: Account<'info, TokenAccount>,
    pub deposit_mint: Account<'info, Mint>,
    /// CHECK: This is the user account that will be the owner of the escrow
    pub user: AccountInfo<'info>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct FundEscrow<'info> {
    #[account(
        seeds = [b"escrow_deposit", deposit_mint.key().as_ref(), user.key().as_ref()],
        bump,
    )]
    pub escrow: Account<'info, MockEscrow>,
    #[account(
        seeds = [b"escrow_deposit_ta", deposit_mint.key().as_ref(), user.key().as_ref()],
        bump,
        mut
    )]
    pub deposit_ta: Account<'info, TokenAccount>,
    pub deposit_mint: Account<'info, Mint>,
    #[account(mut)]
    pub payer_ta: Account<'info, TokenAccount>,
    /// CHECK: This is the user account that will be the owner of the escrow
    pub user: AccountInfo<'info>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[account]
pub struct MockEscrow {
    pub amount: u64,
    pub amount_decimals: u8
}