#![allow(deprecated)]
use anchor_lang::prelude::*;

// run `anchor build` and `anchor keys list` to get the program's public key
declare_id!("CeHmxb8uBgxJfYMM1uyo6XxBXszDreP9VZsB5mpUbyvE"); // program's public key

// anchor adds 8 bytes discriminator to each account to identify the account type
pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;
pub const SEED: &[u8] = b"favorites";

#[program] // module containing program's instructions
pub mod favorites {
    use super::*;

    pub fn set_favorite(
        ctx: Context<SetFavorites>,
        number: u64,
        color: String,
        hobbies: Vec<String>,
    ) -> Result<()> {
        let user_pubkey = ctx.accounts.user.key();
        
        // logs are visible in transaction logs on explorer but are not stored on-chain
        // so after the transaction becomes old enough, they may get pruned
        msg!(
            "Hello, {}! Welcome to Program {}",
            user_pubkey,
            ctx.program_id
        );
        msg!("You are setting following favorites:");
        msg!("Number: {}", number);
        msg!("Color: {}", color);
        msg!("Hobbies: {:?}", hobbies);

        // since the account could be new, `set_inner` is used to ensure proper initialization rather than setting the fields individually
        ctx.accounts.favorites.set_inner(Favorites {
            number,
            color,
            hobbies,
        });
        return Ok(());
    }

    pub fn delete_favorites(ctx: Context<DeleteFavorites>) -> Result<()> {
        let user_pubkey = ctx.accounts.user.key();
        msg!("Goodbye, {}! Your favorites have been deleted.", user_pubkey);
        Ok(())
    }
}

#[account] // account data structure, data is stored in an account
#[derive(InitSpace)] // automatically calculates space needed for account
pub struct Favorites {
    pub number: u64,

    #[max_len(50)]
    pub color: String,

    #[max_len(5, 50)] // max 5 items, each max 50 chars
    pub hobbies: Vec<String>,
}

#[derive(Accounts)]
pub struct SetFavorites<'info> {
    // 'mut' means instructions are allowed to modify this account data
    // https://docs.rs/anchor-lang/latest/anchor_lang/derive.Accounts.html
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init_if_needed, // creates the account if it doesn't exist (make sure to add init-if-needed to the dependencies)
        payer = user, // user pays for the account creation
        space = ANCHOR_DISCRIMINATOR_SIZE + Favorites::INIT_SPACE, // space needed for the account
        seeds = [SEED, user.key().as_ref()], // seeds for PDA
        bump // bump for PDA
    )]
    pub favorites: Account<'info, Favorites>,

    pub system_program: Program<'info, System>, // required for creating accounts
}

#[derive(Accounts)]
pub struct DeleteFavorites<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        close = user, // close the account and send remaining lamports to user
        seeds = [SEED, user.key().as_ref()],
        bump
    )]
    pub favorites: Account<'info, Favorites>,
}

// how this program works
// 1. user calls `set_favorite` instruction
// 2. solana finds/creates their PDA-based favorites account
// 3. the program stores the data in the account
// 4. each user has their own unique favorites account at a deterministic address derived from their public key
