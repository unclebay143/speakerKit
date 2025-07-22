import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useExpertise() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["expertise"],
    queryFn: async () => {
      const { data } = await axios.get("/api/expertise");
      return data;
    },
  });

  const createExpertise = useMutation({
    mutationFn: async (label: string) => {
      const { data } = await axios.post("/api/expertise", { label });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expertise"] });
    },
  });

  return { expertise: data || [], isLoading, error, createExpertise };
}

export function useTopics() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const { data } = await axios.get("/api/topics");
      return data;
    },
  });

  const createTopic = useMutation({
    mutationFn: async (label: string) => {
      const { data } = await axios.post("/api/topics", { label });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });

  return { topics: data || [], isLoading, error, createTopic };
}
