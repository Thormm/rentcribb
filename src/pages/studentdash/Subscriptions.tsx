import { useEffect, useState } from "react";
import clsx from "clsx";
import { BsQuestionCircle } from "react-icons/bs";
import { GrStatusGood } from "react-icons/gr";
import InfoPill from "../../components/Pill";
import { MdOutlinePending } from "react-icons/md";
import { FiMail } from "react-icons/fi";
import { TbUserSquare } from "react-icons/tb";
import { RiInformationLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

// Reusable Label
type LabelProps = React.PropsWithChildren<{ className?: string }>;
function Label({ children, className }: LabelProps) {
  return (
    <div
      className={clsx(
        "text-sm md:text-lg pl-5 md:pl-8 md:my-3 font-semibold text-black",
        className
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
            className="flex md:w-2/3  justify-between items-center px-4 md:px-8 py-3 md:py-5 rounded-4xl border border-black"
          >
            <div className="flex items-center gap-3">
              {item.status === "done" ? (
                <GrStatusGood className="text-black w-4 h-4 md:w-7 md:h-7" />
              ) : (
                <MdOutlinePending className="text-black w-4 h-4 md:w-7 md:h-7" />
              )}
              <span className="text-[9px] md:text-sm text-black">
                {item.date}
              </span>
              <span className="text-[9px] md:text-sm text-black">
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

const AGENT_PLAN_DETAILS: Record<
  string,
  { listing: string; connection: string }
> = {
  free: { listing: "Unlimited", connection: "Unlimited" },
  basic: { listing: "10 Listings", connection: "20 Connections" },
  premium: {
    listing: "Unlimited Listings",
    connection: "Unlimited Connections",
  },
};

const LANDLORD_PLAN_DETAILS: Record<
  string,
  { listing: string; connection: string }
> = {
  free: { listing: "Unlimited", connection: "Unlimited" },
  basic: { listing: "10 Listings", connection: "20 Connections" },
  premium: {
    listing: "Unlimited Listings",
    connection: "Unlimited Connections",
  },
};

const Subscriptions = () => {
  const [agentHistory, setAgentHistory] = useState<any[]>([]);
  const [landlordHistory, setLandlordHistory] = useState<any[]>([]);

  const [agentPlan, setAgentPlan] = useState<any>({});
  const [landlordPlan, setLandlordPlan] = useState<any>({});

  const [showCongrats, setCongrats] = useState(false);
  const [activeTab, setActiveTab] = useState("Agent");
  const [agentFilled, setHasAgentEmail] = useState<boolean | undefined>(
    undefined
  );
  const [landlordFilled, setHasLandlordEmail] = useState<boolean | undefined>(
    undefined
  );
  const [hasAgentPlan, setHasAgentPlan] = useState(false);
  const [hasLandlordPlan, setHasLandlordPlan] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    const user = login?.user || "";

    if (!user) return;

    fetch(`https://cribb.africa/apigets.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getplans", user }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res && res.success) {
          const agentPlans = res.agent || [];
          const landlordPlans = res.landlord || [];

          // ✅ Store all plans for the history lists
          setAgentHistory(agentPlans);
          setLandlordHistory(landlordPlans);

          // ✅ Check for active running plans
          const activeAgent = agentPlans.find(
            (p: any) => String(p.status).toLowerCase() === "running"
          );
          const activeLandlord = landlordPlans.find(
            (p: any) => String(p.status).toLowerCase() === "running"
          );

          const hasAgentPlan = !!activeAgent;
          const hasLandlordPlan = !!activeLandlord;

          setHasAgentPlan(hasAgentPlan);
          setHasLandlordPlan(hasLandlordPlan);

          // ✅ Optional: email presence flags (if you need them)
          setHasAgentEmail?.(res.agent_email_present);
          setHasLandlordEmail?.(res.landlord_email_present);

          // ✅ NEW: set plan data or empty if none
          setAgentPlan(activeAgent || {});
          setLandlordPlan(activeLandlord || {});
        } else {
          console.warn("getplans returned no data or success=false", res);
        }
      })
      .catch((err) => {
        console.error("Error fetching plans:", err);
      });
  }, []);

  // freeplan function referenced in your modal
  const freeplan = async (category: "Agent" | "Landlord"): Promise<void> => {
    const login_data = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    const signup_key = login_data.signup_key;
    const user = login_data.user;

    try {
      const response = await fetch("https://www.cribb.africa/api_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          freeplan: true,
          user,
          mode: "student",
          signup_key,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCongrats(true);
      } else {
        alert(data.message || "Failed to save data.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Network or server error. Please try again.");
    }
  };

  const handleClickRole = (role: "agent" | "landlord") => {
    if (
      (role === "agent" && !agentFilled) ||
      (role === "landlord" && !landlordFilled)
    ) {
      const loginData = JSON.parse(
        sessionStorage.getItem("login_data") || "{}"
      );
      const updatedData = { ...loginData, verification: 0 };
      // Save it back to sessionStorage
      sessionStorage.setItem("login_data", JSON.stringify(updatedData));
      navigate("/businessonboarding");
      return;
    }

    // ✅ navigate with role param
    navigate(`/businessplan?role=${role}`);
  };

  return (
    <div className="bg-white md:py-10 mb-20">
      <section className="px-3 md:px-10 flex justify-center">
        <div className="w-full">
          <SectionHeader title="Subscriptions" />

          <div className="mt-10 rounded-3xl border-4 border-black p-1 md:p-5 bg-[#F4F6F5]">
            <Tabs active={activeTab} setActive={setActiveTab} />

            {/* Agent Tab */}
            {activeTab === "Agent" && (
              <div className="px-2 pt-5 md:p-5 md:mt-5">
                <div className="flex flex-col gap-8 mb-5 bg-transparent">
                  {/* show button only if there's no running agent plan */}
                  {!hasAgentPlan && (
                    <button
                      onClick={() => handleClickRole("agent")}
                      className="md:w-md flex items-center justify-center gap-3 rounded-full font-normal bg-black px-3 md:px-5 py-2 md:py-3 shadow-sm text-sm md:text-md text-white"
                    >
                      <TbUserSquare className="w-8 h-8" />
                      {agentFilled === false
                        ? "Become an Agent >>"
                        : "Get an Agent Plan >>"}
                    </button>
                  )}

                  {/* if they DO have an agent plan, you may choose to show something else — left unchanged */}
                </div>
                <div className="grid mb-10 md:w-2/3 grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1 col-span-2 md:col-span-1">
                    <Label>CURRENT PLAN</Label>
                    <InfoPill className="flex items-center justify-between px-5 md:px-8 max-w-md">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-xs md:text-sm text-black">
                          {agentPlan.plan ? agentPlan.plan : ""}
                        </span>
                        <RiInformationLine size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  <div className="space-y-1 col-span-2 md:col-span-1">
                    <Label>VALID UNTIL</Label>
                    <InfoPill className="flex items-center justify-between px-5 md:px-8 max-w-md">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-xs md:text-sm text-black">
                          {agentPlan.expires_at
                            ? formatDateTime(agentPlan.expires_at)
                            : ""}
                        </span>
                        <RiInformationLine size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  {/* LISTING LIMIT and CONNECTION */}
                  <div>
                    <Label>LISTING LIMIT</Label>
                    <InfoPill className="flex items-center justify-between px-5 md:px-8 max-w-md">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-xs md:text-sm">
                          {AGENT_PLAN_DETAILS[agentPlan.plan?.toLowerCase()]
                            ?.listing || ""}
                        </span>
                        <RiInformationLine size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>
                  <div>
                    <Label>CONNECTION</Label>
                    <InfoPill className="flex items-center justify-between px-5 md:px-8 max-w-md">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-xs md:text-sm">
                          {AGENT_PLAN_DETAILS[agentPlan.plan?.toLowerCase()]
                            ?.connection || ""}
                        </span>
                        <RiInformationLine size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  <div className="col-span-2 flex mt-4 justify-between px-8">
                    <button
                      onClick={() => freeplan("Agent")}
                      disabled={hasAgentPlan || !agentFilled}
                      className={`cursor-pointer py-2 px-3 md:py-3 md:px-6 text-sm md:text-md font-medium border-2 rounded-lg shadow-lg
    ${
      hasAgentPlan || !agentFilled
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-white text-black hover:bg-black hover:text-white transition-all duration-200"
    }`}
                    >
                      FREE TRIAL
                    </button>

                    <button
                      disabled={!hasAgentPlan || !agentFilled}
                      className="py-2 px-3 md:py-3 md:px-6 text-sm md:text-md font-medium bg-black text-white shadow-lg rounded-lg"
                    >
                      UPGRADE
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-10 mb-5">
                  <span className="text-md font-semibold text-black tracking-wide">
                    ----- HISTORY --------------------------
                  </span>
                </div>
                <PaginatedList
                  data={agentHistory.map((plan: any, index: number) => ({
                    id: plan.id || index,
                    date: formatDateTime(plan.created_at),
                    plan: plan.plan,
                    amount: plan.amount ? `₦${plan.amount}` : "₦0",
                    status: plan.status,
                  }))}
                />
              </div>
            )}

            {/* Landlord Tab */}
            {activeTab === "Landlord" && (
              <div className="px-2 pt-5 md:p-5 md:mt-5">
                <div className="flex flex-col gap-8 mb-5 bg-transparent">
                  {/* show button only if there's no running landlord plan */}
                  {!hasLandlordPlan && (
                    <button
                      onClick={() => handleClickRole("landlord")}
                      className="md:w-md flex items-center justify-center gap-3 rounded-full font-normal bg-black px-3 md:px-5 py-2 md:py-3 shadow-sm text-sm md:text-md text-white"
                    >
                      <TbUserSquare className="w-8 h-8" />
                      {landlordFilled === false
                        ? "Become a Landlord >>"
                        : "Get a Landlord Plan >>"}
                    </button>
                  )}
                </div>

                <div className="grid mb-10 md:w-2/3 grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1 col-span-2 md:col-span-1">
                    <Label>CURRENT PLAN</Label>
                    <InfoPill className="flex items-center justify-between px-5 md:px-8 max-w-md">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-xs md:text-sm text-black">
                          {landlordPlan.plan ? landlordPlan.plan : ""}
                        </span>
                        <RiInformationLine size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  <div className="space-y-1 col-span-2 md:col-span-1">
                    <Label>VALID UNTIL</Label>
                    <InfoPill className="flex items-center justify-between px-5 md:px-8 max-w-md">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-xs md:text-sm text-black">
                          {landlordPlan.expires_at
                            ? formatDateTime(landlordPlan.expires_at)
                            : ""}
                        </span>
                        <RiInformationLine size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  <div>
                    <Label>LISTING LIMIT</Label>
                    <InfoPill className="flex items-center justify-between px-5 md:px-8 max-w-md">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-xs md:text-sm">
                          {LANDLORD_PLAN_DETAILS[
                            landlordPlan.plan?.toLowerCase()
                          ]?.listing || ""}
                        </span>
                        <RiInformationLine size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  <div>
                    <Label>CONNECTION</Label>
                    <InfoPill className="flex items-center justify-between px-5 md:px-8 max-w-md">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-xs md:text-sm">
                          {LANDLORD_PLAN_DETAILS[
                            landlordPlan.plan?.toLowerCase()
                          ]?.connection || ""}
                        </span>
                        <RiInformationLine size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  <div className="col-span-2 flex mt-4 justify-between px-8">
                    <button
                      onClick={() => freeplan("Landlord")}
                      disabled={!hasLandlordPlan || !landlordFilled}
                      className={`cursor-pointer py-2 px-3 md:py-3 md:px-6 text-sm md:text-md font-medium border-2 rounded-lg shadow-lg
    ${
      hasLandlordPlan || !landlordFilled
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-white text-black hover:bg-black hover:text-white transition-all duration-200"
    }`}
                    >
                      FREE TRIAL
                    </button>
                    <button className="py-2 px-3 md:py-3 md:px-6 text-sm md:text-md font-medium bg-black text-white shadow-lg rounded-lg">
                      UPGRADE
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-10 mb-5">
                  <span className="text-md font-semibold text-black tracking-wide">
                    ----- HISTORY --------------------------
                  </span>
                </div>
                <PaginatedList
                  data={landlordHistory.map((plan: any, index: number) => ({
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
            {activeTab === "Vendor" && (
              <div className="my-10 md:w-2/3">
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
      {showCongrats && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 relative">
            <p className="text-sm text-center text-gray-600 mb-4">
              Your 14-day free trial has started. You have access to all
              features for the next 14 days. Enjoy exploring!
            </p>

            <div className="flex justify-center">
              <button
                className="px-4 py-2 bg-black text-white rounded-lg"
                onClick={() => setCongrats(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
