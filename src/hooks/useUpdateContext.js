import { useContext } from "react";
import WalletContext from "../context/wallet-context";

function useUpdateContext() {
  const ctx = useContext(WalletContext);

  const clearContext = () => {
    ctx.setSmartAccount(null);
    ctx.setProvider(null);
    ctx.setAddress("");
  };

  return clearContext;
}

export default useUpdateContext;
