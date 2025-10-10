import { Hero, type HeroProps } from "@/components/web/Hero";

const heroProps: HeroProps = {
  title: "Pokédex",
  description:
    "Welcome to my Pokédex Web App. A fun and easy way to explore the world of Pokémon. Built with Next.js and Clerk Auth. Sign in to get started.",
  primaryButtonText: "Sign In",
  primaryButtonLink: "/signin",
  secondaryButtonText: "Sign Up",
  secondaryButtonLink: "/signup",
  imageUrl: "/pokedex-app-image.png",
};

export default function Home() {
  return <Hero {...heroProps} />;
}
