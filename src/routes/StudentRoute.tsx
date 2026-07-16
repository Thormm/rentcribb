import StudentListing from "../pages/student_pages/listingpage/StudentListing";
import Hostelview from "../pages/student_pages/hostelview/Hostelview";
import Connected from "../pages/student_pages/connected/Connected";
import Request from "../pages/student_pages/connected/Request";
import Hostpage from "../pages/student_pages/hostpage/Hostpage";
import RoommatePlan from "../pages/student_pages/plans/RoommatePlan";
import RentPlan from "../pages/student_pages/plans/RentPlan";
import StudentDash from "../pages/student_pages/studentdash/StudentDash";
import Knowyou from "../pages/student_pages/student_knowyou/Knowyou";

const studentRoutes = [
  {
    path: "/studentlisting",
    element: <StudentListing />,
  },
  {
    path: "/roommateplan",
    element: <RoommatePlan />,
  },
  {
    path: "/rentplan",
    element: <RentPlan />,
  },
  {
    path: "/hostelview",
    element: <Hostelview />,
  },
  {
    path: "/connected",
    element: <Connected />,
  },
  {
    path: "/request",
    element: <Request />,
  },
  {
    path: "/hostpage",
    element: <Hostpage />,
  },
  {
    path: "/studentdash",
    element: <StudentDash />,
  },
  {
    path: "/knowyou",
    element: <Knowyou />,
  },
];

export default studentRoutes;