import { useState } from "react";
import {
  FiCamera,
  FiCheckCircle,
  FiChevronDown,
} from "react-icons/fi";
import clsx from "clsx";
import InfoPill from "../../components/Pill"; // pill component
import { DfButton } from "../../components/Pill"; // button component (optional)
import { BsQuestionCircle } from "react-icons/bs";

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
        <h2 className="text-4xl font-extrabold">Hola, {title}</h2>
        <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
          <BsQuestionCircle className="text-white" size={40} />
        </div>
      </div>
      <p className="text-sm pt-5">
        Our goal is for your{" "}
        <span className="text-red-500 font-semibold">SCHOOL LIFE</span> to be{" "}
        <span className="text-red-500 font-semibold">MADE SOFT</span>
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

// Tabs component
const tabs = ["Profile", "Verify ID", "Next of Kin", "Feedback"];
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
            "flex-1 pb-2 pt-2 text-lg relative text-black text-center",
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

const Overview = () => {
  const [activeTab, setActiveTab] = useState("Profile");

  // form state
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [callNumber, setCallNumber] = useState("08078436972");
  const [whatsapp, setWhatsapp] = useState("08078436972");
  const [email, setEmail] = useState("");
  const [stateValue, setStateValue] = useState(""); // store state code/name
  const [landmark, setLandmark] = useState("");
  const [address, setAddress] = useState("");

  const states = [
    { value: "", label: "Select State" },
    { value: "lagos", label: "Lagos" },
    { value: "abuja", label: "Abuja" },
    { value: "rivers", label: "Rivers" },
    // add more as needed
  ];

  const handleSave = () => {
    const payload = {
      firstName,
      lastName,
      callNumber,
      whatsapp,
      email,
      state: stateValue,
      landmark,
      address,
    };
    console.log("Save profile:", payload);
  };

  return (
    <div className="bg-white py-10">
      <section className="px-10 flex justify-center">
        <div className="w-full">
          {/* Header */}
          <SectionHeader title="Zarken" />

          {/* Card */}
          <div className="mt-10 rounded-3xl border-4 border-black p-5 bg-[#F4F6F5]">
            {/* Tabs */}
            <Tabs active={activeTab} setActive={setActiveTab} />

            {/* Content */}
            {activeTab === "Profile" && (
              <div className="p-5">
                {/* Avatar Upload - left aligned */}
                <div className="flex justify-start my-10 pl-5">
                  <div className="h-24 w-24 rounded-full border border-black bg-white flex items-center justify-center">
                    <FiCamera className="text-black" size={35} />
                  </div>
                </div>

                {/* Inputs grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Row 1 */}
                  <div>
                    <Label>FIRST NAME</Label>
                    <InfoPill>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full outline-none py-2 px-3 rounded-md text-black"
                      />
                    </InfoPill>
                  </div>

                  <div>
                    <Label>LAST NAME</Label>
                    <InfoPill>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full outline-none py-2 px-3 rounded-md text-black"
                      />
                    </InfoPill>
                  </div>

                  {/* Row 2 */}
                  <div>
                    <Label>CALL NUMBER</Label>
                    <InfoPill className="flex items-center justify-between">
                      <input
                        type="tel"
                        value={callNumber}
                        onChange={(e) => setCallNumber(e.target.value)}
                        placeholder="08078436972"
                        className="flex-1 outline-none py-2 px-3 rounded-md text-black"
                      />
                      <FiCheckCircle className="text-gray-400 ml-2" size={20} />
                    </InfoPill>
                  </div>

                  <div>
                    <Label>WHATSAPP NO</Label>
                    <InfoPill className="flex items-center justify-between">
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="08078436972"
                        className="flex-1 outline-none py-2 px-3 rounded-md text-black"
                      />
                      <FiCheckCircle className="text-gray-400 ml-2" size={20} />
                    </InfoPill>
                  </div>

                  {/* Row 3 - Email full width */}
                  <div className="md:col-span-2">
                    <Label>EMAIL</Label>
                    <InfoPill>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full outline-none py-2 px-3 rounded-md text-black"
                      />
                    </InfoPill>
                  </div>

                  {/* Row 4 - Full Address */}
                  <div className="md:col-span-2">
                    <Label>FULL ADDRESS</Label>
                    <InfoPill>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House No, Street, Area, City, Postal"
                        className="w-full outline-none py-2 px-3 rounded-md text-black"
                      />
                    </InfoPill>
                  </div>

                  {/* Row 5 - State and Landmark */}
                  <div>
                    <Label>STATE</Label>
                    <InfoPill className="relative flex items-center">
                      <select
                        value={stateValue}
                        onChange={(e) => setStateValue(e.target.value)}
                        className="appearance-none w-full bg-transparent outline-none py-2 px-3 text-black"
                      >
                        <option value="">{states[0].label}</option>
                        {states
                          .filter((s) => s.value !== "")
                          .map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                      </select>
                      <FiChevronDown className="pointer-events-none absolute right-3 text-gray-500" />
                    </InfoPill>
                  </div>

                  <div>
                    <Label>LANDMARK</Label>
                    <InfoPill>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="Around Where"
                        className="w-full outline-none py-2 px-3 rounded-md text-black"
                      />
                    </InfoPill>
                  </div>
                </div>

                {/* Save Changes */}
                <div className="mt-10 flex justify-center">
                  <DfButton onClick={handleSave}>SAVE CHANGES</DfButton>
                </div>
              </div>
            )}

            {/* Other tabs */}
            {activeTab === "Verify ID" && (
              <div className="p-5">Verify ID Content goes here</div>
            )}
            {activeTab === "Next of Kin" && (
              <div className="p-5">Next of Kin Content goes here</div>
            )}
            {activeTab === "Feedback" && (
              <div className="p-5">Feedback Content goes here</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Overview;
