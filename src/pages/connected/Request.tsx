import imgright from "../../assets/request.png";
import { Mars, Venus, Church, Moon, Ban } from "lucide-react";
import { DfButton } from "../../components/Pill";
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
    <div className="px-5 pt-10">
      <h3 className="text-4xl font-medium text-center">{title}</h3>
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

import InfoPill from "../../components/Pill";

import clsx from "clsx"; // optional, for cleaner class merging

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
export default function Request() {
  return (
    <section className="flex justify-center items-center py-10">
      <div className="grid grid-cols-[55%_45%] items-center">
        {/* Left: Image */}
        <div className="ml-20 -mr-10">
          <img
            src={imgright}
            alt="Traveler with suitcase"
            className="h-full w-full object-cover rounded-tl-4xl rounded-bl-4xl"
          />
        </div>

        {/* RIGHT STACK */}
        <div className="space-y-1 mr-20 -ml-10">
          {/* HOSTEL VIEW */}
          <Maincard className="bg-[#F4F6F5] pb-5">
            <SectionHeader
              title="Request"
              caption="Guess who has a Host now? Yes, You!!!"
            />

            <div className="px-5 pb-4 pt-3 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="">
                  <Label className="ml-8">Gender</Label>
                  <div className="flex gap-2 mt-1 text-center">
                    <button className="bg-white border rounded-lg py-4 px-4">
                      <Mars size={25} />
                    </button>
                    <button className="bg-white border rounded-lg py-4 px-4">
                      <Venus size={25} />
                    </button>
                  </div>
                </div>
                <div className="">
                  <Label className="ml-8">Religion</Label>
                  <div className="flex gap-2 mt-1">
                    <button className="bg-white border rounded-lg py-4 px-4">
                      <Church size={25} />
                    </button>
                    <button className="bg-white border rounded-lg py-4 px-4">
                      <Moon size={25} />
                    </button>
                    <button className="bg-white border rounded-lg py-4 px-4">
                      <Ban size={25} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label className="ml-8">Category</Label>
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
                  <Label className="ml-8">Type</Label>
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

                <div className="space-y-1">
                  <Label className="ml-8">Category</Label>
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
                  <Label className="ml-8">Type</Label>
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

                <div className="space-y-1">
                  <Label className="ml-8">Category</Label>
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
                  <Label className="ml-8">Type</Label>
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
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <Label className="ml-8">Budget</Label>
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
                <DfButton>POST</DfButton>
              </div>
            </div>
          </Maincard>
        </div>
      </div>
    </section>
  );
}
