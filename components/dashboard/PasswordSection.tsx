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
import axios from "axios";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function PasswordSection() {
  const { data: session, update } = useSession();
  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  // const [newPassword, setNewPassword] = useState('');

  const isGoogleUserWithoutPassword = session?.user?.authProvider === "google" && !session?.user?.hasPassword;

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (values.newPassword !== values.confirmPassword) {
        toast("New passwords don't match!", {
          description: "Please try again.",
        });
        setLoading(false);
        return;
      }
       if (isGoogleUserWithoutPassword) {
        await axios.post("/api/auth/set-password", {
          newPassword: values.newPassword,
        });
        toast.success("Password set successfully! You can now login with email and password");
      } else {
        await axios.put("/api/users/password", {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
       toast("Password updated successfully!", {
        description: "Your password has been updated.",
      });
      }

      reset();
    } catch (error: any) {
      toast(error?.response?.data?.error || "Failed to update password", {
        description: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSetPassword = async (data: { newPassword: string, confirmPassword: string }) => {
    setLoading(true);
    try {
      if (data.newPassword !== data.confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }

      const response = await axios.post("/api/auth/set-password", {
        newPassword: data.newPassword,
      });
      
       if (response.data.success) {
        toast.success("Password set successfully! You can now login with email and password");
        await update({
          ...session?.user,
          hasPassword: true,
          authProvider: "credentials"
        });
      } else {
        toast.error(response.data.error || "Failed to set password");
      }
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to set password");
    } finally {
      setLoading(false);
    }
  };



  return (
    <Card className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 shadow-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
          <Lock className='w-5 h-5' />
          {session?.user?.hasPassword ? "Update Password" : "Set Your Account Password"}
        </CardTitle>
        <CardDescription className='text-gray-600 dark:text-gray-400'>
         { session?.user?.hasPassword ? "Change your account password" : "Set a new password for your account"}
        </CardDescription>
      </CardHeader>
      {session?.user?.hasPassword ? (
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label
              htmlFor='currentPassword'
              className='text-gray-900 dark:text-white'
            >
              Current Password
            </Label>
            <div className='relative'>
              <Input
                id='currentPassword'
                type={showPasswords.current ? "text" : "password"}
                {...register("currentPassword", { required: true })}
                placeholder='Enter current password'
              />
              <button
                type='button'
                onClick={() =>
                  setShowPasswords((s) => ({ ...s, current: !s.current }))
                }
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'
              >
                {showPasswords.current ? (
                  <EyeOff className='w-4 h-4' />
                ) : (
                  <Eye className='w-4 h-4' />
                )}
              </button>
            </div>
          </div>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label
                htmlFor='newPassword'
                className='text-gray-900 dark:text-white'
              >
                New Password
              </Label>
              <div className='relative'>
                <Input
                  id='newPassword'
                  type={showPasswords.new ? "text" : "password"}
                  {...register("newPassword", { required: true, minLength: 8 })}
                  placeholder='Enter new password'
                />
                <button
                  type='button'
                  onClick={() =>
                    setShowPasswords((s) => ({ ...s, new: !s.new }))
                  }
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'
                >
                  {showPasswords.new ? (
                    <EyeOff className='w-4 h-4' />
                  ) : (
                    <Eye className='w-4 h-4' />
                  )}
                </button>
              </div>
            </div>
            <div className='space-y-2'>
              <Label
                htmlFor='confirmPassword'
                className='text-gray-900 dark:text-white'
              >
                Confirm New Password
              </Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type={showPasswords.confirm ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: true,
                    minLength: 8,
                  })}
                  placeholder='Confirm new password'
                />
                <button
                  type='button'
                  onClick={() =>
                    setShowPasswords((s) => ({ ...s, confirm: !s.confirm }))
                  }
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'
                >
                  {showPasswords.confirm ? (
                    <EyeOff className='w-4 h-4' />
                  ) : (
                    <Eye className='w-4 h-4' />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={!formState.isDirty || !formState.isValid || loading}
              className='bg-purple-600 hover:bg-purple-700 text-white'
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </form>
      ) : (
      <form onSubmit={handleSubmit(onSetPassword)} className=" px-6">
        <div className='grid md:grid-cols-2 gap-4 '>
          <div className='space-y-2'>
            <Label
              htmlFor='newPassword'
              className='text-gray-900 dark:text-white'
            >
              New Password
            </Label>
            <div className='relative'>
              <Input
                id='newPassword'
                type={showPasswords.new ? "text" : "password"}
                {...register("newPassword", { required: true, minLength: 8 })}
                placeholder='Enter new password'
              />
              <button
                type='button'
                onClick={() =>
                  setShowPasswords((s) => ({ ...s, new: !s.new }))
                }
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'
              >
                {showPasswords.new ? (
                  <EyeOff className='w-4 h-4' />
                ) : (
                  <Eye className='w-4 h-4' />
                )}
              </button>
            </div>
          </div>
          <div className='space-y-2'>
            <Label
              htmlFor='confirmPassword'
              className='text-gray-900 dark:text-white'
            >
              Confirm New Password
            </Label>
            <div className='relative'>
              <Input
                id='confirmPassword'
                type={showPasswords.confirm ? "text" : "password"}
                {...register("confirmPassword", {
                  required: true,
                  minLength: 8,
                })}
                placeholder='Confirm new password'
              />
              <button
                type='button'
                onClick={() =>
                  setShowPasswords((s) => ({ ...s, confirm: !s.confirm }))
                }
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'
              >
                {showPasswords.confirm ? (
                  <EyeOff className='w-4 h-4' />
                ) : (
                  <Eye className='w-4 h-4' />
                )}
              </button>
            </div>
          </div>
          </div>
          <div className='flex justify-end py-6'>
            <Button
              type='submit'
              // disabled={!formState.isDirty || !formState.isValid || loading}
              className='bg-purple-600 hover:bg-purple-700 text-white'
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
      </form>)}
    </Card>
  );
}

export default PasswordSection;
