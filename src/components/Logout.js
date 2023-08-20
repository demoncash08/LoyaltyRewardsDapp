import { useContext } from "react";
import { redirect } from "react-router-dom";
import WalletContext from "../context/wallet-context";

export function action() {
  localStorage.removeItem("address");
  return redirect("/");
}
