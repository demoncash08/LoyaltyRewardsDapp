import { useContext, useEffect, useState } from "react"; // Import useState
import WalletContext from "../../context/wallet-context";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { parseUnits, formatUnits } from "ethers/lib/utils";
import TokenABI from "../../contract-ABI/TokenAbi";
import ClaimPortalABI from "../../contract-ABI/ClaimPortalABI";
import Claim from "../../components/functions/Claim";
import TransactionHistoryMenu from "./TransactionHistoryMenu";
import styles from "./ProfilePage.module.css";
import ReferAndEarn from "./ReferPage/ReferAndEarn";

const ProfilePage = () => {
  const ctx = useContext(WalletContext);
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (ctx.address.length === 0) {
      navigate("/login");
    } else {
      // Call checkBalance immediately when ctx.address is available
      // checkBalance();
      fetchTransactions(); // Move it here
    }
  }, [ctx.address, navigate]);

  let contract;
  let claimPortal;
  if (ctx.address != null && ctx.provider != null) {
    contract = new ethers.Contract(ctx.tokenAddress, TokenABI, ctx.provider);
  }

  async function checkBalance() {
    if (contract) {
      try {
        const balance = await contract.balanceOf(ctx.address);
        console.log("balance is ", balance);
        setBalance(formatUnits(balance)); // Update balance state
      } catch (error) {
        console.log(error);
      }
    }
  }
  async function fetchTransactions() {
    if (contract && ctx.address) {
      try {
        const latestBlockNumber = await ctx.provider.getBlockNumber();
        const blockChunkSize = 10; // Adjust this value as needed
        let fromBlock = latestBlockNumber - blockChunkSize + 1;
        let toBlock = latestBlockNumber;
        console.log("Statt");
        const receivedTransfers = [];
        while (fromBlock > 0) {
          const transfers = await contract.queryFilter(
            contract.filters.Transfer(null, ctx.address),
            fromBlock,
            toBlock
          );
          receivedTransfers.push(...transfers);
          fromBlock -= blockChunkSize;
          toBlock -= blockChunkSize;
        }

        console.log("tnxxx", receivedTransfers);
        // Now you can set the receivedTransfers state
        setTransactions(receivedTransfers);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
  }

  fetchTransactions();

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h2 className={styles.pageTitle}>User Profile</h2>
        {balance !== null && (
          <p className={styles.balance}>Balance: {balance.toString()} tokens</p>
        )}
        <p>Wallet address= {ctx.address}</p>
      </div>

      {contract && <Claim />}

      <div className={styles.profilePage}>
        <button
          className={styles.toggleButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          Toggle Transaction History
        </button>

        <TransactionHistoryMenu
          transactions={transactions}
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />
      </div>

      <div className={styles.referSection}>
        <ReferAndEarn />
      </div>
    </div>
  );
};

export default ProfilePage;
