import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useCurrentUser,
  useUpdateCurrentUser,
} from "@/lib/hooks/useCurrentUser";
import { Check, Lock, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UpgradeModal } from "../modals/upgrade-modal";

const allThemeOptions = [
  { key: "teal", name: "Teal", bg: "bg-teal-500", text: "text-white" },
  { key: "light", name: "Light", bg: "bg-gray-100", text: "text-gray-900" },
  { key: "dark", name: "Dark", bg: "bg-gray-800", text: "text-white" },
  { key: "blue", name: "Blue", bg: "bg-blue-600", text: "text-white" },
  { key: "purple", name: "Purple", bg: "bg-purple-600", text: "text-white" },
  { key: "green", name: "Green", bg: "bg-green-500", text: "text-white" },
  {
    key: "gradient",
    name: "Gradient",
    bg: "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600",
    text: "text-white",
  },
];

function ThemeSection() {
  const { data: user, refetch } = useCurrentUser();
  const updateUser = useUpdateCurrentUser();
  const [isInitialized, setIsInitialized] = useState(false);
  const { register, handleSubmit, formState, reset, watch, setValue } = useForm(
    {
      mode: "onChange",
    }
  );
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const isPremiumUser = !!user?.isPro;

  useEffect(() => {
    if (user && !isInitialized) {
      const userTheme = isPremiumUser ? user.theme || "teal" : "teal";
      setValue("theme", userTheme);
      setIsInitialized(true);
    }
  }, [user, isInitialized, setValue, isPremiumUser]);

  const selectedTheme = watch("theme");

  const onSubmit = async (values: any) => {
    try {
      const themeToSave = isPremiumUser ? values.theme : "teal";
      await updateUser.mutateAsync({ theme: themeToSave });
      setMessage({ text: "Theme updated successfully!", type: "success" });
      refetch();
    } catch (error) {
      setMessage({ text: "Failed to update theme", type: "error" });
    }
  };

  return (
    <Card className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 shadow-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
          <Palette className='w-5 h-5' />
          Profile Theme
        </CardTitle>
        <CardDescription className='text-gray-600 dark:text-gray-400'>
          {isPremiumUser
            ? "Choose the theme for your public profile page"
            : "Teal is your current theme. Upgrade to Pro or Lifetime to unlock all color options!"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-6'>
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

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {allThemeOptions.map((theme) => (
              <label
                key={theme.key}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  isPremiumUser || theme.key === "teal"
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-70"
                } ${
                  selectedTheme === theme.key
                    ? "border-purple-500 ring-2 ring-purple-200 dark:ring-purple-800"
                    : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                } ${theme.bg} ${theme.text}`}
              >
                <input
                  type='radio'
                  value={theme.key}
                  {...register("theme")}
                  className='hidden'
                  disabled={!isPremiumUser && theme.key !== "teal"}
                />
                <div className='text-center'>
                  <div className='text-sm font-medium'>{theme.name}</div>
                  {selectedTheme === theme.key && (
                    <Check className='w-4 h-4 mx-auto mt-2' />
                  )}
                </div>
                {!isPremiumUser && theme.key !== "teal" && (
                  <div
                    className='absolute inset-0 bg-black/40 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer'
                    onClick={() => setShowUpgradeModal(true)}
                  >
                    <Lock className='w-4 h-4 text-white' />
                    <span className='text-xs font-medium text-white'>
                      Premium
                    </span>
                  </div>
                )}
              </label>
            ))}
          </div>
          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={
                (!formState.isDirty && isPremiumUser) ||
                !formState.isValid ||
                updateUser.isPending ||
                !isPremiumUser
              }
              className='bg-purple-600 hover:bg-purple-700 text-white'
            >
              {updateUser.isPending ? "Saving..." : "Save Theme"}
            </Button>
          </div>
        </CardContent>
      </form>
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        limitType={"theme"}
        currentCount={0}
        limit={0}
        isPro={isPremiumUser}
      />
    </Card>
  );
}

export default ThemeSection;
