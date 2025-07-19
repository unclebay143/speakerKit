import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

export function useBilling() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Fetch current plan
  const { data: currentPlan, isLoading: isPlanLoading } = useQuery({
    queryKey: ["billing", "plan"],
    queryFn: async () => {
      const { data } = await axios.get("/api/users/plan");
      return data;
    },
    enabled: !!session,
    initialData: {
      name: "Free",
      price: "₦0",
      status: "Active",
      renewal: "Always",
    },
  });

  // Fetch transactions
  const { data: transactions = [], isLoading: isTransactionsLoading } =
    useQuery({
      queryKey: ["billing", "transactions"],
      queryFn: async () => {
        const { data } = await axios.get("/api/transactions");
        return data;
      },
      enabled: !!session,
    });

  // Function to refresh billing data
  const refreshBilling = () => {
    queryClient.invalidateQueries({ queryKey: ["billing"] });
  };

  return {
    currentPlan,
    transactions,
    isLoading: isPlanLoading || isTransactionsLoading,
    refreshBilling,
  };
}
