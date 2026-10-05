import { Toaster } from "@/components/ui/sonner";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import ServiceLCA from "./pages/ServiceLCA";
import ServiceCRP from "./pages/ServiceCRP";
import ServiceScope3 from "./pages/ServiceScope3";
import ServiceWorkshops from "./pages/ServiceWorkshops";
import Training from "./pages/Training";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import International from "./pages/International";
import InternationalUK from "./pages/InternationalUK";
import InternationalRegion from "./pages/InternationalRegion";
import Privacy from "./pages/Privacy";
import Admin from "./pages/Admin";

function Router() {
  return (
    <Switch>
      {/* Core pages */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />

      {/* Services */}
      <Route path="/services" component={Services} />
      <Route path="/services/life-cycle-assessments" component={ServiceLCA} />
      <Route path="/services/carbon-reduction-plans" component={ServiceCRP} />
      <Route path="/services/scope-3-supply-chain" component={ServiceScope3} />
      <Route path="/services/net-zero-strategy-workshops" component={ServiceWorkshops} />

      {/* Training */}
      <Route path="/training" component={Training} />

      {/* Blog */}
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />

      {/* International */}
      <Route path="/international" component={International} />
      <Route path="/international/uk" component={InternationalUK} />
      <Route path="/international/:region" component={InternationalRegion} />

      <Route path="/privacy" component={Privacy} />
      <Route path="/admin" component={Admin} />

      {/* Fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Toaster />
      <Router />
    </>
  );
}

export default App;
