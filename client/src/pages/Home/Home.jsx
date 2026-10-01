import Hero from "../../components/section/Hero/Hero";
import Stats from "../../components/section/Stats/Stats";
import HowItWorks from "../../components/section/HowItWorks/HowItWorks";
import BuilderShowcase from "../../components/section/BuilderShowcase/BuilderShowcase";
import Features from "../../components/section/Features/Features";
import Templates from "../../components/section/Templates/Templates";
import Workflow from "../../components/section/Workflow/Workflow";
import WhyAIBuilder from "../../components/section/WhyAIBuilder/WhyAIBuilder";
import Testimonials from "../../components/section/Testimonials/Testimonials";
import Pricing from "../../components/section/Pricing/Pricing";
import FAQ from "../../components/section/FAQ/FAQ";
import CTA from "../../components/section/CTA/CTA";
const Home = () => {
  return (
    <div className="homepage">
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
    </div>
  );
};

export default Home;
