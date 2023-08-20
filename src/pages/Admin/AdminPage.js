import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import TokenABI from "../../contract-ABI/TokenAbi";
import WalletContext from "../../context/wallet-context";
import { parseUnits, formatUnits } from "ethers/lib/utils";
import SendToken from "../../components/functions/Admin/SendTokens";
import styles from "./styles.module.css";

function AdminPage() {
  const ctx = useContext(WalletContext);
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [allowance, setAllownce] = useState(0);

  useEffect(() => {
    if (ctx.admin === false && ctx.superAdmin === false) {
      navigate("/profile");
    } else {
      // Call checkBalance immediately when ctx.address is available
      checkBalance();
      checkAllowance();
    }
  }, [ctx, balance, allowance, navigate]);

  let contract;
  let claimPortal;
  if (ctx.address != null && ctx.provider != null) {
    contract = new ethers.Contract(ctx.tokenAddress, TokenABI, ctx.provider);
    console.log(contract);
  }

  async function checkBalance() {
    if (contract) {
      try {
        const balance = await contract.balanceOf(ctx.address);
        console.log("balance is ", balance);
        setBalance(balance / 1e18); // Update balance state
      } catch (error) {
        console.log(error);
      }
    }
  }
  async function checkAllowance() {
    if (contract) {
      try {
        const allowance = await contract.allowance(
          ctx.address,
          ctx.DappContract
        );
        console.log("allownce is ", formatUnits(allowance));
        setAllownce(formatUnits(allowance)); // Update balance state
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className={styles.adminPageSection}>
      <h1 className={styles.sectionTitle}>Admin page</h1>
      {console.log(ctx.address)}
      {contract && (
        <>
          {balance !== null && (
            <p className={styles.balanceAllowance}>Balance = {balance.toString()}</p>
          )}
          <p className={styles.balanceAllowance}>Allowance = {allowance.toString()}</p>
        </>
      )}
      <div className={styles.componentsContainer}>
        <SendToken />
      </div>
    </div>

  );
}

export default AdminPage;
