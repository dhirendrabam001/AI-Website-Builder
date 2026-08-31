import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/theme.css";
import "./App.css";
import useLenis from "./hooks/useLenis";
import Header from "./common/Header/Header";
import Footer from "./common/Footer/Footer";
import Hero from "./components/section/Hero/Hero";
import Stats from "./components/section/Stats/Stats";
import HowItWorks from "./components/section/HowItWorks/HowItWorks";
import BuilderShowcase from "./components/section/BuilderShowcase/BuilderShowcase";
import Features from "./components/section/Features/Features";
import Templates from "./components/section/Templates/Templates";
import Workflow from "./components/section/Workflow/Workflow";
import WhyAIBuilder from "./components/section/WhyAIBuilder/WhyAIBuilder";
import Testimonials from "./components/section/Testimonials/Testimonials";
import Pricing from "./components/section/Pricing/Pricing";
import FAQ from "./components/section/FAQ/FAQ";
import CTA from "./components/section/CTA/CTA";

function App() {
  useLenis();

  return (
    <div className="app-shell">
      <Header />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <BuilderShowcase />
        <Features />
        <Templates />
        <Workflow />
        <WhyAIBuilder />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
