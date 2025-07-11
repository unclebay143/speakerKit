import SpeakerKitPreview from "@/components/Preview";

export default function Page({ params }: { params: { username: string } }) {
  return <SpeakerKitPreview username={params.username} />;
}

