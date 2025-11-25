import React from "react";
import logo from "../../assets/logo/UlinzingaUlinzinga-2.png";
import { Link } from "react-router-dom";
// import instagramIcon from "../../assets/icons/instagram.svg";
// import facebookIcon from "../../assets/icons/facebook.svg";
// import twitterIcon from "../../assets/icons/twitter.svg";

function Footer() {
  return (
    <div className="bg-black text-white py-12 pt-12 px-6 flex flex-col items-center space-y-3">
      <img src={logo} alt="Ulinzinga Logo" className="h-16" />
      <div className="mt-4 text-xs flex space-x-6 items-center">
        <Link to="/">Home</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/how-it-works">How it works</Link>
        <Link to="/contact">Contact us</Link>
      </div>
      <div className="mt-4 flex space-x-4 items-center">
        <img src="" alt="Instagram" className="h-5 w-5" />
        <img src="" alt="Facebook" className="h-5 w-5" />
        <img src="" alt="Twitter" className="h-5 w-5" />
      </div>
      <div className="mt-4 text-xs flex space-x-4 items-center">
        <span>Privacy Policies</span>
        <span className="text-base">|</span>
        <span>Terms and Conditions</span>
      </div>
    </div>
  );
}

export default Footer;
