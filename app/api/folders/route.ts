// import { NextResponse } from "next/server";
// import connectViaMongoose from "@/lib/db";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/utils/auth-options";
// import Folder from "@/models/Folders";
// import "../../../models/Images";


// export async function GET() {
//   try {
//     await connectViaMongoose();
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const folders = await Folder.find({ userId: session.user.id }).populate("images");
//     return NextResponse.json(folders);
//   } catch (error) {
//     console.error("Error fetching folders:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: Request) {
//   try {
//     await connectViaMongoose();
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const { name } = await req.json();
    
//     if (!name || name.length < 3) {
//       return NextResponse.json(
//         { error: "Folder name must be at least 3 characters" },
//         { status: 400 }
//       );
//     }

//     const folder = await Folder.create({
//       name,
//       userId: session.user.id,
//     });

//     return NextResponse.json(folder, { status: 201 });
//   } catch (error) {
//     console.error("Error creating folder:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }