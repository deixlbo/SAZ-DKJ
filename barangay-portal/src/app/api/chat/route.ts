export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Simple response for now - integrate with OpenAI in production
    const responses: Record<string, string> = {
      "barangay clearance": "To request a Barangay Clearance, you need: 1) Valid ID, 2) Proof of residency, 3) Pay the processing fee. Visit the Barangay Hall during office hours.",
      "how do i register": "You can register online through this portal or visit the Barangay Hall with your ID and proof of residency.",
      "office hours": "Barangay Hall office hours: Monday-Friday 8:00 AM - 5:00 PM, Saturday 8:00 AM - 12:00 PM",
      "blotter": "To file a blotter, visit the Barangay Hall or contact the Barangay Tanod. Provide incident details and involved parties.",
      "documents": "Available documents: Barangay Clearance, Residency Certificate, Business Permit, Good Moral Character.",
    };

    let response = "I'm here to help! You can ask about document requirements, processes, office hours, or any barangay services.";
    
    for (const [key, value] of Object.entries(responses)) {
      if (message.toLowerCase().includes(key)) {
        response = value;
        break;
      }
    }

    return Response.json({ response });
  } catch (error) {
    return Response.json({ response: "Sorry, I couldn't process your request. Please try again." }, { status: 500 });
  }
}
