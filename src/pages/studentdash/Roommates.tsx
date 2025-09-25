import { useState } from "react";
import clsx from "clsx";
import { BsQuestionCircle } from "react-icons/bs";
import InfoPill from "../../components/Pill";
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

// ----------------------- Mock Data (20 Records) -----------------------
const requestData = [
  { id: 1, course: "Mass Comm", level: "100 Level", justify: "start" },
  { id: 2, course: "Law", level: "200 Level", justify: "end" },
  { id: 3, course: "Engineering", level: "300 Level", justify: "start" },
  { id: 4, course: "Medicine", level: "400 Level", justify: "end" },
  { id: 5, course: "Computer Sci", level: "100 Level", justify: "start" },
  { id: 6, course: "Business Admin", level: "200 Level", justify: "end" },
  { id: 7, course: "Economics", level: "300 Level", justify: "start" },
  { id: 8, course: "Political Sci", level: "400 Level", justify: "end" },
  { id: 9, course: "English", level: "100 Level", justify: "start" },
  { id: 10, course: "Fine Arts", level: "200 Level", justify: "end" },
  { id: 11, course: "History", level: "300 Level", justify: "start" },
  { id: 12, course: "Accounting", level: "400 Level", justify: "end" },
  { id: 13, course: "Architecture", level: "100 Level", justify: "start" },
  { id: 14, course: "Philosophy", level: "200 Level", justify: "end" },
  { id: 15, course: "Sociology", level: "300 Level", justify: "start" },
  { id: 16, course: "Psychology", level: "400 Level", justify: "end" },
  { id: 17, course: "Theatre Arts", level: "100 Level", justify: "start" },
  { id: 18, course: "Education", level: "200 Level", justify: "end" },
  { id: 19, course: "Nursing", level: "300 Level", justify: "start" },
  { id: 20, course: "Public Admin", level: "400 Level", justify: "end" },
];

