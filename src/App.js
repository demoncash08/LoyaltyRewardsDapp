import * as React from "react";
import logo from "./logo.svg";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePgae from "./pages/User/Home";
import ProfilePage from "./pages/User/Profile";
import RootLayout from "./Root";
import ErrorPage from "./pages/Common/ErrorPage";
import SocialAuthUsingParticle from "./Auth/SocialAuthUsingParticle";
import ProductsList from "./pages/User/Products/ProductsList";
import { action as logoutAction } from "./components/Logout";
import {
  tokenLoader,
  action as getAddress,
  LoginPage,
} from "./Auth/AuthUtility";
import WalletContext from "./context/wallet-context";
import AdminPage from "./pages/Admin/AdminPage";
import SuperAdminPage from "./pages/SuperAdmin/SuperAdminPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: "root",
    loader: tokenLoader,
    children: [
      { index: true, element: <HomePgae /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "products", element: <ProductsList /> },
      {
        path: "login",
        element: <LoginPage />,
        action: getAddress,
      },
      { path: "logout", action: logoutAction },
      { path: "admin", element: <AdminPage /> },
      { path: "superadmin", element: <SuperAdminPage /> },
    ],
  },
]);
function App() {
  const [provider, setProvider] = React.useState(null);
  const [smartAccount, setSmartAccount] = React.useState(null);
  const [address, setAddress] = React.useState("");
  const [admin, setAdmin] = React.useState(false);
  const [superAdmin, setSuperAdmin] = React.useState(false);
  const tokenAddress = "0x82F964d6780C695F96d6786B77289DeaB1DBdf88";
  const ClaimPortalAddress = "0x893dB3eA2E162e94efeEe00c4d6b0816491c07a5";
  const DappContract = "0x951900F395c9f7b521224F06ED0cFE5d5e17e5E9";
  const PurchaseContract = "0x5809bbe1a74e2e13c5513e1a86cfe8e3f0b506e9";

  return (
    <WalletContext.Provider
      value={{
        provider: provider,
        smartAccount: smartAccount,
        address: address,
        admin: admin,
        superAdmin: superAdmin,
        tokenAddress: tokenAddress,
        ClaimPortalAddress: ClaimPortalAddress,
        DappContract: DappContract,
        PurchaseContract: PurchaseContract,
      }}
    >
      <RouterProvider router={router} />
    </WalletContext.Provider>
  );
  // return <SocialAuthUsingParticle />;
}

export default App;
