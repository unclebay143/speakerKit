"use client";
import SignupForm from "@/components/auth/signup-form";
import { SparklesCore } from "@/components/sparkles";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignupPage() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/overview");
    }
  }, [user, isLoading, router]);

  return (
    <main className='min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden'>
      <div className='h-full w-full absolute inset-0 z-0'>
        <SparklesCore
          id='tsparticlesfullpage'
          background='transparent'
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className='w-full h-full'
          particleColor='#FFFFFF'
        />
      </div>

      <div className='flex min-h-screen'>
        {/* Image Section - 1/3 */}
        {/* <div className="hidden lg:block lg:flex-1 relative">
          <AuthImageSection type="signup" />
        </div> */}

        {/* Form Section - 2/3 */}
        <div className='flex-1 lg:flex-[2] flex items-center justify-center p-4 relative z-10'>
          <SignupForm />
        </div>
      </div>
    </main>
  );
}
