"use client";

import { useEffect, useState, useRef } from "react";
import { db } from "@/firebase/config";
import { ref, onValue, push, remove } from "firebase/database";
import { useParams } from "next/navigation";
import { QRCode } from "react-qrcode-logo";
import { toast } from "react-toastify";

export default function RoomPage() {
  const { id } = useParams();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const roomRef = ref(db, `rooms/${id}`);
  const messagesRef = ref(db, `rooms/${id}/messages`);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let interval;
    const unsub = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (!data || Date.now() - data.createdAt > 3600000) {
        remove(roomRef);
        setExpired(true);
        setLoading(false);
        return;
      }

      const localToken = localStorage.getItem(`room_${id}_token`);
      setIsCreator(localToken === data.creatorToken);
      const expirationTime = data.createdAt + 3600000; // 1 hour after creation
      const updateTimer = () => {
        const now = Date.now();
        const remaining = expirationTime - now;

        if (remaining <= 0) {
          remove(roomRef);
          setExpired(true);
          return;
        }

        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s`);
      };

      updateTimer(); // initial run

      interval = setInterval(updateTimer, 1000); // update every second
    });
    const msgUnsub = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const msgArray = Object.entries(data).map(([key, val]) => ({
        id: key,
        ...val,
      }));
      setMessages(msgArray);
      setLoading(false);
    });

    return () => {
      unsub();
      msgUnsub();
      clearInterval(interval);
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleSend = async () => {
    if (!text.trim()) return;
    await push(messagesRef, {
      text: text.trim(),
      timestamp: Date.now(),
    });
    setText("");
  };

  //   const handleCopy = (msg) => {
  //     navigator.clipboard.writeText(msg);
  //     toast.success("Copied to clipboard!");
  //     };
  const handleCopy = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success("Copied to clipboard!");
        })
        .catch(() => {
          fallbackCopy(text);
        });
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        toast.success("Copied to clipboard!");
      } else {
        toast.error("Failed to copy.");
      }
    } catch (err) {
      toast.error("Copy not supported.");
    }

    document.body.removeChild(textArea);
  };
  const handleDelete = async (msgId) => {
    await remove(ref(db, `rooms/${id}/messages/${msgId}`));
    toast.info("Message deleted.");
  };
  if (loading) return <p className="text-center">Loading...</p>;
  if (expired)
    return (
      <p className="text-center text-red-500">Room expired or not found.</p>
    );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Room #{id}</h1>

      {isCreator && (
        <div className="mb-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border p-2 rounded"
            rows={3}
            placeholder="Enter message..."
          />
          <button
            onClick={handleSend}
            className="bg-[#4e60c6] text-white px-4 py-2 rounded mt-2 cursor-pointer"
          >
            Send
          </button>
        </div>
      )}

      <div className="space-y-3 mb-6">
        {messages.map((msg) => (
          <div key={msg.id} className="relative p-3 border rounded shadow">
            <div className="flex justify-between items-center">
              <div className="whitespace-pre-wrap max-h-[300px] w-full overflow-y-auto scroll-smooth">
                {msg.text}
              </div>
              <div className="absolute top-2 right-2 gap-2">
                <button
                  onClick={() => handleCopy(msg.text)}
                  className="bg-[#4e60c6] text-white px-2 py-1 rounded text-sm cursor-pointer"
                >
                  Copy
                </button>

                {isCreator && (
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="bg-[#51587d] text-white ml-2 px-2 py-1 rounded text-sm cursor-pointer"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(msg.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
        {isCreator && <div ref={messagesEndRef} />}
      </div>

      <div className="flex flex-col justify-center items-center">
        {timeLeft && (
          <div className="text-center text-sm text-gray-500 mb-2">
            ⏳ Room expires in: {timeLeft}
          </div>
        )}
        <QRCode
          value={typeof window !== "undefined" ? window.location.href : ""}
          logoImage="/logo3.png"
          logoWidth="50"
        />
      </div>
    </div>
  );
}
