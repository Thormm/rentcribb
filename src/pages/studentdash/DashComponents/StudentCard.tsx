import { MdOutlineMan4, MdWoman2 } from "react-icons/md";
import { CgCross } from "react-icons/cg";
import { FaDog, FaCat, FaQuran  } from "react-icons/fa";

import {
  IoGameController,
  IoChatbubblesSharp,
  IoHeadset,
} from "react-icons/io5";
import { CiBowlNoodles } from "react-icons/ci";
import { GiWeightLiftingUp } from "react-icons/gi";
import { PiCheersFill } from "react-icons/pi";
import { TbBedFilled } from "react-icons/tb";
import { RxVideo } from "react-icons/rx";

interface Student {
  id: number;
  gender: string;
  religion: string;
  level: string;
  faculty: string;
  hobby: string[];
  pet: string;
}

const hobbyMap: any = {
  games: { icon: IoGameController, bg: "#E9C3FF" },
  food: { icon: CiBowlNoodles, bg: "#FFC267" },
  exercise: { icon: GiWeightLiftingUp, bg: "#D6FFC3" },
  reading: { icon: IoGameController, bg: "#FFEEB4" },
  hangout: { icon: PiCheersFill, bg: "#FFA9A9" },
  sleep: { icon: TbBedFilled, bg: "#9E9E9E" },
  movies: { icon: RxVideo, bg: "#D7ECF2" },
  chat: { icon: IoChatbubblesSharp, bg: "#56B9A7" },
  music: { icon: IoHeadset, bg: "#FFFDCA" },
};

const StudentCard = ({ item }: { item: Student }) => {
  return (
    <div className="relative text-black bg-[#EBD96B] rounded-4xl shadow-md text-center w-35 md:w-45 md:px-3 md:py-5 sm:px-5 sm:py-5">
      {/* Top circle */}
      <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-[#C2C8DA4D] w-24 h-24 sm:w-28 sm:h-28 md:w-30 md:h-30 rounded-full flex items-center justify-center">
        <span className="text-2xl sm:text-3xl md:text-3xl font-semibold">
          {item.id}
        </span>
      </div>

      {/* Body */}
      <div className="mt-16 sm:mt-20">
        <div className="grid grid-cols-[auto_1fr_auto] items-center w-full gap-3">
          {/* Left column */}
          <div className="flex flex-col items-start gap-0.5">
            {item.gender === "male" ? (
              <MdOutlineMan4 className="text-3xl" />
            ) : (
              <MdWoman2 className="text-3xl" />
            )}
            <FaDog
              className="text-3xl md:text-xl mt-2 pl-3 md:pl-0"
              style={{
                opacity: item.pet === "Dog" || item.pet === "Cat_Dog" ? 1 : 0,
              }}
            />
          </div>

          {/* Middle column — THIS IS THE KEY FIX */}
          <div className="min-w-0 text-center">
            <span className="block truncate text-xs sm:text-sm leading-snug sm:leading-loose">
              {item.faculty}
            </span>
            <span className="block truncate text-xs sm:text-sm leading-snug sm:leading-loose">
              {item.level} level
            </span>
          </div>

          {/* Right column */}
          <div className="flex flex-col items-end gap-0.5">
            {item.religion === "christian" ? (
              <CgCross className="text-3xl" />
            ) : (
              <FaQuran   className="text-4xl md:text-xl px-2 md:px-0" />
            )}
            <FaCat
              className="text-3xl md:text-xl mt-2 pr-3 md:pr-0"
              style={{
                opacity: item.pet === "Cat" || item.pet === "Cat_Dog" ? 1 : 0,
              }}
            />
          </div>
        </div>

        {/* Icons row */}
        <div className="flex justify-center space-x-2 sm:space-x-3 mt-4 mb-5">
          {item.hobby.map((h, i) => {
            const H = hobbyMap[h];
            if (!H) return null;
            const Icon = H.icon;
            return (
              <Icon
                key={i}
                className="text-2xl sm:text-3xl rounded-full p-1"
                style={{ backgroundColor: H.bg }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
