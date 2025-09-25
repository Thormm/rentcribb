import imgright from "../../../../../src/assets/list2.png";
import { DfButton } from "../../../../components/Pill";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import InfoPill from "../../../../components/Pill";
import clsx from "clsx"; // optional, for cleaner class merging
import { FaMinus, FaPlus } from "react-icons/fa";
import { LuStar, LuStarOff } from "react-icons/lu";

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

function StarRow({ value = 4 }: { value?: number }) {
  return (
    <div className="flex items-center gap-1 text-yellow-500">
      {Array.from({ length: 5 }).map((_, i) =>
        i < value ? (
          <LuStar key={i} size={25} fill="currentColor" />
        ) : (
          <LuStarOff key={i} size={25} />
        )
      )}
    </div>
  );
}

export default function Sharedspace2({
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
              className="w-15 h-2 border-2 box-border flex items-center justify-center"
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
          <button onClick={onBack} className="cursor-pointer absolute top-4 right-25 w-11 h-11 border-2 border-white flex items-center justify-center rounded-full bg-[#202020] text-white shadow-lg">
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
                  <Label className="ml-8">No. of Bedroom</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <FaMinus />
                      <span>1</span>
                      <FaPlus />
                    </div>
                  </InfoPill>
                </div>
                <div className="space-y-1">
                  <Label className="ml-8">No. of Ensuite</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <FaMinus />
                      <span>1</span>
                      <FaPlus />
                    </div>
                  </InfoPill>
                </div>
                <div className="space-y-1">
                  <Label className="ml-8">No. of Bathroom</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <FaMinus />
                      <span>1</span>
                      <FaPlus />
                    </div>
                  </InfoPill>
                </div>

                <div className="space-y-1">
                  <Label className="ml-8">No. of Toilets</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <FaMinus />
                      <span>1</span>
                      <FaPlus />
                    </div>
                  </InfoPill>
                </div>

                <div className="space-y-1">
                  <Label className="ml-8">Security</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <select className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none cursor-pointer">
                        <option>Select space type</option>
                      </select>
                      <IoIosArrowDown />
                    </div>
                  </InfoPill>
                </div>

                <div className="space-y-1">
                  <Label className="ml-8">Water</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <select className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none cursor-pointer">
                        <option>Availability</option>
                      </select>
                      {/* custom dropdown icon (optional, to far right) */}
                      <IoIosArrowDown />
                    </div>
                  </InfoPill>
                </div>
              </div>
              {/* Grid pairs */}
              <div className="grid grid-cols-1 gap-6 ">
                {/* Row 1 */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1 pl-6">
                    <Label>Power Supply</Label>
                    <div>
                      <StarRow value={4} />
                      <div className="mt-3 text-md">Good supply</div>
                    </div>
                  </div>

                  <div className="space-y-1 pl-6">
                    <Label>Network Strength</Label>
                    <div>
                      <StarRow value={4} />
                      <div className="mt-3 text-md">Network Coverage</div>
                    </div>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1 pl-6">
                    <Label>Compound</Label>
                    <div>
                      <StarRow value={4} />
                      <div className="mt-3 text-md">Good &amp; Aesthetic</div>
                    </div>
                  </div>

                  <div className="space-y-1 pl-6">
                    <Label>Access Road</Label>
                    <div>
                      <StarRow value={4} />
                      <div className="mt-3 text-md">
                        Good &amp; Accessibility
                      </div>
                    </div>
                  </div>
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
