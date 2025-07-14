import Dashboard from "@/components/dashboard/dashboard";
import { ImageGallery } from "@/components/dashboard/image-gallery";
import { authOptions } from "@/utils/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function FolderPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <Dashboard>
      <ImageGallery />
    </Dashboard>
  );
}
