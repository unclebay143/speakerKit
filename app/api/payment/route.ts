import { NextResponse } from "next/server";
import connectViaMongoose from "@/lib/db";
import User from "@/models/User";
import { initializePayment } from "@/services/paystack";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth-options";

export async function POST(req: Request) {
  try {
    console.log("Payment request received");
    await connectViaMongoose();

    const session = await getServerSession(authOptions);
    console.log("Session:", session?.user); 

    if (!session?.user?.id) {
      console.log("Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, success_redirect_url } = await req.json(); 
    console.log("Plan requested:", plan);

    if (!plan || !["pro", "lifetime"].includes(plan)) {
      console.log("Invalid plan:", plan);
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    if (plan === "lifetime") {
      const lifetimeCount = await User.countDocuments({ plan: "lifetime" });
      console.log("Lifetime slots count:", lifetimeCount);
      if (lifetimeCount >= 20) {
        return NextResponse.json(
          { error: "All lifetime slots have been taken" },
          { status: 400 }
        );
      }
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      console.log("User not found:", session.user.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Define payment parameters
    const amount = plan === "pro" ? 48000 : 100000; 
    const metadata = {
      custom_fields: [
        {
          display_name: "User ID",
          variable_name: "userId",
          value: user._id.toString()
        },
        {
          display_name: "Plan",
          variable_name: "plan",
          value: plan
        }
      ],
      userId: user._id.toString(),
      plan,
      userEmail: user.email,
      success_redirect_url: success_redirect_url || `${process.env.NEXT_PUBLIC_BASE_URL}/billing?payment_success=true`
    };

    console.log("Initializing payment for:", user.email, amount, metadata);

    // Initialize payment with callback_url
    const paymentData = await initializePayment(
      user.email,
      amount,
      metadata,
      plan === "pro" ? process.env.PAYSTACK_PRO_PLAN_CODE : undefined,
      success_redirect_url || `${process.env.NEXT_PUBLIC_BASE_URL}/billing?payment_success=true`
    );

    if (!paymentData.status) {
      console.error("Payment initialization failed:", paymentData.message);
      return NextResponse.json(
        { error: paymentData.message || "Payment initialization failed" },
        { status: 400 }
      );
    }
    
    console.log("Payment initialized successfully");
    return NextResponse.json({
      ...paymentData,
      redirect_url: metadata.success_redirect_url 
    });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}













// import { NextResponse } from "next/server";
// import connectViaMongoose from "@/lib/db";
// import User from "@/models/User";
// import { initializePayment } from "@/services/paystack";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/utils/auth-options";

// export async function POST(req: Request) {
//   try {
//     console.log("Payment request received");
//     await connectViaMongoose();

//     const session = await getServerSession(authOptions);
//      console.log("Session:", session?.user); 

//     if (!session?.user?.id) {
//        console.log("Unauthorized request");
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { plan } = await req.json();
//     console.log("Plan requested:", plan);

//     if (!plan || !["pro", "lifetime"].includes(plan)) {
//         console.log("Invalid plan:", plan);
//       return NextResponse.json(
//         { error: "Invalid plan selected" },
//         { status: 400 }
//       );
//     }

//     if (plan === "lifetime") {
//       const lifetimeCount = await User.countDocuments({ plan: "lifetime" });
//       console.log("Lifetime slots count:", lifetimeCount);
//       if (lifetimeCount >= 20) {
//         return NextResponse.json(
//           { error: "All lifetime slots have been taken" },
//           { status: 400 }
//         );
//       }
//     }

//     const user = await User.findById(session.user.id);
//     if (!user) {
//       console.log("User not found:", session.user.id);
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // Define payment parameters
//     const amount = plan === "pro" ? 48000 : 100000; 
//     const metadata = {
//        custom_fields: [
//       {
//         display_name: "User ID",
//         variable_name: "userId",
//         value: user._id.toString()
//       },
//       {
//         display_name: "Plan",
//         variable_name: "plan",
//         value: plan
//       }
//     ],
//       userId: user._id.toString(),
//       plan,
//       userEmail: user.email
//     };

//     console.log("Initializing payment for:", user.email, amount, metadata);

//     // Initialize payment
//     const paymentData = await initializePayment(
//       user.email,
//       amount,
//       metadata,
//       plan === "pro" ? process.env.PAYSTACK_PRO_PLAN_CODE : undefined
//     );

//     if (!paymentData.status) {
//       console.error("Payment initialization failed:", paymentData.message);
//       return NextResponse.json(
//         { error: paymentData.message || "Payment initialization failed" },
//         { status: 400 }
//       );
//     }
    
//     console.log("Payment initialized successfully");
//     return NextResponse.json(paymentData);
//   } catch (error) {
//     console.error("Payment error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

