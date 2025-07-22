import { NextResponse } from 'next/server';
import connectViaMongoose from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';

export async function POST(req: Request) {
  try {
    await connectViaMongoose();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newPassword } = await req.json();

    // Check if user already has a password
    const user = await User.findOne({ email: session.user.email });
    if (user?.hasPassword) {
      return NextResponse.json(
        { error: "Password already set. Use the update password form." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await User.updateOne(
      { email: session.user.email },
      { 
        password: hashedPassword,
        hasPassword: true,
        authProvider: "credentials" 
      }
    );

    return NextResponse.json({
      success: true,
      message: "Password set successfully",
    });
  } catch (error) {
    console.error("Set password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}











// import { NextResponse } from 'next/server';
// import connectViaMongoose from '@/lib/db';
// import User from '@/models/User';
// import bcrypt from 'bcryptjs';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/utils/auth-options';

// export async function POST(req: Request) {
//   try {
//     await connectViaMongoose();
//     const session = await getServerSession(authOptions);
    
//     if (!session?.user?.email) {
//       return NextResponse.json(
//         { error: "Not authenticated" },
//         { status: 401 }
//       );
//     }

//     const { newPassword } = await req.json();

//     if (!newPassword) {
//       return NextResponse.json(
//         { error: "New password is required" },
//         { status: 400 }
//       );
//     }

//     if (newPassword.length < 8) {
//       return NextResponse.json(
//         { error: "New password must be at least 8 characters" },
//         { status: 400 }
//       );
//     }

//      const user = await User.findOne({ email: session.user.email });
//     if (!user) {
//         return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     user.hasPassword = true;
//     user.authProvider = "credentials"; 
//     await user.save();

//     return NextResponse.json({ success: true, message: "Password set successfully", });
//   } catch (error) {
//     console.error("Set password error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }