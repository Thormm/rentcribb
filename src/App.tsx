import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Listing from "./pages/listingpage/Listing";
import Hostelview from "./pages/hostelview/Hostelview";
import Connected from "./pages/connected/Connected";
import Request from "./pages/connected/Request";
import Hostpage from "./pages/hostpage/Hostpage";
import StudentPlan from "./pages/plans/StudentPlan";
import BusinessPlan from "./pages/plans/BusinessPlan";
import BusinessDash from "./pages/businessdash/BusinessDash";
import StudentDash from "./pages/studentdash/StudentDash";
import Entirespace from "./pages/businessdash/ListingsPage/Entirespace";
import Sharedspace from "./pages/businessdash/ListingsPage/Sharedspace";
import Signup from "./pages/signup_login/Signup";
import Loginpage from "./pages/signup_login/Loginpage";
import Forgotpassword from "./pages/signup_login/forgotpassword";
import Board from "./pages/business_onboarding/board";

// Layout with conditional Navbar
function Layout() {
  const location = useLocation();

  // Explicitly list only pages where you WANT the navbar
  const showNavbarOn = ["/", "/listing"];

  // Check for exact matches, not just prefix matches
  const shouldShowNavbar = showNavbarOn.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Outlet />
    </>
  );
}


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/listing", element: <Listing /> },
      { path: "/hostelview", element: <Hostelview /> },
      { path: "/connected", element: <Connected /> },
      { path: "/request", element: <Request /> },
      { path: "/hostpage", element: <Hostpage /> },
      { path: "/studentplan", element: <StudentPlan /> },
      { path: "/businessplan", element: <BusinessPlan /> },
      { path: "/businessdash", element: <BusinessDash /> },
      { path: "/studentdash", element: <StudentDash /> },
      { path: "/entirespace", element: <Entirespace /> },
      { path: "/sharedspace", element: <Sharedspace /> },
      { path: "/signup", element: <Signup /> },
      { path: "/login", element: <Loginpage mode="student" /> },
      { path: "/forgotpassword", element: <Forgotpassword /> },
      { path: "/businessonboarding", element: <Board /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
