import { IoIosArrowDown } from "react-icons/io";
import logo from "../assets/logo.png";
import nigeriaflag from "../assets/nigeriaflag.png";
import { MdOutlineMenu, MdOutlineDashboard } from "react-icons/md";
import { LuLogIn } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const getLoginData = () => {
  try {
    const raw = sessionStorage.getItem("login_data") || "{}";
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const login = getLoginData();
const whats = login?.user || "";
const mode = login?.mode || "";
const dashboard =
  mode === "student"
    ? "/studentdash"
    : mode === "merchant"
    ? "/businessdash"
    : "/dashboard"; // safe fallback

const Navbar = () => {
  
    const navigate = useNavigate();
  return (
    <>
      {/* Navbar */}
      <nav className="sticky border-4 top-0 grid grid-cols-[1fr_auto] md:grid-cols-3 items-center px-2 md:px-6 py-3 md:py-6 shadow-sm bg-white z-50">
        {/* Left: Flag */}
        <div className="hidden md:flex justify-center gap-6">
          <span className="text-[8px] md:text-[18px] font-semibold">
            Find a Roommate
          </span>
          <span className="text-[8px] md:text-[18px] font-semibold">
            List your Space
          </span>
        </div>

        {/* Center: Logo */}
        <div className="flex justify-start md:justify-center items-start gap-1 col-span-1 md:px-3">
          <img
            src={logo}
            alt="Cribb.Africa Logo"
            className="hidden md:flex m-0 p-0 h-8 md:h-8"
          />
          <div className="rounded-full border bg-white flex md:hidden">
            <img
              src={logo}
              alt="Nigeria Flag"
              className="h-8 md:h-12 object-contain p-2"
            />
          </div>
          <div className="hidden md:flex flex-col items-end p-0 m-0">
            <span className="text-2xl p-0 m-0 md:text-3xl font-extrabold ">
              Cribb.Africa
            </span>
          </div>
          <div className="md:hidden rounded-full bg-black p-2 shrink-0">
            <img
              src={nigeriaflag}
              alt="Nigeria Flag"
              className="h-4 md:h-8 object-contain"
            />
          </div>
        </div>

        {/* Right: Toggle Button */}
        <div className="flex justify-end md:justify-center items-center gap-2">
          <div className="rounded-full bg-black hidden md:flex">
            <img
              src={nigeriaflag}
              alt="Nigeria Flag"
              className="h-7 md:h-12 object-contain p-3"
            />
          </div>
          <button className="px-2 cursor-pointer md:px-5 py-2 md:py-3 border-2 bg-white flex items-center gap-2 text-black rounded-lg shadow-md whitespace-nowrap">
            <MdOutlineMenu className="text-xs md:text-2xl" />
            <span className="text-[10px] md:text-[15px] ">Products</span>
            <IoIosArrowDown className="text-xs md:text-2xl" />
          </button>
          {!whats ? (
            <button onClick={() => navigate("/signup")} className="px-2 cursor-pointer border-black border-2 md:px-5 py-2 md:py-3 bg-black flex items-center gap-2 text-white rounded-lg shadow-md whitespace-nowrap">
              <span className="text-[10px] md:text-[15px]">GET STARTED</span>
              <LuLogIn className="text-xs md:text-2xl" />
            </button>
          ) : (
            <button onClick={() => navigate(dashboard)} className="px-2 cursor-pointer border-black md:px-5 border-2 py-2 md:py-3 bg-black flex items-center gap-2 text-white rounded-lg shadow-md whitespace-nowrap">
              <MdOutlineDashboard className="text-xs md:text-2xl" />
              <span className="text-[10px] md:text-[15px]">DASHBOARD</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
