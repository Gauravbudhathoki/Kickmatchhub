import Link from "next/link";
import { ChalkDivider } from "@/components/ui/ChalkDivider";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-pitch bg-grain-dark">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-8 sm:px-10">
        <Link href="/" className="font-display text-lg font-bold tracking-tight text-chalk">
          KickMatch Hub
        </Link>
      </div>

      <div className="mx-auto flex max-w-md flex-col px-6 pb-24 pt-16 sm:px-10">
        <h1 className="font-display text-3xl font-bold text-chalk">{title}</h1>
        <p className="mt-2 text-chalk/70">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>

      <ChalkDivider className="text-chalk" />
      <div className="h-16 bg-chalk" />
    </main>
  );
}
