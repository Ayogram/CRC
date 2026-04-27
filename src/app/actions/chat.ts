"use server";

export async function processChat(message: string): Promise<string> {
  const lowerMsg = message.toLowerCase();

  // Basic NLP rules mapped to CRC knowledge
  if (lowerMsg.includes("book") || lowerMsg.includes("reserve") || lowerMsg.includes("accommodation") || lowerMsg.includes("room")) {
    return "CRC offers premium accommodation including the Goshen Ultra Suite, Bethel, Zion Signature, Beulah, and Rehoboth rooms, alongside 12-bed and 24-bed dormitories. To make a reservation or check prices, please contact us on WhatsApp at 09069168041.";
  }

  if (lowerMsg.includes("hall") || lowerMsg.includes("facilit") || lowerMsg.includes("event") || lowerMsg.includes("conference") || lowerMsg.includes("wedding")) {
    return "Our facilities include Victory Hall and Redemption Hall, fully equipped with professional sound systems, VIP lighting, and strong AC units. We also have a Garden, Reception Areas, and a Children's Playground. For bookings, please message us on WhatsApp: 09069168041.";
  }

  if (lowerMsg.includes("location") || lowerMsg.includes("where") || lowerMsg.includes("address") || lowerMsg.includes("direction")) {
    return "Christian Retreat Centre is located at 1, CRC Close, End of Ago-Iwoye Street, Off Isawo Road, Agric Bus-Stop, Owutu, Ikorodu, Lagos State, Nigeria. You can find our pin on Google Maps!";
  }

  if (lowerMsg.includes("contact") || lowerMsg.includes("phone") || lowerMsg.includes("whatsapp") || lowerMsg.includes("email") || lowerMsg.includes("call")) {
    return "You can reach our dedicated team directly via Phone or WhatsApp at 09069168041, or email us at christianretreatcentrelagos@gmail.com.";
  }

  if (lowerMsg.includes("hello") || lowerMsg.includes("hi ") || lowerMsg.includes("hey ") || lowerMsg === "hi") {
    return "Hello! Welcome to the Christian Retreat Centre. How can I assist you with your retreat, accommodation, or event planning today?";
  }
  
  if (lowerMsg.includes("retreat") || lowerMsg.includes("program") || lowerMsg.includes("schedule")) {
    return "We host annual retreats and special church programs. Please check our Announcements page for the latest schedule, or contact us directly on WhatsApp at 09069168041 for specific dates and details.";
  }

  if (lowerMsg.includes("price") || lowerMsg.includes("cost") || lowerMsg.includes("how much") || lowerMsg.includes("fee") || lowerMsg.includes("rate")) {
    return "Our pricing varies based on the facility, room type, or dormitory size. For the most accurate and up-to-date pricing, kindly text us on WhatsApp: 09069168041.";
  }

  if (lowerMsg.includes("thank")) {
    return "You're very welcome! If you need anything else, just ask.";
  }

  // Exact Fallback instructed by user
  return "Thanks for your question! I’m unable to answer that specific request right now, but our team will be happy to help you directly on WhatsApp or phone: 09069168041.";
}
