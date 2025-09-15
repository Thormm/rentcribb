import { useState } from "react";
import clsx from "clsx";
import { BsQuestionCircle } from "react-icons/bs";
import { GrStatusGood } from "react-icons/gr";
import InfoPill from "../../components/Pill";
import { MdOutlinePending } from "react-icons/md";
import { FiMail } from "react-icons/fi";
import { TbUserSquare } from "react-icons/tb";
import { RiInformationLine } from "react-icons/ri";

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
const tabs = ["Agent", "Landlord", "Vendor"];
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

// Mocked data
const AgentData = [
  { id: 1, date: "6th Jan, 2025", amount: "₦10,000", status: "done" },
  { id: 2, date: "20th Dec, 2025", amount: "₦50,000", status: "pending" },
  { id: 3, date: "2nd Dec, 2025", amount: "₦15,000", status: "done" },
  { id: 4, date: "18th Nov, 2025", amount: "₦22,000", status: "pending" },
  { id: 5, date: "10th Nov, 2025", amount: "₦18,000", status: "done" },
  { id: 6, date: "1st Nov, 2025", amount: "₦30,000", status: "pending" },
];

// Paginated list
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
            className="flex w-2/3  justify-between items-center px-8 py-5 rounded-4xl border border-black"
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

const Subscriptions = () => {
  const [activeTab, setActiveTab] = useState("Agent");

  return (
    <div className="bg-white py-10">
      <section className="px-10 flex justify-center">
        <div className="w-full">
          <SectionHeader title="Subscriptions" />

          <div className="mt-10 rounded-3xl border-4 border-black p-5 bg-[#F4F6F5]">
            <Tabs active={activeTab} setActive={setActiveTab} />

            {/* Agent Tab */}
            {activeTab === "Agent" && (
              <div className="p-5  space-y-6">
                <div className="grid my-10 w-2/3 grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>VALID UNTIL</Label>
                    <InfoPill>
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-md py-1">26</span>
                        <RiInformationLine size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>
                  <div>
                    <Label>LISTING PILL</Label>
                    <InfoPill>
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-md py-1">26</span>
                        <RiInformationLine size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>
                  <div>
                    <Label>CONNECTION</Label>
                    <InfoPill>
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-md py-1">26</span>
                        <RiInformationLine size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>
                  <div>
                    <Label>CONNECTION</Label>
                    <InfoPill>
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-md py-1">26</span>
                        <RiInformationLine size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  {/* Centered UPGRADE button spanning both cols */}
                  <div className="md:col-span-2 flex justify-center mt-4">
                    <button className="py-3 px-6 text-md font-medium bg-black text-white shadow-lg rounded-lg">
                      UPGRADE
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-10 mb-5">
                  <span className="text-md font-medium text-black tracking-wide">
                    ----- HISTORY --------------------------
                  </span>
                </div>
                <PaginatedList data={AgentData} />
              </div>
            )}

            {/* Landlord Tab */}
            {activeTab === "Landlord" && (
              <div className="p-5 mt-10 space-y-6">
                <div className="flex flex-col gap-8 bg-transparent">
                  <button className="w-md flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-3 shadow-sm text-md text-white">
                    <TbUserSquare className="w-8 h-8" />
                    Become a Landlord &gt;&gt;
                  </button>
                </div>

                <div className="grid my-10 w-2/3 grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>CURRENT PLAN</Label>
                    <InfoPill>
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-md py-1">26</span>
                        <RiInformationLine size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>
                  <div>
                    <Label>VALID UNTIL</Label>
                    <InfoPill>
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-md py-1">26</span>
                        <RiInformationLine size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  {/* Connection pill spanning both columns without icon */}
                  <div className="md:col-span-2">
                    <Label>CONNECTION</Label>
                    <InfoPill>
                      <input
                        type="text"
                        placeholder="Doe"
                        className="w-full outline-none py-1 rounded-md text-black"
                      />
                    </InfoPill>
                  </div>

                  {/* Centered UPGRADE button spanning both cols */}
                  <div className="md:col-span-2 flex mt-4 justify-between px-8">
                    <button className="py-3 px-6 text-md font-medium bg-white text-black shadow-lg rounded-lg">
                      FREE TRIAL
                    </button>
                    <button className="py-3 px-6 text-md font-medium bg-black text-white shadow-lg rounded-lg">
                      UPGRADE
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-10 mb-5">
                  <span className="text-md font-medium text-black tracking-wide">
                    ----- HISTORY --------------------------
                  </span>
                </div>
                <PaginatedList data={AgentData} />
              </div>
            )}

            {/* Vendor Tab */}
            {activeTab === "Vendor" && (
              <div className="my-10 w-2/3">
                <div className="flex flex-col p-5 gap-8 bg-transparent">
                  {/* Coming Soon */}
                  <button className="w-full flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black">
                    <MdOutlinePending className="w-8 h-8" />
                    Coming Soon ...
                  </button>

                  {/* Join Waitlist */}
                  <button className="w-full flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white">
                    <FiMail className="w-8 h-8" />
                    Join Waitlist &gt;&gt;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Subscriptions;
