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
  useMemo,
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
    const testDomain = params.get('domain');
    if (testDomain === 'student') return 'student';
    if (testDomain === 'business') return 'business';
    return 'public';
  }

  const host = window.location.hostname;
  if (host === 'student.cribb.africa') return 'student';
  if (host === 'business.cribb.africa') return 'business';
  return 'public';
};

/* ---------------- OVERRIDE useNavigate ---------------- */

export const useNavigate = () => {
  const navigate = useNavigateOriginal();
  
  return useCallback((to: string | number, options?: any) => {
    if (typeof to === 'number') {
      navigate(to);
      return;
    }

    if (import.meta.env.DEV) {
      const params = new URLSearchParams(window.location.search);
      const domain = params.get('domain');
      
      if (domain && typeof to === 'string') {
        const separator = to.includes('?') ? '&' : '?';
        const url = `${to}${separator}domain=${domain}`;
        navigate(url, options);
        return;
      }
    }
    
    navigate(to, options);
  }, [navigate]);
};

/* ---------------- GET ROUTES BASED ON SUBDOMAIN ---------------- */

const getRoutesForSubdomain = (subdomain: Subdomain) => {
  if (subdomain === 'student') {
    return [
      ...publicRoutes,
      ...studentRoutes,
    ];
  }
  
  if (subdomain === 'business') {
    return [
      ...publicRoutes,
      ...businessRoutes,
    ];
  }
  
  return publicRoutes;
};

/* ---------------- LAYOUT ---------------- */

function Layout() {
  const location = useLocation();
  const subdomain = getSubdomain();

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

  // Get subdomain once when component mounts
  const subdomain = useMemo(() => getSubdomain(), []);
  
  // Create router with useMemo to prevent recreation
  const router = useMemo(() => {
    const routes = getRoutesForSubdomain(subdomain);
    return createBrowserRouter([
      {
        element: <Layout />,
        children: routes,
      },
    ]);
  }, [subdomain]);

  const showAlert = useCallback(
    (message: string, alertType: AlertType = "info", timer = false) => {
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