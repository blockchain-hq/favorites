import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";

import { requestAirdrop } from "./airdrop";
import { getOrCreateWallet } from "./wallet";
import { IDL, NETWORK, WALLET_PATH } from "./config";

const main = async (
  favNumber: number,
  favColor: string,
  favHobbies: string[]
) => {
  const connection = new Connection(NETWORK, "confirmed");

  const userKeypair = await getOrCreateWallet(connection, WALLET_PATH);

  // check balance
  console.log("Wallet address: ", userKeypair.publicKey.toString());
  const balance = await connection.getBalance(userKeypair.publicKey);
  console.log("Balance: ", balance / anchor.web3.LAMPORTS_PER_SOL, "SOL");

  if (balance === 0) {
    console.log("Balance is 0, requesting another airdrop...");
    await requestAirdrop(
      connection,
      userKeypair.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
  }

  const wallet = new Wallet(userKeypair);
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  const program = new Program(IDL, provider);

  const [favoritesPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("favorites"), userKeypair.publicKey.toBuffer()],
    program.programId
  );
  console.log("Favorites PDA: ", favoritesPda.toString());

  const number = new anchor.BN(favNumber);
  const color = favColor;
  const hobbies = favHobbies;

  console.log("\n Setting favorites:");
  console.log("  Number:", number.toString());
  console.log("  Color:", color);
  console.log("  Hobbies:", hobbies.join(", "));

  const tx = await program.methods
    .setFavorite(number, color, hobbies)
    .accounts({
      user: userKeypair.publicKey,
      favorites: favoritesPda,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("\nTransaction successful!");
  console.log("Signature:", tx);
  console.log("View on explorer:");
  console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  console.log(
    `https://explorer.solana.com/address/${favoritesPda}?cluster=devnet`
  );
};

main(2, "black", ["reading", "coding", "swimming"])
  .then(() => {
    console.log("Done");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
