import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Listing from "./pages/listingpage/Listing";
import Hostelview from "./pages/hostelview/Hostelview";
import Connected from "./pages/connected/Connected";
import Request from "./pages/connected/Request";

// Layout with Navbar
function Layout() {
  return (
    <>
      <Navbar />
      {/* All pages render here */}
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,   // Shared layout
    children: [
      { path: "/", element: <Home /> },
      { path: "/listing", element: <Listing /> },
      { path: "/hostelview", element: <Hostelview /> },
      { path: "/connected", element: <Connected /> },
      { path: "/request", element: <Request /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
