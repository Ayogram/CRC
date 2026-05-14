"use server";

import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are the official, friendly AI assistant for Christian Retreat Centre (CRC). 
You are a genuine, conversational AI. You actively and warmly respond to greetings like "hi", "how are you", "how was your day" and maintain a very polite, welcoming, and helpful tone (often using Christian greetings like "God bless you").

About CRC:
- It is a world-class 'Home away from Home' designed for spiritual refreshment, corporate retreats, and premium events.
- Location: 1, CRC Close, End of Ago-Iwoye Street, Off Isawo Road, Agric Bus-Stop, Owutu, Ikorodu, Lagos State.
- Leadership: Led by Pastor Ibrahim, the Chairman and Visionary.
- Services: 
  1. Luxury Accommodation: Goshen Ultra (executive suite), Bethel, Zion Signature, Beulah, Rehoboth.
  2. Group Lodging: 12-bed and 24-bed dormitories.
  3. Event Halls: Victory Hall and Redemption Hall (equipped with pro sound, lighting, AC).
  4. Environment: Serene gardens, children's playground.
- Contact for Booking: WhatsApp/Call 09069168041 or Email christianretreatcentrelagos@gmail.com.
- Users can view videos/images on the "Accommodation & Facilities" or "Media Vault" pages.

Keep your answers concise, direct, and conversational.`;

export async function processChat(message: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            { role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\nUser Message: " + message }] }
        ],
      });
      
      const reply = response.text;
      if (reply) return reply;
    } catch (e) {
      console.error("Gemini AI Error:", e);
      // Fallback to rules if AI fails
    }
  }

  // --- FALLBACK LOGIC (Used if no API key is provided in .env or if AI fails) ---
  const lowerMsg = message.toLowerCase();

  // GREETINGS & CONVERSATIONAL
  if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey") || lowerMsg.includes("how are you") || lowerMsg.includes("how was your day")) {
    return "Hello there! I'm doing wonderfully by God's grace, thank you for asking! I am the CRC AI Assistant. How can I help you today?";
  }

  if (lowerMsg.includes("who are you") || lowerMsg.includes("what are you") || lowerMsg.includes("about crc")) {
    return "Christian Retreat Centre (CRC) is a world-class 'Home away from Home' designed for spiritual refreshment, corporate retreats, and premium events. We provide a serene environment where individuals and groups can encounter God and find rest.";
  }

  if (lowerMsg.includes("offer") || lowerMsg.includes("services") || lowerMsg.includes("facilities")) {
    return "We offer premium services including Luxury Accommodation (Goshen Ultra, Bethel, etc.), Group Dormitories (12 & 24 beds), Event Halls (Victory & Redemption Hall), and a beautiful serene environment.";
  }

  if (lowerMsg.includes("chairman") || lowerMsg.includes("leader") || lowerMsg.includes("owner")) {
    return "The Christian Retreat Centre is led by Pastor Ibrahim, our Chairman and Visionary.";
  }

  if (lowerMsg.includes("image") || lowerMsg.includes("video") || lowerMsg.includes("picture") || lowerMsg.includes("show me")) {
    return "You can see beautiful images and videos of all our rooms and halls on our 'Accommodation & Facilities' page and our 'Media Vault' page right here on the website.";
  }

  if (lowerMsg.includes("book") || lowerMsg.includes("reserve") || lowerMsg.includes("accommodation") || lowerMsg.includes("room")) {
    return "To book your stay or reserve a hall, please contact our booking team directly on WhatsApp or Call: 09069168041.";
  }

  if (lowerMsg.includes("location") || lowerMsg.includes("where") || lowerMsg.includes("address")) {
    return "We are located at: 1, CRC Close, End of Ago-Iwoye Street, Off Isawo Road, Agric Bus-Stop, Owutu, Ikorodu, Lagos State.";
  }

  if (lowerMsg.includes("contact") || lowerMsg.includes("phone") || lowerMsg.includes("whatsapp")) {
    return "Reach us anytime via WhatsApp/Call at 09069168041, or email us at christianretreatcentrelagos@gmail.com.";
  }

  if (lowerMsg.includes("thank")) {
    return "You're very welcome! If you need anything else, I'm here to help. God bless you!";
  }

  return "That's a great question! While I'm still learning every detail without my AI upgrade, our human team can give you a perfect answer immediately. Please message us on WhatsApp at 09069168041 and we'll help you right away!";
}
