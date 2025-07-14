"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Failed to login with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        // redirect: false,
        callbackUrl: "/login",
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className='w-full max-w-md'
    >
      <Card className='bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl'>
        <CardHeader className='text-center space-y-4'>
          <Link
            href='/'
            className='flex items-center justify-center space-x-2 mb-4'
          >
            {/* <UserCircle className='w-8 h-8 text-purple-500' /> */}
            <span className='text-white font-medium text-xl'>SpeakerKit</span>
          </Link>
          <CardTitle className='text-2xl font-bold text-white'>
            Create Your Profile
          </CardTitle>
          <CardDescription className='text-gray-400'>
            Join thousands of speakers managing their profiles with ease
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          {/* Google Signup Button */}
          <Button
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className='w-full bg-white hover:bg-gray-100 text-black border-0 h-12 font-medium'
          >
            <svg className='w-5 h-5' viewBox='0 0 24 24'>
              <path
                fill='currentColor'
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              />
              <path
                fill='currentColor'
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              />
              <path
                fill='currentColor'
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
              />
              <path
                fill='currentColor'
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
              />
            </svg>
            {isLoading ? "Creating account..." : "Continue with Google"}
          </Button>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <Separator className='w-full bg-white/10' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-black/40 px-2 text-gray-400'>
                Or continue with email
              </span>
            </div>
          </div>

          {error && (
            <div className='p-4 text-sm text-red-500 bg-red-500/10 rounded-md'>
              {error}
            </div>
          )}

          {/* Email Signup Form */}
          <form onSubmit={handleEmailSignup} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name' className='text-white'>
                Full Name
              </Label>
              <div className='relative'>
                <User className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input
                  id='name'
                  name='name'
                  placeholder='Enter your full name'
                  type='text'
                  required
                  className='pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email' className='text-white'>
                Email
              </Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input
                  id='email'
                  name='email'
                  placeholder='Enter your email'
                  type='email'
                  required
                  className='pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password' className='text-white'>
                Password{" "}
                <span className='text-gray-500'>(Atleast 8 characters)</span>
              </Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input
                  id='password'
                  name='password'
                  placeholder='Create a password'
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  className='pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-3 text-gray-400 hover:text-white'
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword' className='text-white'>
                Confirm Password
              </Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input
                  id='confirmPassword'
                  name='confirmPassword'
                  placeholder='Confirm your password'
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  className='pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-3 text-gray-400 hover:text-white'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
            </div>

            <Button
              type='submit'
              disabled={isLoading}
              className='w-full bg-purple-600 hover:bg-purple-700 text-white h-12 font-medium'
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className='text-center text-sm text-gray-400'>
            Already have an account?{" "}
            <Link
              href='/login'
              className='text-purple-400 hover:text-purple-300 font-medium'
            >
              Sign in
            </Link>
          </div>

          {/* <div className='text-center text-xs text-gray-500'>
            By creating an account, you agree to our{" "}
            <Link
              href='/terms'
              className='text-purple-400 hover:text-purple-300'
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href='/privacy'
              className='text-purple-400 hover:text-purple-300'
            >
              Privacy Policy
            </Link>
          </div> */}
        </CardContent>
      </Card>
    </motion.div>
  );
}
