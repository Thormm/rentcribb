import { useAlert } from "../../App";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { BsQuestionCircle } from "react-icons/bs";
import InfoPill from "../../components/Pill";
import { useNavigate } from "react-router-dom";
import {
  MdOutlinePostAdd,
  MdLightbulbOutline,
} from "react-icons/md";
import { BiComment } from "react-icons/bi";
import Card from "../../components/Cards";
import { HiOutlineUserCircle } from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { RiInformationLine, RiWhatsappLine } from "react-icons/ri";
import { LuPencil } from "react-icons/lu";
import { CgClose } from "react-icons/cg";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineCall } from "react-icons/md";
import { FiCopy } from "react-icons/fi";

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

// ----------------------- States -----------------------
const states = [
  { value: "", label: "Sort by" },
  { value: "lagos", label: "Lagos" },
  { value: "abuja", label: "Abuja" },
  { value: "rivers", label: "Rivers" },
];


interface LiveSpace {
  id: string;
  space: "entirespace" | "sharedspace";
  name: string;
  type: string;
  location: string;
  price: number;
  duration: string;
  availability_month?: string;
  power_supply?: number | string;
  security?: number | string;

  status: string;
  active: string;
  rating: number;
  reviews: number;
  tier: number;
  bookmarks: number;
  background: string;
}

async function getRepliesSpaces(
  responses: string[],
  declined: string[] = [],
  accepted: string[] = [],
) {
  const res = await fetch("https://www.cribb.africa/apigets.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "get_request_replies_spaces",
      responses,
      declined,
      accepted,
    }),
  });

  const data = await res.json();

  return data.groups || [];
}

