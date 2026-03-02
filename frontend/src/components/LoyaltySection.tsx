import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";


const loyaltySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email too long"),
});

type LoyaltyForm = z.infer<typeof loyaltySchema>;

const LoyaltySection = () => {
  const [walletLink, setWalletLink] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoyaltyForm>({
    resolver: zodResolver(loyaltySchema),
  });

  const onSubmit = async (data: LoyaltyForm) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/generate-wallet-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.details || result.error || "Unknown error");


      if (result?.url) {
        setWalletLink(result.url);
        toast.success("Welcome to Azure Breeze Rewards!");
      } else {
        throw new Error("No wallet link received");
      }
    } catch (err) {
      console.error("Error creating wallet pass:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="loyalty" className="py-24 md:py-32 bg-ocean-deep relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container max-w-xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-gold-light tracking-[0.25em] uppercase text-sm font-body mb-4">
            Exclusive Benefits
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-primary-foreground font-semibold mb-4">
            Join Our Loyalty Program
          </h2>
          <p className="text-sand/70 font-light leading-relaxed">
            Earn points on every stay, unlock complimentary upgrades, and carry your membership in your Google Wallet.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!walletLink ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <div>
                <Label htmlFor="name" className="text-sand/80 font-light text-sm mb-2 block">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  {...register("name")}
                  className="bg-primary-foreground/10 border-sand/20 text-primary-foreground placeholder:text-sand/40 focus:border-gold-light focus:ring-gold-light/20 h-12"
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-sand/80 font-light text-sm mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="bg-primary-foreground/10 border-sand/20 text-primary-foreground placeholder:text-sand/40 focus:border-gold-light focus:ring-gold-light/20 h-12"
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gold hover:bg-gold-light text-ocean-deep font-body tracking-widest uppercase text-sm transition-all duration-300"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Join Now"
                )}
              </Button>
            </motion.form>
          ) : (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-gold/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-gold-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-primary-foreground font-display text-xl">
                You're in! Save your membership pass:
              </p>
              <a
                href={walletLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img
                  src="https://developers.google.com/static/wallet/images/branding/en/wallet/AddToGoogleWallet_196x46.svg"
                  alt="Add to Google Wallet"
                  className="h-12 hover:opacity-80 transition-opacity"
                />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default LoyaltySection;

