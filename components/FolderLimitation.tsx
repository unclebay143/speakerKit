// "use client";

// import { Button } from "@/components/ui/button";
// import { useSession } from "next-auth/react";
// import { useState } from "react";
// import { UpgradeModal } from "./modals/upgrade-modal";

// export function FolderLimitation({
//   currentFolderCount,
//   onCreateFolder
// }: {
//   currentFolderCount: number;
//   onCreateFolder: () => void;
// }) {
//   const { data: session } = useSession();
//   const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  
//   const isFreeUser = session?.user?.plan === "free";
//   const folderLimitReached = isFreeUser && currentFolderCount >= 1;

//   const handleCreateFolder = () => {
//     if (folderLimitReached) {
//       setUpgradeModalOpen(true);
//       return;
//     }
//     onCreateFolder();
//   };

//   return (
//     <>
//       <Button
//         onClick={handleCreateFolder}
//         className="bg-purple-600 hover:bg-purple-700 text-white"
//       >
//         Create New Folder
//       </Button>
      
//       <UpgradeModal
//         open={upgradeModalOpen}
//         onOpenChange={setUpgradeModalOpen}
//         limitType="folders"
//         currentCount={currentFolderCount}
//         limit={1}
//       />
//     </>
//   );
// }