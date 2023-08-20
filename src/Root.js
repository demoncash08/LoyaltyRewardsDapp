import { Outlet } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";

function RootLayout() {
  return (
    <>
      <NavigationBar />
      <Outlet />
    </>
  );
}

export default RootLayout;
