import { NextResponse } from "next/server";
import connectViaMongoose from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { verifyTransaction } from "@/services/paystack";

export async function POST(req: Request) {
  try {
    await connectViaMongoose();

    const payload = await req.json();
    const { event, data } = payload;

    console.log("Webhook received:", event);

    if (event === "charge.success") {
      const { reference, metadata } = data;
      const { userId, plan } = metadata;

      const verification = await verifyTransaction(reference);
      
      if (verification.status && verification.data.status === "success") {
        const amount = verification.data.amount / 100;
        const currency = verification.data.currency || "NGN";

        const updateData: any = { 
          plan,
          ...(plan === "pro" && { 
            planExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            paystackSubscriptionId: verification.data.subscription?.id
          })
        };

        await User.findByIdAndUpdate(userId, updateData);

        // Create transaction record
        await Transaction.create({
          userId,
          amount,
          reference,
          plan,
          status: "completed",
          currency,
          paystackData: verification.data
        });

        return NextResponse.json({ success: true });
      }
    }

    if (event === "subscription.create") {
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}







// import { NextResponse } from "next/server";
// import connectViaMongoose from "@/lib/db";
// import User from "@/models/User";
// import Transaction from "@/models/Transaction";
// import https from "https";

// type PaystackVerification = {
//   status: boolean;
//   data: {
//     status: "success" | "failed" | "abandoned";
//     amount: number;
//     reference: string;
//     [key: string]: any;
//   };
// };


// async function verifyPaystackTransaction(reference: string) {
//   const options = {
//     hostname: "api.paystack.co",
//     port: 443,
//     path: `/transaction/verify/${reference}`,
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//     },
//   };

//   return new Promise((resolve, reject) => {
//     const req = https.request(options, (res) => {
//       let data = "";

//       res.on("data", (chunk) => {
//         data += chunk;
//       });

//       res.on("end", () => {
//         try {
//           resolve(JSON.parse(data));
//         } catch (e) {
//           reject(e);
//         }
//       });
//     });

//     req.on("error", (error) => {
//       reject(error);
//     });

//     req.end();
//   });
// }

// export async function POST(req: Request) {
//   try {
//     await connectViaMongoose();

//     const payload = await req.json();
//     const { event, data } = payload;

//     console.log("Webhook received:", payload);

//     if (event === "charge.success") {
//       const { reference, metadata } = data;
//       const { userId, plan } = metadata;

//       // Verify transaction with Paystack
//       const verification = await verifyPaystackTransaction(reference) as PaystackVerification;
      
//       if (verification.status && verification.data.status === "success") {
//         await User.findByIdAndUpdate(userId, { 
//           plan,
//           planExpiresAt: plan === "pro" ? 
//             new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) :
//             null 
//         });

//         // Create transaction record
//         await Transaction.create({
//           userId,
//           amount: verification.data.amount / 100,
//           reference,
//           plan,
//           status: "completed",
//           currency: verification.data.currency || "NGN" 
//         });

//         return NextResponse.json({ success: true });
//       }
//     }

//     return NextResponse.json({ received: true });
//   } catch (error) {
//     console.error("Webhook error:", error);
//     return NextResponse.json(
//       { error: "Webhook processing failed" },
//       { status: 500 }
//     );
//   }
// }










// import { NextResponse } from "next/server";
// import connectViaMongoose from "@/lib/db";
// import User from "@/models/User";
// import https from "https";

// export async function POST(req: Request) {
//   try {
//     await connectViaMongoose();

//     const payload = await req.json();
//     const { event, data } = payload;

//     if (event === "charge.success") {
//       const { reference, metadata } = data;

//       const options = {
//         hostname: "api.paystack.co",
//         port: 443,
//         path: `/transaction/verify/${reference}`,
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//         },
//       };

//       const verificationResponse = await new Promise((resolve, reject) => {
//         const req = https.request(options, (res) => {
//           let data = "";

//           res.on("data", (chunk) => {
//             data += chunk;
//           });

//           res.on("end", () => {
//             resolve(JSON.parse(data));
//           });
//         });

//         req.on("error", (error) => {
//           reject(error);
//         });

//         req.end();
//       });

//       if (verificationResponse.data.status === "success") {
//         const { userId, plan } = metadata;

//         // Update user plan
//         await User.findByIdAndUpdate(userId, { plan });

//         return NextResponse.json({ success: true });
//       }
//     }

//     return NextResponse.json({ received: true });
//   } catch (error) {
//     console.error("Webhook error:", error);
//     return NextResponse.json(
//       { error: "Webhook processing failed" },
//       { status: 500 }
//     );
//   }
// }