import InfoPill from "../../components/Pill";
import { useState, useEffect } from "react";
import clsx from "clsx"; // optional, for cleaner class merging
import {
  FaStar,
  FaInfoCircle,
  FaExclamationTriangle,
  FaShareAlt,
  FaShieldAlt,
  FaUser,
  FaClipboardList,
} from "react-icons/fa";
import { HiOutlineMail, HiOutlineUserCircle } from "react-icons/hi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdOutlineCall } from "react-icons/md";
import { RiWhatsappLine } from "react-icons/ri";
import { FiCopy } from "react-icons/fi";
import { useLocation } from "react-router-dom";

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

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="px-5 pt-10">
      <h2 className="text-center text-2xl md:text-4xl font-extrabold">
        {title}
      </h2>
      <p className="text-center text-xs md:text-sm pt-1 md:pt-5">
        Check out the Features of this Hostel
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

type LabelProps = React.PropsWithChildren<{
  className?: string;
}>;

function Label({ children, className }: LabelProps) {
  return (
    <div
      className={clsx(
        "text-sm md:text-lg md:my-2 font-semibold ml-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default function Hostelview() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const uploader = params.get("uploader");
  const type = params.get("type");

  const [host, setHost] = useState<any>(null);

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return "--";

    let d: Date | null = null;

    // case 1: 2026-02-05 13:56:10.000000
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      d = new Date(dateStr.replace(" ", "T"));
    }

    // case 2: 26-01-11 03:49:32pm   (yy-mm-dd hh:mm:ssam)
    else if (/^\d{2}-\d{2}-\d{2}\s/.test(dateStr)) {
      const [datePart, timePartRaw] = dateStr.split(" ");

      const [yy, mm, dd] = datePart.split("-").map(Number);

      const timePart = timePartRaw.toLowerCase();
      const isPM = timePart.endsWith("pm");

      const [h, m, s] = timePart.replace(/am|pm/, "").split(":").map(Number);

      let hour = h;
      if (isPM && hour < 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;

      // assume 20xx for your system
      d = new Date(2000 + yy, mm - 1, dd, hour, m, s);
    }

    if (!d || isNaN(d.getTime())) return "--";

    const diff = Date.now() - d.getTime();

    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    if (months > 0) return `${months} month${months > 1 ? "s" : ""}`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;

    return `${Math.max(mins, 0)} min`;
  };

  useEffect(() => {
    if (!uploader) return;

    const fetchHost = async () => {
      const res = await fetch("https://www.cribb.africa/apigets.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_host_details",
          user: uploader,
          type: type,
        }),
      });

      const data = await res.json();

      if (data.data) {
        setHost(data.data);
        console.log("Host summary:", data.data);
      }
    };

    fetchHost();
  }, [uploader]);

  const mockItem = {
    id: 1,
    name: host?.bname ?? "",
    date: formatDateToShort(host?.reg_time ?? ""),
    email: host?.email ?? "",
    call: host?.call ?? "",
    whatsapp: host?.whats ?? "",
  };
  const [expanded, setExpanded] = useState<(typeof mockItem)["id"] | null>(
    mockItem.id,
  );

  function formatDateToShort(dateStr?: string) {
    if (!dateStr) return "--";

    let d: Date | null = null;

    // Case 1: yyyy-mm-dd hh:mm:ss...
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      d = new Date(dateStr.replace(" ", "T"));
    }
    // Case 2: yy-mm-dd hh:mm:ssam/pm
    else if (/^\d{2}-\d{2}-\d{2}\s/.test(dateStr)) {
      const [datePart, timePartRaw] = dateStr.split(" ");
      const [yy, mm, dd] = datePart.split("-").map(Number);

      const timePart = timePartRaw.toLowerCase();
      const isPM = timePart.endsWith("pm");
      const [h, m, s] = timePart.replace(/am|pm/, "").split(":").map(Number);

      let hour = h;
      if (isPM && hour < 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;

      d = new Date(2000 + yy, mm - 1, dd, hour, m, s);
    }

    if (!d || isNaN(d.getTime())) return "--";

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${monthNames[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`;
  }

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="bg-[#F3EDFE]">
      <section className="my-10">
        <div className="px-0 md:px-25 mx-2 grid grid-cols-1 gap-14 md:grid-cols-2">
          {/* LEFT STACK */}

          <div className="space-y-4">
            {/* HOST */}
            <Maincard className="bg-[#CDBCEC] pb-5">
              <SectionHeader title="Host" />

              <div className="md:px-5 space-y-5 pb-5 pt-3">
                {/* Host row */}
                <Label className="my-0 ml-2 md:ml-8 py-2 ">Host</Label>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-white rounded-xl border-3 px-2 py-3">
                    <div className="place-items-center">
                      <FaUser className="text-[16px] md:text-[25px]" />
                    </div>

                    <span className="font-semibold text-sm md:text-xl mr-5 md:mr-35">
                      {type?.toUpperCase?.() || "HOST"}
                    </span>
                  </div>

                  {/* rating still static for now */}
                  <button className="inline-flex items-center md:gap-1 text-xs font-semibold">
                    <FaStar className="text-lg text-yellow-400" />
                    <span className="underline ml-3">1.2 (85)</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Verification */}
                  <div className="space-y-1">
                    <Label className="ml-3 md:ml-8">Verification</Label>

                    <InfoPill className="px-3 md:pl-8 md:px-base">
                      <div className="inline-flex items-center justify-between w-full text-[11px]">
                        <span className="text-xs md:text-sm inline-flex items-center gap-2 rounded px-2 md:px-3 py-1 bg-black text-white">
                          <FaShieldAlt size={14} />
                          TIER {host?.tier ?? "-"}
                        </span>

                        <FaInfoCircle size={14} className="md:ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  {/* Listings */}
                  <div className="space-y-1">
                    <Label className="ml-3 md:ml-8">No. of Listings</Label>

                    <InfoPill className="px-3 md:px-base">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-xs md:pl-4 md:text-sm py-1">
                          {host?.listings ?? 0}
                        </span>

                        <FaInfoCircle size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Joined */}
                  <div className="space-y-1">
                    <Label className="ml-3 md:ml-8">Joined</Label>

                    <InfoPill className="px-3 md:pl-8 md:px-base">
                      <span className="text-xs md:text-sm text-start">
                        {timeAgo(host?.reg_time)} ago
                      </span>
                    </InfoPill>
                  </div>

                  {/* Last seen */}
                  <div className="space-y-1">
                    <Label className="ml-3 md:ml-8">Last Seen</Label>

                    <InfoPill className="px-3 md:pl-8 md:px-base">
                      <span className="text-xs md:text-sm">
                        {timeAgo(host?.last_activity)} ago
                      </span>
                    </InfoPill>
                  </div>
                </div>
              </div>
              <div className="pt-2 w-full mb-5">
                <button className="w-full flex items-center justify-center gap-2 rounded-full bg-[#FFFFFF] px-5 py-5 text-xl font-medium drop-shadow-lg">
                  <FaClipboardList size={40} className="text-black" />
                  <span>All Host Listings </span>
                </button>
              </div>

              <div
                className="mt-2 w-full border-t-4"
                style={{
                  borderStyle: "dashed",
                  borderImage:
                    "repeating-linear-gradient(to right, #0000004D 0, #0000004D 10px, transparent 6px, transparent 24px) 1",
                }}
              />
              {/* Report / Share */}
              <div className="flex items-center justify-between mt-5">
                <button className="inline-flex items-center text-xs md:text-lg gap-2 text-red-600  underline underline-offset-4">
                  <FaExclamationTriangle />
                  Report listing
                </button>
                <button className="inline-flex text-xs md:text-lg items-center gap-2">
                  <FaShareAlt />{" "}
                  <span className="underline  text-[#0556F8]">
                    Give a review
                  </span>
                </button>
              </div>
            </Maincard>
          </div>

          {/* RIGHT STACK */}
          <div className="space-y-1">
            {/* HOSTEL VIEW */}
            <Maincard className="bg-[#F4F6F5] pb-5">
              <SectionHeader title="Hurray" />

              <div className="md:px-5 pb-4 pt-3 space-y-4">
                {/* Bedrooms & Toilets */}
                <div className="space-y-1">
                  <Label className="ml-8">Agency Name</Label>
                  <InfoPill>
                    <span className="text-xs md:text-base">
                      {host?.bname ?? ""}{" "}
                    </span>
                  </InfoPill>
                </div>

                {/* Security */}
                <div className="space-y-1">
                  <Label className="ml-8">About</Label>
                  <InfoPill>
                    <span className="text-xs md:text-base">
                      {host?.babout ?? ""}{" "}
                    </span>
                  </InfoPill>
                </div>

                {/* Water */}
                <div className="space-y-1">
                  <Label className="ml-8">Business Address</Label>
                  <InfoPill>
                    <span className="text-xs md:text-base">
                      {host?.baddress ?? ""}{" "}
                    </span>
                  </InfoPill>
                </div>

                <div className="space-y-6  pr-2">
                  <div className="flex justify-between items-start gap-6">
                    {/* LEFT CARD – single mock item */}
                    <div className="flex-1 border-black rounded-4xl border px-6 py-4 shadow-sm relative">
                      {/* Row 1 */}
                      <div className="flex items-center">
                        <div className="w-6 h-6 flex items-center justify-center text-black">
                          <HiOutlineUserCircle className="w-7 h-7" />
                        </div>
                        <div className="flex flex-grow items-center gap-5 px-4">
                          <span className="text-xs md:text-sm text-black font-normal truncate">
                            {mockItem.name}
                          </span>
                        </div>
                        <button
                          className="w-6 h-6 flex items-center justify-center"
                          onClick={() =>
                            setExpanded(
                              expanded === mockItem.id ? null : mockItem.id,
                            )
                          }
                        >
                          {expanded === mockItem.id ? (
                            <IoIosArrowUp className="w-7 h-7 text-black" />
                          ) : (
                            <IoIosArrowDown className="w-7 h-7 text-black" />
                          )}
                        </button>
                      </div>

                      {/* Row 2 Icons */}
                      {expanded === mockItem.id && (
                        <div className="flex items-center text-black justify-between mt-3 md:px-8">
                          <span className="text-xs">{mockItem.date}</span>

                          <div className="flex gap-1 md:gap-3">
                            <div
                              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer"
                              onClick={() =>
                                (window.location.href = `mailto:${mockItem.email}`)
                              }
                            >
                              <HiOutlineMail className="w-4 h-4" />
                            </div>
                            <div
                              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer"
                              onClick={() =>
                                (window.location.href = `tel:${mockItem.call}`)
                              }
                            >
                              <MdOutlineCall className="w-4 h-4" />
                            </div>
                            <div
                              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer"
                              onClick={() =>
                                window.open(
                                  `https://wa.me/${mockItem.whatsapp}`,
                                  "_blank",
                                )
                              }
                            >
                              <RiWhatsappLine className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Expanded Section with Copy */}
                      {expanded === mockItem.id && (
                        <div className="mt-4 bg-white rounded-xl border p-2 md:p-4 md:px-8 text-black shadow-sm">
                          <div className="space-y-3">
                            {[
                              { label: "Email", value: mockItem.email },
                              { label: "Call no.", value: mockItem.call },
                              { label: "Whatsapp", value: mockItem.whatsapp },
                            ].map((field, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between relative"
                              >
                                <span className="text-xs md:text-base font-semibold">
                                  {field.label}
                                </span>

                                <div className="flex items-center gap-2">
                                  <span className="text-xs md:text-base truncate">
                                    {" "}
                                    {field.value?.length > 15
                                      ? field.value.slice(0, 15) + "…"
                                      : field.value}{" "}
                                  </span>
                                  <FiCopy
                                    className="w-4 h-4 cursor-pointer hover:text-black transition"
                                    onClick={() =>
                                      handleCopy(field.label, field.value)
                                    }
                                  />
                                </div>

                                {/* Modal / small alert */}
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

                <div className="pt-2 w-full mt-10">
                  <button className="w-full text-[white] flex items-center justify-center gap-2 rounded-full bg-black px-5 py-5 text-xl font-medium drop-shadow-lg">
                    <FaClipboardList className="text-md md:text-4xl" />
                    <span className="text-xs md:text-2xl">
                      Say "Hola" to your Host{" "}
                    </span>
                  </button>
                </div>
              </div>
            </Maincard>
          </div>
        </div>
      </section>
    </div>
  );
}
