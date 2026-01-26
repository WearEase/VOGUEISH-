import React from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaTelegramPlane,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0e0e0e] text-gray-400 pt-16 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-gray-700">
        {/* Brand Info */}
        <div>
          <h2 className="text-3xl font-semibold tracking-wider text-white">VOGUEISH</h2>
          <p className="text-sm mt-4 max-w-xs">
            Specializing in high-quality, tailor-fit fashion. Experience our premium <strong>Home Trial</strong> service today.
          </p>
          <p className="text-sm mt-3">info@voguish.live</p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl text-white font-medium tracking-wide mb-4">Contact Us</h3>
          <p className="text-sm">8819 Ohio St. South Gate, CA 90280</p>
          <p className="text-sm mt-2">ourstudio@hello.com</p>
          <p className="text-sm mt-2">+1 386-688-3295</p>
        </div>

        {/* Policies & Socials */}
        <div>
          <h3 className="text-xl text-white font-medium tracking-wide mb-4">Policies</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
          </ul>
          <div className="flex gap-4 mt-6">
            {[FaInstagram, FaFacebookF, FaTelegramPlane, FaTwitter].map((Icon, index) => (
              <div
                key={index}
                className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
              >
                <Icon className="text-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center py-6 text-sm text-gray-500 tracking-wide">
        © 2024 VOGUEISH. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
