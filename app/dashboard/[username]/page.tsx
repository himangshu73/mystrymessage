"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Message } from "@/model/user";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaDeleteLeft } from "react-icons/fa6";
import { toast } from "sonner";

const Dashboard = () => {
  const [loadingMessage, setLoadingMessage] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const { username } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log("I am in the useeffect");
        const response = await axios.get("/api/get-messages");
        console.log(response.data);
        if (response.data.messages) {
          setMessages(response.data.messages);
        } else {
          console.log("Failed to get Messages");
        }
      } catch (error) {
        console.log("Error getting messages:", error);
      } finally {
        setLoadingMessage(false);
      }
    };
    fetchMessages();
  }, []);

  const handleDelete = async (messageId: string) => {
    await axios.delete(`/api/delete-message`, { data: { messageId } });
    toast("Message Delete Successfully");
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messageId)
    );
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="m-auto">
      <h1 className="text-2xl">Dashboard</h1>
      <p>Wecome, {username}.</p>
      <Separator className="mb-4" />
      {loadingMessage ? (
        <p>Loading Messages</p>
      ) : (
        <div className="max-w-96 m-auto">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <Card key={index} className="mb-4 bg-blue-200">
                <CardContent className="p-2 flex justify-between">
                  <div>
                    <p>{message.content}</p>
                  </div>
                  <div>
                    <FaDeleteLeft
                      size={30}
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDelete(message._id)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No message found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
