import { useContext, useEffect, useState } from "react"; // Import useState
import WalletContext from "../../context/wallet-context";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import TokenABI from "../../contract-ABI/TokenAbi";
import SuperAdminPortal from "../../components/functions/SuperAdmin/SuperAdminPortal";
import RewardForPurchase from "../../components/functions/SuperAdmin/RewardForPurchase";
import styles from "./style.module.css";
import SalesList from "./SalesList";
function SuperAdminPage() {
  const ctx = useContext(WalletContext);
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (ctx.superAdmin === false) {
      navigate("/profile");
    } else {
      // Call checkBalance immediately when ctx.address is available
      checkBalance();
    }
  }, [ctx, balance, navigate]);

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
  return (
    <div className={styles.superAdminSection}>
      <h2 className={styles.sectionTitle}>Super admin</h2>
      {contract && (
        <p className={styles.balance}>
          {balance !== null && `Balance = ${balance.toString()}`}
        </p>
      )}
      <div className={styles.componentsContainer}>
        <SuperAdminPortal />
        <RewardForPurchase />
      </div>
      <SalesList />
    </div>
  );
}

export default SuperAdminPage;
