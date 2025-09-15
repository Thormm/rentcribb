import { useState } from "react";
import clsx from "clsx";
import { BsQuestionCircle } from "react-icons/bs";
import { BiRotateRight } from "react-icons/bi";
import { GrStatusGood } from "react-icons/gr";
import InfoPill from "../../components/Pill";
import {
  MdOutlinePayments,
  MdOutlinePending,
  MdDoubleArrow,
} from "react-icons/md";
import { RiStickyNoteAddLine } from "react-icons/ri";

// Reusable Label
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

// Header with help icon
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
        Collect your rewards:{" "}
        <span className="text-[#FFA1A1] font-semibold">
          You have done the Most !!
        </span>
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

// Tabs
const tabs = ["Withdrawals", "Top ups", "Refunds"];
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

// Mocked data
const withdrawalsData = [
  { id: 1, date: "6th Jan, 2025", amount: "₦10,000", status: "done" },
  { id: 2, date: "20th Dec, 2025", amount: "₦50,000", status: "pending" },
  { id: 3, date: "2nd Dec, 2025", amount: "₦15,000", status: "done" },
  { id: 4, date: "18th Nov, 2025", amount: "₦22,000", status: "pending" },
  { id: 5, date: "10th Nov, 2025", amount: "₦18,000", status: "done" },
  { id: 6, date: "1st Nov, 2025", amount: "₦30,000", status: "pending" },
];

const topupsData = [
  { id: 1, date: "15th Feb, 2025", amount: "₦20,000", status: "done" },
  { id: 2, date: "22nd Dec, 2025", amount: "₦70,000", status: "pending" },
  { id: 3, date: "12th Dec, 2025", amount: "₦15,000", status: "done" },
  { id: 4, date: "8th Dec, 2025", amount: "₦10,000", status: "pending" },
  { id: 5, date: "1st Dec, 2025", amount: "₦45,000", status: "done" },
  { id: 6, date: "25th Nov, 2025", amount: "₦12,000", status: "pending" },
];

const refundsData = {
  NEW: [
    { id: 1, date: "1st Jan, 2025", amount: "₦5,000", status: "pending" },
    { id: 2, date: "3rd Jan, 2025", amount: "₦8,000", status: "done" },
    { id: 3, date: "5th Jan, 2025", amount: "₦12,000", status: "done" },
    { id: 4, date: "7th Jan, 2025", amount: "₦18,000", status: "pending" },
    { id: 5, date: "9th Jan, 2025", amount: "₦20,000", status: "done" },
    { id: 6, date: "12th Jan, 2025", amount: "₦25,000", status: "pending" },
  ],
  "ON-GOING": [
    { id: 7, date: "10th Jan, 2025", amount: "₦15,000", status: "pending" },
    { id: 8, date: "7th Jan, 2025", amount: "₦18,000", status: "pending" },
    { id: 9, date: "9th Jan, 2025", amount: "₦20,000", status: "done" },
    { id: 10, date: "12th Jan, 2025", amount: "₦25,000", status: "pending" },
    { id: 11, date: "20th Dec, 2024", amount: "₦25,000", status: "done" },
    { id: 12, date: "20th Dec, 2024", amount: "₦25,000", status: "done" },
  ],
  SORTED: [
    { id: 13, date: "20th Dec, 2024", amount: "₦25,000", status: "done" },
    { id: 14, date: "7th Jan, 2025", amount: "₦18,000", status: "pending" },
    { id: 15, date: "9th Jan, 2025", amount: "₦20,000", status: "done" },
    { id: 16, date: "12th Jan, 2025", amount: "₦25,000", status: "pending" },
    { id: 17, date: "20th Dec, 2024", amount: "₦25,000", status: "done" },
    { id: 18, date: "20th Dec, 2024", amount: "₦25,000", status: "done" },
  ],
};

