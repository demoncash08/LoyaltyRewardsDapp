import { useContext } from "react";
import WalletContext from "../context/wallet-context";
function LogoutContext() {
  const ctx = useContext(WalletContext);

  // Clear context values by updating the state
  ctx.smartAccount = null;
  ctx.provider = null;
  ctx.address("");
  ctx.admin = false;
  ctx.superAdmin = false;
  return <></>;
}
export default LogoutContext;
