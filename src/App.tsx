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
import Plan from "./pages/plans/Plan";
import BusinessDash from "./pages/businessdash/BusinessDash";
import StudentDash from "./pages/studentdash/StudentDash";

// Layout with conditional Navbar
function Layout() {
  const location = useLocation();

  // Add all the routes where you DON'T want the navbar

  const hideNavbarOn = ["/businessdash","/studentdash", "/login", "/register"];
  const shouldHideNavbar = hideNavbarOn.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
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
      { path: "/plan", element: <Plan /> },
      { path: "/businessdash", element: <BusinessDash /> },
      { path: "/studentdash", element: <StudentDash /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
