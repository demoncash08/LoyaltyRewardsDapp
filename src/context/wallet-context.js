import * as React from "react";
const WalletContext = React.createContext({
  provider: null,
  smartAccount: null,
  address: "",
  admin: false,
  superAdmin: false,
  tokenAddress: "0x82F964d6780C695F96d6786B77289DeaB1DBdf88",
  ClaimPortalAddress: "0x893dB3eA2E162e94efeEe00c4d6b0816491c07a5",
  DappContract: "0x951900F395c9f7b521224F06ED0cFE5d5e17e5E9",
  PurchaseContract: "0x5809bbe1a74e2e13c5513e1a86cfe8e3f0b506e9",
});

export default WalletContext;
