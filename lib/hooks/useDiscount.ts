"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";

interface Discount {
  _id: string;
  email: string;
  type: string;
  usedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useDiscounts() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Fetch all discounts
  const {
    data: discounts,
    isLoading,
    error,
  } = useQuery<Discount[]>({
    queryKey: ["discounts"],
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/discounts");
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Add new discount
  const addDiscount = useMutation({
    mutationFn: async (email: string) => {
      try {
        const response = await axios.post("/api/admin/discounts", { email });
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.response?.data?.message || "Failed to add discount");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });

  return {
    discounts,
    isLoading,
    error,
    addDiscount,
  };
}