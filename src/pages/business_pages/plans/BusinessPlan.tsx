import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { IoIosArrowBack } from "react-icons/io";
import { MdDoubleArrow, MdOutlineFlashOn } from "react-icons/md";
import { BiWorld } from "react-icons/bi";
import { HiOutlineUserCircle } from "react-icons/hi";
import { TbUserSquare } from "react-icons/tb";
import clsx from "clsx";
import { DfButton } from "../../../components/Pill";
import InfoPill from "../../../components/Pill";
import logo from "../../../assets/logo.png";
import nigeriaflag from "../../../assets/nigeriaflag.png";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineTag } from "react-icons/ai";
import { useAlert } from "../../../App";

declare const PaystackPop: any;

/* ─────────────────────────────────────────────────────────────────────
   Origin snapshot helpers — local to this file, nothing shared.
   A snapshot is { path: "/businessrequests?user=man", state: { id: 42 } }.
   The caller writes it before navigating here via `rememberBusinessPlanOrigin`.
   ───────────────────────────────────────────────────────────────────── */
const RETURN_PATH_KEY = "businessplan_return_path";
const RETURN_STATE_KEY = "businessplan_return_state";

type OriginSnapshot = {
  path: string;
  state: any;
};

function rememberBusinessPlanOrigin(state: any = null) {
  try {
    sessionStorage.setItem(
      RETURN_PATH_KEY,
      window.location.pathname +
        window.location.search +
        window.location.hash,
    );
    if (state != null) {
      sessionStorage.setItem(RETURN_STATE_KEY, JSON.stringify(state));
    }
  } catch (err) {
    console.warn("[BusinessPlan] failed to store origin:", err);
  }
}

/** Export the writer so any page can call it before navigating here. */
export { rememberBusinessPlanOrigin };

function readBusinessPlanOrigin(): OriginSnapshot | null {
  const path = sessionStorage.getItem(RETURN_PATH_KEY);
  if (!path) return null;

  let state: any = null;
  const rawState = sessionStorage.getItem(RETURN_STATE_KEY);
  if (rawState) {
    try {
      state = JSON.parse(rawState);
    } catch {
      state = null;
    }
  }

  return { path, state };
}

function clearBusinessPlanOrigin() {
  sessionStorage.removeItem(RETURN_PATH_KEY);
  sessionStorage.removeItem(RETURN_STATE_KEY);
}

function isAuthPath(p: string): boolean {
  return (
    p === "/login" ||
    p === "/signup" ||
    p.startsWith("/login?") ||
    p.startsWith("/signup?") ||
    p.includes("/forgotpassword")
  );
}

/* ───────────────────────────── UI helpers ──────────────────────────── */

function Maincard({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={["rounded-4xl px-5 border-4 shadow", className].join(" ")}>
      {children}
    </div>
  );
}

function SectionHeader({
  title,
  caption,
}: {
  title: string;
  caption?: string;
}) {
  return (
    <div className="pt-8 md:px-5">
      <h3 className="text-3xl font-medium text-center">{title}</h3>
      <p className="text-center text-xs md:text-md pt-3">
        {caption ?? "Check out the Features of this Hostel"}
      </p>
      <div
        className="mt-1 md:w-95 border-t-4 mx-auto text-[#0000004D]"
        style={{
          borderStyle: "dashed",
          borderImage:
            "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
        }}
      />
    </div>
  );
}

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

/* ───────────────────────────── Plans ──────────────────────────────── */

const AgentPlans = {
  INSTANT: {
    price: "₦10,000",
    tag: "For Listing a Single Space : Pay-As-You-Go",
    discount: 0,
    features: [
      ["Max No. Listing", "1"],
      ["Duration", "3 Months"],
      ["Replying Requests", "Free"],
      ["Max No. Connection", "Unlimited"],
    ],
  },
  EXPLORE: {
    price: "₦20,000",
    tag: "Monthly Plan for Full Access : Subscription",
    discount: 0,
    features: [
      ["Max No. Listing", "Unlimited"],
      ["Duration", "30 Days"],
      ["Replying Requests", "Free"],
      ["Max No. Connection", "Unlimited"],
    ],
  },
  "GO PRO": {
    price: "₦50,000",
    tag: "Quarterly Plan for Full Access : Subscription",
    discount: 16,
    features: [
      ["Max No. Listing", "Unlimited"],
      ["Duration", "3 Months"],
      ["Replying Requests", "Free"],
      ["Max No. Connection", "Unlimited"],
    ],
  },
};

