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
import { useState } from "react";
import { useForm } from "react-hook-form";

function PasswordSection() {
  const { register, handleSubmit, formState, reset, watch } = useForm({
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
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (values: any) => {
    setLoading(true);
    setMessage(null);
    try {
      if (values.newPassword !== values.confirmPassword) {
        setMessage("New passwords don't match!");
        setLoading(false);
        return;
      }
      await axios.put("/api/users/password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setMessage("Password updated successfully!");
      reset();
    } catch (error: any) {
      setMessage(error?.response?.data?.error || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 shadow-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
          <Lock className='w-5 h-5' />
          Update Password
        </CardTitle>
        <CardDescription className='text-gray-600 dark:text-gray-400'>
          Change your account password
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>
          {message && (
            <div className='text-sm mb-2 text-center text-red-500 dark:text-red-400'>
              {message}
            </div>
          )}
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
    </Card>
  );
}

export default PasswordSection;
