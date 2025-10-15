import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { MdDoubleArrow, MdOutlineFlashOn } from "react-icons/md";
import { BiWorld } from "react-icons/bi";
import { HiOutlineUserCircle } from "react-icons/hi";
import { TbUserSquare } from "react-icons/tb";
import clsx from "clsx";
import { DfButton } from "../../components/Pill";
import InfoPill from "../../components/Pill";
import logo from "../../assets/logo.png";
import nigeriaflag from "../../assets/nigeriaflag.png";
import { useNavigate } from "react-router-dom";
import { AiOutlineTag } from "react-icons/ai";

declare const PaystackPop: any;

function Maincard({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={["rounded-4xl md:px-5 border-4 shadow", className].join(" ")}
    >
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
    <div className="px-5 pt-10 pb-5">
      <h3 className="text-xl md:text-3xl font-medium text-center">{title}</h3>
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
        "text-sm md:text-md md:my-3 font-semibold ml-0",
        className
      )}
    >
      {children}
    </div>
  );
}

// ✅ Pricing tables
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

const BusinessPlan = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<"Agent" | "Landlord">("Agent");
  const [activePlan, setActivePlan] =
    useState<keyof typeof AgentPlans>("INSTANT");
  const [email, setEmail] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [user, setUser] = useState("");

  // ✅ Load Paystack once
  useEffect(() => {
    const src = "https://js.paystack.co/v1/inline.js";
    if (!document.querySelector(`script[src="${src}"]`)) {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // ✅ Fetch session data and set category/email/user
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    if (data?.category) setCategory(data.category);
    if (data?.email) setLoginEmail(data.email);
    if (data?.user) setUser(data.user);
  }, []);

  const currentPlans = category === "Agent" ? AgentPlans : LandlordPlans;
  const current = currentPlans[activePlan];

  const extractAmount = (price: string) =>
    parseInt(price.replace(/[^\d]/g, ""), 10);

  const handlePaystack = () => {
    const amount = extractAmount(current.price) * 100 + 200;
    const userEmail = email || loginEmail;

    if (!userEmail) {
      alert("Please provide your email address before proceeding.");
      return;
    }
    if (typeof PaystackPop === "undefined") {
      alert("Payment gateway not loaded yet. Please wait a moment.");
      return;
    }

    // ✅ Use new reference format
    const ref = `cribb_${category}_${extractAmount(current.price)}_${user}`;

    const handler = PaystackPop.setup({
      key: "pk_live_e7e226db6e7b774d5fc940646959c622a606e546",
      email: userEmail,
      amount,
      ref,
      onClose: () => alert("Payment window closed."),
      callback: (response: any) => {
        alert("Payment successful! Reference: " + response.reference);
        navigate("/businessrequests");
      },
    });

    handler.openIframe();
  };

  return (
    <div className="bg-[#F3EDFE] pb-10 min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 grid grid-cols-[1fr_auto] md:grid-cols-3 items-center px-4 md:px-6 py-3 md:py-4 shadow-sm bg-white z-50 border-b">
        <div className="hidden md:flex justify-center">
          <div className="rounded-full bg-black">
            <img
              src={nigeriaflag}
              alt="Nigeria Flag"
              className="h-7 md:h-12 object-contain p-3"
            />
          </div>
        </div>

        <div className="flex justify-start md:justify-center items-start gap-1 col-span-1 md:px-3">
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

        {/* Removed toggle button */}
        <div></div>
      </nav>

      {/* Header Section */}
      <div className="w-full bg-[#1C0B3D] md:pb-8 pt-8 text-white shadow">
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
              <span className="inline-flex items-center gap-2 rounded-lg border-2 px-1 py-2 md:px-3 md:py-4 md:text-lg font-md text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-white/15">
                <HiOutlineUserCircle className="h-6 w-6 md:h-10 md:w-10" />{" "}
                AGENT
              </span>
            )}
            {category === "Landlord" && (
              <span className="inline-flex items-center gap-2 rounded-lg border-2 px-1 py-2 md:px-3 md:py-4 md:text-lg font-md text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-white/15">
                <TbUserSquare className="h-6 w-6 md:h-10 md:w-10" /> LANDLORD
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <section className="justify-center my-10 md:my-20 flex">
        <div className="mx-2 md:mx-30 justify-center w-full md:w-1/2 grid grid-cols-1">
          <Maincard className="bg-[#F4F6F5] pb-5">
            <SectionHeader
              title="Plan"
              caption="Simple, Transparent Plans based on your need"
            />

            <div>
              <div className="grid m-2 md:m-0 grid-cols-3 gap-4 border border-dashed border-gray-40 bg-white p-3 rounded-lg">
                {Object.keys(currentPlans).map((plan) => (
                  <button
                    key={plan}
                    onClick={() =>
                      setActivePlan(plan as keyof typeof currentPlans)
                    }
                    className={clsx(
                      "w-full flex items-center justify-center gap-1 md:gap-2 p-1 md:p-3 rounded-lg",
                      activePlan === plan
                        ? "bg-black text-white"
                        : "bg-transparent text-black"
                    )}
                  >
                    {plan === "INSTANT" && (
                      <MdOutlineFlashOn className="text-md md:text-4xl" />
                    )}
                    {plan === "EXPLORE" && (
                      <BiWorld className="text-md md:text-4xl" />
                    )}
                    {plan === "GO PRO" && (
                      <MdDoubleArrow className="text-md md:text-4xl" />
                    )}
                    <span className="text-xs md:text-2xl">{plan}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Plan Details */}
            <div className="px-5 pt-5 pb-4 space-y-4">
              <div className="space-y-1">
                <Label className="ml-8">Service Amount</Label>
                <InfoPill>
                  <div className="inline-flex items-center justify-between w-full">
                    <span className="font-bold text-lg py-1">
                      {current.price}
                    </span>
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
                  <small className="bg-white p-2 rounded-lg text-xs md:text-base">
                    {current.tag}
                  </small>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="ml-8">Features</Label>
                <div className="rounded-2xl bg-white mx-1 border-1 p-3">
                  {current.features.map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center text-xs justify-between py-2 px-4 md:text-base"
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
                <Label className="ml-8">Email</Label>
                <InfoPill className="bg-white">
                  <input
                    type="email"
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

            <div
              className="mt-1 mb-5 mx-5 md:w-95 border-t-4 md:mx-auto text-[#0000004D]"
              style={{
                borderStyle: "dashed",
                borderImage:
                  "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
              }}
            />
            <div className="w-full flex text-xs md:text-sm md:pt-5 justify-end px-5">
              <span
                className="text-[#0556F8] cursor-pointer"
                onClick={() => navigate("/businessdash")}
              >
                Continue to Dashboard{" "}
              </span>
            </div>
          </Maincard>
        </div>
      </section>
    </div>
  );
};

export default BusinessPlan;
