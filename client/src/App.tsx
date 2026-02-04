import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SocialMediaLinking from "./pages/SocialMediaLinking";
import AccountManagement from "./pages/AccountManagement";
import ContentGenerator from "./pages/ContentGenerator";
import ImageGenerator from "./pages/ImageGenerator";
import Campaigns from "./pages/Campaigns";
import AnalyticsAndReports from "./pages/AnalyticsAndReports";
import Settings from "./pages/Settings";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/social-media-linking"} component={SocialMediaLinking} />
      <Route path={"/account-management"} component={AccountManagement} />
      <Route path={"/content-generator"} component={ContentGenerator} />
      <Route path={"/image-generator"} component={ImageGenerator} />
      <Route path={"/campaigns"} component={Campaigns} />
      <Route path={"/analytics"} component={AnalyticsAndReports} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
