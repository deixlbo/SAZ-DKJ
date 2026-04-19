// Chatbot Utility Functions
// Helper functions for common operations

import { RESPONSE_TEMPLATES } from "./chatbot-config";

/**
 * Formats a list of items with bullet points or numbers
 */
export function formatList(items: string[], type: "bullet" | "number" = "bullet"): string {
  if (type === "bullet") {
    return items.map((item) => `• ${item}`).join("\n");
  }
  return items.map((item, idx) => `${idx + 1}. ${item}`).join("\n");
}

/**
 * Generates a document checklist response
 */
export function getDocumentChecklist(documentType: string): string {
  const requirements =
    RESPONSE_TEMPLATES.documentRequirements[documentType as keyof typeof RESPONSE_TEMPLATES.documentRequirements];

  if (!requirements) {
    return `I don't have specific requirements for "${documentType}". Please visit the barangay hall or check the portal for more information.`;
  }

  return `Here are the required documents for ${documentType}:\n\n${formatList(requirements)}`;
}

/**
 * Generates a process step-by-step response
 */
export function getProcessSteps(processType: string): string {
  const steps =
    RESPONSE_TEMPLATES.processSteps[processType as keyof typeof RESPONSE_TEMPLATES.processSteps];

  if (!steps) {
    return `I don't have detailed steps for "${processType}". Please contact the barangay hall for guidance.`;
  }

  return `Here's how to ${processType}:\n\n${formatList(steps, "number")}`;
}

/**
 * Summarizes resident data
 */
export function generateResidentSummary(data: {
  totalResidents?: number;
  byPurok?: Record<string, number>;
  activeStatus?: number;
}): string {
  let summary = "📊 Resident Summary:\n\n";

  if (data.totalResidents) {
    summary += `• Total Residents: ${data.totalResidents}\n`;
  }

  if (data.byPurok) {
    summary += "• Distribution by Purok:\n";
    Object.entries(data.byPurok).forEach(([purok, count]) => {
      summary += `  - ${purok}: ${count}\n`;
    });
  }

  if (data.activeStatus) {
    summary += `• Active Status: ${data.activeStatus}\n`;
  }

  return summary;
}

/**
 * Generates a document request summary
 */
export function generateDocumentSummary(data: {
  pending?: number;
  processing?: number;
  approved?: number;
  rejected?: number;
}): string {
  let summary = "📄 Document Request Status:\n\n";

  if (data.pending) summary += `• Pending: ${data.pending}\n`;
  if (data.processing) summary += `• Processing: ${data.processing}\n`;
  if (data.approved) summary += `• Approved: ${data.approved}\n`;
  if (data.rejected) summary += `• Rejected: ${data.rejected}\n`;

  const total = (data.pending || 0) + (data.processing || 0) + (data.approved || 0) + (data.rejected || 0);
  summary += `\n📌 Total: ${total} requests`;

  return summary;
}

/**
 * Generates a blotter case summary
 */
export function generateBlotterSummary(data: {
  pending?: number;
  mediation?: number;
  hearing?: number;
  settled?: number;
  unsettled?: number;
}): string {
  let summary = "⚖️ Blotter Status:\n\n";

  if (data.pending) summary += `• Pending Investigation: ${data.pending}\n`;
  if (data.mediation) summary += `• In Mediation: ${data.mediation}\n`;
  if (data.hearing) summary += `• Scheduled Hearing: ${data.hearing}\n`;
  if (data.settled) summary += `• Settled: ${data.settled}\n`;
  if (data.unsettled) summary += `• Unsettled: ${data.unsettled}\n`;

  const total = (data.pending || 0) + (data.mediation || 0) + (data.hearing || 0) + (data.settled || 0) + (data.unsettled || 0);
  summary += `\n📌 Total: ${total} cases`;

  return summary;
}

/**
 * Detects the intent of a user's query
 */
