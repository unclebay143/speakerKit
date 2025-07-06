import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

// interface Image {
//   _id: string;
//   name: string;
//   images: any[];
//   createdAt: string;
// }

export function useImage() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const deleteImage = useMutation({
        mutationFn: (id: string) =>
            axios.delete(`api/images/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(["images"]);
        }
    });

    return {
        deleteImage
    }
}

