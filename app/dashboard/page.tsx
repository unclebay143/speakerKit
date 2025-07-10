import Dashboard from "@/components/dashboard/dashboard";
import { ProfilesOverview } from "@/components/dashboard/profile-overview";
import { authOptions } from "@/utils/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if(!session) {
    redirect("/login")
  }
  return ( 
  <Dashboard>
      <ProfilesOverview />
    </Dashboard>)
}
