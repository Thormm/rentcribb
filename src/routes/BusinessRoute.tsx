// src/routes/BusinessRoute.tsx

import BusinessDash from "../pages/business_pages/businessdash/BusinessDash";
import BusinessRequests from "../pages/business_pages/listingpage/BusinessRequestListing";
import Entirespace from "../pages/business_pages/ListingsPage/Entirespace";
import Sharedspace from "../pages/business_pages/ListingsPage/Sharedspace";
import Board from "../pages/business_pages/business_onboarding/Board";
import BusinessPlan from "../pages/business_pages/plans/BusinessPlan";

const businessRoutes = [
  {
    path: "/",
    element: <BusinessDash />,
  },
  {
    path: "/businessdash",
    element: <BusinessDash />,
  },
  {
    path: "/businessrequests",
    element: <BusinessRequests />,
  },
  {
    path: "/entirespace",
    element: <Entirespace />,
  },
  {
    path: "/sharedspace",
    element: <Sharedspace />,
  },
  {
    path: "/businessonboarding",
    element: <Board />,
  },
  {
    path: "/businessplan",
    element: <BusinessPlan />,
  },
];

export default businessRoutes;