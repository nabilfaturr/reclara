import { cn } from "@/lib/utils";
import { Heading } from "@/components/shared/heading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme.toggle";

type LayoutProviderProps = {
  children: React.ReactNode;
  className?: string;
};

export function LayoutProvider({ children, className }: LayoutProviderProps) {
  return (
    <div className="min-h-screen max-w-2xl mx-auto border-x font-sans absolute inset-0">
      <header className="p-2 absolute z-10 top-0 max-w-2xl w-full">
        <div className="flex justify-between items-center p-5 bg-input/30 rounded-lg">
          <Link href="/" className="cursor-pointer hover:underline">
            <Heading level={2} variant="mono">
              Reclara
            </Heading>
          </Link>
          <div className="flex justify-between items-center gap-2">
            <Button asChild>
              <Link href={"/auth/sign-up"}>Sign Up</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main
        className={cn(`h-full flex items-center justify-center`, className)}
      >
        {children}
      </main>
    </div>
  );
}
