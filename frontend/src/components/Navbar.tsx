import { motion } from "framer-motion";

const Navbar = () => (
  <motion.nav
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.3 }}
    className="fixed top-0 left-0 right-0 z-50 py-6 px-8"
  >
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <a href="#" className="font-display text-xl text-primary-foreground tracking-wide">
        Azure Breeze
      </a>
      <div className="hidden md:flex items-center gap-8">
        {["Experiences", "Dining", "Spa"].map((item) => (
          <a
            key={item}
            href="#"
            className="text-sand/70 hover:text-primary-foreground text-sm font-body tracking-wider uppercase transition-colors duration-200"
          >
            {item}
          </a>
        ))}
        <a
          href="#loyalty"
          className="text-gold-light text-sm font-body tracking-wider uppercase hover:text-gold transition-colors duration-200"
        >
          Loyalty
        </a>
      </div>
    </div>
  </motion.nav>
);

export default Navbar;
