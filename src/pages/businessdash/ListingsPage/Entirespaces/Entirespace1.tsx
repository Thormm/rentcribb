import imgright from "../../../../../src/assets/list1.png";
import { DfButton } from "../../../../components/Pill";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import InfoPill from "../../../../components/Pill";
import clsx from "clsx"; // optional, for cleaner class merging
import { FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
    <div className="px-5 pt-8">
      <h3 className="text-3xl font-medium text-center">{title}</h3>
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


type LabelProps = React.PropsWithChildren<{
  className?: string;
}>;

function Label({ children, className }: LabelProps) {
  return (
    <div className={clsx("text-md my-3 font-semibold ml-0", className)}>
      {children}
    </div>
  );
}
export default function Entirespace1({ onNext }: { onNext?: () => void }) {
  const navigate = useNavigate();
  return (
    <section className="flex flex-col gap-4 justify-center items-center py-10 bg-[#F3EDFE]">
      <div className="grid grid-cols-[45%_55%] w-full">
        <div className=""></div>

        <div className="min-w-0 flex items-center justify-center">
          {/* flex-wrap so items drop to new line instead of pushing into left column */}
          <div className="flex gap-2 flex-wrap justify-center max-w-full">
            <a
              className="w-15 h-2 border-2 box-border flex items-center justify-center"
            ></a>
            <a
              className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"
            ></a>
            <a
              className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"
            ></a>
            <a
              className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"
            ></a>
            
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[55%_45%] items-center">
        {/* Left: Image */}
        <div className="ml-20 -mr-10 relative z-0">
          <img
            src={imgright}
            alt="Traveler with suitcase"
            className="h-full w-full object-cover rounded-tl-4xl rounded-bl-4xl"
          />

          {/* Rounded arrow button at top-right */}
          <button onClick={() => navigate("/businessdash")} className="cursor-pointer absolute top-4 right-25 w-11 h-11 border-2 border-white flex items-center justify-center rounded-full bg-[#202020] text-white shadow-lg">
            <IoIosArrowBack size={14} />
          </button>
        </div>

        {/* RIGHT STACK */}
        <div className="space-y-1 mr-20 -ml-10 z-2">
          {/* HOSTEL VIEW */}
          <Maincard className="bg-[#F4F6F5] pb-5">
            <SectionHeader
              title="Space Details"
              caption="Help Guest Imagine their Stay in your Space"
            />

            <div className="px-5 pb-4 pt-3 space-y-4">
              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <Label className="ml-8">Space Name (Your Eyes Only)</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <input className="w-full appearance-none bg-transparent text-xs outline-none" placeholder="Give your entire unit a name" />
                    </div>
                  </InfoPill>
                </div>
              </div>

              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <Label className="ml-8">Full Address (Your Eyes Only)</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <input className="w-full appearance-none bg-transparent text-xs outline-none" placeholder="Enter Space address" />
                    </div>
                  </InfoPill>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                

                
                <div className="space-y-1">
                  <Label className="ml-8">Type</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <select className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none cursor-pointer">
                        <option>Select Space Type</option>
                      </select>
                      <IoIosArrowDown />
                    </div>
                  </InfoPill>
                </div>

                <div className="space-y-1">
                  <Label className="ml-8">No. of Units</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                     
                      <FaMinus />
                      <span>1</span>
                      <FaPlus />
                    </div>
                  </InfoPill>
                </div>


                <div className="space-y-1">
                  <Label className="ml-8">Location</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <select className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none cursor-pointer">
                        <option>Select space type</option>
                      </select>
                      {/* custom dropdown icon (optional, to far right) */}
                      <svg
                        className="w-5 h-5 text-gray-500  pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </InfoPill>
                </div>

                <div className="space-y-1">
                  <Label className="ml-8">Availability</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <select className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none cursor-pointer">
                        <option>Availability</option>
                      </select>
                      {/* custom dropdown icon (optional, to far right) */}
                      <svg
                        className="w-5 h-5 text-gray-500  pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </InfoPill>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <Label className="ml-8">House Rules</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <select className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none cursor-pointer">
                        <option>Type</option>
                      </select>
                      {/* custom dropdown icon (optional, to far right) */}
                      <svg
                        className="w-5 h-5 text-gray-500  pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </InfoPill>
                </div>
              </div>

              <div className="pt-2 w-full mt-2 flex items-center justify-center">
                <DfButton onClick={onNext}>NEXT</DfButton>
              </div>
            </div>
          </Maincard>
        </div>
      </div>
    </section>
  );
}
