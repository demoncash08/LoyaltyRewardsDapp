import React from "react";
import styles from "./TransactionHistoryMenu.module.css"; // Import your custom styles for TransactionHistoryMenu

const TransactionHistoryMenu = ({ transactions, isOpen, onClose }) => {
  return (
    <div className={`${styles.menu} ${isOpen ? styles.open : ""}`}>
      <button className={styles.closeButton} onClick={onClose}>
        Close
      </button>
      <h3>Transaction History</h3>
      <ul className={styles.transactionList}>
        {transactions.map((transaction, index) => (
          <li key={index} className={styles.transactionItem}>
            {/* Display transaction details here */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistoryMenu;
