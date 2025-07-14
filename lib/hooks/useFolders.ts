import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Folder {
  updatedAt: string;
  _id: string;
  name: string;
  images: any[];
  createdAt: string;
}

export function useFolders() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Fetch all folders
  const {
    data: folders,
    isLoading,
    error,
  } = useQuery<Folder[]>({
    queryKey: ["folders"],
    queryFn: async () => {
      const { data } = await axios.get("/api/folders");
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch individual folder
  const useFolder = (folderId: string | null) => {
    return useQuery<Folder>({
      queryKey: ["folder", folderId],
      queryFn: async () => {
        if (!folderId) throw new Error("Folder ID is required");
        const { data } = await axios.get(`/api/folders/${folderId}`);
        return data;
      },
      enabled: !!folderId && !!session?.user?.id,
    });
  };

  // Create folder
  const createFolder = useMutation({
    mutationFn: (name: string) => axios.post("/api/folders", { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  // Update folder
  const updateFolder = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      axios.put(`/api/folders/${id}`, { name }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folder", variables.id] });
    },
  });

  // Delete folder
  const deleteFolder = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/folders/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  // Upload image
  const uploadImage = useMutation({
    mutationFn: ({ folderId, file }: { folderId: string; file: File }) => {
      const formData = new FormData();
      formData.append("folderId", folderId);
      formData.append("file", file);
      return axios.post("/api/images/upload", formData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({
        queryKey: ["folder", variables.folderId],
      });
    },
  });

  return {
    folders,
    isLoading,
    error,
    useFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    uploadImage,
  };
}
