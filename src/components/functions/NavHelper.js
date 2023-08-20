import { ethers } from "ethers";
import DappABI from "../../contract-ABI/DappABI";
import WalletContext from "../../context/wallet-context";
import TokenABI from "../../contract-ABI/TokenAbi";

async function checkStatus(userData) {
  const ClaimPortalContract = new ethers.Contract(
    userData.ClaimPortalContract,
    TokenABI,
    userData.provider
  );

  try {
    const isAdmin = await ClaimPortalContract.isAdmin(userData.address);
    const isSuperAdmin = await ClaimPortalContract.isSuperAdmin(
      userData.address
    );
    console.log("Admin Check", isAdmin, " Super Admin check", isSuperAdmin);
    return {
      admin: isAdmin,
      superAdmin: isSuperAdmin,
    };
  } catch (error) {
    console.error("Error checking status:", error);
    return {
      admin: false,
      superAdmin: false,
    };
  }
}

export default checkStatus;
