import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home/Home";
import Listing from "./pages/listingpage/Listing";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/listing", element: <Listing /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
