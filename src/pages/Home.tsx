import Hero from "../components/Hero";
import TrustRibbon from "../components/TrustRibbon";
import Stats from "../components/Stats";
import Services from "../components/Services";
import WhyChooseUs from "../components/WhyChooseUs";
import Process from "../components/Process";
import Gallery from "../components/Gallery";
import Testimonials from "../components/Testimonials";
import LocalExperts from "../components/LocalExperts";
import Location from "../components/Location";
import FAQ from "../components/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustRibbon />
      <Stats />
      <Services />
      <WhyChooseUs />
      <Process />
      <Gallery />
      <Testimonials />
      <LocalExperts />
      <Location />
      <FAQ />
    </>
  );
}
