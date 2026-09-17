import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import clsx from "clsx";
import { BsQuestionCircle } from "react-icons/bs";
import InfoPill from "../../../components/Pill";
import { MdOutlinePostAdd, MdLightbulbOutline } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import { FaToggleOff, FaToggleOn, FaArrowRight } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BiComment } from "react-icons/bi";
import RoommateCard, { type Roommate } from "../components/RoommateCard";
import { GrCheckmark } from "react-icons/gr";
import { MdDeleteForever } from "react-icons/md";
import { TbCancel, TbArrowBack } from "react-icons/tb";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CgClose } from "react-icons/cg";

// ----------------------- Types -----------------------
type RequestStatus = "pending" | "approved" | "declined" | "rejected";

interface RawRequest {
  id: number;
  sender: string;
  receiver: string;
  created_at: string;
  status: RequestStatus;
  sender_profile: any | null;
  receiver_profile: any | null;
}

interface EnrichedRequest {
  id: number;
  sender: string;
  receiver: string;
  created_at: string;
  status: RequestStatus;
  isSender: boolean;
  otherUserWhats: string;
  card: Roommate | null;
}

// ----------------------- Reusable Label -----------------------
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

// ----------------------- Section Header -----------------------
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

// ----------------------- Helpers -----------------------

const actions = {
  onPendingAction: (i: any) => console.log("Unsend:", i),
  onViewInfo: (i: any) => console.log("View Info:", i),
  onDecline: (i: any) => console.log("Delete:", i),
  onReject: (i: any) => console.log("Decline:", i),
};

