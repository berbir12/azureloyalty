const Footer = () => (
  <footer className="py-12 bg-ocean-deep border-t border-sand/10">
    <div className="container max-w-6xl mx-auto px-6 text-center">
      <p className="font-display text-2xl text-primary-foreground mb-2">Azure Breeze Resort</p>
      <p className="text-sand/50 font-light text-sm">
        © {new Date().getFullYear()} Azure Breeze Resort. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
