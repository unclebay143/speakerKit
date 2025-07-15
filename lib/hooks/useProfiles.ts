import { Profile } from "@/types/profile";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";

export function useProfiles() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Fetch 
  const { data: profiles, isLoading, error } = useQuery<Profile[]>({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data } = await axios.get("/api/profiles");
      return data;
    },
    enabled: !!session
  });

  // Create
  // const createProfile = useMutation({
  //   mutationFn: (newProfile: Omit<Profile, "_id" | "userId" | "createdAt" | "updatedAt">) => 
  //     axios.post("/api/profiles", newProfile),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["profiles"]);
  //   }
  // });

   const createProfile = useMutation({
    mutationFn: async (newProfile: Omit<Profile, "_id" | "userId" | "createdAt" | "updatedAt">) => {
      try {
        const response = await axios.post("/api/profiles", newProfile);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw error;
        }
        throw new Error("Failed to create profile");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profiles"]);
    }
  });

  // Update 
  const updateProfile = useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<Profile>) => 
      axios.put(`/api/profiles/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(["profiles"]);
    }
  });

  // Delete 
  const deleteProfile = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/profiles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["profiles"]);
    }
  });

  return {
    profiles,
    isLoading,
    error,
    createProfile,
    updateProfile,
    deleteProfile
  };
}