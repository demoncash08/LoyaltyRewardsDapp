import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  IHybridPaymaster,
  SponsorUserOperationDto,
  PaymasterMode,
} from "@biconomy/paymaster";
import { BiconomySmartAccount } from "@biconomy/account";
import { parseUnits, formatUnits } from "ethers/lib/utils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WalletContext from "../../context/wallet-context";
import ClaimPortalABI from "../../contract-ABI/ClaimPortalABI";
import SendTransaction from "./TransactionPopUp/SendTransaction";
import styles from "./style_claim.module.css";

const Claim = () => {
  const ctx = useContext(WalletContext);
  const [claimTokens, setClaimTokens] = useState(0);
  useEffect(() => {
    checkClaim();
  }, [claimTokens, checkClaim]);
  console.log(ctx);
  const claimPortalContract = new ethers.Contract(
    ctx.ClaimPortalAddress,
    ClaimPortalABI,
    ctx.provider
  );

  async function ClaimTheTokens() {
    if (claimTokens < 1) {
      console.log("Nothing to claim");
      return;
    }
    console.log("h");

    try {
      toast.info("Sending transaction", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      const minTx = await claimPortalContract.populateTransaction.claimTokens();

      console.log(minTx.data);
      const tx1 = {
        to: ctx.ClaimPortalAddress,
        data: minTx.data,
      };
      console.log("here before userop");
      let userOp = await ctx.smartAccount.buildUserOp([tx1]);
      console.log({ userOp });

      const biconomyPaymaster = ctx.smartAccount.paymaster;
      let paymasterServiceData = {
        mode: PaymasterMode.SPONSORED,
      };
      const paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
          userOp,
          paymasterServiceData
        );
      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
      console.log(ctx.smartAccount);
      const userOpResponse = await ctx.smartAccount.sendUserOp(userOp);
      console.log("userOpHash", userOpResponse);
      const { receipt } = await userOpResponse.wait(1);
      toast.success(`Success! Tokens claimed ${receipt.transactionHash} `, {
        position: "top-right",
        autoClose: 18000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setClaimTokens(0);
      console.log("txHash", receipt.transactionHash);
    } catch (error) {
      console.log(error);
    }
  }

  async function checkClaim() {
    console.log("in");
    const claimPortalContract = new ethers.Contract(
      ctx.ClaimPortalAddress,
      ClaimPortalABI,
      ctx.smartAccount.signer
    );
    console.log(ctx.smartAccount);
    const tokens = await claimPortalContract.userClaim(ctx.address);
    console.log(formatUnits(tokens));
    setClaimTokens(formatUnits(tokens));
  }
  checkClaim();
  return (
    <div className={styles.container}>
      <p>Available Claim = `${claimTokens}`</p>
      <button className={styles.button} onClick={checkClaim}>Check claim</button>
      <button className={styles.button} onClick={ClaimTheTokens}>Claim</button>
      <ToastContainer
        className={styles.toastContainer}
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Claim;
