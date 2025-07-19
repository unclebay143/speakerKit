"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Clock, CreditCard, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Transaction = {
  id: string;
  date: string;
  status: string;
  amount: string;
};

export function BillingDashboard() {
  // const { data: session } = useSession();
  // const router = useRouter();
  // const [loading, setLoading] = useState(false);
  // const [, setError] = useState("");
  const [currentPlan, setCurrentPlan] = useState({
    name: "Free",
    price: "₦0",
    status: "Active",
    renewal: "Always",
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planRes, txRes] = await Promise.all([
          fetch("/api/users/plan"),
          fetch("/api/transactions"),
        ]);

        if (planRes.ok) setCurrentPlan(await planRes.json());
        if (txRes.ok) setTransactions(await txRes.json());
      } catch (error) {
        console.error("Failed to fetch billing data:", error);
      }
    };

    fetchData();
  }, []);

  const statusBadge = (status: string) => {
    if (status === "Success")
      return (
        <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-white/10'>
          <CheckCircle className='w-4 h-4 text-gray-400' /> Success
        </span>
      );
    if (status === "Failed")
      return (
        <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-white/10'>
          <XCircle className='w-4 h-4 text-red-400' /> Failed
        </span>
      );
    // return (
    //   <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-white/10'>
    //     <Clock className='w-4 h-4 text-gray-400' /> Pending
    //   </span>
    // );
  };

  return (
    <div className='max-w-screen-lg mx-auto flex flex-col gap-6'>
      {/* Current Plan Card */}
      <Card className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 shadow-sm'>
        <CardHeader className='pb-2 flex flex-row items-center gap-2'>
          <CreditCard className='w-5 h-5 text-purple-500' />
          <CardTitle className='text-gray-900 dark:text-white text-xl font-bold'>
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent className='p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-0'>
          <div>
            <div className='text-2xl font-extrabold mb-1 text-gray-900 dark:text-white'>
              {currentPlan.price}
            </div>
            <div className='mb-2 flex items-center gap-2'>
              <span className='inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'>
                {currentPlan.name}
              </span>
              {statusBadge(currentPlan.status)}
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              Renews: {currentPlan.renewal}
            </div>
          </div>
          {/* <Button className='bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-2 rounded-lg shadow-none transition'>
            Upgrade
          </Button> */}
          <div className='flex flex-col gap-3 max-w-xs'>
            {currentPlan.name.toLowerCase() !== "pro" && (
              <Link
                href='/pricing'
                className='relative bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium px-6 py-1.5 rounded-md shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center text-sm'
              >
                Upgrade
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History Card */}
      <Card className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/20 shadow-sm'>
        {transactions.length > 0 && (
          <CardHeader className='flex flex-row items-center gap-2'>
            <Clock className='w-5 h-5 text-purple-500' />
            <CardTitle className='text-gray-900 dark:text-white text-lg font-bold'>
              Transaction History
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className='p-6 overflow-x-auto'>
          {transactions.length === 0 ? (
            <div className='py-12 text-center'>
              <div className='flex flex-col items-center gap-3'>
                <div className='w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center'>
                  <Clock className='w-6 h-6 text-gray-400' />
                </div>
                <div>
                  <p className='text-gray-900 dark:text-white font-medium'>
                    No transactions yet
                  </p>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    Your transaction history will appear here
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className='bg-black/5 dark:bg-white/5 border-b border-gray-200 dark:border-white/20 hover:bg-current'>
                  <TableHead className='text-gray-900 dark:text-white font-semibold'>
                    Date
                  </TableHead>
                  <TableHead className='text-gray-900 dark:text-white font-semibold'>
                    Status
                  </TableHead>
                  <TableHead className='text-gray-900 dark:text-white font-semibold'>
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx, i) => (
                  <TableRow
                    key={tx.id}
                    className={`border-b border-gray-200 dark:border-white/20 transition-colors ${"hover:bg-gray-50 dark:hover:bg-white/10"} ${
                      i % 2 === 0
                        ? "bg-black/0 dark:bg-white/0"
                        : "bg-black/5 dark:bg-white/5"
                    }`}
                  >
                    <TableCell className='py-3 text-gray-900 dark:text-white'>
                      {tx.date}
                    </TableCell>
                    <TableCell>{statusBadge(tx.status)}</TableCell>
                    <TableCell className='font-semibold text-gray-900 dark:text-white'>
                      {tx.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// 'use client'

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { CheckCircle, Clock, CreditCard, XCircle } from "lucide-react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// type Transaction = {
//   id: string;
//   date: string;
//   status: string;
//   amount: string;
// };

// export function BillingDashboard() {

//   const { data: session } = useSession();
//   const router = useRouter();
//   // const [loading, setLoading] = useState(false);
//   const [, setError] = useState("");
//   const [currentPlan, setCurrentPlan] = useState({
//     name: "Free",
//     price: "₦0",
//     status: "Active",
//     renewal: "Never"
//   });
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

//   // Placeholder data
//   //  const currentPlan = {
//   //   name: session?.user?.plan || "Free",
//   //   price: session?.user?.plan === "pro" ? "₦48,000/yr" : session?.user?.plan === "lifetime" ? "₦100,000" : "₦0",
//   //   status: "Active",
//   //   renewal: session?.user?.plan === "pro" ? "2025-06-01" : "Never",
//   // };
//   // const currentPlan = {
//   //   name: "Pro",
//   //   price: "₦48,000/yr",
//   //   status: "Active",
//   //   renewal: "2025-06-01",
//   // };
//   // const transactions = [
//   //   { id: 1, date: "2024-06-01", status: "Success", amount: "₦48,000" },
//   //   { id: 2, date: "2023-06-01", status: "Success", amount: "₦48,000" },
//   //   { id: 3, date: "2022-06-01", status: "Failed", amount: "₦48,000" },
//   // ];

//    const handleUpgrade = async (plan: string) => {
//     if (!session) {
//       router.push("/signup");
//       return;
//     }

//     // setLoading(true);
//     setLoadingPlan(plan);
//     setError("");

//     try {
//       const response = await fetch("/api/payment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ plan, success_url: `${window.location.origin}/billing?payment_success=true` }),
//       });

//       const data = await response.json();

//       if (response.ok && data.data?.authorization_url) {
//         window.location.href = data.data.authorization_url;
//       } else {
//         setError(data.error || "Payment initialization failed");
//       }
//     } catch (err) {
//       setError("An error occurred while processing your request");
//     } finally {
//        setLoadingPlan(null);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [planRes, txRes] = await Promise.all([
//           fetch('/api/users/plan'),
//           fetch('/api/transactions')
//         ]);

//         if (planRes.ok) setCurrentPlan(await planRes.json());
//         if (txRes.ok) setTransactions(await txRes.json());
//         } catch (error) {
//           console.error("Failed to fetch billing data:", error);
//         }
//     };

//     fetchData();
//   }, []);

//   const statusBadge = (status: string) => {
//     if (status === "Success")
//       return (
//         <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-white/10'>
//           <CheckCircle className='w-4 h-4 text-gray-400' /> Success
//         </span>
//       );
//     if (status === "Failed")
//       return (
//         <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-white/10'>
//           <XCircle className='w-4 h-4 text-red-400' /> Failed
//         </span>
//       );
//     return (
//       <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-white/10'>
//         <Clock className='w-4 h-4 text-gray-400' /> Pending
//       </span>
//     );
//   };

//   return (
//     <div className='max-w-screen-lg mx-auto flex flex-col gap-6'>
//       {/* Current Plan Card */}
//       <Card className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 shadow-sm'>
//         <CardHeader className='pb-2 flex flex-row items-center gap-2'>
//           <CreditCard className='w-5 h-5 text-purple-500' />
//           <CardTitle className='text-gray-900 dark:text-white text-xl font-bold'>
//             Current Plan
//           </CardTitle>
//         </CardHeader>
//         <CardContent className='p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-0'>
//           <div>
//             <div className='text-2xl font-extrabold mb-1 text-gray-900 dark:text-white'>
//               {currentPlan.price}
//             </div>
//             <div className='mb-2'>
//               <span className='inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 mr-2'>
//                 {currentPlan.name}
//               </span>
//               {statusBadge(currentPlan.status)}
//             </div>
//             <div className='text-xs text-gray-500 dark:text-gray-400'>
//               Renews: {currentPlan.renewal}
//             </div>
//           </div>
//           {/* <Button className='bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-2 rounded-lg shadow-none transition'>
//             Upgrade
//           </Button> */}
//           <div className="flex flex-col gap-3 max-w-xs">
//             {currentPlan.name.toLowerCase() !== "pro" && (
//               <Button
//                 onClick={() => handleUpgrade("pro")}
//                 disabled={loadingPlan !== null}
//                 className="relative bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium px-6 py-1.5 rounded-md shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
//                 size="sm"
//               >
//                 {loadingPlan === "pro" ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Processing...
//                   </span>
//                 ) : (
//                   <>
//                     Upgrade
//                     {/* <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-white/20 rounded-full">₦48,000/yr</span> */}
//                   </>
//                 )}
//               </Button>
//             )}
//             {/* {currentPlan.name.toLowerCase() !== "lifetime" && (
//               <Button
//                 onClick={() => handleUpgrade("lifetime")}
//                 disabled={loadingPlan !== null}
//                 className="relative bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium px-6 py-1.5 rounded-md shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
//                 size="sm"
//               >
//                 {loadingPlan === "lifetime" ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Processing...
//                   </span>
//                 ) : (
//                   <>
//                     Upgrade to Lifetime
//                     <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-white/20 rounded-full">₦100,000</span>
//                   </>
//                 )}
//               </Button>
//             )} */}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Transaction History Card */}
//       <Card className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/20 shadow-sm'>
//         <CardHeader className='flex flex-row items-center gap-2'>
//           <Clock className='w-5 h-5 text-purple-500' />
//           <CardTitle className='text-gray-900 dark:text-white text-lg font-bold'>
//             Transaction History
//           </CardTitle>
//         </CardHeader>
//         <CardContent className='p-6 overflow-x-auto'>
//           <Table>
//             <TableHeader>
//               <TableRow className='bg-black/5 dark:bg-white/5 border-b border-gray-200 dark:border-white/20 hover:bg-current'>
//                 <TableHead className='text-gray-900 dark:text-white font-semibold'>
//                   Date
//                 </TableHead>
//                 <TableHead className='text-gray-900 dark:text-white font-semibold'>
//                   Status
//                 </TableHead>
//                 <TableHead className='text-gray-900 dark:text-white font-semibold'>
//                   Amount
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {transactions.map((tx, i) => (
//                 <TableRow
//                   key={tx.id}
//                   className={`border-b border-gray-200 dark:border-white/20 transition-colors ${"hover:bg-gray-50 dark:hover:bg-white/10"} ${
//                     i % 2 === 0
//                       ? "bg-black/0 dark:bg-white/0"
//                       : "bg-black/5 dark:bg-white/5"
//                   }`}
//                 >
//                   <TableCell className='py-3 text-gray-900 dark:text-white'>
//                     {tx.date}
//                   </TableCell>
//                   <TableCell>{statusBadge(tx.status)}</TableCell>
//                   <TableCell className='font-semibold text-gray-900 dark:text-white'>
//                     {tx.amount}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
