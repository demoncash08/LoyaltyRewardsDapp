import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import styles from "./ProductsList.module.css";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null); // New state for error handling
  const apiUrl = "http://localhost:1337/api/products?populate=*";

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (data.data) {
          setProducts(data.data);
        }
      } catch (error) {
        setError("An error occurred while fetching data");
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className={styles.productsList}>
      {error ? (
        <p>{error}</p>
      ) : products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
};

export default ProductsList;
