"use server";

export async function processChat(message: string): Promise<string> {
  const lowerMsg = message.toLowerCase();

  // GREETINGS
  if (lowerMsg.includes("hello") || lowerMsg.includes("hi ") || lowerMsg.includes("hey ") || lowerMsg === "hi") {
    return "Hello! Welcome to the Christian Retreat Centre (CRC). I am your AI assistant. How can I assist you with your retreat, accommodation, or event planning today?";
  }

  // WHO ARE YOU / WHAT ARE YOU GUYS
  if (lowerMsg.includes("who are you") || lowerMsg.includes("what are you") || lowerMsg.includes("about crc") || lowerMsg.includes("tell me about you")) {
    return "Christian Retreat Centre (CRC) is a world-class 'Home away from Home' designed for spiritual refreshment, corporate retreats, and premium events. We provide a serene, holy, and high-standard environment where individuals and groups can encounter God and find rest.";
  }

  // WHAT DO YOU HAVE TO OFFER / SERVICES
  if (lowerMsg.includes("offer") || lowerMsg.includes("services") || lowerMsg.includes("do you have") || lowerMsg.includes("facilities")) {
    return "We offer a complete suite of premium services:\n\n" +
           "1. **Luxury Accommodation**: From executive suites (Goshen Ultra) to standard luxury rooms (Bethel, Zion Signature, Beulah, Rehoboth).\n" +
           "2. **Group Lodging**: Spacious 12-bed and 24-bed dormitories for camps and teams.\n" +
           "3. **Event Halls**: Victory Hall and Redemption Hall, equipped with professional sound, VIP lighting, and strong AC.\n" +
           "4. **Serene Environment**: Landscaped gardens, children's playground, and secure reception areas.\n" +
           "5. **Spiritual Atmosphere**: Perfect for church conventions, personal prayer retreats, and conferences.";
  }

  // CHAIRMAN / LEADERSHIP
  if (lowerMsg.includes("chairman") || lowerMsg.includes("leader") || lowerMsg.includes("owner") || lowerMsg.includes("who is in charge")) {
    return "The Christian Retreat Centre is led by **Pastor Ibrahim**, our Chairman and Visionary. He is dedicated to providing a high-standard space for the body of Christ to retreat and be refreshed.";
  }

  // IMAGES / VIDEOS / PREVIEWS
  if (lowerMsg.includes("image") || lowerMsg.includes("video") || lowerMsg.includes("see them") || lowerMsg.includes("picture") || lowerMsg.includes("show me")) {
    return "Yes! You can see beautiful images and videos of all our rooms and halls on our **'Accommodation & Facilities'** page and our **'Media Vault'** page right here on the website. Each room has a 'Pulse Preview' video you can watch!";
  }

  // BOOKING / RESERVATION
  if (lowerMsg.includes("book") || lowerMsg.includes("reserve") || lowerMsg.includes("accommodation") || lowerMsg.includes("room") || lowerMsg.includes("stay")) {
    return "To check availability or book your stay, please contact our booking team directly on WhatsApp or Call: **09069168041**. We recommend booking in advance for peak retreat seasons!";
  }

  // LOCATION
  if (lowerMsg.includes("location") || lowerMsg.includes("where") || lowerMsg.includes("address") || lowerMsg.includes("direction")) {
    return "We are located at: **1, CRC Close, End of Ago-Iwoye Street, Off Isawo Road, Agric Bus-Stop, Owutu, Ikorodu, Lagos State**. You can find us on Google Maps as 'Christian Retreat Centre'.";
  }

  // VISION / WHY / MISSION
  if (lowerMsg.includes("why") || lowerMsg.includes("vision") || lowerMsg.includes("mission") || lowerMsg.includes("purpose")) {
    return "Our 'Why' is simple: We believe everyone needs a place to escape the noise and encounter God. Our mission is to provide a serene, premium, and spiritually charged environment for retreats and holy gatherings.";
  }

  // CONTACT
  if (lowerMsg.includes("contact") || lowerMsg.includes("phone") || lowerMsg.includes("whatsapp") || lowerMsg.includes("email")) {
    return "Reach us anytime via:\n" +
           "• WhatsApp/Call: 09069168041\n" +
           "• Email: christianretreatcentrelagos@gmail.com";
  }

  if (lowerMsg.includes("thank")) {
    return "You're very welcome! If you need anything else, I'm here to help. God bless you!";
  }

  // Intelligent Fallback
  return "That's a great question! While I'm still learning every detail, our team can give you a perfect answer immediately. Please message us on WhatsApp at **09069168041** and we'll help you right away!";
}
