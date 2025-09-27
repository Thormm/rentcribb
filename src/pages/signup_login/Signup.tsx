import { BiSolidBriefcase } from "react-icons/bi";
import { MdDoubleArrow } from "react-icons/md";
import clsx from "clsx";
import logo from "../../assets/logo.png";
import nigeriaflag from "../../assets/nigeriaflag.png";
import signbg from "../../assets/signbg.png";
import InfoPill from "../../components/Pill";

/* ---------- Reusable Components ---------- */
function Maincard({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={clsx("rounded-2xl md:rounded-4xl px-5 border-4 shadow", className)}>
      {children}
    </div>
  );
}

function SectionHeader({ title, caption }: { title: string; caption?: string }) {
  return (
    <div className="md:px-5 pt-8">
      <h3 className="text-xl md:text-3xl font-medium text-center">{title}</h3>
      <p className="text-center text-xs md:text-md pt-3">
        {caption ?? "Check out the Features of this Hostel"}
      </p>
      <div
        className="mt-1 md:w-95 border-t-4 mx-auto text-[#0000004D]"
        style={{
          borderStyle: "dashed",
          borderImage:
            "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
        }}
      />
    </div>
  );
}

function Label({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={clsx("text-sm md:text-md md:my-3 font-semibold ml-0", className)}>{children}</div>;
}

/* Single Input Field (Reusable inside this file) */
function InputField({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div className="space-y-1">
      <Label className="ml-8">{label}</Label>
      <InfoPill className="bg-white">
        <div className="inline-flex items-center justify-between w-full">
          <input
            type={type}
            placeholder={placeholder}
            className="w-full appearance-none bg-transparent text-[10px] md:text-xs outline-none"
          />
        </div>
      </InfoPill>
    </div>
  );
}

/* ---------- Main Signup Page ---------- */
const Signup = () => {
  return (
    <>
      {/* ---------- Navbar ---------- */}
      <nav className="sticky top-0 grid grid-cols-[1fr_auto] md:grid-cols-3 items-center px-4 md:px-6 py-3 md:py-4 shadow-sm bg-white z-50 border-b">
        {/* Left: Flag (hidden on mobile, shown on md+) */}
        <div className="hidden md:flex justify-center">
          <div className="rounded-full bg-black">
            <img src={nigeriaflag} alt="Nigeria Flag" className="h-10 md:h-12 object-contain p-3" />
          </div>
        </div>

        {/* Center: Logo + Text */}
        <div className="flex justify-start md:justify-center items-center gap-1 col-span-1">
          <img src={logo} alt="Cribb.Africa Logo" className="h-8 md:h-14" />
          <div className="flex flex-col">
            <h1 className="text-md md:text-2xl font-extrabold">Cribb</h1>
            <span className="text-[10px] md:text-sm text-black">for Students</span>
          </div>
        </div>

        {/* Right: Button */}
        <div className="flex justify-end md:justify-center items-center gap-2">
          {/* Mobile flag */}
          <div className="md:hidden rounded-full bg-black p-2 shrink-0">
            <img src={nigeriaflag} alt="Nigeria Flag" className="h-4 md:h-8 object-contain" />
          </div>

          <button className="px-3 md:px-4 py-2 md:py-3 bg-black flex items-center gap-2 text-[10px] text-white rounded-lg shadow-md whitespace-nowrap">
            <span className="sm:text-xs">
              <BiSolidBriefcase />
            </span>
            Business &gt; &gt;
          </button>
        </div>
      </nav>

      {/* ---------- Section with Background ---------- */}
      <section
        className="px-2 pt-5 md:pt-10 pb-20 min-h-screen flex flex-col items-center justify-center text-black"
        style={{
          backgroundImage: `url(${signbg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* Progress Dots */}
        <div className="grid grid-cols-1 mb-5">
          <div className="flex items-center justify-center">
            <div className="flex gap-2 flex-wrap justify-center">
              <span className="w-10 md:w-15 h-2 bg-white border-2 border-white" />
              <span className="w-10 md:w-15 h-2 bg-[#3A3A3A] border border-white" />
              <span className="w-10 md:w-15 h-2 bg-[#3A3A3A] border border-white" />
              <span className="w-10 md:w-15 h-2 bg-[#3A3A3A] border border-white" />
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="grid grid-cols-1 items-center w-full md:w-2/5">
          <Maincard className="bg-[#F4F6F5] pb-5">
            <SectionHeader title="Sign Up" caption="Let’s get you Set-Up, it’s super easy!" />

            <div className="md:px-5 pb-4 pt-3 space-y-4">
              <InputField label="EMAIL" placeholder="Enter your email" type="email" />
              <InputField label="CALL NO." placeholder="Enter Number" type="tel" />
              <InputField label="WHATSAPP NO." placeholder="Enter Number" type="tel" />

              {/* Verify Button */}
              <InfoPill className="bg-black text-white mt-5 md:mt-10">
                <button className="inline-flex items-center justify-center w-full">
                  <span>Verify</span>
                  <MdDoubleArrow className="ml-2 text-3xl" />
                </button>
              </InfoPill>

              {/* Divider */}
              <div
                className="md:mt-5 md:w-95 border-t-4 mx-auto text-[#0000004D]"
                style={{
                  borderStyle: "dashed",
                  borderImage:
                    "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
                }}
              />

              {/* Footer link */}
              <div className="w-full flex text-xs md:text-sm md:pt-5 justify-center">
                <span>
                  Have a Cribb.Africa account? <span className="text-[#0556F8] cursor-pointer">Log in</span>
                </span>
              </div>
            </div>
          </Maincard>
        </div>
      </section>
    </>
  );
};

export default Signup;