const LandlordPlans = {
  INSTANT: {
    price: "₦10,000",
    discount: 0,
    tag: "For Listing a Single Space : Pay-As-You-Go",
    features: [
      ["Max No. Listing", "1"],
      ["Duration", "3 Months"],
      ["Replying Requests", "Free"],
      ["Max No. Connection", "Unlimited"],
    ],
  },
  EXPLORE: {
    price: "₦20,000",
    discount: 0,
    tag: "Monthly Plan for Full Access : Subscription",
    features: [
      ["Max No. Listing", "Unlimited"],
      ["Duration", "30 Days"],
      ["Replying Requests", "Free"],
      ["Max No. Connection", "Unlimited"],
    ],
  },
  "GO PRO": {
    price: "₦50,000",
    discount: 16,
    tag: "Quarterly Plan for Full Access : Subscription",
    features: [
      ["Max No. Listing", "Unlimited"],
      ["Duration", "3 Months"],
      ["Replying Requests", "Free"],
      ["Max No. Connection", "Unlimited"],
    ],
  },
};

/* ───────────────────────────── Component ──────────────────────────── */

const BusinessPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useAlert();

  const [category, setCategory] = useState<"Agent" | "Landlord">("Agent");
  const [activePlan, setActivePlan] =
    useState<keyof typeof AgentPlans>("INSTANT");
  const [email, setEmail] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [user, setUser] = useState("");

  const currentPlans = category === "Agent" ? AgentPlans : LandlordPlans;
  const current = currentPlans[activePlan];

  // ─── 1. Load Paystack once ───────────────────────────────────────────
  useEffect(() => {
    const src = "https://js.paystack.co/v1/inline.js";
    if (!document.querySelector(`script[src="${src}"]`)) {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // ─── 2. Read ?role= → set category, fall back to stored role ─────────
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get("role");

    if (role === "agent") setCategory("Agent");
    else if (role === "landlord") setCategory("Landlord");
    else {
      const storedRole = sessionStorage.getItem("businessplan_active_role");
      if (storedRole === "Agent" || storedRole === "Landlord") {
        setCategory(storedRole);
      }
    }

    const data = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    if (data?.email) setLoginEmail(data.email);
    if (data?.user) setUser(data.user);
  }, [location.search]);

  // ─── 3. Persist category so toggle survives reloads ──────────────────
  useEffect(() => {
    sessionStorage.setItem("businessplan_active_role", category);
  }, [category]);

  // ─── 4. Restore active plan after a manual refresh ───────────────────
  useEffect(() => {
    const saved = sessionStorage.getItem("businessplan_active_plan");
    if (saved && saved in currentPlans) {
      setActivePlan(saved as keyof typeof currentPlans);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // ─── 5. Back: snapshot → state.from → referrer → navigate(-1) ────────
  const goBackToPrevious = () => {
    // 1. Snapshot written by the caller via rememberBusinessPlanOrigin(...)
    const snapshot = readBusinessPlanOrigin();
    clearBusinessPlanOrigin();

    if (snapshot?.path) {
      if (/^https?:\/\//i.test(snapshot.path)) {
        window.location.href = snapshot.path;
        return;
      }
      // ✅ State preserved verbatim — { id }, { from }, anything
      navigate(snapshot.path, { state: snapshot.state ?? undefined });
      return;
    }

    // 2. React Router state on this entry
    const stateFrom = (location.state as any)?.from;
    if (stateFrom) {
      navigate(stateFrom, {
        state: (location.state as any).returnState,
      });
      return;
    }

    // 3. Referrer — reject same path & auth pages
    const ref = document.referrer;
    if (ref && ref !== window.location.href) {
      try {
        const u = new URL(ref);
        const samePath =
          u.origin === window.location.origin &&
          u.pathname === location.pathname;
        if (!samePath && !isAuthPath(u.pathname)) {
          navigate(u.pathname + u.search);
          return;
        }
      } catch {
        /* non-URL referrer, ignore */
      }
    }

    // 4. Nothing → browser history
    navigate(-1);
  };

  // ─── 6. Toggle role — replace history (no new entry, no shuffle) ─────
  const toggleRole = () => {
    const nextRole = category === "Agent" ? "landlord" : "agent";
    const nextCategory: "Agent" | "Landlord" =
      nextRole === "landlord" ? "Landlord" : "Agent";

    sessionStorage.setItem("businessplan_active_plan", activePlan);
    sessionStorage.setItem("businessplan_active_role", nextCategory);

    const params = new URLSearchParams(location.search);
    params.set("role", nextRole);

    // replace: true → doesn't add a history entry, so the back
    // button still points at the REAL origin (e.g. /businessrequests)
    navigate(`${location.pathname}?${params.toString()}`, {
      replace: true,
    });
  };

  const extractAmount = (price: string) =>
    parseInt(price.replace(/[^\d]/g, ""), 10);

  const handlePaystack = () => {
    const amount = extractAmount(current.price) * 100 + 200;
    const userEmail = email || loginEmail;

    if (!userEmail) {
      showAlert(
        "Please provide your email address before proceeding.",
        "warning",
      );
      return;
    }
    if (typeof PaystackPop === "undefined") {
      showAlert(
        "Payment gateway not loaded yet. Please wait a moment.",
        "warning",
      );
      return;
    }

    const random = Math.random().toString(36).substring(2, 10);
    const ref = `cribb_Rent_${extractAmount(current.price)}_${user}_${random}`;

    const handler = PaystackPop.setup({
      key: "pk_live_e7e226db6e7b774d5fc940646959c622a606e546",
      email: userEmail,
      amount,
      ref,
      onClose: () => showAlert("Payment window closed.", "info"),
      callback: (response: any) => {
        if (response?.status === "success" || response?.reference) {
          showAlert(
            "Successful Transaction Please continue to confirm transactions",
            "success",
          );

          setTimeout(() => {
            goBackToPrevious();
          }, 500);
        } else {
          showAlert("Transaction was not completed.", "warning");
        }
      },
    });

    handler.openIframe();
  };

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 grid grid-cols-[1fr_auto] md:grid-cols-3 items-center px-4 md:px-6 py-3 md:py-4 shadow-sm bg-white z-50 border-b">
        {/* Left: Flag */}
        <div className="hidden md:flex justify-center">
          <div className="rounded-full bg-black">
            <img
              src={nigeriaflag}
              alt="Nigeria Flag"
              className="h-7 md:h-12 object-contain p-3"
            />
          </div>
        </div>

        {/* Center: Logo */}
        <div
          className="flex justify-start md:justify-center items-start gap-1 col-span-1 md:px-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="Cribb.Africa Logo"
            className="m-0 p-0 h-8 md:h-11"
          />
          <div className="flex flex-col items-end p-0 m-0">
            <span className="text-2xl p-0 m-0 md:text-4xl font-extrabold">
              Cribb
            </span>
            <span className="text-[10px] pr-1 -mt-2 md:text-sm text-black self-end">
              for Business
            </span>
          </div>
        </div>

        {/* Right: Role toggle */}
        <div className="flex justify-end md:justify-center items-center gap-2">
          <div className="md:hidden rounded-full bg-black p-2 shrink-0">
            <img
              src={nigeriaflag}
              alt="Nigeria Flag"
              className="h-4 md:h-8 object-contain"
            />
          </div>
          <button
            onClick={toggleRole}
            className="px-3 cursor-pointer md:px-5 py-2 md:py-3 bg-black flex items-center gap-2 text-white rounded-lg shadow-md whitespace-nowrap"
          >
            <span className="text-[8px] md:text-[15px] underline">
              {category === "Agent"
                ? "PRICING FOR /LANDLORD >>"
                : "PRICING FOR /AGENT >>"}
            </span>
          </button>
        </div>
      </nav>

      <div className="bg-[#F3EDFE] pb-10 min-h-screen place-items-center">
        {/* Header Section */}
        <div className="w-full  bg-[#1C0B3D] md:pb-8 pt-8 text-white shadow">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="text-sm md:text-lg font-semibold text-[#FFA1A1]">
              PRICING
            </div>
            <div className="mt-1 flex items-center justify-between gap-4">
              <h1 className="text-lg md:text-4xl my-4 font-extrabold ">
                {category === "Agent"
                  ? "Become an Agent on"
                  : "Become a Landlord on"}{" "}
                <span className="text-[#C2C8DA]">Cribb</span>
              </h1>

              {category === "Agent" && (
                <span className="w-50 justify-center inline-flex items-center gap-2 rounded-lg border-2 px-1 py-2 md:px-3 md:py-4 md:text-lg font-md text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-white/15">
                  <HiOutlineUserCircle className="h-6 w-6 md:h-10 md:w-10" />{" "}
                  AGENT
                </span>
              )}
              {category === "Landlord" && (
                <span className="w-50 justify-center inline-flex items-center gap-2 rounded-lg border-2 px-1 py-2 md:px-3 md:py-4 md:text-lg font-md text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-white/15">
                  <TbUserSquare className="h-6 w-6 md:h-10 md:w-10" /> LANDLORD
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <section className=" justify-center w-full px-4 md:w-[1200px] my-10 md:my-20 flex">
          <div className="relative justify-center w-full md:w-1/2 grid grid-cols-1">
            {/* Back button → previous page */}
            <div
              className="border-2 border-black absolute -top-3 -left-3 w-12 h-12 rounded-full bg-black flex items-center justify-center cursor-pointer"
              onClick={goBackToPrevious}
            >
              <IoIosArrowBack className="text-white text-2xl" />
            </div>

            <Maincard className="bg-[#F4F6F5] pb-5">
              <SectionHeader
                title="Plan"
                caption="Simple, Transparent Plans based on your need"
              />

              <div
                className="grid grid-cols-3 gap-4 mt-3 md:mt-5 bg-white p-3 rounded-lg"
                style={{
                  borderStyle: "dashed",
                  borderColor: "#0000004D",
                  borderWidth: "1px",
                }}
              >
                {Object.keys(currentPlans).map((plan) => {
                  const isActive = activePlan === plan;

                  return (
                    <button
                      key={plan}
                      onClick={() =>
                        setActivePlan(plan as keyof typeof currentPlans)
                      }
                      className={clsx(
                        "flex items-center justify-center gap-2 rounded-lg md:px-3 py-2 font-semibold transition-colors duration-200 border",
                        isActive
                          ? "bg-black text-[#D6FFC3] border-black shadow-md"
                          : "bg-white text-black border-gray-300 hover:bg-gray-100",
                      )}
                    >
                      {plan === "INSTANT" && (
                        <MdOutlineFlashOn className="text-md md:text-2xl" />
                      )}
                      {plan === "EXPLORE" && (
                        <BiWorld className="text-md md:text-2xl" />
                      )}
                      {plan === "GO PRO" && (
                        <MdDoubleArrow className="text-md md:text-2xl" />
                      )}

                      <span className="text-xs md:text-lg">{plan}</span>
                    </button>
                  );
                })}
              </div>

              {/* Plan Details */}
              <div className="pt-5 pb-4 space-y-4">
                <div className="space-y-1">
                  <Label>SERVICE AMOUNT</Label>
                  <InfoPill>
                    <div className="inline-flex items-center justify-between w-full">
                      <span className="font-bold py-1">{current.price}</span>
                      {current.discount > 0 && (
                        <span className="flex items-center font-semibold gap-2 bg-[#FFA9A9] p-2 rounded-lg md:rounded-2xl">
                          <AiOutlineTag className="text-lg md:text-2xl" />
                          <span className="text-xs md:text-sm">
                            {current.discount}% - OFF
                          </span>
                        </span>
                      )}
                    </div>
                  </InfoPill>

                  <div className="w-full flex justify-end mr-5 mt-2">
                    <small className="bg-white p-2 rounded-lg text-xs md:text-md">
                      {current.tag}
                    </small>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>FEATURES</Label>
                  <div className="rounded-2xl bg-white mx-1 border-1 p-3">
                    {current.features.map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center text-xs justify-between py-2 px-2 md:text-base"
                      >
                        <span>{label}</span>
                        <span className="inline-flex text-xs md:text-base items-center gap-2">
                          {value} <Info size={20} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="mt-1 md:w-95 border-t-4 mx-auto text-[#0000004D]"
                  style={{
                    borderStyle: "dashed",
                    borderImage:
                      "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
                  }}
                />

                <div className="space-y-1">
                  <Label>EMAIL</Label>
                  <InfoPill className="bg-white">
                    <input
                      type="email"
                      readOnly
                      placeholder={loginEmail || "Enter your email"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full outline-none text-md py-1"
                    />
                  </InfoPill>
                </div>

                <div className="pt-2 w-full flex justify-center mt-10 cursor-pointer">
                  <DfButton onClick={handlePaystack}>NEXT</DfButton>
                </div>
              </div>
            </Maincard>
          </div>
        </section>
      </div>
    </>
  );
};

export default BusinessPlan;