import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
  useNavigate as useNavigateOriginal,
} from "react-router-dom";
import {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
} from "react";

import Navbar from "./components/Navbar";
import AlertBox from "./components/AlertBox";

import publicRoutes from "./routes/PublicRoute";
import studentRoutes from "./routes/StudentRoute";
import businessRoutes from "./routes/BusinessRoute";

/* ---------------- ALERT GLOBAL CONTEXT ---------------- */

type AlertType = "warning" | "info" | "success";

type AlertContextType = {
  showAlert: (message: string, alertType?: AlertType, timer?: boolean) => void;
};

const AlertContext = createContext<AlertContextType | null>(null);

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used inside App");
  return ctx;
};

/* ---------------- DOMAIN CONTEXT ---------------- */

type Subdomain = "public" | "student" | "business";

interface DomainContextType {
  subdomain: Subdomain;
}

const DomainContext = createContext<DomainContextType | null>(null);

export const useDomain = () => {
  const ctx = useContext(DomainContext);
  if (!ctx) throw new Error("useDomain must be used inside App");
  return ctx;
};

/* ---------------- DETECT SUBDOMAIN ---------------- */

const getSubdomain = (): Subdomain => {
  if (import.meta.env.DEV) {
    const params = new URLSearchParams(window.location.search);
    const testDomain = params.get("domain");
    if (testDomain === "student") return "student";
    if (testDomain === "business") return "business";
    return "public";
  }

  const host = window.location.hostname;
  console.log("🔍 Detected hostname:", host);

  // Same conditions for both subdomains
  if (host === "student.cribb.africa") return "student";
  if (host === "business.cribb.africa") return "business";
  if (host.includes("student.cribb.africa")) return "student";
  if (host.includes("business.cribb.africa")) return "business";

  return "public";
};

/* ---------------- OVERRIDE useNavigate ---------------- */

export const useNavigate = () => {
  const navigate = useNavigateOriginal();

  return useCallback(
    (to: string | number, options?: any) => {
      if (typeof to === "number") {
        navigate(to);
        return;
      }

      if (import.meta.env.DEV) {
        const params = new URLSearchParams(window.location.search);
        const domain = params.get("domain");

        if (domain && typeof to === "string") {
          const separator = to.includes("?") ? "&" : "?";
          const url = `${to}${separator}domain=${domain}`;
          navigate(url, options);
          return;
        }
      }

      navigate(to, options);
    },
    [navigate],
  );
};

/* ---------------- GET ROUTES BASED ON SUBDOMAIN ---------------- */

const getRoutesForSubdomain = (subdomain: Subdomain) => {
  console.log("📋 Getting routes for subdomain:", subdomain);

  // Same pattern for both subdomains
  if (subdomain === "student") {
    return [...publicRoutes, ...studentRoutes];
  }

  if (subdomain === "business") {
    return [...publicRoutes, ...businessRoutes];
  }

  return publicRoutes;
};

/* ---------------- PAGE TITLE MANAGER ---------------- */

const updatePageTitle = (pathname: string, subdomain: Subdomain) => {
  let mode = "";
  if (subdomain === "student") mode = "Students";
  else if (subdomain === "business") mode = "Business";
  else mode = "";

  let pageName = "Home";
  const path = pathname.toLowerCase();

  // Simplified page name mapping
  if (path === "/" || path === "") pageName = "Home";
  else if (path.includes("login")) pageName = "Login";
  else if (path.includes("signup")) pageName = "Sign Up";
  else if (path.includes("dashboard") || path.includes("dash"))
    pageName = "Dashboard";
  else if (path.includes("listing")) pageName = "Listings";
  else if (path.includes("request")) pageName = "Requests";
  else if (path.includes("hostelview")) pageName = "Hostel View";
  else if (path.includes("connected")) pageName = "Connected";
  else if (path.includes("profile")) pageName = "Profile";
  else if (path.includes("waitlist")) pageName = "Waitlist";
  else if (path.includes("forgotpassword")) pageName = "Forgot Password";
  else {
    // Fallback: extract from URL
    const parts = path.split("/").filter((p) => p);
    if (parts.length > 0) {
      pageName = parts[parts.length - 1]
        .replace(/[_-]/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
  }

  // Remove duplicate mode names
  let title = `Cribb.Africa`;
  if (mode) {
    // Don't repeat mode if it's already in page name
    if (!pageName.includes(mode)) {
      title += ` - ${mode}`;
    }
  }
  title += ` ${pageName}`;

  document.title = title.trim();
};
/* ---------------- LAYOUT ---------------- */

function Layout() {
  const location = useLocation();
  const subdomain = getSubdomain();

  // Update page title whenever route changes
  useEffect(() => {
    updatePageTitle(location.pathname, subdomain);
  }, [location.pathname, subdomain]);

  const showNavbarOn = [
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
    <DomainContext.Provider value={{ subdomain }}>
      {shouldShowNavbar && <Navbar setLoginModal={setLoginModal} />}
      <Outlet context={{ loginModal, setLoginModal, subdomain }} />
    </DomainContext.Provider>
  );
}

/* ---------------- APP ---------------- */

export default function App() {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    alertType: "info" as AlertType,
    timer: false,
  });

  const [router, setRouter] = useState<any>(null);

  // Initialize router after component mounts
  useEffect(() => {
    const subdomain = getSubdomain();
    console.log("🚀 App mounted, subdomain:", subdomain);

    const routes = getRoutesForSubdomain(subdomain);
    console.log("📋 Total routes loaded:", routes.length);
    console.log(
      "📋 Route paths:",
      routes.map((r) => r.path),
    );

    const newRouter = createBrowserRouter([
      {
        element: <Layout />,
        children: routes,
      },
    ]);
    setRouter(newRouter);
  }, []);

  const showAlert = useCallback(
    (message: string, alertType: AlertType = "info", timer = false) => {
      setAlert({
        open: true,
        message,
        alertType,
        timer,
      });
    },
    [],
  );

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  // Show nothing while router is initializing
  if (!router) {
    return null;
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      <RouterProvider router={router} />
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
