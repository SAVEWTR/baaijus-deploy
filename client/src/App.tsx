import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Baajuses from "@/pages/baajuses";
import Demo from "@/pages/demo";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import Layout from "@/components/layout";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Authentication routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Protected routes */}
      {isAuthenticated ? (
        <Layout>
          <Route path="/" component={Dashboard} />
          <Route path="/baajuses" component={Baajuses} />
          <Route path="/demo" component={Demo} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/settings" component={Settings} />
        </Layout>
      ) : !isLoading ? (
        <Route path="/" component={Landing} />
      ) : null}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
