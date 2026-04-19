// Chatbot Configuration and Prompt Templates
// Used for role-specific AI responses

export const CHATBOT_CONFIG = {
  roles: {
    official: {
      name: "Barangay Official Assistant",
      welcomeMessage: "Hi! I'm your Barangay Assistant for officials. I can help you with document summaries, resident searches, report generation, blotter assistance, notification management, and more. What do you need?",
      quickPrompts: [
        "How many pending documents today?",
        "Show residents in Purok 3",
        "Generate this week's report",
        "List unpaid document requests",
      ],
      capabilities: [
        "Document management and summaries",
        "Resident information and filtering",
        "Report generation (monthly, weekly, custom)",
        "Blotter case assistance and tracking",
        "Notification management and drafting",
        "Data insights and analytics",
        "Email automation and communication",
      ],
    },
    resident: {
      name: "Barangay Resident Assistant",
      welcomeMessage: "Hi! I'm your Barangay Assistant. I can help you with document requirements, application status, process guidance, announcements, and frequently asked questions. How can I help?",
      quickPrompts: [
        "How do I request a Barangay Clearance?",
        "What is my request status?",
        "What documents do I need?",
        "When is the barangay office open?",
      ],
      capabilities: [
        "Document requirements and guidance",
        "Application status tracking",
        "Process explanation and step-by-step help",
        "Barangay information and services",
        "Announcements and events",
        "FAQs and common questions",
        "Profile management assistance",
      ],
    },
  },

  // Prompt templates for different queries
  prompts: {
    official: {
      dailyStatus: "Summarize today's pending documents, hearings scheduled, and critical tasks.",
      residentSearch: "Filter residents by specified criteria and provide relevant information.",
      reportGeneration: "Generate a professional report for the specified timeframe with relevant data.",
      blotterAssistance: "Provide case management suggestions and next steps for blotter cases.",
      validation: "Check submissions for completeness and flag any missing documents or information.",
      notification: "Draft professional notification messages for residents.",
    },
    resident: {
      documentRequirements: "Explain the document requirements step-by-step for the requested document type.",
      statusTracking: "Provide current status of the resident's application or request.",
      processGuidance: "Explain the process clearly with steps they need to take.",
      barangayInfo: "Provide information about barangay services, hours, and location.",
      announcementHelp: "Simplify and explain announcements in easy language.",
    },
  },

  // System behaviors
  behaviors: {
    maxMessageLength: 2000,
    contextWindow: 10, // Number of previous messages to include in context
    voiceLanguages: ["en-US", "en-PH", "fil-PH", "tl-PH"],
    autoScrollOnMessage: true,
    showTypingIndicator: true,
    allowVoiceInput: true,
    enableCopyResponse: true,
    enableQuickPrompts: true,
    clearChatOnSwitch: false,
  },

  // Error messages
  errors: {
    noMicrophone: "Microphone not available. Please check permissions or use text input.",
    noConnection: "Connection error. Please check your internet and try again.",
    apiError: "Unable to reach the server. Please try again later.",
    invalidQuery: "Please provide a more specific question.",
  },

  // Response guidelines
  guidelines: {
    maxResponseLength: 1000,
    useBulletPoints: true,
    includeActionItems: true,
    disclaimerText: "AI-powered • May make mistakes • Official info from barangay hall",
    linkToOfficialResources: true,
  },
};

// Feature detection and availability
export const FEATURE_FLAGS = {
  voiceInput: typeof window !== "undefined" && "webkitSpeechRecognition" in window,
  copyToClipboard: typeof navigator !== "undefined" && "clipboard" in navigator,
  multiLanguage: true,
  emailIntegration: false, // Requires Gmail API setup
  blockchainVerification: false, // Advanced feature
  faceVerification: false, // Advanced feature
  realTimeDataSync: true, // Connected to Supabase
};

// Common responses and templates
export const RESPONSE_TEMPLATES = {
  documentRequirements: {
    barangayClearance: [
      "Valid ID (Passport, Driver's License, PRC ID, or any government ID)",
      "Proof of Residency (Water bill, Electric bill, or Rent receipt dated within 3 months)",
      "Barangay Residency Certificate (if you haven't registered)",
    ],
    indigency: [
      "Proof of Residency (Water bill, Electric bill, or Rent receipt)",
      "Two (2) letters of recommendation from Barangay officials or neighbors",
      "Identification card or acceptable ID",
    ],
    businessPermit: [
      "Proof of Residency",
      "Valid ID of Business Owner",
      "Business lease or proof of establishment location",
      "DTI Registration or SEC Registration",
      "Proof of payment of municipal tax",
    ],
  },

  processSteps: {
    documentRequest: [
      "1. Identify the document type you need",
      "2. Prepare all required documents",
      "3. Submit your application through the portal or at the barangay hall",
      "4. Pay the processing fee",
      "5. Wait for processing (usually 3-5 business days)",
      "6. Pick up your document when notified",
    ],
    blotterFiling: [
      "1. Go to the Barangay Hall",
      "2. Prepare a clear statement of the incident",
      "3. File the complaint with the Barangay Tanod",
      "4. Wait for the blotter investigation",
      "5. Attend mediation or hearing if scheduled",
      "6. Await resolution",
    ],
  },

  barangayInfo: {
    hours: "Monday - Friday: 8:00 AM - 5:00 PM, Saturday: 8:00 AM - 12:00 PM, Sunday & Holidays: Closed",
    location: "Barangay Santiago Hall, San Antonio, Zambales",
    contact: "Phone: (123) 456-7890, Email: info@brgy-santiago.gov.ph",
    services: [
      "Document requests (Clearance, Indigency, Certificate of Residency)",
      "Blotter services",
      "Business permits",
      "Community announcements",
      "Assistance with government transactions",
    ],
  },
};

export default CHATBOT_CONFIG;
