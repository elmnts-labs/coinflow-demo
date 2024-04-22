use anchor_lang::prelude::*;

declare_id!("3nYFYeGungM4L5WZ9BJLsieUrmXPSrmtmmihfUyMA2Vj");

#[program]
pub mod coinflow_test {
    use super::*;

    pub fn greet(_ctx: Context<Initialize>) -> Result<()> {
        msg!("GM!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
