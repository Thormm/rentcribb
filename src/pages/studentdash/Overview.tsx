import { useState } from "react";
import { FiCamera, FiCheckCircle, FiChevronDown, FiArrowUpRight } from "react-icons/fi";
import clsx from "clsx";
import InfoPill from "../../components/Pill"; // pill component
import { BsQuestionCircle } from "react-icons/bs";
import { PiHouse } from "react-icons/pi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FiMail } from "react-icons/fi";
import { MdOutlinePending } from "react-icons/md";
import { RiInformationLine } from "react-icons/ri";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

type Review = {
  id: number;
  date: string;
  name: string;
  type: "home" | "user";
  rating?: number;
  text?: string;
};

const reviews: Review[] = [
  { id: 1, date: "6th Jan, 2025", name: "Zarken Christian", type: "home" },
  {
    id: 2,
    date: "6th Jan, 2025",
    name: "Zarken Christian",
    type: "user",
    rating: 5,
    text: "This is a very good customer, pays well as speaks kindly.",
  },
  { id: 3, date: "1st Jan, 2025", name: "Tessie Ahaiwe", type: "home" },
  { id: 4, date: "16th Dec, 2025", name: "Habib Saliu", type: "user" },
];

// Reusable Label
type LabelProps = React.PropsWithChildren<{ className?: string }>;
function Label({ children, className }: LabelProps) {
  return (
    <div className={clsx("text-md pl-8 my-2 font-semibold text-black", className)}>
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
        <span className="text-[#FFA1A1] font-semibold">SCHOOL LIFE</span> to be{" "}
        <span className="text-[#FFA1A1] font-semibold">MADE SOFT</span>
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
function Tabs({ active, setActive }: { active: string; setActive: (t: string) => void }) {
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

const Overview = () => {
  const [activeTab, setActiveTab] = useState("Profile");

  // form state
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [whatsapp, setWhatsapp] = useState("08078436972");
  const [stateValue, setStateValue] = useState("");
  const [landmark, setLandmark] = useState("");
  const [address, setAddress] = useState("");

  // Feedback states
  const [expanded, setExpanded] = useState<number | null>(null);
  const [ratings, setRatings] = useState<{ [key: number]: number }>(
    reviews.reduce((acc, r) => ({ ...acc, [r.id]: r.rating || 0 }), {})
  );
  const [feedbackTexts, setFeedbackTexts] = useState<{ [key: number]: string }>(
    reviews.reduce((acc, r) => ({ ...acc, [r.id]: r.text || "" }), {})
  );

  const handleStarClick = (reviewId: number, starIndex: number) => {
    setRatings((prev) => ({ ...prev, [reviewId]: starIndex + 1 }));
  };

  const handleTextChange = (reviewId: number, value: string) => {
    setFeedbackTexts((prev) => ({ ...prev, [reviewId]: value }));
  };

  const states = [
    { value: "", label: "Select State" },
    { value: "lagos", label: "Lagos" },
    { value: "abuja", label: "Abuja" },
    { value: "rivers", label: "Rivers" },
  ];

  const handleSave = () => {
    const payload = {
      firstName,
      lastName,
      whatsapp,
      state: stateValue,
      landmark,
      address,
      feedback: { ratings, feedbackTexts },
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
                          <div className="p-5 w-2/3">
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
                                    className="w-full outline-none py-1 rounded-md text-black"
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
                                    className="w-full outline-none py-1 rounded-md text-black"
                                  />
                                </InfoPill>
                              </div>
            
                              {/* Row 2 */}
                              <div>
                                <Label>CALL NUMBER</Label>
                                <InfoPill>
                                  <div className="inline-flex items-center justify-between w-full">
                                    <span className="text-md py-1">26</span>
                                    <RiInformationLine size={14} className="ml-auto" />
                                  </div>
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
                                    className="flex-1 outline-none py-1 rounded-md text-black"
                                  />
                                  <FiCheckCircle className="text-gray-400 ml-2" size={20} />
                                </InfoPill>
                              </div>
            
                              {/* Row 3 - Email full width */}
                              <div className="md:col-span-2">
                                <Label>EMAIL</Label>
                                <InfoPill>
                                                      <div className="inline-flex items-center justify-between w-full">
                                                        <span className="text-md py-1">26</span>
                                                        <RiInformationLine size={14} className="ml-auto" />
                                                      </div>
                                                    </InfoPill>
                              </div>

                              {/* Row 3 - Email full width */}
                              <div className="md:col-span-2">
                                <Label>UNIVERSITY</Label>
                                <InfoPill>
                                  <input
                                    type="email"
                                    value="tanin@gmail.com"
                                    className="w-full outline-none py-1 rounded-md text-black"
                                  />
                                </InfoPill>
                              </div>
            
            <div
        className="mt-1 w-100 border-t-4 mx-auto text-[#0000004D]"
        style={{
          borderStyle: "dashed",
          borderImage:
            "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
        }}
      />
            
                              {/* Row 4 - Full Address */}
                              <div className="md:col-span-2">
                                <Label>FULL ADDRESS</Label>
                                <InfoPill className="bg-white">
                                  <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter your Address"
                                    className="w-full outline-none py-1 rounded-md text-black"
                                  />
                                </InfoPill>
                              </div>

                              
                              {/* Row 5 - State and Landmark */}
                              <div className="pl-1">
                                <Label>STATE</Label>
                                <InfoPill className="relative flex items-center bg-white">
                                  <select
                                    value={stateValue}
                                    onChange={(e) => setStateValue(e.target.value)}
                                    className="appearance-none w-full bg-transparent outline-none py-1 text-black"
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
                                  <FiChevronDown className="pointer-events-none absolute right-8 text-gray-500" />
                                </InfoPill>
                              </div>
            
                              <div>
                                <Label>LANDMARK</Label>
                                <InfoPill className="bg-white">
                                  <input
                                    type="text"
                                    value={landmark}
                                    onChange={(e) => setLandmark(e.target.value)}
                                    placeholder="Around Where"
                                    className="w-full outline-none py-1 rounded-md text-black"
                                  />
                                </InfoPill>
                              </div>
                            </div>
            
                            {/* Save Changes */}
                            <div className="mt-10 flex justify-center">
                              <button
                                onClick={handleSave}
                                className="py-3 text-md px-4 font-medium bg-black shadow-lg rounded-lg"
                              >
                                SAVE CHANGES
                              </button>
                            </div>
                          </div>
                        )}
            
                        {/* Other tabs */}
                        {activeTab === "Verify ID" && (
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
                        {activeTab === "Next of Kin" && (
                          <div className="p-5 w-2/3">
                            {/* Inputs grid */}
                            <div className="grid my-10 grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Row 1 */}
                              <div>
                                <Label>FIRST NAME</Label>
                                <InfoPill className="bg-white">
                                  <input
                                    type="text"
                                    placeholder="Entire First Name"
                                    className="w-full outline-none py-1 rounded-md text-black"
                                  />
                                </InfoPill>
                              </div>
            
                              <div>
                                <Label>LAST NAME</Label>
                                <InfoPill className="bg-white">
                                  <input
                                    type="text"
                                    placeholder="Enter Last Name"
                                    className="w-full outline-none py-1 rounded-md text-black"
                                  />
                                </InfoPill>
                              </div>
            
                              {/* Row 2 */}
                              <div>
                                <Label>CALL NUMBER</Label>
                                <InfoPill className="flex items-center justify-between bg-white">
                                  <input
                                    type="tel"
                                    placeholder="Call Number"
                                    className="flex-1 outline-none py-1 rounded-md text-black"
                                  />
                                </InfoPill>
                              </div>
            
                              <div>
                                <Label>WHATSAPP NO.</Label>
                                <InfoPill className="flex items-center justify-between bg-white">
                                  <input
                                    type="tel"
                                    placeholder="Whatsapp Number"
                                    className="flex-1 outline-none py-1 rounded-md text-black"
                                  />
                                </InfoPill>
                              </div>
            
                              {/* Row 3 - Email full width */}
                              <div className="md:col-span-2">
                                <Label>EMAIL</Label>
                                <InfoPill className="bg-white">
                                  <input
                                    type="email"
                                    placeholder="Enter Your Email"
                                    className="w-full outline-none py-1 rounded-md text-black"
                                  />
                                </InfoPill>
                              </div>
            
                            </div>
            
                            {/* Save Changes */}
                            <div className="mt-10 flex justify-center">
                              <button
                                onClick={handleSave}
                                className="py-3 text-md px-4 font-medium bg-black shadow-lg rounded-lg"
                              >
                                SAVE CHANGES
                              </button>
                            </div>
                          </div>
                        )}

            {/* Feedback tab (adjusted) */}
            {activeTab === "Feedback" && (
  <div className="w-2/3 p-5">
    {/* Header with dashed line */}
    <div className="flex items-center gap-3 my-8">
      <span className="text-md font-semibold text-black tracking-wide">
        --- GIVE REVIEWS --------------------------
      </span>
    </div>

    {/* Reviews list */}
    <div className="space-y-8">
      {reviews.map((r) => {
        const isExpanded = expanded === r.id;
        return (
          <div
            key={r.id}
            className="border-black rounded-4xl border px-6 py-4 shadow-sm"
          >
            {/* Row 1 */}
            <div className="flex items-center">
              {/* Left icon (PiHouse) */}
              <div className="w-6 h-6 flex items-center justify-center text-black">
                <PiHouse className="w-6 h-6" />
              </div>

              {/* Date + name */}
              <div className="flex flex-grow items-center gap-5 px-4">
                <span className="text-md font-normal text-black whitespace-nowrap">
                  {r.date}
                </span>
                <span className="text-md text-black font-normal truncate">
                  {r.name}
                </span>
              </div>

              {/* Right dropdown toggle */}
              <div
                className="w-6 h-6 flex items-center justify-center cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : r.id)}
              >
                {isExpanded ? (
                  <IoIosArrowUp className="w-6 h-6 text-black" />
                ) : (
                  <IoIosArrowDown className="w-6 h-6 text-black" />
                )}
              </div>
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <div className="mt-3 px-10">
                {/* Stars + POST */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) =>
                      i < (ratings[r.id] || 0) ? (
                        <AiFillStar
                          key={i}
                          className="w-7 h-7 text-yellow-400 cursor-pointer"
                          onClick={() => handleStarClick(r.id, i)}
                        />
                      ) : (
                        <AiOutlineStar
                          key={i}
                          className="w-7 h-7 text-gray-300 cursor-pointer"
                          onClick={() => handleStarClick(r.id, i)}
                        />
                      )
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-black text-[#D6FFC3] text-sm font-medium cursor-pointer">
                    <FiArrowUpRight className="w-4 h-4" />
                    POST
                  </span>
                </div>

                <div className="mt-3">
                  <textarea
                    value={feedbackTexts[r.id] || ""}
                    onChange={(e) => handleTextChange(r.id, e.target.value)}
                    placeholder = "Write your feedback here..."
                    className="w-full min-h-[80px] py-2 px-3 text-black rounded-xl  bg-white focus:outline-none resize-none text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>

    {/* Feedback area */}
    <div className="mt-10">
      <div className="text-md px-10 font-medium text-black mb-2">FEEDBACK</div>
      <textarea
        defaultValue="Hola, Cribb ..."
        className="w-full min-h-[110px] py-3 px-10 text-[#00000080] rounded-2xl border border-black bg-white focus:outline-none resize-none text-sm placeholder-gray-400"
      />
    </div>

    {/* Send button */}
    <div className="mt-10 flex justify-center">
      <button
        onClick={handleSave}
        className="py-3 text-md px-8 font-medium bg-black shadow-lg rounded-lg"
      >
        SEND
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

export default Overview;
