import React, { useEffect, useState } from "react";
import styles from "./SalesList.module.css";

const SalesList = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await fetch("http://localhost:1337/api/sales");
      const data = await response.json();
      setSalesData(data.data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  return (
    <div className={styles.salesListContainer}>
      <h2>Sales List</h2>
      <ul>
        {salesData.map((sale) => (
          <li key={sale.id} className={styles.salesListItem}>
            <h3>Product: {sale.attributes.productName}</h3>
            <p>User Email: {sale.attributes.userEmail}</p>
            <p>Seller Email: {sale.attributes.sellerEmail}</p>
            {/* <p>Ecommerce Email: {sale.attributes.ecommerceEmail}</p> */}
            <p>Product Price: ${sale.attributes.productPrice}</p>
            {/* <p>Created At: {sale.attributes.createdAt}</p> */}
            <p>User Address: {sale.attributes.userAddress}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalesList;
