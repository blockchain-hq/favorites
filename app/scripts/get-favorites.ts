import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import fs from "fs";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { IDL, NETWORK, WALLET_PATH } from "./config";
import { Favorites } from "../../target/types/favorites";

const main = async () => {
  const connection = new Connection(NETWORK, "confirmed");

  // load wallet
  if (!fs.existsSync(WALLET_PATH)) {
    console.error("Wallet not found at:", WALLET_PATH);
    console.log("Run 'npm run set-favorites' first to create a wallet");
    process.exit(1);
  }

  const secretKey = JSON.parse(fs.readFileSync(WALLET_PATH, "utf8"));
  const userKeypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
  console.log("Wallet address: ", userKeypair.publicKey.toString());

  const wallet = new Wallet(userKeypair);
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  // TypeScript casting for Anchor programs
  // Without the generic type <Favorites> and casting (idl as Favorites),
  // TypeScript doesn't know about your program's specific accounts/methods.
  // This would result in: "Property 'favorites' does not exist on type 'AccountNamespace<Idl>'"
  const program = new Program<Favorites>(IDL, provider);

  const [favoritesPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("favorites"), userKeypair.publicKey.toBuffer()],
    program.programId
  );
  console.log("Favorites PDA: ", favoritesPda.toString());

  try {
    // below expression is possible by the generic type <Favorites>
    const favorites = await program.account.favorites.fetch(favoritesPda);

    console.log("Your favorites are:");
    console.log("Number: ", favorites.number.toString());
    console.log("Color: ", favorites.color);
    console.log("Hobbies: ", favorites.hobbies.join(", "));

    console.log("View on explorer:");
    console.log(
      `https://explorer.solana.com/address/${favoritesPda}?cluster=devnet`
    );
  } catch (error) {
    console.error("Error fetching favorites:", error);
    console.log(
      "💡 Run 'npm run set-favorites' first to create a favorites account"
    );
  }
};

main()
  .then(() => {
    console.log("Done");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
