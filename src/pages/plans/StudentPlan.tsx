import { Info } from "lucide-react";
import { MdDoubleArrow, MdOutlineFlashOn } from "react-icons/md";
import { BiWorld } from "react-icons/bi";
import { useState } from "react";
import { DfButton } from "../../components/Pill";

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
    <div className="px-5 pt-10">
      <h3 className="text-4xl font-medium text-center">{title}</h3>
      <p className="text-center text-md pt-3">
        {caption ?? "Check out the Features of this Hostel"}
      </p>
      <div
        className="mt-1 w-95 border-t-4 mx-auto text-[#0000004D]"
        style={{
          borderStyle: "dashed",
          borderImage:
            "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
        }}
      />
    </div>
  );
}

import InfoPill from "../../components/Pill";
import clsx from "clsx";

type LabelProps = React.PropsWithChildren<{
  className?: string;
}>;

function Label({ children, className }: LabelProps) {
  return (
    <div className={clsx("text-md my-5 font-semibold ml-0", className)}>
      {children}
    </div>
  );
}

// Mock plan data
const plans = {
  INSTANT: {
    price: "₦10,000",
     tag: "For a Quick and Single Connect : Pay-As-You-Go",
    features: [
      ["No. of Connections", "<< up to 1 Host"],
      ["No. of Requests", "<< up to 3 Post"],
      ["Duration", "No limit"],
      ["Posting Request", "Free"],
    ],
  },
  EXPLORE: {
    price: "₦20,000",
    tag: "For Exploring your Choices",
    features: [
      ["No. of Connections", "<< Up to 3 Host "],
      ["No. of Requests", "<< Up to 3 Posts"],
      ["Duration", "No Limit"],
      ["Posting Request", "Free"],
    ],
  },
  "GO PRO": {
    price: "₦50,000",
    tag: "For Zero Restriction on your Choices ",
    features: [
      ["No. of Connections", "<< Up to 10 Host "],
      ["No. of Requests", "<< Up to 3 Posts"],
      ["Duration", "No Limit"],
      ["Posting Request", "Free"],
    ],
  },
};

const StudentPlan = () => {
  const [activePlan, setActivePlan] = useState<keyof typeof plans>("INSTANT");

  const current = plans[activePlan];

  return (
    <div className="bg-[#F3EDFE]">
      <section className="py-40 justify-center flex">
        <div className="mx-30 w-1/2 grid grid-cols-1 gap-14">
          {/* RIGHT STACK */}
          <div className="space-y-1">
            <Maincard className="bg-[#F4F6F5] pb-5">
              <SectionHeader
                title="Pricing"
                caption="Simple, Transparent Plan based on your need"
              />

              {/* Toggle Buttons */}
              <div>
                <div className="grid grid-cols-3 gap-4 mt-10 border border-dashed border-gray-40 bg-white p-3 rounded-lg">
                  <button
                    onClick={() => setActivePlan("INSTANT")}
                    className={clsx(
                      "w-full flex items-center justify-center gap-2 p-3 rounded-lg",
                      activePlan === "INSTANT"
                        ? "bg-black text-white"
                        : "bg-transparent text-black"
                    )}
                  >
                    <MdOutlineFlashOn
                      className={activePlan === "INSTANT" ? "text-white" : ""}
                      size={40}
                    />
                    <span className="text-2xl">INSTANT</span>
                  </button>

                  <button
                    onClick={() => setActivePlan("EXPLORE")}
                    className={clsx(
                      "w-full flex items-center justify-center gap-2 p-3 rounded-lg",
                      activePlan === "EXPLORE"
                        ? "bg-black text-white"
                        : "bg-transparent text-black"
                    )}
                  >
                    <BiWorld
                      className={activePlan === "EXPLORE" ? "text-white" : ""}
                      size={40}
                    />
                    <span className="text-2xl">EXPLORE</span>
                  </button>

                  <button
                    onClick={() => setActivePlan("GO PRO")}
                    className={clsx(
                      "w-full flex items-center justify-center gap-2 p-3 rounded-lg",
                      activePlan === "GO PRO"
                        ? "bg-black text-white"
                        : "bg-transparent text-black"
                    )}
                  >
                    <MdDoubleArrow
                      className={activePlan === "GO PRO" ? "text-white" : ""}
                      size={40}
                    />
                    <span className="text-2xl">GO PRO</span>
                  </button>
                </div>
              </div>

              {/* Details Section */}
              <div className="px-5 pb-4 pt-3 space-y-4">
                {/* Service Amount */}
                <div className="space-y-1">
                  <Label className="ml-8">Service Amount</Label>
                  <InfoPill>
                    <div className="inline-flex items-center justify-between w-full">
                      <span className="font-bold text-lg py-1">
                        {current.price}
                      </span>
                    </div>
                  </InfoPill>
                  <div className="w-full flex justify-end mr-5 mt-2">
                    <small className="bg-white p-2 rounded-lg">
                        {current.tag}
                    </small>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-1">
                  <Label className="ml-8">Features</Label>
                  <div className="rounded-2xl bg-white mx-1 border-1 p-3">
                    {current.features.map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between py-2 px-4 text-md"
                      >
                        <span>{label}</span>
                        <span className="inline-flex items-center gap-2">
                          {value} <Info size={20} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <Label className="ml-8">Email</Label>
                  <InfoPill className="bg-white">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full outline-none text-md py-1"
                    />
                  </InfoPill>
                </div>

                {/* Next Button */}
                <div className="pt-2 w-full flex justify-center mt-10">
                  <DfButton>NEXT</DfButton>
                </div>
              </div>
            </Maincard>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentPlan;
