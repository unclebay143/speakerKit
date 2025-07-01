import LoginForm from "@/components/auth/login-form"
import { SparklesCore } from "@/components/sparkles"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

       <div className="flex min-h-screen">
      {/* Image Section  */}
        {/* <div className="hidden lg:block lg:flex-1 relative">
          <AuthImageSection type="login" />
        </div> */}
        {/* Form Section */}
        <div className="flex-1 lg:flex-[2] flex items-center justify-center p-4 relative z-10">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
