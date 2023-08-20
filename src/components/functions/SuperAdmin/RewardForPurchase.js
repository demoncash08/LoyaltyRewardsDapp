import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  IHybridPaymaster,
  SponsorUserOperationDto,
  PaymasterMode,
} from "@biconomy/paymaster";
import { BiconomySmartAccount } from "@biconomy/account";
import WalletContext from "../../../context/wallet-context";
import { parseUnits, formatUnits } from "ethers/lib/utils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TokenABI from "../../../contract-ABI/TokenAbi";
import ClaimPortalABI from "../../../contract-ABI/ClaimPortalABI";
import { useNavigate } from "react-router-dom";
import rewardStyles from "./rewardStyles.module.css";

function RewardForPurchase() {
  const ctx = useContext(WalletContext);
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [userAddress, setUserAddress] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [multiplier, setMultiplier] = useState("");

  const ClaimPortalContract = new ethers.Contract(
    ctx.ClaimPortalAddress,
    ClaimPortalABI,
    ctx.provider
  );

  useEffect(() => {
    if (ctx.superAdmin === false) {
      navigate("/profile");
    } else {
      // Call checkBalance immediately when ctx.address is available
      checkBalance();
    }
  }, [ctx, balance, navigate]);

  let contract;

  if (ctx.address != null && ctx.provider != null) {
    contract = new ethers.Contract(ctx.tokenAddress, TokenABI, ctx.provider);
    console.log(contract);
  }

  async function checkBalance() {
    if (contract) {
      try {
        const balance = await contract.balanceOf(ctx.ClaimPortalAddress);
        console.log("balance is ", balance);
        setBalance(formatUnits(balance)); // Update balance state
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleReward(event) {
    event.preventDefault();
    if (contract) {
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
      try {
        const minTx =
          await ClaimPortalContract.populateTransaction.addTokensAfterPurchase(
            userAddress,
            ethers.utils.parseEther(purchaseAmount),
            multiplier
          );
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
        toast.success(`Success! Tokens sent ${receipt.transactionHash} `, {
          position: "top-right",
          autoClose: 18000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log("txHash", receipt.transactionHash);
        checkBalance();
        setUserAddress(""); // Reset input fields
        setPurchaseAmount("");
        setMultiplier("");
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className={rewardStyles.rewardSection}>
    <h3>Reward user for purchase</h3>
    <h4 className={rewardStyles.portalbalance}>Portal Balance: {balance.toString()}</h4>
    <form className={rewardStyles.form} onSubmit={handleReward}>
      <label className={rewardStyles.label} htmlFor="userAddress">User Address:</label>
      <input
        className={rewardStyles.inputField}
        type="text"
        id="userAddress"
        value={userAddress}
        onChange={(event) => setUserAddress(event.target.value)}
      />
      <label className={rewardStyles.label} htmlFor="purchaseAmount">Purchase Amount:</label>
      <input
        className={rewardStyles.inputField}
        type="text"
        id="purchaseAmount"
        value={purchaseAmount}
        onChange={(event) => setPurchaseAmount(event.target.value)}
      />
      <label className={rewardStyles.label} htmlFor="multiplier">Multiplier:</label>
      <input
        className={rewardStyles.inputField}
        type="text"
        id="multiplier"
        value={multiplier}
        onChange={(event) => setMultiplier(event.target.value)}
      />
      <div className={rewardStyles.buttonContainer}>
        <button className={rewardStyles.button} type="submit">Reward User</button>
      </div>
    </form>
    <ToastContainer
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
}

export default RewardForPurchase;
