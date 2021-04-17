import { useEffect } from "react";
import { useLocation } from "react-router-dom"
import { useFirebaseContext } from "./useFirebaseContext";

export const useRouteAnalytics = () => {
  const location = useLocation();
  const { analytics } = useFirebaseContext();
  useEffect(() => {
    analytics.logEvent('page_view', {
      page_path: location.pathname,
      page_location: window.location.href,
    });
  }, [analytics, location]);
}