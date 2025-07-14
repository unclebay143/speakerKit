import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputWithPrefix } from "@/components/ui/input-with-prefix";
import { Label } from "@/components/ui/label";
import {
  useCurrentUser,
  useUpdateCurrentUser,
} from "@/lib/hooks/useCurrentUser";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function ProfileInfoSection() {
  const { data: user, isLoading: refetch } = useCurrentUser();
  const updateUser = useUpdateCurrentUser();
  const [isInitialized, setIsInitialized] = useState(false);
  const { register, handleSubmit, formState, setValue } = useForm({
    mode: "onChange",
  });
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (user && !isInitialized) {
      setValue("fullName", user.name || "");
      setValue("slug", user.slug || ""); 
      // setValue("username", user.username || "");
      setValue("email", user.email || "");
      setIsInitialized(true);
    }
  }, [user, isInitialized, setValue]);

  const onSubmit = async (values: any) => {
    try {
      await updateUser.mutateAsync({
        name: values.fullName,
        // username: values.username,
      });
      setMessage({
        text: "Profile information updated successfully!",
        type: "success",
      });
      refetch();
    } catch (error) {
      setMessage({
        text: "Failed to update profile information",
        type: "error",
      });
    }
  };

  return (
    <Card className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 shadow-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
          Account Information
        </CardTitle>
        <CardDescription className='text-gray-600 dark:text-gray-400'>
          Update your personal information
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>
          {message && (
            <div
              className={`text-sm p-3 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
              }`}
            >
              {message.text}
            </div>
          )}
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label
                htmlFor='fullName'
                className='text-gray-900 dark:text-white'
              >
                Full Name
              </Label>
              <Input
                id='fullName'
                {...register("fullName", { required: true })}
              />
            </div>
            <div className='space-y-2'>
              <Label
                htmlFor='slug'
                className='text-gray-900 dark:text-white'
              >
                Profile URL
              </Label>
              <InputWithPrefix
                id='slug'
                prefix='speakerkit.com/'
                value={user?.slug || ''}
                readOnly disabled
                // {...register("username", { required: true, minLength: 3 })}
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email' className='text-gray-900 dark:text-white'>
              Email Address
            </Label>
            <Input id='email' {...register("email")} readOnly disabled />
          </div>
          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={
                !formState.isDirty || !formState.isValid || updateUser.isPending
              }
              className='bg-purple-600 hover:bg-purple-700 text-white'
            >
              {updateUser.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}

export default ProfileInfoSection;
