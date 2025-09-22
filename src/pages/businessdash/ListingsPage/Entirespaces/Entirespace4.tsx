import imgright from "../../../../../src/assets/request.png";
import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io";
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
    <div className="px-5 pt-5">
      <h3 className="text-3xl font-medium text-center">{title}</h3>
      <p className="text-center text-md pt-5">
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

import InfoPill from "../../../../components/Pill";

import clsx from "clsx"; // optional, for cleaner class merging
import { MdKeyboardDoubleArrowRight, MdOutlinePayments } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { RiInformationLine } from "react-icons/ri";

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
export default function Entirespace2({
  onBack,
}: {
  onBack?: () => void;
}) {
  return (
    <section className="flex flex-col gap-4 justify-center items-center py-10 bg-[#F3EDFE]">
      <div className="grid grid-cols-[45%_55%] w-full">
        <div className=""></div>

        <div className="min-w-0 flex items-center justify-center">
          {/* flex-wrap so items drop to new line instead of pushing into left column */}
          <div className="flex gap-2 flex-wrap justify-center max-w-full">
            <a
              href="#"
              className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"
            ></a>
            <a
              href="#"
              className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"
            ></a>
            <a
              href="#"
              className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"
            ></a>
            <a
              href="#"
              className="w-15 h-2 border-2 box-border flex items-center justify-center"
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
          <button onClick={onBack}  className="absolute top-4 right-25 w-11 h-11 border-2 border-white flex items-center justify-center rounded-full bg-[#202020] text-white shadow-lg">
            <IoIosArrowBack size={14} />
          </button>
        </div>

        {/* RIGHT STACK */}
        <div className="space-y-1 mr-20 -ml-10 z-2">
          {/* HOSTEL VIEW */}
          <Maincard className="bg-[#CDBCEC] pb-5">
            <SectionHeader
              title="Booking & Rent"
              caption="Help Guest Imagine their Stay in your Space"
            />

            <div className="px-5 pb-4 pt-3 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label className="ml-8">Inspection</Label>
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
                  <Label className="ml-8">Price</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <input
                        className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none"
                        placeholder="Enter Amount"
                      />
                      <FaPlus />
                    </div>
                  </InfoPill>
                </div>
                <div className="space-y-1">
                  <Label className="ml-8">Rent</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <input
                        className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none"
                        placeholder="How much?"
                      />
                      <RiInformationLine />
                    </div>
                  </InfoPill>
                </div>

                <div className="space-y-1">
                  <Label className="ml-8">Duration</Label>
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
                  <Label className="ml-8">Caution Fee</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <input
                        className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none"
                        placeholder="How much?"
                      />
                      <RiInformationLine />
                    </div>
                  </InfoPill>
                </div>

                <div className="space-y-1">
                  <Label className="ml-8">Service Charge</Label>
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
                  <Label className="ml-8">Agreement Fee</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <input
                        className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none"
                        placeholder="How much?"
                      />
                      <RiInformationLine />
                    </div>
                  </InfoPill>
                </div>

                <div className="space-y-1">
                  <Label className="ml-8">Agency Fee</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <input
                        className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none"
                        placeholder="How much?"
                      />
                      <RiInformationLine />
                    </div>
                  </InfoPill>
                </div>
              </div>

              <div
                className="mt-6 w-full border-t-4 mx-auto text-[#0000004D]"
                style={{
                  borderStyle: "dashed",
                  borderImage:
                    "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
                }}
              />
              <button className="w-full my-8 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black">
                <MdOutlinePayments className="w-8 h-8" />
                Preview Pricing
              </button>

              <button className="w-full mt-8 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white">
                Proceed
                <MdKeyboardDoubleArrowRight className="w-8 h-8" />
              </button>
            </div>
          </Maincard>
        </div>
      </div>
    </section>
  );
}
