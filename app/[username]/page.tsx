// import SpeakerKitPreview from "@/components/Preview";

// export default function Page({ params }: { params: { username: string } }) {
//   return <SpeakerKitPreview username={params.username} />;
// }


"use client";

import { usePathname } from "next/navigation";
import SpeakerKitPreview from "@/components/Preview";

export default function Page() {
  const pathname = usePathname();
  const username = pathname.split("/")[1]; 
  
  return <SpeakerKitPreview username={username} />;
}