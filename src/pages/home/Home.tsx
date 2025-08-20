import React, { useState } from "react";
import heroImg from "../../assets/hero.jpg";
import logo from "../../assets/logo.png";

export const Home: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logos = ["/hm.png", "/obey.png", "/shopify.png", "/lacoste.png"];

  return (
    <div className="font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 shadow-sm bg-white relative">
        {/* Left side (desktop links) */}
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <a href="/products" className="hover:text-black">
            Products
          </a>
          <a href="/rent" className="hover:text-black">
            /Rent
          </a>
        </div>

        {/* Center Logo */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Cribb.Africa Logo" className="h-8 w-auto" />
          <h1 className="text-xl font-bold">Cribb.Africa</h1>
        </div>

        {/* Right (desktop links + login) */}
        <div className="hidden md:flex space-x-6 items-center">
          <a href="/about" className="hover:text-black">
            About Us
          </a>
          <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
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

      {/* Hero Section */}
      <section
        className="relative flex flex-col items-center justify-center text-center text-white h-[90vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImg})`,
        }}
      >

<div className="absolute inset-0 bg-[#17161080]"></div>

        {/* Text Content */}
        <div className="lg:mt-30 relative z-10 max-w-3xl px-4">
          <h1 className="text-3xl lg:text-6xl font-extrabold mb-6">
            <span className="text-[#C2C8DA]">RENTING </span>: MADE SOFT
          </h1>
          <p className="mb-8 lg:px-25 text-[10px] lg:text-sm text-white">
            We are on a journey to make school life soft for Uni-students in
            and from Africa. <b>/Rent</b> makes it easier, faster and cheaper to find
            an apartment in your University.
          </p>

          {/* Search Box */}
          <div className="flex flex-col md:flex-row items-center justify-center bg-white rounded-2xl shadow-lg p-6 space-y-6 md:space-y-0 md:space-x-6">
            {/* Dropdown 1 */}
            <div className="flex flex-col text-left">
              <label className="text-sm font-semibold text-black pl-4 mb-2">
                MOVE-IN-DATE
              </label>
              <div className="relative">
                <select className="appearance-none px-4 py-3 text-[11px] rounded-[25px] border border-[#00000080] text-[#00000080] w-60">
                  <option>How soon are you moving in?</option>
                  <option>Next month</option>
                  <option>2–3 months</option>
                  <option>6+ months</option>
                </select>
                {/* Custom Arrow */}
                <svg
                  className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#00000080]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Dropdown 2 */}
            <div className="flex flex-col text-left">
              <label className="text-sm pl-4 font-semibold text-black mb-2">
                BUDGET
              </label>
              <div className="relative">
                <select className="appearance-none px-4 py-3 text-[11px] rounded-[25px] border border-[#00000080] text-[#00000080] w-60">
                  <option>Select price range</option>
                  <option>$100 – $300</option>
                  <option>$300 – $600</option>
                  <option>$600+</option>
                </select>
                {/* Custom Arrow */}
                <svg
                  className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#00000080]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Button */}
            <button className="px-4 py-3 text-[11px] bg-black text-white rounded-lg border border-white shadow-md shadow-black hover:bg-gray-200 hover:text-black">
  VIEW LISTING
</button>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="bg-purple-100 py-6 overflow-hidden">
        <h2 className="text-center font-bold text-lg mb-4">
          TRUSTED BY 1000+ STUDENTS FROM
        </h2>

        {/* Scrolling Logos */}
        <div className="flex animate-marquee space-x-12">
          {logos.concat(logos).map((logo, idx) => (
            <img
              key={idx}
              src={logo}
              alt="logo"
              className="h-10 object-contain"
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
