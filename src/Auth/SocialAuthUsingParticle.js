import { ParticleAuthModule, ParticleProvider } from "@biconomy/particle-auth";
import { useContext, useState } from "react";
import { IBundler, Bundler } from "@biconomy/bundler";
import {
  BiconomySmartAccount,
  BiconomySmartAccountConfig,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import { ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import { Form, useNavigate } from "react-router-dom";
import SendToken from "../components/SendToken";
import WalletContext from "../context/wallet-context";
import DappABI from "../contract-ABI/DappABI";
import ClaimPortalABI from "../contract-ABI/ClaimPortalABI";
import styles from "./login.module.css";

export default function SocialAuthUsingParticle() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [smartAccount, setSmartAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const ctx = useContext(WalletContext);
  const navigate = useNavigate();

  const particle = new ParticleAuthModule.ParticleNetwork({
    projectId: projectId,
    clientKey: clientKey,
    appId: appId,
    chainName: "polygon", //optional: current chain name, default Ethereum.
    chainId: ChainId.POLYGON_MUMBAI,
    wallet: {
      displayWalletEntry: true,
      defaultWalletEntryPosition: ParticleAuthModule.WalletEntryPosition.BR,
    },
  });

  const bundler = new Bundler({
    bundlerUrl: "your own bundler URL",

    chainId: ChainId.POLYGON_MUMBAI,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  });

  const paymaster = new BiconomyPaymaster({
    paymasterUrl: "Your own paymaster URL",
  });

  console.log(ctx);

  const connect = async () => {
    try {
      console.log("This", ctx);
      setLoading(true);
      const userInfo = await particle.auth.login();
      console.log("Logged in user:", userInfo.google_email);
      const email = userInfo.google_email;
      setEmail(userInfo.google_email);
      const particleProvider = new ParticleProvider(particle.auth);
      const web3Provider = new ethers.providers.Web3Provider(
        particleProvider,
        "any"
      );
      setProvider(web3Provider);
      const biconomySmartAccountConfig = {
        signer: web3Provider.getSigner(),
        chainId: ChainId.POLYGON_MUMBAI,
        bundler: bundler,
        paymaster: paymaster,
      };
      let biconomySmartAccount = new BiconomySmartAccount(
        biconomySmartAccountConfig
      );
      console.log("This");
      biconomySmartAccount = await biconomySmartAccount.init();
      const add = await biconomySmartAccount.getSmartAccountAddress();
      setAddress(add);
      setSmartAccount(biconomySmartAccount);
      //Context here
      console.log("First", web3Provider);
      ctx.smartAccount = biconomySmartAccount;
      ctx.provider = web3Provider;
      ctx.address = add;
      console.log("second", ctx.provider);

      localStorage.setItem("address", add);
      checkStatus();
      handleClick(email, add);
      // navigate("/profile");
    } catch (error) {
      console.error(error);
    }
  };

  const checkStatus = async () => {
    try {
      const ClaimPortalContract = new ethers.Contract(
        ctx.ClaimPortalAddress,
        ClaimPortalABI,
        ctx.provider
      );
      console.log("Token Contract", ClaimPortalContract);
      const isAdmin = await ClaimPortalContract.isAdmin(ctx.address);
      const isSuperAdmin = await ClaimPortalContract.isSuperAdmin(ctx.address);
      console.log("This section ", isAdmin);
      setIsAdmin(isAdmin);
      setIsSuperAdmin(isSuperAdmin);
      console.log("Admin Check", isAdmin, " Super Admin check", isSuperAdmin);
      ctx.admin = isAdmin;
      ctx.superAdmin = isSuperAdmin;
    } catch (error) {
      console.error("Error checking status:", error);
    }
  };
  const handleClick = async (email, address) => {
    const apiUrl = "http://localhost:1337/api/members";
    const requestBody = {
      data: {
        email: email,
        address: address,
        link: {
          id: 1,
          type: "abc",
        },
      },
    };

    try {
      const apiUrl = "http://localhost:1337/api/members";

      console.log("here", email);
      console.log("mp", address);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            email: email,
            address: address,
          },
        }),
      });
      console.log(response);

      const responseData = await response.json();
    } catch (error) {
      console.error("Error sending POST request:", error);
    }
  };

  return (
    <>
      {ctx.address && navigate("/profile")}
      <div className={styles.loginContainer}>
        <form className={styles.loginForm} action="login" method="post">
          <img
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png"
            alt="Login Illustration"
            className={styles.loginImage}
          />
          <h1>Login to WAGMI</h1>
          {!loading && !address && (
            <button className={styles.loginButton} onClick={connect}>
              Click to login
            </button>
          )}
        </form>
      </div>
      {ctx.address && navigate("/profile")}
    </>
  );
}