export function detectQueryIntent(query: string): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("require") || lowerQuery.includes("need") || lowerQuery.includes("document")) {
    return "document_requirements";
  }

  if (lowerQuery.includes("how") || lowerQuery.includes("step") || lowerQuery.includes("process")) {
    return "process_guidance";
  }

  if (lowerQuery.includes("status") || lowerQuery.includes("progress") || lowerQuery.includes("check")) {
    return "status_tracking";
  }

  if (lowerQuery.includes("pending") || lowerQuery.includes("count") || lowerQuery.includes("how many")) {
    return "data_summary";
  }

  if (lowerQuery.includes("time") || lowerQuery.includes("hour") || lowerQuery.includes("open")) {
    return "barangay_info";
  }

  if (lowerQuery.includes("announce") || lowerQuery.includes("event")) {
    return "announcements";
  }

  return "general_inquiry";
}

/**
 * Suggests next actions based on context
 */
export function suggestNextActions(context: string): string[] {
  const suggestions: string[] = [];

  if (context.includes("document")) {
    suggestions.push("Upload required documents");
    suggestions.push("Check submission checklist");
    suggestions.push("Track processing status");
  }

  if (context.includes("blotter") || context.includes("complaint")) {
    suggestions.push("Schedule hearing date");
    suggestions.push("Notify respondent");
    suggestions.push("Generate case summary");
  }

  if (context.includes("resident")) {
    suggestions.push("Filter by Purok");
    suggestions.push("View resident details");
    suggestions.push("Send announcement");
  }

  return suggestions;
}

/**
 * Formats a notification message
 */
export function formatNotification(
  recipientName: string,
  type: "hearing" | "document_ready" | "reminder" | "announcement",
  details: Record<string, any>
): string {
  let message = `Dear ${recipientName},\n\n`;

  switch (type) {
    case "hearing":
      message += `Your scheduled hearing is on ${details.date} at ${details.time}.\n`;
      message += `Location: ${details.location || "Barangay Hall"}\n`;
      message += `Please bring all necessary documents.\n`;
      break;

    case "document_ready":
      message += `Your ${details.documentType} is now ready for pickup.\n`;
      message += `Please come to the barangay hall during office hours.\n`;
      message += `Reference: ${details.referenceNumber}\n`;
      break;

    case "reminder":
      message += `${details.message}\n`;
      message += `Deadline: ${details.deadline}\n`;
      break;

    case "announcement":
      message += `${details.message}\n`;
      if (details.date) message += `Date: ${details.date}\n`;
      if (details.location) message += `Location: ${details.location}\n`;
      break;
  }

  message += `\nFor more information, visit the Barangay Portal or call us at (123) 456-7890.\n\n`;
  message += `Regards,\nBarangay Santiago Administration`;

  return message;
}

/**
 * Validates if a query is appropriate for the chatbot
 */
export function isValidQuery(query: string): boolean {
  // Reject empty or too short queries
  if (!query || query.trim().length < 3) {
    return false;
  }

  // Reject inappropriate content
  const inappropriatePhrases = ["hate", "violence", "illegal"];
  const hasInappropriate = inappropriatePhrases.some((phrase) => query.toLowerCase().includes(phrase));

  return !hasInappropriate;
}

/**
 * Generates a disclaimer for specific response types
 */
export function addDisclaimer(responseType: "legal" | "official" | "general"): string {
  switch (responseType) {
    case "legal":
      return "\n\n⚠️ This is general information. For legal matters, please consult with an official at the barangay hall.";

    case "official":
      return "\n\n✓ This information is verified. Official documents should be obtained from the barangay hall.";

    default:
      return "\n\n💡 This is AI-generated information. Please verify with official sources.";
  }
}

/**
 * Translates response to Filipino (simple version)
 */
export function translateToFilipino(text: string): string {
  // This is a simplified example - in production, use a proper translation service
  const translations: Record<string, string> = {
    "good morning": "magandang umaga",
    "how can i help": "paano po ako makakatulong",
    "please visit": "mangyaring bisitahin",
    "thank you": "maraming salamat",
  };

  let translated = text;
  Object.entries(translations).forEach(([english, tagalog]) => {
    translated = translated.replace(new RegExp(english, "gi"), tagalog);
  });

  return translated;
}

export default {
  formatList,
  getDocumentChecklist,
  getProcessSteps,
  generateResidentSummary,
  generateDocumentSummary,
  generateBlotterSummary,
  detectQueryIntent,
  suggestNextActions,
  formatNotification,
  isValidQuery,
  addDisclaimer,
  translateToFilipino,
};
