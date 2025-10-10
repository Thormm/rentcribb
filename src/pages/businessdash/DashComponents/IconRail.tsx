import {
  FiChevronRight,
  FiGrid,
  FiCreditCard,
  FiSettings,
} from "react-icons/fi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import {
  MdWallet,
  MdOutlineAddBusiness,
  MdOutlineBookmarkAdded,
  MdOutlineBackpack,
} from "react-icons/md";
import { RiListView } from "react-icons/ri";
import { BsQrCode } from "react-icons/bs";
import { PiHouse } from "react-icons/pi";
import { TbUserSquare } from "react-icons/tb";
import { IoCopyOutline } from "react-icons/io5";
import logo from "../../../assets/logo2.png";
import { FaRegBell } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { HiOutlineUserCircle } from "react-icons/hi";

export default function IconRail({
  onToggle,
  activeTab,
  setActiveTab,
  openSection,
  toggleSection,
  referralCode,
}: {
  onToggle: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSection: string | null;
  toggleSection: (title: string) => void;
  referralCode: string;
}) {
  // 🔹 Shared classes to avoid repetition
  const baseBtn =
    "grid h-10 w-10 md:h-12 md:w-12 place-items-center rounded-xl transition ";
  const activeClass = "text-[#FFA1A1] border-[#FFA1A1] border-l-[3px]";
  const inactiveClass = "text-white border-transparent";
  const sectionIcon =
    "grid h-14 w-14 place-items-center rounded-xl transition text-gray-400";

  const coreTabs = [
    {
      tab: "overview",
      icon: <FiGrid className="md:h-12 md:w-12 md:px-3" />,
      title: "Overview",
    },
    {
      tab: "payments",
      icon: <FiCreditCard className="md:h-12 md:w-12 md:px-3" />,
      title: "Payments",
    },
    {
      tab: "subscriptions",
      icon: <MdWallet className="md:h-12 md:w-12 md:px-3" />,
      title: "Subscriptions",
    },
  ];

  const sections = [
    {
      title: "AGENT",
      icon: <HiOutlineUserCircle className="h-8 w-8 md:h-14 md:w-14 md:px-3" />,
      items: [
        {
          label: "Business Overview",
          tab: "bizoverview",
          icon: <MdOutlineAddBusiness className="md:h-14 md:w-14 md:px-3" />,
        },
        {
          label: "Listings",
          tab: "listings",
          icon: <RiListView className="md:h-14 md:w-14 md:px-3" />,
        },
        {
          label: "Bookings",
          tab: "bookingsagent",
          icon: <MdOutlineBookmarkAdded className="md:h-14 md:w-14 md:px-3" />,
        },
      ],
    },
    {
      title: "LANDLORD",
      icon: <TbUserSquare className="h-8 w-8 md:h-14 md:w-14 md:px-3" />,
      items: [
        {
          label: "Hostel Overview",
          tab: "hosteloverview",
          icon: <PiHouse className="md:h-14 md:w-14 md:px-3" />,
        },
        {
          label: "Listings",
          tab: "listingslandlord",
          icon: <RiListView className="md:h-14 md:w-14 md:px-3" />,
        },
        {
          label: "Bookings",
          tab: "bookingslandlord",
          icon: <MdOutlineBookmarkAdded className="md:h-14 md:w-14 md:px-3" />,
        },
      ],
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const Spacer = () => <div className="flex-1 my-3 md:my-6">---</div>;

  return (
    <div
      className="flex h-full w-15 md:w-[120px] flex-col items-center bg-black/95 border-r border-neutral-800 relative overflow-y-auto scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* Logo + Controls */}
      <div className="pt-5 pb-6 flex flex-col items-center gap-5 md:gap-6">
        <img src={logo} alt="Cribb.Africa Logo" className="h-9" />
        <button className="p-2 md:p-3 rounded-full bg-neutral-800 ">
          <FaRegBell className="md:h-6 md:w-6 text-white" />
        </button>
        <button
          onClick={onToggle}
          className="p-2 md:p-3 rounded-full bg-neutral-800"
          title="Expand sidebar"
        >
          <FiChevronRight className="md:h-6 md:w-6" />
        </button>
      </div>

      <Spacer />

      {/* Core Tabs */}
      <div className="flex flex-col items-center md:gap-3 md:mt-6">
        {coreTabs.map(({ tab, icon, title }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            title={title}
            className={`${baseBtn} ${
              activeTab === tab ? activeClass : inactiveClass
            }`}
          >
            {icon}
          </button>
        ))}
      </div>

      <Spacer />

      {/* AGENT + LANDLORD Sections */}
      <div className="flex  flex-col items-center md:gap-4">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col items-center md:gap-1">
            <div className="flex justify-center items-center w-[30px] md:gap-1">
              <button
                onClick={() => toggleSection(section.title)}
                className={sectionIcon}
                title={section.title}
              >
                {section.icon}
              </button>
              <button
                onClick={() => toggleSection(section.title)}
                className="text-white"
              >
                {openSection === section.title ? (
                  <IoIosArrowUp className="h-4 w-4" />
                ) : (
                  <IoIosArrowDown className="h-4 w-4" />
                )}
              </button>
            </div>

            {openSection === section.title && (
              <div className="flex flex-col items-center md:gap-2 mt-2">
                {section.items.map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => setActiveTab(item.tab)}
                    className={`${baseBtn} ${
                      activeTab === item.tab ? activeClass : inactiveClass
                    }`}
                    title={item.label}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Spacer />

      {/* QR / Copy */}
      <div className="flex flex-col items-center justify-center">
        <span className="text-white text-[10px] font-bold">COPY</span>
        <button
          type="button"
          onClick={handleCopy}
          className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#C2C8DA4D] flex items-center justify-center shadow-lg"
        >
          <BsQrCode className="text-white text-xl md:text-2xl" />
        </button>
        <div className="flex items-center gap-1 text-white text-[8px] md:text-[10px] font-semibold mt-1">
          <span>{referralCode}</span>
          <IoCopyOutline className="text-white" />
        </div>
      </div>

      <Spacer />

      {/* Settings */}
      <div className="flex flex-col items-center ">
      <button
        onClick={() => setActiveTab("settings")}
        className={`${baseBtn}  ${
          activeTab === "settings" ? activeClass : inactiveClass
        }`}
        title="Settings"
      >
        <FiSettings className="md:h-12 md:w-12 md:px-3" />
      </button>
      </div>

      <Spacer />

      {/* Profile */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-400 rounded-full mb-5 shrink-0" />
        <div className="flex flex-col items-center gap-3">
          <button type="button" title="Log out">
            <LuLogOut className="md:h-8 md:w-8 text-white my-2" />
          </button>
          <button type="button" title="Switch">
            <MdOutlineBackpack className="md:h-8 md:w-8 text-white my-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
