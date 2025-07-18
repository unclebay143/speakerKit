"use client";
import { useState } from "react";
import { SparklesCore } from "@/components/sparkles";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useDiscounts } from "@/lib/hooks/useDiscount";

const InputSkeleton = () => (
  <div className="w-full h-10 bg-gray-800/50 rounded-lg animate-pulse"></div>
);

const ButtonSkeleton = () => (
  <div className="w-24 h-10 bg-purple-800/50 rounded-lg animate-pulse"></div>
);

const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-800/50 rounded w-3/4"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-800/50 rounded w-1/2"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-800/50 rounded w-1/2"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-6 w-16 bg-gray-800/50 rounded-full"></div>
    </td>
  </tr>
);

export default function DiscountAdmin() {
  const [email, setEmail] = useState("");
  const { data: session, status } = useSession();
  const { discounts, isLoading, error, addDiscount } = useDiscounts();

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const handleAddDiscount = async () => {
    if (!email) return;
    try {
      await addDiscount.mutateAsync(email);
      setEmail("");
    } catch (error) {
      console.error("Error adding discount:", error);
    }
  };

  return (
    <main className="min-h-screen bg-black/[0.96] antialiased relative overflow-hidden">
      {/* Sparkles Background */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesadmin"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#FFFFFF" 
        />
      </div>

      {/* Admin side */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-black/70 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/50 to-black">
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  SpeakerKit Manager
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-purple-600 text-white">
                  Admin
                </span>
              </h1>
              <p className="text-purple-200 mt-1">
                Manage discounts for users
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* The User Form */}
              <div className="bg-black/40 p-6 rounded-lg border border-purple-500/20">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Add New Discount User
                </h2>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-purple-200 mb-1">
                      Email Address
                    </label>
                    {isLoading ? (
                      <InputSkeleton />
                    ) : (
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="user@example.com"
                      />
                    )}
                  </div>
                  <div className="flex items-end">
                    {isLoading ? (
                      <ButtonSkeleton />
                    ) : (
                      <button
                        onClick={handleAddDiscount}
                        disabled={addDiscount.isPending || !email}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                      >
                        {addDiscount.isPending ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Adding...
                          </span>
                        ) : (
                          "Add Discount"
                        )}
                      </button>
                    )}
                  </div>
                </div>
                {addDiscount.isSuccess && (
                  <div className="mt-4 p-3 bg-green-900/30 border border-green-500/30 text-green-100 rounded-lg">
                    Discount User added successfully!
                  </div>
                )}
              </div>

              {/* List of Email */}
              <div className="bg-black/40 p-6 rounded-lg border border-purple-500/20">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Active Discounts User ({isLoading ? "..." : discounts?.length || 0})
                </h2>
                {isLoading ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-purple-500/20">
                      <thead className="bg-purple-900/20">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-500/10">
                        {[...Array(3)].map((_, i) => (
                          <TableRowSkeleton key={i} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-300">
                    Error loading discounts
                  </div>
                ) : discounts?.length === 0 ? (
                  <div className="text-center py-8 text-purple-300">
                    No discounts user added yet
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-purple-500/20">
                      <thead className="bg-purple-900/20">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-500/10">
                        {discounts?.map((discount) => (
                          <tr key={discount._id} className="hover:bg-purple-900/10">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {discount.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300">
                              {discount.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300">
                              {new Date(discount.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                discount.usedAt 
                                  ? "bg-gray-800 text-gray-400" 
                                  : "bg-green-900/30 text-green-400"
                              }`}>
                                {discount.usedAt ? "Used" : "Active"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-purple-500/20 text-center text-xs text-purple-400">
              Only authorized administrators can access this panel
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}