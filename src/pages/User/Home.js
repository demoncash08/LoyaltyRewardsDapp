import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the carousel styles
import "./HomePgae.css"; // Import your custom CSS for styling
import ProductsList from "./Products/ProductsList";

function HomePgae() {
  return (
    <>
      <nav>{/* Your Navbar Content */}</nav>
      <Carousel autoPlay={true} interval={3000} infiniteLoop={true}>
        <div className="slider-image">
          <img src="../images/lyl.jpg" alt="Image 1" />
        </div>
        <div className="slider-image">
          <img src="../images/eco.jpg" alt="Image 2" />
        </div>
        <div className="slider-image">
          <img src="../images/rfr.jpg" alt="Image 3" />
        </div>
        {/* Add more divs with images as needed */}
      </Carousel>
      <h1 className="heading">Products</h1>
      <ProductsList />
    </>
  );
}

export default HomePgae;
