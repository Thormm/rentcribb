import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";
import {
  useState,
  createContext,
  useContext,
  useCallback,
} from "react";

import Navbar from "./components/Navbar";
import AlertBox from "./components/AlertBox";

import Home from "./pages/home/Home";
import StudentListing from "./pages/listingpage/StudentListing";
import BusinessRequests from "./pages/listingpage/BusinessRequestListing";
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
import ForgotPassword from "./pages/signup_login/ResetPassword";
import Board from "./pages/business_onboarding/Board";

/* ---------------- ALERT GLOBAL CONTEXT ---------------- */

type AlertType = "warning" | "info" | "success";

type AlertContextType = {
  showAlert: (
    message: string,
    alertType?: AlertType,
    timer?: boolean
  ) => void;
};

const AlertContext = createContext<AlertContextType | null>(null);

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used inside App");
  return ctx;
};

/* ---------------- LAYOUT ---------------- */

function Layout() {
  const location = useLocation();

  const showNavbarOn = [
    "/",
    "/studentlisting",
    "/businesslisting",
    "/businessrequests",
    "/request",
    "/hostelview",
    "/connected",
  ];

  const shouldShowNavbar = showNavbarOn.includes(location.pathname);

  const [loginModal, setLoginModal] = useState(false);

  return (
    <>
      {shouldShowNavbar && (
        <Navbar setLoginModal={setLoginModal} />
      )}

      <Outlet context={{ loginModal, setLoginModal }} />
    </>
  );
}

/* ---------------- ROUTER ---------------- */

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/studentlisting", element: <StudentListing /> },
      { path: "/businessrequests", element: <BusinessRequests /> },
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
      { path: "/login", element: <Loginpage /> },
      { path: "/forgotpassword", element: <ForgotPassword /> },
      { path: "/businessonboarding", element: <Board /> },
    ],
  },
]);

/* ---------------- APP (GLOBAL ALERT LOGIC) ---------------- */

export default function App() {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    alertType: "info" as AlertType,
    timer: false,
  });

  const showAlert = useCallback(
    (
      message: string,
      alertType: AlertType = "info",
      timer = false
    ) => {
      setAlert({
        open: true,
        message,
        alertType,
        timer,
      });
    },
    []
  );

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      <RouterProvider router={router} />

      {/* GLOBAL ALERT (ONLY ONCE) */}
      <AlertBox
        open={alert.open}
        onClose={closeAlert}
        message={alert.message}
        alertType={alert.alertType}
        timer={alert.timer}
      />
    </AlertContext.Provider>
  );
}