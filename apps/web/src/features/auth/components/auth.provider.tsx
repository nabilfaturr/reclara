import { getSession } from "../lib";
import { redirect } from "next/navigation";

type AuthProviderProps = {
  children: React.ReactNode;
};

export async function AuthProvider({ children }: AuthProviderProps) {
  const session = await getSession();

  if (!session) return redirect("/auth/sign-in");

  return <>{children}</>;
}
