import { useState,useEffect } from "react";
import clsx from "clsx";
import { BsQuestionCircle } from "react-icons/bs";
import InfoPill from "../../components/Pill";
import StudentCard from "./DashComponents/StudentCard"; 
import {
  MdWoman2,
  MdOutlinePostAdd,
  MdLightbulbOutline,
} from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import { FaUtensils, FaFilm, FaBook, FaToggleOff } from "react-icons/fa";
import { CgCross } from "react-icons/cg";
import { BiComment } from "react-icons/bi";
import { FaToggleOn } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";


const getLoginData = () => {
  try {
    const raw = sessionStorage.getItem("login_data") || "{}";
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

// ----------------------- Reusable Label -----------------------
type LabelProps = React.PropsWithChildren<{ className?: string }>;
function Label({ children, className }: LabelProps) {
  return (
    <div
      className={clsx("text-md pl-8 my-2 font-semibold text-black", className)}
    >
      {children}
    </div>
  );
}

/* ----------------------- TYPES ----------------------- */
interface Student {
  id: number;
  gender: string;
  religion: string;
  level: string;
  faculty: string;
  hobby: string[];
  pet: string;
}

/* ----------------------- API ----------------------- */
const API_URL = "https://www.cribb.africa/apigets.php";

/* ----------------------- PAGINATED CARDS ----------------------- */
function PaginatedCards() {
  const [data, setData] = useState<Student[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

 useEffect(() => {
    const login = getLoginData();
    const whats = login?.user || "";
    if (!whats) return;
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "studentmatched", whats }),
    })
      .then(res => res.json())
      .then(res => setData(res.data))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div>
      <div
        className="space-y-3 px-5 max-h-[1000px] overflow-y-auto cards-scroll"
        style={{ scrollbarColor: "#FFA1A1 transparent", scrollbarWidth: "thin" }}
      >
        {currentData.map(item => (
          <div key={item.id} className="min-w-sm md:min-w-0 flex justify-end">
            <div className="flex gap-6 md:pt-15 items-center mb-10 relative bg-[#F3EDFE] rounded-3xl p-5 shadow-lg pr-8
              before:content-[''] before:absolute before:-bottom-3 before:right-10
              before:w-0 before:h-0 before:border-l-[10px] before:border-r-[10px]
              before:border-t-[12px] before:border-l-transparent before:border-r-transparent
              before:border-t-[#F3EDFE]"
            >
              <StudentCard item={item} />

              <div className="flex flex-col justify-between w-35 md:w-50">
                <div className="flex flex-col gap-4">
                  <InfoPill className="bg-[#D6FFC3]">
                    <div className="inline-flex items-center justify-between w-full">
                      <span className="text-xs md:text-md py-1 text-black">Online</span>
                      <FaToggleOn size={25} className="ml-auto text-black" />
                    </div>
                  </InfoPill>

                  <InfoPill className="bg-[#FFA1A1]">
                    <div className="inline-flex items-center justify-between w-full">
                      <span className="text-xs md:text-md py-1 text-black">Delete</span>
                      <MdOutlineDeleteForever size={25} className="ml-auto text-black" />
                    </div>
                  </InfoPill>

                  <div className="flex justify-center">
                    <button className="py-3 text-md w-30 font-medium bg-black text-white shadow-lg rounded-lg">
                      EDIT
                    </button>
                  </div>
                </div>

                <div className="text-black text-center mt-4 text-sm">
                  11-12-2009
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={clsx(
                "px-3 py-1 rounded-md border",
                page === i + 1
                  ? "bg-[#FFA1A1] text-white border-[#FFA1A1]"
                  : "bg-white text-black border-black"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


/* ----------------------- MATCHED CARDS ----------------------- */
function MatchedCards() {
  const [data, setData] = useState<Student[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 18;

  useEffect(() => {
    const login = getLoginData();
    const whats = login?.user || "";
    if (!whats) return;
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "studentmatched", whats }),
    })
      .then(res => res.json())
      .then(res => setData(res.data))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div>
      <div
        className="grid grid-cols-2 py-15 md:grid-cols-3 gap-y-20 md:gap-x-6 max-h-[1000px] overflow-y-auto pr-2 cards-scroll"
        style={{ scrollbarColor: "#FFA1A1 transparent", scrollbarWidth: "thin" }}
      >
        {currentData.map(item => (
          <div key={item.id} className="flex justify-center">
            <StudentCard item={item} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={clsx(
                "px-3 py-1 rounded-md border",
                page === i + 1
                  ? "bg-[#FFA1A1] text-white border-[#FFA1A1]"
                  : "bg-white text-black border-black"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


// ----------------------- Section Header -----------------------
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="pt-5 text-black">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-4xl font-extrabold">{title}</h2>
        <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
          <BsQuestionCircle className="text-white" size={40} />
        </div>
      </div>
      <p className="text-xs md:text-sm pt-5">
        We’ve made it a soft experience getting a Match ...
      </p>

      <div
        className="mt-2 w-full border-t-4"
        style={{
          borderStyle: "dashed",
          borderImage:
            "repeating-linear-gradient(to right, #0000004D 0, #0000004D 10px, transparent 6px, transparent 24px) 1",
        }}
      />
    </div>
  );
}

// ----------------------- Tabs -----------------------
const tabs = ["Explore", "Requests", "Match"];
function Tabs({
  active,
  setActive,
}: {
  active: string;
  setActive: (t: string) => void;
}) {
  return (
    <div
      className="flex mt-5 border-2 py-4 rounded-xl relative overflow-hidden"
      style={{
        borderStyle: "dashed",
        borderColor: "#0000004D",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={clsx(
            "flex-1 pb-2 pt-2 text-xs md:text-lg relative text-black font-medium text-center",
            active === tab
              ? "after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-3/4 after:h-1 after:bg-[#FFA1A1]"
              : ""
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// ----------------------- Main Component -----------------------
const Rommates = () => {
  const [activeTab, setActiveTab] = useState("Explore");

  return (
    <div className="bg-white md:py-10 mb-20">
      <section className="px-3 md:px-10 flex justify-center">
        <div className="w-full">
          <SectionHeader title="Rommates" />

          <div className="mt-10 rounded-3xl border-4 border-black p-1 md:p-5 bg-[#F4F6F5] overflow-x-auto">
            {/* Tabs */}
            <Tabs active={activeTab} setActive={setActiveTab} />

            {/* Explore Tab */}
            {activeTab === "Explore" && (
              <div className="p-2 md:p-5">
                <div className="grid grid-cols-1 md:w-2/3 mt-5 gap-6">
                  <div>
                    <Label>VISIBILITY</Label>
                    <InfoPill>
                      <div className="inline-flex items-center justify-between w-full">
                        <span className=" text-xs md:text-sm">Active : Yes, Receiving Requests</span>
                        <span className="bg-black space-x-1 px-4 py-2 rounded-md text-[#D6FFC3] flex items-center">
                          <FaToggleOff /> <span className=" text-xs md:text-sm">SWITCH</span>
                        </span>
                      </div>
                    </InfoPill>
                  </div>
                </div>

                {/* Profile Card */}
                <div className="justify-start flex ml-8">
                  <div className="flex flex-col items-center mt-15">
                    <div className="relative text-black bg-[#EBD96B] rounded-4xl py-6 w-45 shadow-md text-center">
                      <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-[#C2C8DA4D] w-30 h-30 rounded-full flex items-center justify-center">
                        <span className="text-3xl font-semibold">You</span>
                      </div>

                      <div className="mt-20">
                        <div className="flex justify-center gap-2">
                          <MdWoman2 className="text-4xl mt-2" />
                          <p className="text-sm leading-loose">
                            Mass com <br /> 300 Level
                          </p>
                          <CgCross className="text-4xl mt-2" />
                        </div>

                        <div className="flex justify-center space-x-3 mt-2 mb-5">
                          <FaUtensils className="text-3xl rounded-full bg-pink-400 p-1" />
                          <FaFilm className="text-3xl rounded-full bg-pink-400 p-1" />
                          <FaBook className="text-3xl rounded-full bg-pink-400 p-1" />
                        </div>
                      </div>
                    </div>

                    <button className="mt-6 bg-black text-semibold text-white w-40 py-4 rounded-lg shadow-md">
                      EDIT
                    </button>
                  </div>
                </div>

                <button className=" md:w-2/3 mt-10 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black">
                  <BiComment className="w-8 h-8" />
                  Rommate Requests
                </button>

                <button className="mt-5 md:w-2/3 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white">
                  <MdOutlinePostAdd className="w-8 h-8" />
                  Explore Rommates
                </button>
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === "Requests" && (
              <div className="p-2 md:p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-2/3">
                  <div>
                    <Label>HOW IT WORKS</Label>
                    <InfoPill className="relative flex items-center">
                      12
                      <MdLightbulbOutline className="pointer-events-none absolute right-5 text-black" />
                    </InfoPill>
                  </div>
                  <div>
                    <Label>FILTER</Label>
                    <InfoPill className="relative flex items-center">
                      Sortby
                      <FiChevronDown className="pointer-events-none absolute right-5 text-black" />
                    </InfoPill>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-8 mb-10">
                  <span className="text-md font-semibold text-black tracking-wide mt-10">
                    --- YOUR LISTINGS -------------------------------
                  </span>
                </div>
                <PaginatedCards /> 

                <button className="md:w-2/3 mt-10 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white">
                  <MdOutlinePostAdd className="w-8 h-8" />
                  Explore Rommates
                </button>
              </div>
            )}

            {/* Match Tab */}
            {activeTab === "Match" && ( 
              <div className="mb-10">
                <div className="p-2 md:p-5 md:w-2/3">
                  <span className="text-md font-semibold text-black tracking-wide mt-10">
                    --- YOUR LISTINGS -------------------------------
                  </span>
                </div>

                <MatchedCards />
                <button className="md:w-2/3 mt-10 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black">
                  <BiComment className="w-8 h-8" />
                  Rommate Requests
                </button>
                <button className="md:w-2/3 mt-5 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white">
                  <MdOutlinePostAdd className="w-8 h-8" />
                  Explore Rommates
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Rommates;
