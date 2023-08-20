import { useState } from "react";
import { ethers } from "ethers";
import TokenABI from "../contract-ABI/TokenAbi";
import {
  IHybridPaymaster,
  SponsorUserOperationDto,
  PaymasterMode,
} from "@biconomy/paymaster";
import { BiconomySmartAccount } from "@biconomy/account";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { parseUnits } from "ethers/lib/utils";

const tokenAddress = "0x82F964d6780C695F96d6786B77289DeaB1DBdf88";
function SendToken(props) {
  const [minted, setMinted] = useState(false);

  const handleMint = async () => {
    console.log(props.smartAccount);
    const contract = new ethers.Contract(
      tokenAddress,
      TokenABI,
      props.provider
    );
    try {
      toast.info("Minting your NFT...", {
        position: "top-right",
        autoClose: 15000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      const minTx = await contract.populateTransaction.transfer(
        "0xc5c56659d845c90250dce3ac6bab1ab1b0d81cb5",
        parseUnits("69")
      );
      console.log(minTx.data);
      const tx1 = {
        to: tokenAddress,
        data: minTx.data,
      };
      console.log("here before userop");
      console.log(props.smartAccount.buildUserOp);
      let userOp = await props.smartAccount.buildUserOp([tx1]);
      console.log({ userOp });
      const biconomyPaymaster = props.smartAccount.paymaster;
      let paymasterServiceData = {
        mode: PaymasterMode.SPONSORED,
      };
      const paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
          userOp,
          paymasterServiceData
        );

      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
      console.log(props.smartAccount);
      const userOpResponse = await props.smartAccount.sendUserOp(userOp);
      console.log("userOpHash", userOpResponse);
      console.log("This");
      const { receipt } = await userOpResponse.wait(1);
      console.log("txHash", receipt.transactionHash);
      setMinted(true);
      toast.success(
        `Success! Here is your transaction:${receipt.transactionHash} `,
        {
          position: "top-right",
          autoClose: 18000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
    } catch (error) {
      console.error(error);
      console.log(error);
    }
  };
  return (
    <>
      {tokenAddress && <button onClick={handleMint}>Mint NFT</button>}
      {minted && (
        <a href={`https://mumbai.polygonscan.com/${tokenAddress}`}>
          {" "}
          Click to view minted nfts for smart account
        </a>
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
    </>
  );
}

export default SendToken;
