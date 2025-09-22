import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import fs from "fs";
import { IDL, NETWORK, WALLET_PATH } from "./config";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { Favorites } from "../../target/types/favorites";

const main = async () => {
  const connection = new Connection(NETWORK, "confirmed");

  // load wallet
  if (!fs.existsSync(WALLET_PATH)) {
    console.error(
      "Wallet not found! Run 'npm run set-favorites' first to create a wallet"
    );
    process.exit(1);
  }

  const secretKey = JSON.parse(fs.readFileSync(WALLET_PATH, "utf8"));
  const userKeypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
  console.log("Wallet address: ", userKeypair.publicKey.toString());

  const wallet = new Wallet(userKeypair);
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  const program = new Program(IDL, provider);

  // derive PDA
  const [favoritesPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("favorites"), userKeypair.publicKey.toBuffer()],
    program.programId
  );
  console.log("Favorites PDA: ", favoritesPda.toString());

  console.log("\n Deleting favorites:");

  const tx = await program.methods.deleteFavorites().rpc();

  console.log("\nTransaction successful!");
  console.log("Signature:", tx);
  console.log("Rent refunded to your wallet");
  console.log("View on explorer:");
  console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  console.log(
    `https://explorer.solana.com/address/${favoritesPda}?cluster=devnet`
  );
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
