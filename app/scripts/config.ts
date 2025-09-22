import path from "path";
import idl from "../../target/idl/favorites.json";
import { Favorites } from "../../target/types/favorites";

export const NETWORK = "https://api.devnet.solana.com";
export const WALLETS_DIR = "wallets";
export const WALLET_PATH = path.join(__dirname, `../${WALLETS_DIR}/user1.json`);
export const IDL = idl as Favorites;
