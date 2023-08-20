import { useContext, useEffect } from "react";
import { Link,NavLink, useRouteLoaderData } from "react-router-dom";
import WalletContext from "../context/wallet-context";
import styles from "./Nav.module.css";

const NavigationBar = () => {
  const address = useRouteLoaderData("root");
  const ctx = useContext(WalletContext);

  useEffect(() => {
    if (address == null || address.length <= 3) {
      console.log("Navigation", ctx);
      ctx.address = "";
      ctx.smartAccount = null;
      ctx.provider = null;
    }
  }, [address, ctx.address]);

  return (
    <nav className={styles.nav}>
      <div className={styles.leftSection}>
        <div className={styles.logo}>
          <Link to="/"><img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fk-plus_3b0baa.png" alt="Company Logo" /></Link>
        </div>
        <ul className={styles.navLinks}>
          <li>
            <NavLink to="" activeClassName={styles.active} end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="products" activeClassName={styles.active}>
              Products
            </NavLink>
          </li>
        </ul>
      </div>
      <div className={styles.rightSection}>
        <ul className={styles.navLinks}>
          {!ctx.address ? (
            <>
              <li>
                <NavLink to="login" activeClassName={styles.active}>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="profile" activeClassName={styles.active}>
                  Profile
                </NavLink>
              </li>
            </>
          ) : (
            <>
              {ctx.superAdmin && (
                <li>
                  <NavLink to="superAdmin" activeClassName={styles.active}>
                    Super Admin
                  </NavLink>
                </li>
              )}
              {(ctx.admin || ctx.superAdmin) && (
                <li>
                  <NavLink to="admin" activeClassName={styles.active}>
                    Admin
                  </NavLink>
                </li>
              )}
              {(ctx.admin || ctx.superAdmin || ctx.profile) && (
                <li>
                  <NavLink to="profile" activeClassName={styles.active}>
                    profile
                  </NavLink>
                </li>
              )}
              <li>
                <form action="logout" method="post">
                  <button className={styles.formButton}>Logout</button>
                </form>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
