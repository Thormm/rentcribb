import { useState } from "react"; 
import imgright from "../../../../../src/assets/list4.png";
import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io";
import InfoPill from "../../../../components/Pill";
import clsx from "clsx";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { RiInformationLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

function Maincard({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={["rounded-4xl px-5 border-4 shadow", className].join(" ")}>{children}</div>;
}

function SectionHeader({ title, caption }: { title: string; caption?: string }) {
  return (
    <div className="pt-8 md:px-5">
      <h3 className="text-xl md:text-3xl font-medium text-center">{title}</h3>
      <p className="text-center text-xs md:text-md pt-3">{caption ?? "Check out the Features of this Hostel"}</p>
      <div
        className="mt-1 md:w-95 border-t-4 mx-auto text-[#0000004D]"
        style={{
          borderStyle: "dashed",
          borderImage: "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
        }}
      />
    </div>
  );
}

function Label({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={clsx("text-sm md:text-md md:my-3 font-semibold ml-0", className)}>{children}</div>;
}

interface Entirespace4Props {
  onBack?: () => void;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function Entirespace4({ onBack, formData, setFormData }: Entirespace4Props) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const user = login?.user || "";
  const signup_key = login?.signup_key || "";

  const durationOptions = [
    "Per Year",
    "Per Session",
    "Per 9months",
    "Per 6months",
    "Per Semester",
    "Per 3months",
    "Per month",
  ];

  const handleSave = async () => {
    setLoading(true);
    setStatusMessage("Saving...");
    try {
      const payload = {
        action: "entire_space4",
        user: user,
        signup_key:signup_key,
        inspection: formData.inspection,
        price: formData.price,
        rent: formData.rent,
        duration: formData.duration,
        caution_fee: formData.caution_fee,
        service_charge: formData.service_charge,
        agreement_fee: formData.agreement_fee,
        agency_fee: formData.agency_fee,
        space_id: formData.space_id,
      };

      const response = await fetch("https://www.cribb.africa/api_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success){
        setStatusMessage("Saved successfully!");
        setTimeout(() => {
          setStatusMessage(null);
        }, 1000);
        navigate("/login");
      } 
      else {setStatusMessage("Error: " + (data.message || "Unknown"));
        setTimeout(() => setStatusMessage(null), 2000);} 
    } catch (err) {
      setStatusMessage("Network error");
      setTimeout(() => setStatusMessage(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  const isSelectField = (field: string) => field === "inspection" || field === "duration";
  const hasInfoIcon = (field: string) =>
    ["rent","caution_fee", "service_charge", "agreement_fee", "agency_fee"].includes(field);

  return (
    <section className="mx-1 md:mx-0 flex flex-col gap-4 justify-center items-center py-10 bg-[#F3EDFE]">
      <div className="grid grid-cols-1 md:grid-cols-[45%_55%] w-full">
        <div></div>
        <div className="min-w-0 flex items-center justify-center">
          <div className="flex gap-2 flex-wrap justify-center max-w-full">
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
            <a className="w-15 h-2 border-2 box-border flex items-center justify-center"></a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] items-center">
        <div className="-mb-20 md:mb-0 mx-2 md:ml-20 md:-mr-10 relative">
          <img src={imgright} alt="Traveler with suitcase" className="h-full w-full object-cover rounded-tl-4xl rounded-bl-4xl" />
          <button
            onClick={onBack}
            className="cursor-pointer absolute top-5 right-5 md:right-25 w-11 h-11 border-2 border-white flex items-center justify-center rounded-full bg-[#202020] text-white shadow-lg"
          >
            <IoIosArrowBack size={14} />
          </button>
        </div>

        <div className="space-y-1 md:mr-20 md:-ml-10 z-2">
          <Maincard className="bg-[#CDBCEC] pb-5 md:pb-8 px-6 md:px-10">
            <SectionHeader title="Booking & Rent" caption="Help Guest Imagine their Stay in your Space" />

            <div className="md:px-5 pb-4 pt-3 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                {[
                  "inspection",
                  "price",
                  "rent",
                  "duration",
                  "caution_fee",
                  "service_charge",
                  "agreement_fee",
                  "agency_fee",
                ].map((field) => {
                  const label = field
                    .split("_")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ");

                  return (
                    <div key={field} className="space-y-1">
                      <Label className="ml-8">{label}</Label>
                      <InfoPill className="bg-white">
                        <div className="inline-flex items-center justify-between w-full">
                          {isSelectField(field) ? (
                            <select
                              value={formData[field] || ""}
                              onChange={(e) =>
                                setFormData({ ...formData, [field]: e.target.value })
                              }
                              className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none cursor-pointer"
                            >
                              {field === "inspection" ? (
                                <>
                                  <option value="">Charge type</option>
                                  <option value="Per House">Per House</option>
                                  <option value="Per Area">Per Area</option>
                                </>
                              ) : (
                                <>
                                  <option value="">Select {label}</option>
                                  {durationOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </>
                              )}
                            </select>
                          ) : (
                            <input
                              type="number"
                              value={formData[field] || ""}
                              onChange={(e) =>
                                setFormData({ ...formData, [field]: e.target.value })
                              }
                              placeholder={field === "price" ? "Enter Amount" : "How much?"}
                              className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none"
                            />
                          )}

                          {field === "price" ? (
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({ ...formData, price: Number(formData.price || 0) + 1 })
                              }
                            >
                            </button>
                          ) : (
                            hasInfoIcon(field) && <RiInformationLine />
                          )}

                          {isSelectField(field) && <IoIosArrowDown />}
                        </div>
                      </InfoPill>
                    </div>
                  );
                })}
              </div>

              <div
                className="mt-6 w-full border-t-4 mx-auto text-[#0000004D]"
                style={{
                  borderStyle: "dashed",
                  borderImage:
                    "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
                }}
              />

              {/*<button
                onClick={() => alert("Preview not implemented")}
                className="w-full my-8 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black"
              >
                <MdOutlinePayments className="w-8 h-8" />
                Preview Pricing
              </button>*/}

              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full mt-8 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white"
              >
                {loading ? "Saving..." : "Proceed"}
                <MdKeyboardDoubleArrowRight className="w-8 h-8" />
              </button>
            </div>
          </Maincard>
        </div>
      </div>
      {/* STATUS MODAL */}
      {statusMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-72 text-center shadow-lg">
            <p className="text-sm md:text-md">{statusMessage}</p>
          </div>
        </div>
      )}
    </section>
  );
}
