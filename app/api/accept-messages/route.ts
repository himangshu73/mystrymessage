import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 500 }
    );
  }

  const userId = user._id;

  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update accept message status.",
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Accept Message Status Changed successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update user status to accept messages.");
    return Response.json(
      {
        success: false,
        message: "Failed to update user staus to accept messages",
      },
      { status: 500 }
    );
  }
}