// ----------------------- Paginated Cards -----------------------
function PaginatedCards() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(requestData.length / itemsPerPage);
  const currentData = requestData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div>
      <div
        className="space-y-3 max-h-[1000px] overflow-y-auto pr-2 cards-scroll"
        style={{
          scrollbarColor: "#FFA1A1 transparent",
          scrollbarWidth: "thin",
        }}
      >
        {currentData.map((item) => (
          <div className={`flex justify-${item.justify}`}>
            <div
              key={item.id}
              className="inline-flex gap-6 pt-20 items-center mb-10 relative bg-[#F3EDFE] rounded-3xl p-5 shadow-lg pr-8
  before:content-[''] before:absolute before:-bottom-3 before:right-10 
  before:w-0 before:h-0 before:border-l-[10px] before:border-r-[10px] before:border-t-[12px] 
  before:border-l-transparent before:border-r-transparent before:border-t-[#F3EDFE]"
            >
              {/* Main card */}
              <div className="relative text-black bg-[#EBD96B] rounded-4xl py-6 w-45 shadow-md text-center">
                {/* Top circle */}
                <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-[#C2C8DA4D] w-30 h-30 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-semibold">{item.id}</span>
                </div>

                {/* Body */}
                <div className="mt-20">
                  <div className="flex justify-center gap-2">
                    <MdWoman2 className="text-4xl mt-2" />
                    <p className="text-sm leading-loose">
                      {item.course} <br /> {item.level}
                    </p>
                    <CgCross className="text-4xl mt-2" />
                  </div>

                  {/* Icons row */}
                  <div className="flex justify-center space-x-3 mt-2 mb-5">
                    <FaUtensils className="text-3xl rounded-full bg-pink-400 p-1" />
                    <FaFilm className="text-3xl rounded-full bg-pink-400 p-1" />
                    <FaBook className="text-3xl rounded-full bg-pink-400 p-1" />
                  </div>
                </div>
              </div>

              {/* Auxiliary card */}
              <div className="flex flex-col justify-between w-64">
                <div className="flex flex-col gap-4">
                  <InfoPill className="bg-[#D6FFC3]">
                    <div className="inline-flex items-center justify-between w-full">
                      <span className="text-md py-1 text-black">Online</span>
                      <FaToggleOn size={25} className="ml-auto text-black" />
                    </div>
                  </InfoPill>
                  <InfoPill className="bg-[#FFA1A1]">
                    <div className="inline-flex items-center justify-between w-full">
                      <span className="text-md py-1 text-black">Delete</span>
                      <MdOutlineDeleteForever
                        size={25}
                        className="ml-auto text-black"
                      />
                    </div>
                  </InfoPill>
                  <div className="flex justify-center">
                    <button className="py-3 text-md w-30 font-medium bg-black text-white shadow-lg rounded-lg">
                      EDIT
                    </button>
                  </div>
                </div>
                {/* Date or metadata */}
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
              key={i + 1}
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

function MatchedCards() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 18; // 3 cards per row × 3 rows per page
  const totalPages = Math.ceil(requestData.length / itemsPerPage);
  const currentData = requestData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div>
      <div
        className="grid grid-cols-3 gap-6 max-h-[1000px] overflow-y-auto pr-2 cards-scroll"
        style={{
          scrollbarColor: "#FFA1A1 transparent",
          scrollbarWidth: "thin",
        }}
      >
        {currentData.map((item) => (
          <div key={item.id} className="flex justify-center">
            <div className="relative text-black bg-[#EBD96B] mt-20 rounded-4xl py-6 w-45 shadow-md text-center">
              {/* Bubble */}
              <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-[#C2C8DA4D] w-30 h-30 rounded-full flex items-center justify-center">
                <span className="text-3xl font-semibold">{item.id}</span>
              </div>

              {/* Card content */}
              <div className="mt-20">
                <div className="flex justify-center gap-2">
                  <MdWoman2 className="text-4xl mt-2" />
                  <p className="text-sm leading-loose">
                    {item.course} <br /> {item.level}
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
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
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
        <h2 className="text-4xl font-extrabold">{title}</h2>
        <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
          <BsQuestionCircle className="text-white" size={40} />
        </div>
      </div>
      <p className="text-sm pt-5">
        We’ve made it a soft experience getting a Match...
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
      style={{ borderStyle: "dashed", borderColor: "#0000004D" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={clsx(
            "flex-1 pb-2 pt-2 text-lg relative text-black font-medium text-center",
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
    <div className="bg-white py-10">
      <section className="px-10 flex justify-center">
        <div className="w-full">
          <SectionHeader title="Rommates" />

          <div className="mt-10 rounded-3xl border-4 border-black p-5 bg-[#F4F6F5]">
            <Tabs active={activeTab} setActive={setActiveTab} />

            {/* Explore Tab */}
            {activeTab === "Explore" && (
              <div className="p-5 space-y-6">
                <div className="grid grid-cols-1 w-2/3 mt-5 gap-6">
                  <div>
                    <Label>VISIBILITY</Label>
                    <InfoPill>
                      <div className="inline-flex items-center justify-between w-full">
                        <span>Active : Yes, Receiving Requests</span>
                        <span className="bg-black space-x-1 px-4 rounded-md text-[#D6FFC3] flex items-center">
                          <FaToggleOff /> <span>SWITCH</span>
                        </span>
                      </div>
                    </InfoPill>
                  </div>
                </div>

                {/* Profile Card */}
                <div className="justify-start flex ml-8">
                  <div className="flex flex-col items-center mt-10">
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

                <button className="w-2/3 mt-10 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black">
                  <BiComment className="w-8 h-8" />
                  Rommate Requests
                </button>

                <button className="w-2/3 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white">
                  <MdOutlinePostAdd className="w-8 h-8" />
                  Explore Rommates
                </button>
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === "Requests" && (
              <div className="p-5 mt-5 space-y-6">
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

                <div className="flex items-center gap-3 mt-8">
                  <span className="text-md font-semibold text-black tracking-wide mt-10">
                    --- YOUR LISTINGS -------------------------------
                  </span>
                </div>
                <PaginatedCards />

                <button className="w-2/3 mt-10 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white">
                  <MdOutlinePostAdd className="w-8 h-8" />
                  Explore Rommates
                </button>
              </div>
            )}

            {/* Match Tab */}
            {activeTab === "Match" && (
              <div className="mb-10">
                <div className="flex items-center gap-3 w-2/3">
                  <span className="text-md font-semibold text-black tracking-wide mt-10">
                    --- YOUR LISTINGS -------------------------------
                  </span>
                </div>

                <MatchedCards />
                <button className="w-2/3 mt-10 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black">
                  <BiComment className="w-8 h-8" />
                  Rommate Requests
                </button>
                <button className="w-2/3 mt-5 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white">
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
