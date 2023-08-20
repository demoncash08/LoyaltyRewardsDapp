import { useContext, useState } from "react";
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
import superAdminStyles from "./superAdminStyles.module.css"

function SuperAdminPortal() {
  const ctx = useContext(WalletContext);
  const ClaimPortalContract = new ethers.Contract(
    ctx.ClaimPortalAddress,
    ClaimPortalABI,
    ctx.provider
  );

  const [adminAddress, setAdminAddress] = useState("");
  const [checkisAdmin, setCheckisAdmin] = useState("");

  async function checkAdmin() {
    if (checkisAdmin.length < 4) {
      console.log("Wrong address");
      return;
    }
    const result = await ClaimPortalContract.isAdmin(checkisAdmin);
    console.log(result);
  }

  async function addAdmin() {
    if (adminAddress.length < 4) {
      console.log("Wrong address");
      return;
    }
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
      const minTx = await ClaimPortalContract.populateTransaction.addAdmin(
        adminAddress
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
      toast.success(`Success! Admin Added ${receipt.transactionHash} `, {
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
      setAdminAddress("");
    } catch (error) {
      console.log(error);
    }
  }

  async function removeAdmin() {
    if (adminAddress.length < 4) {
      console.log("Wrong address");
      return;
    }
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
      const minTx = await ClaimPortalContract.populateTransaction.removeAdmin(
        adminAddress
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
      toast.success(`Success! Admin Removed ${receipt.transactionHash} `, {
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
      setAdminAddress("");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={superAdminStyles.outerbox}>
    <div className={superAdminStyles.adminSection}>
      <label className={superAdminStyles.label} htmlFor="checkAdmin">Admin Address:</label>
      <input
        className={superAdminStyles.inputField}
        type="text"
        id="checkAdmin"
        value={checkisAdmin}
        onChange={(event) => setCheckisAdmin(event.target.value)}
      />
      <button className={superAdminStyles.button} onClick={checkAdmin}>Check Admin</button>
    </div>
    <div className={superAdminStyles.adminSection}>
      <label className={superAdminStyles.label} htmlFor="adminAddress">Admin Address:</label>
      <input
        className={superAdminStyles.inputField}
        type="text"
        id="adminAddress"
        value={adminAddress}
        onChange={(event) => setAdminAddress(event.target.value)}
      />
      <div className={superAdminStyles.buttonContainer}>
        <button className={superAdminStyles.button} onClick={addAdmin}>Add Admin</button>
        <button className={superAdminStyles.button} onClick={removeAdmin}>Remove Admin</button>
      </div>
    </div>
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

export default SuperAdminPortal;
