import { useState, useEffect } from "react";
import clsx from "clsx";
import TopBar from "./components/Header";
import Footer from "./components/Footer";
import CratePage from "./pages/CratePage";
import CardPage from "./pages/CardPage";
import ReviewPage from "./pages/ReviewPage";
import ApolloPage from "./pages/ApolloPage";
import BustPage from "./pages/BustPage";
import GenerateLabPage from "./pages/GenerateLabPage";

// ─── Simple hash router ───
function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash.slice(1) || "/");
  useEffect(() => {
    const handler = () => setRoute(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  return route;
}

// ─── App layout (copied from RCM src/App.tsx) ───

const App: React.FC = () => {
  const route = useHashRoute();

  return (
    <div
      className={clsx(
        "flex flex-col min-h-screen transition-colors duration-300",
        "bg-dark-background"
      )}
    >
      <div
        className={clsx(
          "border-b border-stroke w-full flex justify-center px-4 lg:px-8 transition-colors duration-300 sticky top-0 z-50",
          "bg-dark-background"
        )}
      >
        <TopBar />
      </div>
      <div className="lg:max-w-[1505px] mx-auto px-4 lg:px-8 flex flex-col flex-1 w-full">
        {route === "/lab" ? (
          <GenerateLabPage />
        ) : route.startsWith("/bust") ? (
          <BustPage version={route.split("/")[2] || "rodin"} />
        ) : route.startsWith("/apollo") ? (
          <ApolloPage version={route.split("/")[2] || "v9"} />
        ) : route === "/review" ? (
          <ReviewPage />
        ) : route === "/card" ? (
          <CardPage />
        ) : (
          <CratePage />
        )}
      </div>
      <div
        className={clsx(
          "border-t border-stroke w-full flex justify-center px-4 lg:px-8 bg-dark-background"
        )}
      >
        <Footer />
      </div>
    </div>
  );
};

export default App;