// Map a raw request status -> which modal action flags are true
function getStatusFlags(status: RequestStatus) {
  return {
    pending: status === "pending",
    approve: status === "approved",
    decline: status === "declined",
    reject: status === "rejected",
  };
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso.replace(" ", "T"));
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day} - ${month} - ${year}`;
  } catch {
    return iso;
  }
}


function buildCardFromUser(u: any): Roommate | null {
  if (!u) return null;
  return {
    id: parseInt(u.id) || Math.random(),
    gender: u.gender || "",
    religion: u.religion || "",
    level: u.level || "",
    faculty: u.faculty || "",
    move_in_date: u.availability || "",
    duration: u.duration || "",
    type: u.type || "",
    price: u.amount_share ? String(u.amount_share) : "",
    features: u.hobby ? u.hobby.split(",").map((s: string) => s.trim()) : [],
    pet: u.pet || "",
    value: "You",
  };
}

// ----------------------- Request Row -----------------------
function RequestCard({
  req,
  onAction,
}: {
  req: EnrichedRequest;
  onAction: (action: keyof typeof actions, req: EnrichedRequest) => void;
}) {
  const [open, setOpen] = useState(false);
  const flags = getStatusFlags(req.status);
  const isSender = req.isSender;

  const toggle = () => setOpen((p) => !p);

  // Sender -> right justified; Receiver -> left justified
  const wrapperJustify = isSender ? "justify-end" : "justify-start";
  const labelText = isSender ? "You replied ..." : "Someone requested ...";

  const handleAction = (key: keyof typeof actions) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction(key, req);
    setOpen(false);
  };

  return (
    <div className="md:min-w-150">
      {/* GROUP TITLE */}
      <div className={clsx("flex items-center mt-5", wrapperJustify)}>
        <span className="text-xs p-2 bg-white text-[#5B5B5B] rounded-md">
          {labelText}
        </span>
      </div>

      {/* CARD */}
      <div className={clsx("mt-8 flex", wrapperJustify)}>
        <div className="flex gap-4 ">
          {!req.card ? (
            <div className="w-[280px] h-[360px] flex items-center justify-center bg-white rounded-2xl shadow-sm">
              <AiOutlineLoading3Quarters className="animate-spin w-8 h-8 text-black" />
            </div>
          ) : (
            <div className="relative mx-5">
              <RoommateCard
                card={req.card}
                bgColor={isSender ? "#EBD96B" : undefined}
              />

              <div className="absolute -top-2 md:-top-4 -left-5 flex flex-col gap-5 z-10">
                {/* Dots / Close toggle */}
                {open ? (
                  <CgClose
                    onClick={toggle}
                    className="text-white w-10 h-10 md:w-11 md:h-11 p-3 rounded-full bg-black shadow-md cursor-pointer"
                  />
                ) : (
                  <HiOutlineDotsVertical
                    onClick={toggle}
                    className="text-white w-10 h-10 md:w-11 md:h-11 p-3 rounded-full bg-black shadow-md cursor-pointer"
                  />
                )}

                {/* Modal */}
                {open && (
                  <div className="absolute -top-2 md:-top-4 left-12 bg-white border-2 border-black rounded-2xl shadow-lg z-10 w-[200px] p-4 flex flex-col gap-3">
                    <div className="text-center text-xs md:text-sm font-semibold text-black">
                      {formatDate(req.created_at)}
                    </div>
                    <div className="border-t-2 border-dashed border-gray-400"></div>
                    <div className="flex flex-col">
                      {/* PENDING */}
                      {flags.pending && (
                        <div className="flex items-center justify-between p-2">
                          <span className="text-xs md:text-sm text-black">
                            Pending
                          </span>
                          <AiOutlineLoading3Quarters className="text-black w-4 h-4 md:h-6 md:w-6" />
                        </div>
                      )}
                      {flags.pending && (
                        <div
                          className="flex items-center justify-between bg-[#FFA1A1] p-2 rounded-md cursor-pointer"
                          onClick={handleAction("onPendingAction")}
                        >
                          <span className="text-xs md:text-sm text-black">
                            Unsend
                          </span>
                          <TbArrowBack className="text-black w-4 h-4 md:h-6 md:w-6" />
                        </div>
                      )}

                      {/* APPROVED */}
                      {flags.approve && (
                        <div className="flex items-center justify-between p-2">
                          <span className="text-xs md:text-sm text-black">
                            Accepted
                          </span>
                          <GrCheckmark className="w-5 h-5 md:h-6 md:w-6 p-1 rounded-full border-2 shadow-md" />
                        </div>
                      )}
                      {flags.approve && (
                        <div
                          className="flex items-center justify-between bg-black p-2 rounded-md cursor-pointer"
                          onClick={handleAction("onViewInfo")}
                        >
                          <span className="text-xs md:text-sm text-white">
                            View Info
                          </span>
                          <FaArrowRight className="text-white w-4 h-4 md:h-6 md:w-6" />
                        </div>
                      )}

                      {/* DECLINED */}
                      {flags.decline && (
                        <div className="flex items-center justify-between p-2">
                          <span className="text-xs md:text-sm text-black">
                            Declined
                          </span>
                          <TbCancel className="text-black w-4 h-4 md:h-6 md:w-6" />
                        </div>
                      )}
                      {flags.decline && (
                        <div
                          className="flex items-center justify-between bg-[#FFA1A1] p-2 rounded-md cursor-pointer"
                          onClick={handleAction("onDecline")}
                        >
                          <span className="text-xs md:text-sm text-black">
                            Delete
                          </span>
                          <MdDeleteForever className="text-black w-4 h-4 md:h-6 md:w-6" />
                        </div>
                      )}

                      {/* REJECTED */}
                      {flags.reject && (
                        <div className="flex items-center justify-between p-2">
                          <span className="text-xs md:text-sm text-black">
                            Pending
                          </span>
                          <AiOutlineLoading3Quarters className="text-black w-4 h-4 md:h-6 md:w-6" />
                        </div>
                      )}
                      {flags.reject && (
                        <div
                          className="flex items-center justify-between bg-[#FFA1A1] p-2 rounded-md cursor-pointer"
                          onClick={handleAction("onReject")}
                        >
                          <span className="text-xs md:text-sm text-black">
                            Decline
                          </span>
                          <TbCancel className="text-black w-4 h-4 md:h-6 md:w-6" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Status badge icons */}
                {flags.pending && (
                  <AiOutlineLoading3Quarters className="text-black w-10 h-10 md:w-11 md:h-11 p-3 rounded-full border-2 bg-white shadow-md" />
                )}
                {flags.reject && (
                  <AiOutlineLoading3Quarters className="text-black w-10 h-10 md:w-11 md:h-11 p-3 rounded-full border-2 bg-white shadow-md" />
                )}
                {flags.approve && (
                  <GrCheckmark className="w-10 h-10 md:w-11 md:h-11 p-3 rounded-full bg-[#D6FFC3] border-2 shadow-md" />
                )}
                {flags.decline && (
                  <TbCancel className="text-black w-10 h-10 md:w-11 md:h-11 p-3 rounded-full border-2 bg-[#FFA1A1] shadow-md" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------- Main Component -----------------------
const Rommates = () => {
  const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
  const [activeTab, setActiveTab] = useState("Explore");
  const navigate = useNavigate();
  const [hostel, setHostel] = React.useState<any>(null);
  const [toggling, setToggling] = useState(false);
  const [requests, setRequests] = useState<EnrichedRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const isVisible = String(hostel?.open ?? "").toLowerCase() === "yes";
  const myWhats = login?.user;

  const roommateData: Roommate | null = useMemo(() => {
    if (!hostel) return null;
    return {
      id: parseInt(hostel.id) || Math.random(),
      gender: hostel.gender || "",
      religion: hostel.religion || "",
      level: hostel.level || "",
      faculty: hostel.faculty || "",
      move_in_date: hostel.availability || "",
      duration: hostel.duration || "",
      type: hostel.type || "",
      price: hostel.amount_share ? String(hostel.amount_share) : "",
      features: hostel.hobby
        ? hostel.hobby.split(",").map((s: string) => s.trim())
        : [],
      pet: hostel.pet || "",
      value: "You",
    };
  }, [hostel, login?.user]);

  useEffect(() => {
    if (!login?.user) navigate("/login");
  }, [navigate, login?.user]);

  // Fetch own hostel / verification
  useEffect(() => {
    const fetchHostel = async () => {
      const res = await fetch("https://www.cribb.africa/apigets.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "student_roommate_details",
          whats: login?.user,
        }),
      });

      const data = await res.json();

      if (data.data) {
        const verification = data.data.verification;
        if (
          verification === 0 ||
          verification === "0" ||
          verification === false
        ) {
          navigate("/knowyou", { replace: true });
          return;
        }
        setHostel(data.data);
      } else {
        console.log(data.message);
      }
    };

    if (login?.user) fetchHostel();
  }, [login?.user, navigate]);

  // Fetch roommate requests (single call — backend joins the profiles)
  useEffect(() => {
    const fetchRequests = async () => {
      if (!myWhats) return;
      setRequestsLoading(true);
      try {
        const res = await fetch("https://www.cribb.africa/apigets.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "get_roommate_requests",
            whats: myWhats,
          }),
        });
        const data = await res.json();

        const raw: RawRequest[] = Array.isArray(data.data) ? data.data : [];

        const enriched: EnrichedRequest[] = raw.map((r) => {
          const isSender = String(r.sender) === String(myWhats);
          const otherProfile = isSender ? r.receiver_profile : r.sender_profile;
          return {
            id: r.id,
            sender: r.sender,
            receiver: r.receiver,
            created_at: r.created_at,
            status: r.status,
            isSender,
            otherUserWhats: isSender ? r.receiver : r.sender,
            card: buildCardFromUser(otherProfile),
          };
        });

        setRequests(enriched);
      } catch (err) {
        console.error("Failed to fetch requests", err);
      } finally {
        setRequestsLoading(false);
      }
    };

    fetchRequests();
  }, [myWhats]);

  const handleToggleVisibility = async () => {
    if (!hostel || toggling) return;
    setToggling(true);

    const previous = hostel.open;
    const next = String(previous ?? "").toLowerCase() === "yes" ? "no" : "yes";
    setHostel({ ...hostel, open: next });

    try {
      const res = await fetch("https://www.cribb.africa/api_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_roommate_visibility",
          user: login?.user,
          signup_key: login?.signup_key,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setHostel({ ...hostel, open: previous });
        console.error("Toggle failed:", data.reply);
      } else {
        setHostel({ ...hostel, open: data.open });
      }
    } catch (err) {
      console.error("Toggle error:", err);
      setHostel({ ...hostel, open: previous });
    } finally {
      setToggling(false);
    }
  };

  const handleRequestAction = (
    actionKey: keyof typeof actions,
    req: EnrichedRequest,
  ) => {
    // TODO: wire up to backend later
    actions[actionKey](req);
  };

  return (
    <div className="bg-white md:py-10 mb-20">
      <section className="px-3 md:px-10 flex justify-center">
        <div className="w-full">
          <SectionHeader title="Roommates" />

          <div className="mt-10 rounded-3xl border-4 border-black p-1 md:p-5 bg-[#F4F6F5]">
            <Tabs active={activeTab} setActive={setActiveTab} />

            {/* Explore Tab */}
            {activeTab === "Explore" && (
              <div className="p-2 md:p-5 mt-5 md:w-2/3">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <Label>VISIBILITY</Label>
                    <InfoPill>
                      <div className="inline-flex items-center justify-between w-full">
                        <span className=" text-xs md:text-sm">
                          {isVisible
                            ? "Active : Yes, Receiving Requests"
                            : "INACTIVE : Not Receiving Requests"}
                        </span>
                        <button
                          type="button"
                          onClick={handleToggleVisibility}
                          disabled={toggling}
                          className="bg-black space-x-1 px-4 py-2 rounded-md text-[#D6FFC3] flex items-center disabled:opacity-60"
                        >
                          {isVisible ? <FaToggleOn /> : <FaToggleOff />}{" "}
                          <span className=" text-xs md:text-sm">SWITCH</span>
                        </button>
                      </div>
                    </InfoPill>
                  </div>
                </div>

                <div className="justify-start flex ml-8">
                  <div className="flex flex-col items-center mt-15">
                    {roommateData && (
                      <RoommateCard card={roommateData} bgColor={"#EBD96B"} />
                    )}
                    <button
                      onClick={() => navigate("/knowyou")}
                      className="mt-6 bg-black text-semibold text-white w-40 py-4 rounded-lg shadow-md"
                    >
                      EDIT
                    </button>
                  </div>
                </div>

                <button className=" w-full mt-10 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black">
                  <BiComment className="w-8 h-8" />
                  Rommate Requests
                </button>

                <button
                  onClick={() => navigate("/explore")}
                  className="mt-5 w-full  flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white"
                >
                  <MdOutlinePostAdd className="w-8 h-8" />
                  Explore Rommates
                </button>
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === "Requests" && (
              <div className="p-2 md:p-5 mt-5 md:w-2/3">
                <div className="grid grid-cols-2 gap-6">
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

                <div className="flex items-center gap-3 mt-8 mb-10">
                  <span className="text-sm md:text-md font-semibold text-black tracking-wide mt-10">
                    --- YOUR REQUESTS -------------
                  </span>
                </div>

                {requestsLoading && requests.length === 0 && (
                  <div className="flex justify-center py-10">
                    <AiOutlineLoading3Quarters className="animate-spin w-8 h-8 text-black" />
                  </div>
                )}

                {!requestsLoading && requests.length === 0 && (
                  <div className="text-center text-sm text-gray-500 py-10">
                    No roommate requests yet.
                  </div>
                )}

                {requests.map((req) => (
                  <RequestCard
                    key={req.id}
                    req={req}
                    onAction={handleRequestAction}
                  />
                ))}

                <button className="w-full mt-10 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white">
                  <MdOutlinePostAdd className="w-8 h-8" />
                  Explore Rommates
                </button>
              </div>
            )}

            {/* Match Tab */}
            {activeTab === "Match" && (
              <div className="p-2 md:p-5 mt-5 md:w-2/3">
                <span className="text-sm md:text-md font-semibold text-black tracking-wide mt-10">
                  --- YOUR LISTINGS ----------
                </span>

                <div className="overflow-x-auto md:min-w-150"></div>
                <button className="w-full mt-10 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black">
                  <BiComment className="w-8 h-8" />
                  Rommate Requests
                </button>
                <button className="w-full mt-5 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white">
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
