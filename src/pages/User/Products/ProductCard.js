import React, { useState, useEffect, useContext } from "react";
import styles from "./ProductCard.module.css";
import WalletContext from "../../../context/wallet-context";
import TokenABI from "../../../contract-ABI/TokenAbi";
import { ethers } from "ethers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PurchaseItemABI from "../../../contract-ABI/PurchaseItemABI";
import { parseUnits } from "ethers/lib/utils";
import {
  IHybridPaymaster,
  SponsorUserOperationDto,
  PaymasterMode,
} from "@biconomy/paymaster";

const ProductCard = ({ product }) => {
  const ctx = useContext(WalletContext);

  const url = "http://localhost:1337";
  const part2 = product.attributes.image.data.attributes.url;
  const imgUrl = url + part2;

  const tokenContract = new ethers.Contract(
    ctx.tokenAddress,
    TokenABI,
    ctx.provider
  );
  const purchaseContract = new ethers.Contract(
    ctx.PurchaseContract,
    PurchaseItemABI,
    ctx.provider
  );

  async function purchaseItem() {
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

      const amount = parseUnits(product.attributes.price.toString()); // Convert input to appropriate units
      console.log(amount);
      const tx = await tokenContract.populateTransaction.transfer(
        ctx.PurchaseContract,
        amount
      );
      const tx1 = {
        to: ctx.tokenAddress,
        data: tx.data,
      };
      console.log("here before userop");
      console.log(ctx.smartAccount.buildUserOp);
      let userOp = await ctx.smartAccount.buildUserOp([tx1]);
      console.log({ userOp });
      const biconomyPaymaster = ctx.smartAccount.paymaster;
      let paymasterServiceData = {
        mode: PaymasterMode.SPONSORED,
      };
      let paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
          userOp,
          paymasterServiceData
        );

      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
      console.log(ctx.smartAccount);
      const userOpResponse = await ctx.smartAccount.sendUserOp(userOp);
      console.log("userOpHash", userOpResponse);
      console.log("This");
      const { receipt } = await userOpResponse.wait(1);
      console.log("txHash", receipt.transactionHash);
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
      console.log("Transaction receipt:", receipt);
    } catch (error) {
      console.error("Error purchasing product:", error);
    }
  }

  return (
    <div className={styles.productCard}>
      {product.attributes.image && (
        <img
          src={imgUrl}
          alt={product.attributes.title}
          className={styles.productImage}
        />
      )}
      <h2 className={styles.name}>{product.attributes.title}</h2>
      <p className={styles.price}>Price: {product.attributes.price} WAGMI</p>
      <p className={styles.description}>{product.attributes.description}</p>

      {/* <p>Quantity: {product.attributes.quantity}</p>
      <p>Seller Email: {product.attributes.sellerEmail}</p>
      <p>Wallet Address: {product.attributes.walletAddress}</p>
      <p>Created At: {createdAt}</p> */}

      {ctx.address && (
        <button className={styles.buyButton} onClick={purchaseItem}>
          Buy
        </button>
      )}

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
};

export default ProductCard;
