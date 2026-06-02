import { useEffect, useState } from "react";
import clsx from "clsx";
import { BsQuestionCircle } from "react-icons/bs";
import { GrStatusGood } from "react-icons/gr";
import InfoPill from "../../components/Pill";
import { MdOutlinePending } from "react-icons/md";
import { FiMail } from "react-icons/fi";
import { RiInformationLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { HiOutlineUsers } from "react-icons/hi";
import { PiHouse } from "react-icons/pi";
import Spaceholder from "../../components/Spaceholder";

// Reusable Label
type LabelProps = React.PropsWithChildren<{ className?: string }>;
function Label({ children, className }: LabelProps) {
  return (
    <div
      className={clsx(
        "text-sm md:text-md md:my-3 font-semibold ml-6",
        className,
      )}
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
        <h2 className="text-2xl md:text-4xl font-extrabold">{title}</h2>
        <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
          <BsQuestionCircle className="text-white" size={40} />
        </div>
      </div>
      <p className="text-xs md:text-sm pt-5">
        Simple, Transparent Plan based on your need
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
const tabs = ["Roommate", "Rent", "Marketplace"];
function Tabs({
  active,
  setActive,
}: {
  active: string;
  setActive: (t: string) => void;
}) {
  return (
    <div
      className="flex md:mt-5 border-2 py-4 rounded-2xl relative overflow-hidden bg-white"
      style={{ borderStyle: "dashed", borderColor: "#0000004D" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={clsx(
            "flex-1 pb-2 pt-2 text-xs md:text-lg relative text-black font-medium text-center",
            active === tab
              ? "after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-3/4 after:h-1 after:bg-[#FFA1A1]"
              : "",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// Paginated list
function PaginatedList({
  data,
}: {
  data: {
    id: number;
    date: string;
    plan: string;
    amount: string;
    status: string;
  }[];
}) {

  if(data.length === 0) {
    return(
      <Spaceholder />
    )
  }

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <div>
      <div
        className="space-y-4 max-h-[350px] overflow-y-auto pr-2 mb-4 md:mb-0"
        style={{
          scrollbarColor: "#FFA1A1 transparent",
          scrollbarWidth: "thin",
        }}
      >
        {currentData.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center px-4 md:px-8 py-3 md:py-5 rounded-4xl border border-black"
          >
            <div className="flex items-center gap-3">
              {item.status === "done" ? (
                <GrStatusGood className="text-black w-5 h-5 md:w-7 md:h-7" />
              ) : (
                <MdOutlinePending className="text-black w-5 h-5 md:w-7 md:h-7" />
              )}
              <span className="text-[11px] md:text-sm text-black">
                {item.date}
              </span>
              <span className="text-[11px] md:text-sm text-black">
                {item.plan}
              </span>
            </div>
            <span className="font-semibold text-xs md:text-base text-black">
              {item.amount}
            </span>
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
                  : "bg-white text-black border-black",
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

const formatDateTime = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString.replace(" ", "T"));

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }); // May, Jun, etc.
  const year = date.getFullYear();

  // Add day suffix (st, nd, rd, th)
  const j = day % 10,
    k = day % 100;
  let suffix = "th";
  if (j === 1 && k !== 11) suffix = "st";
  else if (j === 2 && k !== 12) suffix = "nd";
  else if (j === 3 && k !== 13) suffix = "rd";

  return `${day}${suffix} ${month}, ${year}`;
};

const roommate_PLAN_DETAILS: Record<string, { connection: string }> = {
  Instant: { connection: "Unlimited" },
  Explore: { connection: "Unlimited" },
  Go_pro: {
    connection: "Unlimited",
  },
};

const rent_PLAN_DETAILS: Record<string, { connection: string }> = {
  Instant: { connection: "Unlimited" },
  Explore: { connection: "Unlimited" },
  Go_pro: {
    connection: "Unlimited",
  },
};

const Subscriptions = () => {
  const [roommateHistory, setroommateHistory] = useState<any[]>([]);
  const [rentHistory, setrentHistory] = useState<any[]>([]);

  const [roommatePlan, setroommatePlan] = useState<any>({});
  const [rentPlan, setrentPlan] = useState<any>({});

  const [activeTab, setActiveTab] = useState("Roommate");

  const [hasroommatePlan, setHasroommatePlan] = useState(false);
  const [hasrentPlan, setHasrentPlan] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    const user = login?.user || "";

    if (!user) return;

    fetch(`https://cribb.africa/apigets.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getstudentplans", user }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res && res.success) {
          const roommatePlans = res.roommate || [];
          const rentPlans = res.rent || [];

          // ✅ Store all plans for the history lists
          setroommateHistory(roommatePlans);
          setrentHistory(rentPlans);

          // ✅ Check for active running plans
          const activeroommate = roommatePlans.find(
            (p: any) => String(p.status).toLowerCase() === "running",
          );
          const activerent = rentPlans.find(
            (p: any) => String(p.status).toLowerCase() === "running",
          );

          const hasroommatePlan = !!activeroommate;
          const hasrentPlan = !!activerent;

          setHasroommatePlan(hasroommatePlan);
          setHasrentPlan(hasrentPlan);

          // ✅ NEW: set plan data or empty if none
          setroommatePlan(activeroommate || {});
          setrentPlan(activerent || {});
        } else {
          console.warn("getplans returned no data or success=false", res);
        }
      })
      .catch((err) => {
        console.error("Error fetching plans:", err);
      });
  }, []);

  return (
    <div className="bg-white md:py-10 mb-20">
      <section className="px-3 md:px-10 flex justify-center">
        <div className="w-full">
          <SectionHeader title="Subscriptions" />

          <div className="mt-10 rounded-3xl border-4 border-black p-1 md:p-5 bg-[#F4F6F5]">
            <Tabs active={activeTab} setActive={setActiveTab} />

            {/* roommate Tab */}
            {activeTab === "Roommate" && (
              <div className="p-2 md:p-5 mt-5 md:w-2/3">
                {!hasroommatePlan && (
                  <div className="flex flex-col mb-5 bg-transparent">
                    {/* show button only if there's no running roommate plan */}

                    <button
                      onClick={() => navigate("/roommateplan")}
                      className="w-full flex items-center justify-center gap-3 rounded-full font-normal bg-black px-4 py-4 shadow-sm text-lg text-white"
                    >
                      <HiOutlineUsers className="w-8 h-8" />
                      Get a Roommate Plan
                    </button>

                    {/* if they DO have an roommate plan, you may choose to show something else — left unchanged */}
                  </div>
                )}
                <div className="grid mb-10 w-full grid-cols-2 gap-4 md:gap-6">
                  {hasroommatePlan && (
                    <>
                      {" "}
                      <div>
                        <Label>CURRENT PLAN</Label>
                        <InfoPill>
                          <div className="inline-flex items-center justify-between w-full">
                            <span className="text-xs md:text-sm text-black">
                              {roommatePlan.plan ? roommatePlan.plan : ""}
                            </span>
                            <RiInformationLine size={14} className="ml-auto" />
                          </div>
                        </InfoPill>
                      </div>
                      <div>
                        <Label>VALID UNTIL</Label>
                        <InfoPill>
                          <div className="inline-flex items-center justify-between w-full">
                            <span className="text-xs md:text-sm text-black">
                              {roommatePlan.expires_at
                                ? formatDateTime(roommatePlan.expires_at)
                                : ""}
                            </span>
                            <RiInformationLine size={14} className="ml-auto" />
                          </div>
                        </InfoPill>
                      </div>
                      <div className="col-span-2">
                        <Label>CONNECTION</Label>
                        <InfoPill>
                          <div className="inline-flex items-center justify-between w-full">
                            <span className="text-xs md:text-sm">
                              {roommate_PLAN_DETAILS[roommatePlan.plan]
                                ?.connection || ""}
                            </span>
                            <RiInformationLine size={14} className="ml-auto" />
                          </div>
                        </InfoPill>
                      </div>
                    </>
                  )}
                  <div className="col-span-2 flex mt-4 justify-between px-8">
                    <button
                      disabled={!hasroommatePlan}
                      onClick={() => navigate("/roommateplan")}
                      className={`cursor-pointer py-2 px-3 md:py-3 md:px-6 text-sm md:text-md font-medium shadow-lg rounded-lg ${
                        !hasroommatePlan
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-black text-white"
                      }`}
                    >
                      UPGRADE
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-10 mb-5">
                  <span className="text-sm md:text-md font-semibold text-black  tracking-wide">
                    --- HISTORY --------------------
                  </span>
                </div>
                <PaginatedList
                  data={roommateHistory.map((plan: any, index: number) => ({
                    id: plan.id || index,
                    date: formatDateTime(plan.created_at),
                    plan: plan.plan,
                    amount: plan.amount ? `₦${plan.amount}` : "₦0",
                    status: plan.status,
                  }))}
                />
              </div>
            )}

            {/* rent Tab */}
            {activeTab === "Rent" && (
              <div className="p-2 md:p-5 mt-5 md:w-2/3">
                {!hasrentPlan && (
                  <div className="flex flex-col mb-5 bg-transparent">
                    {/* show button only if there's no running rent plan */}

                    <button
                      onClick={() => navigate("/rentplan")}
                      className="w-full flex items-center justify-center gap-3 rounded-full font-normal bg-black px-4 py-4 shadow-sm text-lg text-white"
                    >
                      <PiHouse className="w-8 h-8" />
                      Get a Rent Plan
                    </button>
                  </div>
                )}

                <div className="grid mb-10 w-full grid-cols-2 gap-4 md:gap-6">
                  {hasrentPlan && (
                    <>
                      {" "}
                      <div>
                        <Label>CURRENT PLAN</Label>
                        <InfoPill>
                          <div className="inline-flex items-center justify-between w-full">
                            <span className="text-xs md:text-sm text-black">
                              {rentPlan.plan ? rentPlan.plan : ""}
                            </span>
                            <RiInformationLine size={14} className="ml-auto" />
                          </div>
                        </InfoPill>
                      </div>
                      <div>
                        <Label>VALID UNTIL</Label>
                        <InfoPill>
                          <div className="inline-flex items-center justify-between w-full">
                            <span className="text-xs md:text-sm text-black">
                              {rentPlan.expires_at
                                ? formatDateTime(rentPlan.expires_at)
                                : ""}
                            </span>
                            <RiInformationLine size={14} className="ml-auto" />
                          </div>
                        </InfoPill>
                      </div>
                      <div className="col-span-2">
                        <Label>CONNECTION</Label>
                        <InfoPill>
                          <div className="inline-flex items-center justify-between w-full">
                            <span className="text-xs md:text-sm">
                              {rent_PLAN_DETAILS[rentPlan.plan]?.connection ||
                                ""}
                            </span>
                            <RiInformationLine size={14} className="ml-auto" />
                          </div>
                        </InfoPill>
                      </div>
                    </>
                  )}
                  <div className="col-span-2 flex mt-4 justify-between px-8">
                    <button
                      disabled={!hasrentPlan}
                      onClick={() => navigate("/rentplan")}
                      className={`cursor-pointer py-2 px-3 md:py-3 md:px-6 text-sm md:text-md font-medium shadow-lg rounded-lg ${
                        !hasrentPlan
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-black text-white"
                      }`}
                    >
                      UPGRADE
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-10 mb-5">
                  <span className="text-sm md:text-md font-semibold text-black  tracking-wide">
                    --- HISTORY --------------------
                  </span>
                </div>
                <PaginatedList
                  data={rentHistory.map((plan: any, index: number) => ({
                    id: plan.id || index,
                    date: formatDateTime(plan.created_at),
                    plan: plan.plan,
                    amount: plan.amount ? `₦${plan.amount}` : "₦0",
                    status: plan.status,
                  }))}
                />
              </div>
            )}

            {/* Vendor Tab */}
            {activeTab === "Marketplace" && (
              <div className="p-2 md:p-5 mt-5 md:w-2/3">
                <div className="flex flex-col gap-8 bg-transparent">
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