async function getLiveSpaces(user: string): Promise<LiveSpace[]> {
  const res = await fetch("https://www.cribb.africa/apigets.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "get_booked_spaces", user }),
  });

  const parsePhotos = (raw: any) => {
    if (!raw) return [];
    try {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const data = await res.json();

  const entire: LiveSpace[] = (data.entire_spaces ?? []).map((item: any) => ({
    id: item.id,
    space: "entirespace",
    name: item.name,
    type: item.type,
    location: item.location,
    price: Number(item.price),
    duration: item.duration,
    availability_month: item.availability_month,
    power_supply: item.power_supply,
    security: item.security,
    status: item.status,
    active: item.active,
    rating: item.rating,
    reviews: item.reviews,
    tier: item.tier,
    bookmarks: item.bookmarks,
    background: item.background,
    created_at: item.created_at,
    // NEW:
    photos: parsePhotos(item.photos), // e.g. ["photo_12_...jpg", ...]
    user: item.user,
  }));

  const shared: LiveSpace[] = (data.shared_spaces ?? []).map((item: any) => ({
    id: item.id,
    space: "sharedspace",
    name: item.name,
    type: item.type,
    location: item.location,
    price: Number(item.price),
    duration: item.duration,
    availability_month: item.availability_month,
    power_supply: item.power_supply,
    security: item.security,
    status: item.status,
    active: item.active,
    rating: item.rating,
    reviews: item.reviews,
    tier: item.tier,
    bookmarks: item.bookmarks,
    background: item.background,
    created_at: item.created_at,
    // NEW:
    photos: parsePhotos(item.photos), // e.g. ["photo_12_...jpg", ...]
    user: item.user,
  }));

  return [...entire, ...shared];
}

function RequestsCards({
  setShowFirst,
  setSelectedResponses,
  setSelectedItemDetails,
  setRequestsCount, // 👈 add this
}: {
  setShowFirst: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedResponses: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedItemDetails: React.Dispatch<React.SetStateAction<any>>;
  setRequestsCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const navigate = useNavigate();
  const [draftItems, setDraftItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const toggleModal = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };
  const { showAlert } = useAlert();

  const handleStatusUpdate = async (id: string | number) => {
    try {
      const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
      if (!login) return;

      const user = login?.user || "";
      const signup_key = login?.signup_key || "";

      const res = await fetch("https://www.cribb.africa/api_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_student_request_status",
          id,
          user,
          signup_key,
        }),
      });

      const data = await res.json();

      if (data.success) {
        showAlert(`Response updated`, "success", true);
        setTimeout(() => {
          window.location.href = "/studentdash?goto=rent";
        }, 3000);
      } else {
        showAlert(data.message || "Update failed", "info");
      }
    } catch (err) {
      console.error(err);
      showAlert("Something went wrong", "info");
    }
  };

  useEffect(() => {
    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");

    if (!login?.user || !login?.signup_key) {
      setDraftItems([]);
      setLoading(false);
      return;
    }

    fetch("https://www.cribb.africa/apigets.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "get_my_requests",
        user: login.user,
        signup_key: login.signup_key,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setDraftItems(data);

        // 👇 update global count
        setRequestsCount(data.length);
      })
      .catch(() => setDraftItems([]))
      .finally(() => setLoading(false));
  }, []);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(draftItems.length / itemsPerPage);
  const currentData = draftItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  if (loading) {
    return <div className="px-8 text-black">Loading requests...</div>;
  }

  if (!draftItems.length) {
    return <div className="px-8 text-black">No requests found</div>;
  }

  return (
    <div>
      <div
        className="space-y-6 draft-scroll overflow-y-auto pr-2"
        style={{
          maxHeight: "420px",
          scrollbarColor: "#FFA1A1 transparent",
          scrollbarWidth: "thin",
        }}
      >
        {currentData.map((item, idx) => (
          <div key={item.id || idx}>
            <div className="grid grid-cols-1 text-sm md:text-md font-semibold my-5 mx-8 text-black">
              Request {(page - 1) * itemsPerPage + idx + 1}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6">
              <div className="flex items-center text-black px-6 text-sm flex-1 border-black rounded-4xl border-[1.5px] py-3 shadow-sm">
                <p className="text-xs md:text-base">
                  A {item.gender} Student needs a{" "}
                  <b>
                    {item.category === "Shared Space" ? "SHARED " : ""}
                    {item.type}
                  </b>{" "}
                  with{" "}
                  {Array.isArray(item.features) && item.features.length
                    ? item.features.join(", ")
                    : "basic facilities"}{" "}
                  around{" "}
                  {[item.preferred_location_1, item.preferred_location_2]
                    .filter(Boolean)
                    .join(", ")}
                  .
                  <br />
                  Budget: <b>({item.budget})</b>
                  <br />
                  {item.move_in_date?.toLowerCase() === "urgently" ? (
                    <>
                      Looking to Move in <b>URGENTLY</b>
                    </>
                  ) : (
                    <>
                      Looking to Move-in on or before <b>{item.move_in_date}</b>
                      .
                    </>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-2 w-full md:w-1/3">
                <div className="flex items-center justify-center gap-3 w-full border-black rounded-4xl border-[1.5px] py-2 md:py-4 shadow-sm">
                  <div
                    className="flex items-center relative w-20 md:w-40 justify-between"
                    onClick={() => toggleModal(item.id)}
                  >
                    <span className="text-xs md:text-lg py-1 text-black truncate">
                      More
                    </span>

                    {openMenuId === item.id ? (
                      <CgClose className="absolute -right-7 md:-right-5 text-white w-10 h-10 md:w-14 md:h-14 p-2 md:p-3 rounded-full bg-black" />
                    ) : (
                      <HiOutlineDotsVertical className="absolute -right-7 md:-right-5 text-white w-10 h-10 md:w-14 md:h-14 p-2 md:p-3 rounded-full bg-black" />
                    )}

                    {openMenuId === item.id && (
                      <div className="absolute top-8 left-12 md:-left-5 bg-white border-2 border-black rounded-2xl shadow-lg z-10 w-[200px] p-4 flex flex-col gap-3">
                        <div className="text-center text-xs md:text-sm font-semibold text-black">
                          {"10 - 03 - 2023"}
                        </div>
                        <div className="border-t-2 border-dashed border-gray-400"></div>
                        <div className="flex flex-col gap-4">
                          {(() => {
                            let responsesCount = 0;

                            try {
                              const list =
                                typeof item.responses === "string"
                                  ? JSON.parse(item.responses)
                                  : item.responses;

                              responsesCount = Array.isArray(list)
                                ? list.length
                                : 0;
                            } catch {
                              responsesCount = 0;
                            }

                            return (
                              <>
                                {/* ONLY SHOW EDIT IF NO RESPONSES */}
                                {responsesCount === 0 && (
                                  <div
                                    className="flex items-center justify-between bg-black p-2 rounded-md cursor-pointer"
                                    onClick={() =>
                                      navigate(`/request?edit=${item.id}`)
                                    }
                                  >
                                    <span className="text-xs md:text-sm text-white">
                                      Edit
                                    </span>

                                    <LuPencil className="text-white w-4 h-4 md:h-6 md:w-6" />
                                  </div>
                                )}

                                {/* DELETE ALWAYS SHOWS */}
                                <div
                                  className="flex items-center justify-between bg-[#FFA1A1] p-2 rounded-md cursor-pointer"
                                  onClick={() => handleStatusUpdate(item.id)}
                                >
                                  <span className="text-xs md:text-sm text-black">
                                    Delete
                                  </span>

                                  <MdDeleteForever className="text-black w-4 h-4 md:h-6 md:w-6" />
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  onClick={() => {
                    let list: string[] = [];

                    try {
                      list =
                        typeof item.responses === "string"
                          ? JSON.parse(item.responses)
                          : item.responses;
                    } catch {
                      list = [];
                    }

                    setSelectedResponses(list);

                    // ✅ save the request item
                    setSelectedItemDetails(item);

                    setShowFirst(false);
                  }}
                  className="flex items-center justify-center bg-black gap-3 w-full border-black rounded-4xl border py-4 shadow-sm cursor-pointer"
                >
                  <div className="flex items-center relative w-20 md:w-40 justify-between">
                    <span className="text-xs py-1 md:text-lg text-white truncate">
                      {(() => {
                        try {
                          const list =
                            typeof item.responses === "string"
                              ? JSON.parse(item.responses)
                              : item.responses;

                          return Array.isArray(list) ? list.length : 0;
                        } catch {
                          return 0;
                        }
                      })()}{" "}
                      Replies
                    </span>

                    <FaArrowRight className="absolute -right-7 md:-right-5 text-white w-10 h-10 md:w-14 md:h-14 p-2 md:p-3 rounded-full bg-[#202020]" />
                  </div>
                </div>
              </div>
            </div>
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

// ----------------------- Live: existing paginated cards (5 per page) -----------------------
function BookedCards({ data }: { data: LiveSpace[] }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    setPage(1);
  }, [data]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <div>
      <div className="w-full max-w-6xl mx-auto px-6 md:px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentData.map((card) => (
            <div key={`${card.space}-${card.id}`} className="">
              <div className="w-auto flex justify-end">
                <Card
                  item={card}
                  onView={() =>
                    navigate("/hostelview", {
                      state: { space: [card.id, card.space] },
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
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

// ----------------------- Paginated Cards -----------------------
function RequestsResponses({
  responses,
  declined,
  accepted,
  item,
}: {
  responses: string[];
  declined: string[];
  accepted: string[];
  item: any;
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleResponseUpdate = async (
    id: string | number,
    space?: string,
    request_id?: string | number,
    update?: string,
  ) => {
    try {
      const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
      if (!login?.user) return;

      const res = await fetch("https://www.cribb.africa/api_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_student_response",
          id,
          user: login.user,
          signup_key: login.signup_key,
          space,
          request_id,
          update,
        }),
      });

      const data = await res.json();

      if (data.success) {
        showAlert("Response updated", "success", true);

        setTimeout(() => {
          window.location.href = "/studentdash?goto=rent";
        }, 1500);
      } else {
        showAlert(data.message || "Update failed", "info");
      }
    } catch (err) {
      console.error(err);
      showAlert("Something went wrong", "info");
    }
  };

  useEffect(() => {
    if (!responses.length) {
      setData([]);
      return;
    }

    setLoading(true);

    getRepliesSpaces(responses, declined, accepted)
      .then(setData)
      .finally(() => setLoading(false));
  }, [responses]);

  return (
    <div
      className="space-y-8 "
      style={{
        scrollbarColor: "#FFA1A1 transparent",
        scrollbarWidth: "thin",
      }}
    >
      {loading && (
        <div className="text-sm text-gray-500">Loading replies...</div>
      )}

      {!responses.length && data.length === 0 && (
        <div className="text-sm text-gray-500">
          No replies found for this request.
        </div>
      )}

      {responses.length > 0 && data.length > 0 && (
        <div className="space-y-2">
          {/* REQUEST */}

          <div className="flex md:justify-start">
            {" "}
            <Label>REQUEST</Label>
          </div>
          <div className="flex">
            <div className="flex items-stretch w-full">
              <div className="flex-1 border-black border-[1.5px] rounded-3xl p-4 shadow-sm text-black">
                <p className="text-xs md:text-base">
                  A {item.gender} Student needs a{" "}
                  <b>
                    {item.category === "Shared Space" ? "SHARED " : ""}
                    {item.type}
                  </b>{" "}
                  with{" "}
                  {Array.isArray(item.features) && item.features.length
                    ? item.features.join(", ")
                    : "basic facilities"}{" "}
                  around{" "}
                  {[item.preferred_location_1, item.preferred_location_2]
                    .filter(Boolean)
                    .join(", ")}
                  .
                  <br />
                  Budget: <b>({item.budget})</b>
                  <br />
                  {item.move_in_date?.toLowerCase() === "urgently" ? (
                    <>
                      Looking to Move in <b>URGENTLY</b>
                    </>
                  ) : (
                    <>
                      Looking to Move-in on or before <b>{item.move_in_date}</b>
                      .
                    </>
                  )}
                </p>
              </div>

              <div className="w-[4px] bg-black ml-3 my-3 rounded"></div>
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-sm md:text-md font-semibold text-black tracking-wide mt-10 mb-5">
              --- REPLIES ----------
              {responses.length}
            </span>
          </div>

          {currentData.map((group: any, idx: number) => (
            <div key={`${group.uploader}-${group.user}-${idx}`} className="md:min-w-150">
              {/* GROUP TITLE */}
              <div className="flex justify-center items-center mt-5">
                <span className="text-xs p-2 bg-white text-[#5B5B5B] rounded-md">
                  {group.uploader === "agent" ? "An agent" : "A landlord"}{" "}
                  replied ..
                </span>
              </div>

              {/* HORIZONTAL CARDS */}
              <div className="overflow-x-auto -mt-4">
                <div className="flex gap-4 md:min-w-max">
                  {(group.spaces || []).map((card: any) => (
                    <div
                      key={`${card.space}-${card.id}`}
                      className="shrink-0 mt-0 px-0"
                    >
                      <Card                  
                        item={card}
                        onView={() => {
                          navigate("/hostelview", {
                            state: { space: [card.id, card.space,item.id] },
                          });
                        }}
                        actions={{
                          onDecline: (card) => {
                            handleResponseUpdate(
                              card.id,
                              card.space,
                              item.id,
                              "delete",
                            );
                          },

                          onReject: (card) => {
                            handleResponseUpdate(
                              card.id,
                              card.space,
                              item.id,
                              "reject",
                            );
                          },

                          onViewInfo: (card) => {
                            navigate("/hostelview", {
                              state: { space: [card.id, card.space] },
                            });
                          },
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

// ----------------------- Section Header -----------------------
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

// ----------------------- Tabs -----------------------
const tabs = ["Booked", "Requests", "Host"];
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

interface DraftItem {
  id: number | string;
  name: string;
  date: string;
  email: string;
  call: string;
  whatsapp: string;
  status: string;
  space_name: string;
}

// ----------------------- Paginated Drafts -----------------------
function PaginatedHost() {
  const [page, setPage] = useState(1);
  const [expandedLeft, setExpandedLeft] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const loginData = sessionStorage.getItem("login_data");
    if (!loginData) return;

    const user = JSON.parse(loginData)?.user;

    const fetchBookings = async () => {
      try {
        const res = await fetch("https://www.cribb.africa/apigets.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "get_hosts",
            user: user,
          }),
        });

        const data = await res.json();
        setDraftItems(
          data.map((b: any) => ({
            id: b.id,
            name: b.name ?? "Unknown",
            email: b.email ?? "",
            call: b.call ?? "",
            whatsapp: b.whatsapp ?? "",
          })),
        );
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  const totalPages = Math.ceil(draftItems.length / itemsPerPage);
  const currentData = draftItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handleCopy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1500);
  };

 

  return (
    <div>
      <div
        className="space-y-6 pb-4 draft-scroll overflow-y-auto overflow-x-auto pr-2"
        style={{
          maxHeight: "420px",
          scrollbarColor: "#FFA1A1 transparent",
          scrollbarWidth: "thin",
        }}
      >
        {currentData.map((item) => (
          <div
            key={item.id}
            className="flex gap-6 md:w-2/3 md:min-w-2/3 items-center"
          >
            <div className="grid  w-full">
              {/* Left card */}
              <div
                className={clsx(
                  "flex-1 border-black rounded-4xl border shadow-sm",
                  "min-h-[40px] md:min-h-[60px] flex flex-col justify-center self-center cursor-pointer", // <--- add self-start
                )}
              >
                {/* Header row */}
                <div className="grid grid-cols-[auto_1fr_auto] items-center min-w-[250px] px-3 py-3 gap-3">
                  <div className="flex justify-center">
                    <HiOutlineUserCircle className="w-7 h-7 text-black" />
                  </div>


                  <div className="truncate text-xs md:text-sm text-black">
                    {item.name?.length > 20
                      ? item.name.slice(0, 20) + "…"
                      : item.name}
                  </div>

                  <span
                    className="flex justify-center cursor-pointer"
                    onClick={() =>
                      setExpandedLeft((prev) => ({
                        ...prev,
                        [item.id]: !prev[item.id],
                      }))
                    }
                  >
                    {expandedLeft[item.id] ? (
                      <IoIosArrowUp className="w-7 h-7 text-black" />
                    ) : (
                      <IoIosArrowDown className="w-7 h-7 text-black" />
                    )}
                  </span>
                </div>

                {/* Row 2 icons */}
                {expandedLeft[item.id] && (
                  <div className="flex items-center text-black justify-between mt-4 px-4 md:px-6">
                    

                    <div className="flex gap-2 md:gap-3">
                      <div
                        className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer"
                        onClick={() =>
                          (window.location.href = `mailto:${item.email}`)
                        }
                      >
                        <HiOutlineMail className="w-4 h-4" />
                      </div>

                      <div
                        className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer"
                        onClick={() =>
                          (window.location.href = `tel:${item.call}`)
                        }
                      >
                        <MdOutlineCall className="w-4 h-4" />
                      </div>

                      <div
                        className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer"
                        onClick={() =>
                          window.open(
                            `https://wa.me/${item.whatsapp}`,
                            "_blank",
                          )
                        }
                      >
                        <RiWhatsappLine className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Expanded contact info */}
                {expandedLeft[item.id] && (
                  <div className="m-4 bg-white rounded-xl border p-4 md:p-6 text-black shadow-sm">
                    <div className="space-y-4">
                      {[
                        { label: "Email", value: item.email },
                        { label: "Call no.", value: item.call },
                        { label: "Whatsapp", value: item.whatsapp },
                      ].map((field, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between relative"
                        >
                          <span className="text-xs md:text-base font-semibold">
                            {field.label}
                          </span>
                          <div className="flex items-center pl-4">
                            <span className="text-xs md:text-base truncate">
                              {field.value?.length > 14
                                ? field.value.slice(0, 14) + "…"
                                : field.value}
                            </span>
                            <FiCopy
                              className="w-4 h-4 cursor-pointer"
                              onClick={() =>
                                handleCopy(field.label, field.value)
                              }
                            />
                          </div>
                          {copiedField === field.label && (
                            <div className="absolute -top-6 right-0 bg-black text-white text-xs px-2 py-1 rounded shadow-md">
                              Copied!
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-md border ${
                page === i + 1
                  ? "bg-[#FFA1A1] text-white border-[#FFA1A1]"
                  : "bg-white text-black border-black"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ----------------------- Main Component -----------------------
export default function Rent() {
  const [selectedResponses, setSelectedResponses] = useState<string[]>([]);
  const [requestsCount, setRequestsCount] = useState(0);
  const isMaxReached = requestsCount >= 3;
  const [selectedItemDetails, setSelectedItemDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Booked");
  const [stateValue, setStateValue] = useState("");
  const [showFirst, setShowFirst] = useState(true); // default: first section visible
  const navigate = useNavigate();
  const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");

  const [cards, setCards] = useState<LiveSpace[]>([]);
  useEffect(() => {
    if (!login.user) return;
    getLiveSpaces(login.user).then(setCards);
  }, []);

  return (
    <div className="bg-white md:py-10 mb-10">
      <section className="px-3 md:px-10 flex justify-center">
        <div className="w-full">
          <SectionHeader title="Rent" />

          <div className="mt-10 rounded-3xl border-4 border-black p-1 md:p-5 bg-[#F4F6F5]">
            <Tabs active={activeTab} setActive={setActiveTab} />

            {/* Booked Tab */}
            {activeTab === "Booked" && (
              <div className="p-2 md:p-5 mt-5 md:w-2/3">
                <span className="text-sm md:text-md font-semibold text-black tracking-wide">
                  --- ALL BOOKINGS ------------
                </span>
                <div className="overflow-x-auto md:min-w-160">
                  <BookedCards data={cards} />
                </div>
                <button
                  onClick={() => navigate("/request")}
                  className="cursor-pointer w-full mt-10 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black"
                >
                  <BiComment className="w-8 h-8" />
                  Post a Rent Requests
                </button>
                <button
                  onClick={() => navigate("/studentlisting")}
                  className="cursor-pointer w-full mt-5 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white"
                >
                  <MdOutlinePostAdd className="w-8 h-8" />
                  View Other Listings
                </button>
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === "Requests" && (
              <div className="p-2 md:p-5 mt-5 space-y-6 md:w-2/3">
                {showFirst ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative flex flex-col mb-10">
                        <Label>NEW REQUEST</Label>
                        <div
                          onClick={() => {
                            if (!isMaxReached) {
                              navigate("/request");
                            }
                          }}
                          className={clsx(
                            "absolute disable md:mt-5 left-8 top-9 flex items-center justify-center w-12 h-12 rounded-full",
                            isMaxReached
                              ? "bg-gray-400 cursor-not-allowed opacity-60"
                              : "bg-black cursor-pointer",
                          )}
                        >
                          <FaPlus size={20} className="text-white" />
                        </div>
                      </div>

                      <div className="col-span-2 grid grid-cols-2 gap-4 mt-5">
                        <div>
                          <Label>TOTAL ACTIVE</Label>
                          <InfoPill className="relative flex items-center bg-white">
                            <input
                              type="text"
                              readOnly
                              value={requestsCount}
                              className="w-full text-xs md:text-sm outline-none py-1 rounded-md text-black"
                            />
                            <RiInformationLine className="pointer-events-none absolute right-3 text-gray-500" />
                          </InfoPill>
                        </div>

                        <div>
                          <Label>MAX REQUEST</Label>
                          <InfoPill className="relative flex items-center bg-white">
                            <input
                              type="text"
                              readOnly
                              value={3}
                              className="w-full text-xs md:text-sm outline-none py-1 rounded-md text-black"
                            />
                            <RiInformationLine className="pointer-events-none absolute right-3 text-gray-500" />
                          </InfoPill>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 my-8">
                      <span className="text-sm md:text-md font-semibold text-black tracking-wide mt-10">
                        --- YOUR REQUESTS -------
                      </span>
                    </div>
                    <div className="overflow-x-auto md:min-w-170">
                      <RequestsCards
                        setShowFirst={setShowFirst}
                        setSelectedResponses={setSelectedResponses}
                        setSelectedItemDetails={setSelectedItemDetails}
                        setRequestsCount={setRequestsCount} // 👈 add this
                      />
                    </div>

                    <button
                      onClick={() => navigate("/studentlisting")}
                      className="cursor-pointer w-full mt-10 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white"
                    >
                      <MdOutlinePostAdd className="w-8 h-8" />
                      View Other Listings
                    </button>
                  </>
                ) : (
                  <>
                    <IoIosArrowBack
                      onClick={() => setShowFirst(true)}
                      className="cursor-pointer text-white w-13 h-13 p-3 ml-8 rounded-full bg-black"
                    />

                    <div className="col-span-2 grid grid-cols-2 gap-4 mt-5">
                      <div>
                        <Label>HOW IT WORKS</Label>
                        <InfoPill className="relative  flex items-center bg-white">
                          <span className="py-1">Info</span>
                          <MdLightbulbOutline className="pointer-events-none absolute right-5 text-lg text-black" />
                        </InfoPill>
                      </div>

                      <div>
                        <Label>FILTER</Label>
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
                          <FiChevronDown className="pointer-events-none absolute right-5 text-black" />
                        </InfoPill>
                      </div>
                    </div>

                    <RequestsResponses
                      responses={selectedResponses}
                      declined={selectedItemDetails?.declined || []}
                      accepted={selectedItemDetails?.accepted || []}
                      item={selectedItemDetails}
                    />
                    <button
                      onClick={() => navigate("/request")}
                      className="cursor-pointer w-full mt-10 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black"
                    >
                      <BiComment className="w-8 h-8" />
                      Post a Rent Requests
                    </button>

                    <button
                      onClick={() => navigate("/studentlisting")}
                      className="cursor-pointer w-full mt-5 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white"
                    >
                      <MdOutlinePostAdd className="w-8 h-8" />
                      View Other Listings
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Host Tab */}
            {activeTab === "Host" && (
              <div className="p-2 md:p-5 mt-5 md:w-2/3">
                {/* Header with dashed line */}
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-sm md:text-md font-semibold text-black tracking-wide">
                    -- YOUR HOST -------------
                  </span>
                </div>

                <PaginatedHost />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
