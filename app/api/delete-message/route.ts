import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        {
          status: 401,
        }
      );
    }

    const { messageId } = await request.json();

    const result = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    return Response.json(
      {
        success: true,
        message: "Message deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error Deleting Message.",
      },
      { status: 500 }
    );
  }
}
