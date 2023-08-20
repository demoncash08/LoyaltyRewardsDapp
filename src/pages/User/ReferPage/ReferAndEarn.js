import React, { useState } from "react";
import styles from "./ReferAndEarn.module.css";

const ReferAndEarn = () => {
  const [showReferralLink, setShowReferralLink] = useState(false);
  const referralLink = "https://example.com/referral/user123";
  const referralRules = [
    "Refer a friend and earn 10% of their first purchase amount.",
    "Your friend must use your referral link to sign up and make a purchase.",
    "You'll receive the referral bonus once your friend's purchase is confirmed.",
  ];

  const handleToggle = () => {
    setShowReferralLink(!showReferralLink);
  };

  return (
    <div className={styles.container}>
      <h2>Refer and Earn</h2>
      <button className={styles.toggleButton} onClick={handleToggle}>
        {showReferralLink ? "Hide Referral Info" : "Show Referral Info"}
      </button>
      {showReferralLink && (
        <div>
          <div className={styles.referralRules}>
            <h3>Referral Rules:</h3>
            <ul>
              {referralRules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>
          <div className={styles.referralLink}>
            <p>Your Referral Link:</p>
            <input type="text" value={referralLink} readOnly />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferAndEarn;
