import logo from "../assets/logo.png";
import { useState } from "react";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      {/* Navbar */}
      <nav className="flex justify-between items-center px-15 py-6 shadow-sm bg-white relative border-3">
        {/* Left side (desktop links) */}
        <div className="hidden md:flex space-x-20 text-black font-medium text-xl">
          <a href="/products">
            Products
          </a>
          <a href="/rent" >
            /Rent
          </a>
        </div>

        {/* Center Logo */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Cribb.Africa Logo" className="h-10 w-auto" />
          <h1 className="text-3xl font-extrabold">Cribb.Africa</h1>
        </div>

        {/* Right (desktop links + login) */}
          <div className="hidden md:flex space-x-20 text-black items-center font-medium ">
          <a href="/about" className="hover:text-black text-xl">
            About Us
          </a>
          <button className="px-8 py-3 bg-black text-sm text-white rounded-lg shadow-md">
            LOGIN
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center text-gray-800"
          onClick={() => setIsMenuOpen(true)}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Mobile Overlay Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="absolute top-0 right-0 w-2/3 h-full bg-white p-6 flex flex-col">
              {/* Close Button */}
              <button
                className="self-end mb-8"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  className="w-7 h-7 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Menu Items */}
              <div className="flex flex-col items-center space-y-6 text-lg font-medium">
                <a href="/products" onClick={() => setIsMenuOpen(false)}>
                  Products
                </a>
                <a href="/rent" onClick={() => setIsMenuOpen(false)}>
                  /Rent
                </a>
                <a href="/about" onClick={() => setIsMenuOpen(false)}>
                  About Us
                </a>
                <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                  LOGIN
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
