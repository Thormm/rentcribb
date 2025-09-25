import imgright from "../../../../../src/assets/list3.png";
import { DfButton } from "../../../../components/Pill";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import InfoPill from "../../../../components/Pill";
import clsx from "clsx"; // optional, for cleaner class merging
import { IoCameraOutline } from "react-icons/io5";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { PiHouse } from "react-icons/pi";

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
export default function Sharedspace3({
  onNext,
  onBack,
}: {
  onNext?: () => void;
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
              className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"
            ></a>
            <a
              className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"
            ></a>
            <a
              className="w-15 h-2 border-2 box-border flex items-center justify-center"
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
          <button
            onClick={onBack}
            className="cursor pointer absolute top-4 right-25 w-11 h-11 border-2 border-white flex items-center justify-center rounded-full bg-[#202020] text-white shadow-lg"
          >
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
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label className="ml-8">All Feature</Label>
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
                  <Label className="ml-8">Special Feature</Label>
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
                  <Label className="ml-8">Hostel Photo</Label>
                  <div className="w-full bg-white rounded-full border-[1.5px] px-8 py-3 text-[15px] text-[#222] shadow-sm">
                    <div className="flex items-center justify-start gap-6 w-full">
                      <IoCameraOutline className="w-8 h-8" />
                      <span className="text-xs text-gray-500 ">Add Photo</span>
                    </div>
                  </div>
                  <div className="flex justify-center mt-1 mx-5">
                    <span className="inline-block text-xs p-2 rounded-2xl text-[#7F7F7F] bg-white">
                      add a sum of 5 photos that shows overall view of the space
                      features.
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="ml-8">Hostel Video</Label>
                  <div className="w-full bg-white rounded-full border-[1.5px] px-8 py-3 text-[15px] text-[#222] shadow-sm">
                    <div className="flex items-center justify-start gap-6 w-full">
                      <AiOutlineVideoCameraAdd className="w-8 h-8" />
                      <span className="text-xs text-gray-500 ">Add Video</span>
                    </div>
                  </div>
                  <div className="flex justify-center mt-1 mx-5">
                    <span className="inline-block text-xs p-2 rounded-2xl text-[#7F7F7F] bg-white">
                      add a 2mins videos that shows detailed & quick overall
                      view of the space.
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <Label className="ml-8">Target University</Label>
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
              <div
                className="mt-6 w-full border-t-4 mx-auto text-[#0000004D]"
                style={{
                  borderStyle: "dashed",
                  borderImage:
                    "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
                }}
              />
              <button className="w-full my-8 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black">
                <PiHouse className="w-8 h-8" />
                Preview Space
              </button>
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
