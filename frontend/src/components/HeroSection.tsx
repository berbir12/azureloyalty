import { motion } from "framer-motion";
import heroImage from "@/assets/hero-resort.jpg";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const scrollToLoyalty = () => {
    document.getElementById("loyalty")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={heroImage}
        alt="Azure Breeze Resort - luxury beachfront resort with infinity pool at sunset"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-hero" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sand font-body tracking-[0.3em] uppercase text-sm mb-6"
        >
          Welcome to Paradise
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl text-primary-foreground font-semibold leading-tight mb-6"
        >
          Azure Breeze
          <span className="block text-gold-light italic font-normal text-4xl md:text-5xl lg:text-6xl mt-2">
            Resort
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-sand text-lg md:text-xl font-light max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Where turquoise waters meet timeless luxury. Discover serenity on the shores of an untouched paradise.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Button
            variant="outline"
            size="lg"
            onClick={scrollToLoyalty}
            className="border-gold-light text-gold-light hover:bg-gold-light hover:text-ocean-deep font-body tracking-widest uppercase text-sm px-10 py-6 transition-all duration-300"
          >
            Join Our Loyalty Program
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-sand/40 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 bg-sand/60 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
