"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom } from "@/lib/roomUtils";
import { ref, get } from "firebase/database";
import { db } from "@/firebase/config";
import { toast } from "react-toastify";

export default function Home() {
  const router = useRouter();
  const [joiningId, setJoiningId] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingJoin, setLoadingJoin] = useState(false);

  const handleCreateRoom = async () => {
    setLoadingCreate(true);
    const roomId = await createRoom();
    router.push(`/room/${roomId}`);
  };

  const handleJoinRoom = async () => {
    if (joiningId.length !== 4 || isNaN(joiningId)) {
      toast.error("Enter a valid 4-digit room ID");
      return;
    }

    setLoadingJoin(true);
    const roomRef = ref(db, `rooms/${joiningId}`);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      toast.error("Room does not exist or has expired.");
      setLoadingJoin(false);
      return;
    }

    router.push(`/room/${joiningId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center sm:gap-20 gap-10 px-4 bg-gray-50">
      <div className="flex flex-col gap-3">
        <h1 className="text-xl font-bold text-center">
          Instant Rooms, Effortless Sharing
        </h1>
        <h6 className="text-l font-semibold text-center max-w-[700px]">
          Create a secure text-sharing room with a simple 4-digit code — no
          signups, no hassle. Share messages in real-time, copy them with a tap,
          and let the room auto-expire after an hour for total privacy.
        </h6>
      </div>

      <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-6 justify-center sm:gap-3 gap-5">
        {/* Create Room */}
        <div className="w-64 p-4 bg-white shadow-lg rounded-lg text-center justify-center flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Create Room</h2>
          <p className="mb-4">Start a new text-sharing session.</p>
          <button
            onClick={handleCreateRoom}
            disabled={loadingCreate}
            className="px-6 py-2 bg-[#4e60c6] text-white rounded-lg"
          >
            {loadingCreate ? "Creating..." : "Create a Room"}
          </button>
        </div>

        {/* Join Room */}
        <div className="w-64 p-4 bg-white shadow-lg rounded-lg  text-center justify-center flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Join Room</h2>
          <p className="mb-4">Enter a room ID to join an existing session.</p>
          <div className="flex flex-col items-center gap-2">
            <input
              type="text"
              placeholder="Enter 4-digit Room ID"
              value={joiningId}
              onChange={(e) => setJoiningId(e.target.value.replace(/\D/g, ""))}
              maxLength={4}
              className="border w-full py-2 px-4 rounded-lg text-center text-l"
            />
            <button
              onClick={handleJoinRoom}
              disabled={loadingJoin}
              className="bg-[#51587d] text-white py-2 px-6 rounded-lg w-full"
            >
              {loadingJoin ? "Joining..." : "Join Room"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
