import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface HeroProps {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  imageUrl: string;
}

export const Hero = async ({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  imageUrl,
}: HeroProps) => {
  const { userId } = await auth();

  const getButton = (
    text: string,
    link: string,
    variant: "primary" | "secondary",
  ) => {
    const buttonVariant = variant === "primary" ? "default" : "outline";
    return link.startsWith("/signin") ? (
      <Button
        className="w-full sm:w-auto"
        size="lg"
        asChild
        variant={buttonVariant}
      >
        <SignInButton>{text}</SignInButton>
      </Button>
    ) : link.startsWith("/signup") ? (
      <Button
        className="w-full sm:w-auto"
        size="lg"
        asChild
        variant={buttonVariant}
      >
        <SignUpButton>{text}</SignUpButton>
      </Button>
    ) : (
      <Button
        className="w-full sm:w-auto"
        size="lg"
        asChild
        variant={buttonVariant}
      >
        <Link href={link}>{text}</Link>
      </Button>
    );
  };
  const secondaryButton = getButton(
    secondaryButtonText,
    secondaryButtonLink,
    "secondary",
  );
  const primaryButton = getButton(
    primaryButtonText,
    primaryButtonLink,
    "primary",
  );
  return (
    <section className="overflow-hidden py-32">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-between gap-20 lg:flex-row">
          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            <h1 className="text-4xl font-bold text-pretty lg:max-w-md lg:text-7xl">
              {title}
            </h1>
            <p className="max-w-xl text-xl font-medium lg:text-2xl">
              {description}
            </p>
            <div className="flex w-full justify-center lg:justify-start gap-4">
              {userId ? (
                <Button size="lg" asChild variant="default">
                  <Link href="/app/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  {primaryButton}
                  {secondaryButton}
                </>
              )}
            </div>
          </div>
          <Image
            src={imageUrl}
            alt="placeholder hero"
            className="aspect-video rounded-md object-cover"
            width={600}
            height={400}
            unoptimized
          />
        </div>
      </div>
    </section>
  );
};
