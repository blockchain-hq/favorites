# Solana Favorites Program & Client

A comprehensive educational Solana smart contract example that demonstrates user data storage using Program Derived Addresses (PDAs). This repository includes both the on-chain program and complete client-side implementation with TypeScript scripts.

## Repository Purpose

This project serves as an educational resource for learning Solana development, showcasing:

- **Smart Contract Development**: A Rust-based Anchor program for storing user preferences
- **Client Integration**: TypeScript scripts demonstrating how to interact with Solana programs
- **PDA Usage**: Practical implementation of Program Derived Addresses for user-specific data storage
- **Complete Workflow**: From program deployment to client interaction

## 📋 Table of Contents

- [Smart Contract Overview](#-smart-contract-overview)
- [Available Methods](#-available-methods)
- [Client Scripts](#-client-scripts)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Client](#-running-the-client)
- [Development Workflow](#-development-workflow)
- [Program Architecture](#-program-architecture)
- [Educational Resources](#educational-resources)

## Smart Contract Overview

The Favorites program is a Solana smart contract built with the Anchor framework that allows users to store and manage their personal preferences on-chain. Each user gets their own unique data account derived from their public key using Program Derived Addresses (PDAs).

**📍 Deployed Program ID (Devnet)**: `CeHmxb8uBgxJfYMM1uyo6XxBXszDreP9VZsB5mpUbyvE`

You can interact with this deployed program directly or deploy your own version.

### Key Features:

- **User-specific Storage**: Each user has their own favorites account at a deterministic address
- **Data Persistence**: Store favorite number, color, and hobbies on-chain
- **Account Management**: Automatic account creation and deletion with rent refunds
- **Gas Efficiency**: Optimized for minimal transaction costs

### Data Structure:

```rust
pub struct Favorites {
    pub number: u64,           // User's favorite number
    pub color: String,         // Favorite color (max 50 chars)
    pub hobbies: Vec<String>,  // List of hobbies (max 5 items, 50 chars each)
}
```

## Available Methods

### 1. `set_favorite`

**Purpose**: Store or update user's favorite data

**Parameters**:

- `number: u64` - Favorite number
- `color: String` - Favorite color (max 50 characters)
- `hobbies: Vec<String>` - Array of hobbies (max 5 items, 50 chars each)

**Behavior**:

- Creates account if it doesn't exist (using `init_if_needed`)
- Updates existing data if account already exists
- User pays for account creation (rent)
- Logs transaction details for debugging

### 2. `delete_favorites`

**Purpose**: Delete user's favorites account and reclaim rent

**Parameters**: None (uses signer's account)

**Behavior**:

- Closes the user's favorites account
- Returns all rent lamports to the user
- Account becomes inaccessible after deletion

## Client Scripts

The client implementation provides ready-to-use TypeScript scripts for interacting with the smart contract:

### Core Scripts

| Script                | Purpose                   | Usage                      |
| --------------------- | ------------------------- | -------------------------- |
| `set-favorites.ts`    | Store favorites data      | `npm run set-favorites`    |
| `get-favorites.ts`    | Retrieve user's favorites | `npm run get-favorites`    |
| `delete-favorites.ts` | Delete favorites account  | `npm run delete-favorites` |

### Utility Scripts

| File         | Purpose                           |
| ------------ | --------------------------------- |
| `wallet.ts`  | Wallet creation and management    |
| `airdrop.ts` | Devnet SOL airdrop functionality  |
| `config.ts`  | Network and program configuration |

### Client Features:

- **Automatic Wallet Management**: Creates and persists wallets locally
- **Network Handling**: Configured for Solana Devnet with easy switching
- **Balance Management**: Automatic SOL airdrop when balance is low
- **Transaction Monitoring**: Explorer links for transaction verification
- **Error Handling**: Comprehensive error management and user feedback

## 🏗 Project Structure

```
favorites/
├── programs/
│   └── favorites/
│       └── src/
│           └── lib.rs              # Smart contract source code
├── app/
│   ├── scripts/
│   │   ├── set-favorites.ts        # Set user favorites
│   │   ├── get-favorites.ts        # Retrieve favorites
│   │   ├── delete-favorites.ts     # Delete favorites
│   │   ├── wallet.ts               # Wallet utilities
│   │   ├── airdrop.ts              # SOL airdrop helper
│   │   └── config.ts               # Configuration
│   ├── wallets/                    # Generated wallet files
│   └── package.json                # Client dependencies
├── target/
│   ├── idl/
│   │   └── favorites.json          # Generated IDL
│   └── types/
│       └── favorites.ts            # TypeScript types
├── tests/
│   └── favorites.ts                # Anchor tests
├── Anchor.toml                     # Anchor configuration
└── Cargo.toml                      # Rust dependencies
```

## 🔧 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v16 or later)
- **Rust** (latest stable version)
- **Solana CLI** (v1.14 or later)
- **Anchor CLI** (v0.31.1 or later)
- **pnpm** or **npm** package manager

### Installation:

Install Rust, Solana CLI, and Anchor CLI following their respective official installation guides.

## 🚀 Installation & Setup

1. **Clone the repository**:

```bash
git clone <repository-url>
cd favorites
```

2. **Install dependencies**:

```bash
# Install root dependencies
pnpm install

# Install client dependencies
cd app
pnpm install
cd ..
```

3. **Build the program**:

```bash
anchor build
```

4. **Deploy to Devnet** (optional):

```bash
# Configure Solana CLI for devnet
solana config set --url devnet

# Deploy the program
anchor deploy
```

## 🎮 Running the Client

### Quick Start Example

1. **Set favorites** (creates wallet if needed):

```bash
cd app
npm run set-favorites
```

2. **View your favorites**:

```bash
npm run get-favorites
```

3. **Delete favorites** (reclaims rent):

```bash
npm run delete-favorites
```

### Customizing Data

Edit the values in `app/scripts/set-favorites.ts`:

```typescript
// Line 71 - Modify these values
main(42, "blue", ["programming", "gaming", "reading"]);
```

### Example Output:

```
Wallet address: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHU
Balance: 2 SOL
Favorites PDA: 8YxKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHU

Setting favorites:
  Number: 42
  Color: blue
  Hobbies: programming, gaming, reading

Transaction successful!
Signature: 5j7...abc
View on explorer: https://explorer.solana.com/tx/5j7...abc?cluster=devnet
```

## 🔄 Development Workflow

### 1. Smart Contract Development

```bash
# Make changes to programs/favorites/src/lib.rs
anchor build                    # Compile the program
anchor test                     # Run tests
anchor deploy                   # Deploy to configured network
```

### 2. Client Development

```bash
cd app
# Modify scripts in app/scripts/
npm run set-favorites          # Test your changes
npm run get-favorites          # Verify data storage
```

### 3. Testing Flow

```bash
# Test complete workflow
npm run set-favorites          # Store data
npm run get-favorites          # Verify storage
npm run delete-favorites       # Clean up
npm run get-favorites          # Verify deletion
```

## 🏛 Program Architecture

### Program Derived Addresses (PDAs)

The program uses PDAs to create deterministic addresses for user data:

```rust
// PDA derivation
seeds = [b"favorites", user.key().as_ref()]
```

This ensures:

- **Deterministic**: Same user always gets the same account address
- **Unique**: Each user has their own isolated data storage
- **Secure**: Only the user can modify their own data

### Account Structure

```rust
#[account]
#[derive(InitSpace)]
pub struct Favorites {
    pub number: u64,              // 8 bytes
    pub color: String,            // 4 + 50 bytes (max)
    pub hobbies: Vec<String>,     // 4 + (5 * (4 + 50)) bytes (max)
}
// Total: ~324 bytes + 8 bytes discriminator
```

### Security Features

- **Signer Verification**: Only account owners can modify their data
- **PDA Validation**: Ensures data integrity through seed verification
- **Rent Management**: Automatic rent payment and reclamation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues:

**"Program not deployed"**

```bash
anchor deploy  # Deploy the program first
```

**"Insufficient funds"**

- The scripts automatically request airdrops on devnet
- For mainnet, ensure your wallet has sufficient SOL

**"Account not found"**

- Run `set-favorites` first to create the account
- Check if you're using the correct wallet

**"Transaction failed"**

- Check Solana network status
- Verify program ID in `Anchor.toml` matches deployed program
- Ensure sufficient SOL for transaction fees

# Educational Resources

- [Solana Bootcamp](https://www.youtube.com/watch?v=amAq-WHAFs8&list=PLilwLeBwGuK7HN8ZnXpGAD9q6i4syhnVc)
- [How to get the correct declare_id in Solana Anchor Project](https://medium.com/@cryptowikihere/how-to-get-the-correct-declare-id-in-solana-anchor-project-ade9af0cf9ba)
- [Solana Playground](https://beta.solpg.io/)
- [A simple introduction to Solana accounts, rent, and PDAs](https://www.youtube.com/watch?v=jjEZBmWI1S4)
