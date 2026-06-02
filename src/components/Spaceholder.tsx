import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import spacebanner from "../../src/assets/spacebanner.png";

type SpaceholderProps = {
  className?: string;
  title?: string;
  comment?: string;
};

export default function Spaceholder({
  className = "h-80",
  title = "Nothing to see yet...",
  comment = "Your progress will show up here",
}: SpaceholderProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1600); // adjust duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`relative w-full rounded overflow-hidden ${className}`}
    >
      {/* Background Image */}
      <img
        src={spacebanner}
        alt="Banner"
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-black text-center">
        {loading ? (
          <>
            <AiOutlineLoading3Quarters className="w-8 h-8 md:w-10 md:h-10 animate-spin mb-3" />
            <h1 className="text-lg md:text-xl font-semibold">Loading...</h1>
          </>
        ) : (
          <>
            <h1 className="text-xl md:text-2xl font-semibold">{title}</h1>

            <p className="mt-3 text-xs md:text-sm">{comment}</p>
          </>
        )}
      </div>
    </div>
  );
}