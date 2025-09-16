import { Medal, Star, User, ChevronLeft, ChevronRight } from "lucide-react";

function TierBadge({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-2">
      <User className="h-5 w-5" />
      <span className="inline-flex items-center gap-1 rounded-md bg-black px-2 py-0.5 text-xs text-white">
        <Medal className="h-3.5 w-3.5 text-yellow-500" />
        <span className="text-xs font-semibold py-1 px-2">TIER {n}</span>
      </span>
    </div>
  );
}

function Rating({ value, reviews }: { value: number; reviews: number }) {
  return (
    <div className="inline-flex items-center gap-2 text-md">
      <div className="inline-flex items-center gap-1">
        <Star className="h-6 w-6 text-[orange]" />
        <span className="font-semibold text-xl">{value}</span>
        <span className="opacity-70 text-xl">({reviews})</span>
      </div>
    </div>
  );
}

// Generic props so each page can shape its own "CardItem"
type CardProps<T extends { background: string; tier: number; rating: number; reviews: number; title: string; location: string; price: string }> = {
  item: T;
};

export default function Card<T extends { background: string; tier: number; rating: number; reviews: number; title: string; location: string; price: string }>({
  item,
}: CardProps<T>) {
  return (
    <div
      className={`w-85 rounded-4xl border-4 p-3 mt-10 shadow-[10px_10px_24px_rgba(0,0,0,0.08)] ${item.background} border-black`}
    >
      {/* image placeholder with shuttle buttons */}
      <div className="relative h-75 border-black border-2 w-full overflow-hidden rounded-2xl bg-gray-100">
        <div className="absolute right-2 top-2 flex items-center gap-2">
          <button className="grid h-8 w-8 place-items-center rounded-full bg-black text-white ring-1 ring-black">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-full bg-black text-white ring-1 ring-black">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* meta row */}
      <div className="mt-3 flex items-center text-black justify-between">
        <TierBadge n={item.tier} />
        <Rating value={item.rating} reviews={item.reviews} />
      </div>

      <div className="border-t-2 text-black  border-dashed border-gray-400 my-2"></div>

      {/* description */}
      <p className="mt-3 text-md text-center text-black ">
        {item.title} <span className="font-semibold">{item.location}</span> for{" "}
        <span className="font-semibold">{item.price}</span>
      </p>
    </div>
  );
}
