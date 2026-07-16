// src/routes/PublicRoute.tsx

import Home from "../pages/public_pages/home/Rentpage";
import Loginpage from "../pages/public_pages/signup_login/Loginpage";
import Signup from "../pages/public_pages/signup_login/Signup";
import ForgotPassword from "../pages/public_pages/signup_login/ResetPassword";

const publicRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Loginpage />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword />,
  },
];

export default publicRoutes;