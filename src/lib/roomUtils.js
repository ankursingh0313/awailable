import { ref, get, set } from "firebase/database";
import { db } from "@/firebase/config";
import { v4 as uuidv4 } from "uuid";

export const generateRoomId = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const createRoom = async () => {
  let roomId = generateRoomId();
  const roomRef = ref(db, `rooms/${roomId}`);
  const snapshot = await get(roomRef);

  if (snapshot.exists()) {
    return await createRoom(); // Try again on collision
  }

  const creatorToken = uuidv4();
  const createdAt = Date.now();

  await set(roomRef, {
    text: "",
    createdAt,
    creatorToken,
  });

  localStorage.setItem(`room_${roomId}_token`, creatorToken);
  return roomId;
};
