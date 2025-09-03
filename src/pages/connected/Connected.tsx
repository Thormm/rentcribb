import {
  Star,
  Info,
  AlertTriangle,
  Share2,
  ShieldCheck,
  User,
  ListCheck, CopyIcon,
} from "lucide-react";

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

function SectionHeader({ title, caption }: { title: string; caption?: string }) {
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
    <div className={clsx("text-md my-5 font-semibold ml-0", className)}>
      {children}
    </div>
  );
}


export default function Hostelview() {
  return (
    <div className="bg-[#F3EDFE]">
      <section className="py-20">
        <div className="mx-24 max-w-6xl grid grid-cols-1 gap-14 lg:grid-cols-2">
          {/* LEFT STACK */}

          <div className="space-y-4">
            {/* HOST */}
            <Maincard className="bg-[#CDBCEC] pb-5">
              <SectionHeader title="Host"/>

              <div className="px-5 pb-5 pt-3">
                {/* Host row */}
                <Label className="ml-8">Host</Label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-white rounded-xl border-3 px-2 py-3">
                    <div className="place-items-center">
                      <User size={30} />
                    </div>
                    <span className="font-semibold text-xl mr-35">
                      LANDLORD
                    </span>
                  </div>

                  <button className="inline-flex items-center gap-1 text-xs font-semibold">
                    <Star /> <span className="underline ml-3">1.2 (85)</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* First InfoPill */}
                  <div className="space-y-1">
                    <Label className="ml-8">Verification</Label>
                    <InfoPill>
                      <div className="inline-flex items-center justify-between w-full text-[11px]">
                        <span className="inline-flex items-center gap-2 rounded px-3 py-1 bg-black text-white ">
                          <ShieldCheck size={24} /> TIER 1
                        </span>
                        <Info size={24} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  {/* Second InfoPill */}
                  <div className="space-y-1">
                    <Label className="ml-8">No. of Listings</Label>
                    <InfoPill>
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-md py-1">26</span>
                        <Info size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="ml-8">How long on Cribb</Label>
                    <InfoPill>2 Months</InfoPill>
                  </div>

                  <div className="space-y-1">
                    <Label className="ml-8">Last Seen</Label>
                    <InfoPill>2 Days Ago</InfoPill>
                  </div>
                </div>
                {/* View House Rules */}
                <div className="pt-2 w-full mt-10">
                  <button className="w-full flex items-center justify-center gap-2 rounded-full bg-[#FFFFFF] px-5 py-5 text-xl font-medium drop-shadow-lg">
                    <ListCheck size={40} className="text-black" />
                    <span>All Host Listings </span>
                  </button>
                </div>

                <div
                  className="mt-5 w-95 border-t-4 mx-auto text-[#0000004D]"
                  style={{
                    borderStyle: "dashed",
                    borderImage:
                      "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
                  }}
                />
                {/* Report / Share */}
                <div className="flex items-center justify-between mt-5">
                  <button className="inline-flex items-center text-sm gap-2 text-red-600  underline underline-offset-4">
                    <AlertTriangle size={35} />
                    Report listing
                  </button>
                  <button className="inline-flex items-center gap-2">
                    <Share2 size={20} /> <span className="underline text-md text-[#0556F8]">Give a review</span> 
                  </button>
                </div>
              </div>
            </Maincard>
          </div>

          {/* RIGHT STACK */}
          <div className="space-y-1">
            {/* HOSTEL VIEW */}
            <Maincard className="bg-[#F4F6F5] pb-5">
              <SectionHeader title="Hurray"  caption="Guess who has a Host now? Yes, You!!!"/>

              <div className="px-5 pb-4 pt-3 space-y-4">
               

                {/* Bedrooms & Toilets */}
                <div className="space-y-1">
                  <Label className="ml-8">Agency Name</Label>
                  <InfoPill>
                    AYsmart Property & Investmentite
                  </InfoPill>
                </div>

                {/* Security */}
                <div className="space-y-1">
                  <Label className="ml-8">About</Label>
                  <InfoPill>
                    Finding your path to sucess. 
We are on a journey to make your renting easy.
                  </InfoPill>
                </div>

                {/* Water */}
                <div className="space-y-1">
                  <Label className="ml-8">Business Address</Label>
                  <InfoPill>
                    11 Salami street close Akarabi Street okeodo Ilorin, Kwara State, Nigeria.
                  </InfoPill>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="ml-8">Call no.</Label>
                    <InfoPill className="bg-white">
                      <div className="inline-flex items-center justify-between w-full ">
                        <span className="text-md">08165000602</span>
                        <CopyIcon size={24} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  <div className="space-y-1">
                    <Label className="ml-8">Whatsapp no.</Label>
                    <InfoPill className="bg-white">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-md">08165000602</span>
                        <CopyIcon size={24} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>
                </div>


               <div className="pt-2 w-full mt-10">
                  <button className="w-full text-[white] flex items-center justify-center gap-2 rounded-full bg-black px-5 py-5 text-xl font-medium drop-shadow-lg">
                    <ListCheck size={30} />
                    <span>Say "Hola" to your Host </span>
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
