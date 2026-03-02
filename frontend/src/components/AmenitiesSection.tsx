import { motion } from "framer-motion";
import { Waves, UtensilsCrossed, Sparkles } from "lucide-react";

const amenities = [
  {
    icon: Waves,
    title: "Infinity Pool",
    description: "A breathtaking oceanfront pool that seamlessly blends into the horizon.",
  },
  {
    icon: UtensilsCrossed,
    title: "Fine Dining",
    description: "World-class cuisine crafted by Michelin-starred chefs using local ingredients.",
  },
  {
    icon: Sparkles,
    title: "Luxury Spa",
    description: "Rejuvenate with exclusive treatments inspired by ancient island traditions.",
  },
];

const AmenitiesSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-accent tracking-[0.25em] uppercase text-sm font-body mb-4">
            Experiences
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground font-semibold">
            Curated for You
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {amenities.map((amenity, index) => (
            <motion.div
              key={amenity.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-azure-light flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                <amenity.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-3">
                {amenity.title}
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                {amenity.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