// Pagination helper
function PaginatedList({
  data,
}: {
  data: { id: number; date: string; amount: string; status: string }[];
}) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div>
      <div
        className="space-y-4 max-h-[350px] overflow-y-auto pr-2"
        style={{
          scrollbarColor: "#FFA1A1 transparent",
          scrollbarWidth: "thin",
        }}
      >
        {currentData.map((item) => (
          <div
            key={item.id}
            className="flex w-2/3 justify-between items-center px-8 py-5 rounded-4xl border border-black"
          >
            <div className="flex items-center gap-3">
              {item.status === "done" ? (
                <GrStatusGood className="text-black w-7 h-7" />
              ) : (
                <MdOutlinePending className="text-black w-7 h-7" />
              )}
              <span className="text-md text-black">{item.date}</span>
            </div>
            <span className="font-bold text-black">{item.amount}</span>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
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

const Payment = () => {
  const [activeTab, setActiveTab] = useState("Withdrawals");
  const [activeRefund, setActiveRefund] = useState<
    "NEW" | "ON-GOING" | "SORTED"
  >("NEW");

  return (
    <div className="bg-white py-10">
      <section className="px-10 flex justify-center">
        <div className="w-full">
          {/* Header */}
          <SectionHeader title="Payments" />

          {/* Card */}
          <div className="mt-10 rounded-3xl border-4 border-black p-5 bg-[#F4F6F5]">
            {/* Tabs */}
            <Tabs active={activeTab} setActive={setActiveTab} />

            {/* Withdrawals Tab */}
            {activeTab === "Withdrawals" && (
              <div className="p-5 mt-5 space-y-6">
                <Label>BALANCE</Label>
                <InfoPill className="flex items-center justify-between px-3 max-w-md">
                  <div className="inline-flex items-center justify-between w-full">
                    <span className="text-xl font-bold text-black">₦250,000</span>
                    <button className="flex items-center gap-2 px-3 py-1 bg-black text-[#D6FFC3] text-sm rounded-md">
                      <MdOutlinePayments /> WITHDRAW
                    </button>
                  </div>
                </InfoPill>

                <Label>TOTAL EARNED</Label>
                <InfoPill className="max-w-md">
                  <div className="inline-flex items-center justify-between w-full">
                    <span className="text-xl font-medium text-black">
                      ₦500,000
                    </span>
                  </div>
                </InfoPill>

                <div className="flex items-center gap-3 mt-10 mb-5">
                  <span className="text-md font-medium text-black tracking-wide">
                    --- HISTORY --------------------------
                  </span>
                </div>
                <PaginatedList data={withdrawalsData} />
              </div>
            )}

            {/* Top ups Tab */}
            {activeTab === "Top ups" && (
              <div className="p-5">
                <div className="flex items-center gap-3 mt-5 mb-5">
                  <span className="text-md font-medium text-black tracking-wide">
                    ----- HISTORY --------------------------
                  </span>
                </div>
                <PaginatedList data={topupsData} />
              </div>
            )}

            {/* Refunds Tab */}
            {activeTab === "Refunds" && (
              <div>
                <div className="p-5">
                  {/* Toggle Buttons */}
                  <div className="grid grid-cols-3 gap-4 mt-5 border border-dashed border-gray-40 bg-white p-3 rounded-lg">
                    <button
                      onClick={() => setActiveRefund("NEW")}
                      className={clsx(
                        "flex items-center justify-center gap-2 rounded-lg",
                        activeRefund === "NEW"
                          ? "bg-black text-white"
                          : "bg-transparent text-black"
                      )}
                    >
                      <RiStickyNoteAddLine
                        className={activeRefund === "NEW" ? "text-white" : ""}
                        size={30}
                      />
                      <span className="text-lg font-semibold">NEW</span>
                    </button>

                    <button
                      onClick={() => setActiveRefund("ON-GOING")}
                      className={clsx(
                        "flex items-center justify-center gap-2 p-3 rounded-lg",
                        activeRefund === "ON-GOING"
                          ? "bg-black text-white"
                          : "bg-transparent text-black"
                      )}
                    >
                      <BiRotateRight
                        className={
                          activeRefund === "ON-GOING" ? "text-white" : ""
                        }
                        size={30}
                      />
                      <span className="text-lg font-semibold">ON-GOING</span>
                    </button>

                    <button
                      onClick={() => setActiveRefund("SORTED")}
                      className={clsx(
                        "flex items-center justify-center gap-2 p-3 rounded-lg",
                        activeRefund === "SORTED"
                          ? "bg-black text-white"
                          : "bg-transparent text-black"
                      )}
                    >
                      <MdDoubleArrow
                        className={
                          activeRefund === "SORTED" ? "text-white" : ""
                        }
                        size={30}
                      />
                      <span className="text-lg font-semibold">SORTED</span>
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  {/* History */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-md font-medium text-black tracking-wide">
                      ----- ENTRIES --------------------------
                    </span>
                  </div>
                  <PaginatedList data={refundsData[activeRefund]} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Payment;
