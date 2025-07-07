import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

  // Fetch all 
  const { 
    data: folders, 
    isLoading, 
    error 
  } = useQuery<Folder[]>({
    queryKey: ["folders"],
    queryFn: async () => {
      const { data } = await axios.get("/api/folders");
      return data;
    },
    enabled: !!session?.user?.id
  });

  const getFolder = useQuery({
  queryKey: ["folder"],
  queryFn: async ({ queryKey }) => {
    const [_, folderId] = queryKey;
    const { data } = await axios.get(`/api/folders/${folderId}`);
    return data;
  },
  enabled: false 
});


  // Create 
  const createFolder = useMutation({
    mutationFn: (name: string) => 
      axios.post("/api/folders", { name }),
    onSuccess: () => {
      queryClient.invalidateQueries(["folders"]);
    }
  });

  // Update 
  const updateFolder = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => 
      axios.put(`/api/folders/${id}`, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries(["folders"]);
    }
  });

  // Delete 
  const deleteFolder = useMutation({
    mutationFn: (id: string) => 
      axios.delete(`/api/folders/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["folders"]);
    }
  });

  // Upload
  const uploadImage = useMutation({
    mutationFn: ({ folderId, file }: { folderId: string; file: File }) => {
      const formData = new FormData();
      formData.append("folderId", folderId);
      formData.append("file", file);
      return axios.post("/api/images/upload", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["folders"]);
    }
  });

  return {
    folders,
    isLoading,
    error,
    getFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    uploadImage
  };
}