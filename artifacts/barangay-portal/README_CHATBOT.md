# Barangay AI Chatbot Implementation Guide

## Overview

The Barangay Santiago Chatbot is an AI-powered assistant that serves both officials and residents with role-specific help, real-time information, and process guidance.

## Architecture

### Components

```
src/
├── components/
│   └── chatbot/
│       ├── chatbot.tsx           # Main chatbot component
│       └── CHATBOT_FEATURES.md   # Feature documentation
├── lib/
│   ├── chatbot-config.ts         # Configuration and prompts
│   └── chatbot-utils.ts          # Utility functions
└── api/
    └── openai/                   # OpenAI API integration
```

### Technology Stack

- **Frontend**: React + TypeScript
- **AI Engine**: OpenAI GPT API (via conversational API)
- **Database**: Supabase (for context and data)
- **Voice Input**: Web Speech API
- **State Management**: React Hooks

## Features

### For Officials

1. **Smart Daily Dashboard**
   - Quick stats on pending documents
   - Resident count by Purok
   - Blotter case status
   - Hearing schedule

2. **Resident Management**
   - Search residents by Purok, age, status
   - View detailed profiles
   - Filter by criteria

3. **Report Generation**
   - Monthly summaries
   - Document statistics
   - Blotter analytics
   - Export to Excel/PDF

4. **Case Management**
   - Blotter case summaries
   - Suggested next steps
   - Hearing scheduling assistance
   - Auto-generate notifications

5. **Validation & Quality Control**
   - Flag incomplete submissions
   - Verify document requirements
   - Check data accuracy

### For Residents

1. **Document Guidance**
   - Step-by-step instructions
   - Required documents checklist
   - Upload guides
   - Prevent incomplete submissions

2. **Status Tracking**
   - Request progress
   - Processing timeline
   - Pickup notifications
   - Deadline reminders

3. **Process Explanation**
   - How to file a blotter complaint
   - Mediation process
   - Hearing procedures
   - Rights and responsibilities

4. **General Information**
   - Office hours and location
   - Available services
   - Contact information
   - FAQ answers

## Usage

### Basic Implementation

```tsx
import { Chatbot } from "@/components/chatbot/chatbot";

export function MyPage() {
  return (
    <>
      <YourContent />
      <Chatbot />
    </>
  );
}
```

The chatbot is already integrated in `App.tsx` and available globally.

### Configuration

Edit `src/lib/chatbot-config.ts` to:

- Change welcome messages
- Modify quick prompts
- Add new capabilities
- Update response templates

```typescript
import { CHATBOT_CONFIG } from "@/lib/chatbot-config";

// Access configuration
const officialConfig = CHATBOT_CONFIG.roles.official;
const residentQuickPrompts = CHATBOT_CONFIG.roles.resident.quickPrompts;
```

### Utility Functions

```typescript
import {
  formatList,
  getDocumentChecklist,
  generateBlotterSummary,
  detectQueryIntent,
  formatNotification,
} from "@/lib/chatbot-utils";

// Generate formatted responses
const checklist = getDocumentChecklist("barangayClearance");
const summary = generateBlotterSummary({ pending: 5, hearing: 3 });

// Detect user intent
const intent = detectQueryIntent("How do I request a clearance?");

// Format notifications
const notification = formatNotification("Juan Dela Cruz", "hearing", {
  date: "April 25, 2026",
  time: "2:00 PM",
  location: "Barangay Hall",
});
```

## Voice Input

The chatbot supports hands-free interaction using Web Speech API:

```typescript
// Automatically handled by the component
// User clicks microphone icon → speaks question → AI responds
```

**Supported Languages:**
- English (US)
- English (Philippine)
- Filipino/Tagalog
- Taglish

**Requirements:**
- Microphone access (browser permission)
- Chrome, Edge, or Safari

## API Integration

The chatbot connects to OpenAI's conversational API through `src/api/openai/`:

```typescript
// Create conversation
POST /api/openai/conversations
{
  "title": "Barangay Assistant Chat"
}

// Send message
POST /api/openai/conversations/{id}/messages
{
  "content": "How many pending documents today?"
}

// Response (streaming)
data: { "content": "Based on the database..." }
```

## Role-Based Behavior

The chatbot automatically detects the user's role and adapts:

```typescript
const { userData } = useAuth();
const isOfficial = userData?.role === "official";

// Different welcome messages
const welcome = isOfficial 
  ? OFFICIAL_WELCOME 
  : RESIDENT_WELCOME;

// Different quick prompts
const prompts = isOfficial 
  ? QUICK_PROMPTS_OFFICIAL 
  : QUICK_PROMPTS_RESIDENT;

// Different system prompts for context
const systemPrompt = buildContextPrompt(message);
```

## Customization

### Add New Quick Prompts

```typescript
// In chatbot-config.ts
export const CHATBOT_CONFIG = {
  roles: {
    official: {
      quickPrompts: [
        "Your new prompt here",
        "Another prompt",
      ],
    },
  },
};
```

### Add Document Requirements

```typescript
// In chatbot-config.ts
RESPONSE_TEMPLATES.documentRequirements.yourDocument = [
  "Requirement 1",
  "Requirement 2",
];
```

### Add New Response Template

```typescript
// In chatbot-utils.ts
export function generateYourSummary(data): string {
  // Your formatting logic
  return formatted;
}
```

## Advanced Features (Future)

### Real-Time Data Integration
```typescript
// Connect to Supabase for live data
const { data: residents } = await supabase
  .from("residents")
  .select("*")
  .eq("purok", "Purok 3");
```

### Email Automation
```typescript
// Draft and send emails to residents
const email = formatNotification(name, "document_ready", details);
await sendEmail(resident.email, email);
```

### Predictive Analytics
```typescript
// Analyze trends and suggest improvements
const peakHours = analyzeRequestTrends();
const suggestions = generateSuggestions(peakHours);
```

### Multi-Language Support
```typescript
// Translate responses automatically
const response = await translateResponse(aiResponse, "fil-PH");
```

## Performance Optimization

- **Message Caching**: Stores recent responses in localStorage
- **Streaming Responses**: Avoids waiting for full response
- **Lazy Loading**: Chat widget loads only when opened
- **Conversation Reuse**: Maintains conversation ID for context

## Security Considerations

- No sensitive data stored in chat (PII not logged)
- All API calls use HTTPS
- User role verification before serving role-specific data
- Rate limiting on API calls
- Conversation IDs are session-based

## Accessibility

- Keyboard navigation support
- Voice input for accessibility
- Screen reader friendly
- High contrast colors
- Clear error messages

## Troubleshooting

### Chatbot not responding
1. Check internet connection
2. Verify OpenAI API is running
3. Check browser console for errors

### Voice input not working
1. Grant microphone permission
2. Use supported browser (Chrome, Edge, Safari)
3. Check microphone is plugged in

### Wrong responses
1. Try more specific questions
2. Clear chat and start fresh
3. Verify data is correctly loaded

## Testing

```typescript
// Test in console
import { detectQueryIntent } from "@/lib/chatbot-utils";

console.log(detectQueryIntent("How do I get a clearance?"));
// Output: "process_guidance"

console.log(detectQueryIntent("How many pending?"));
// Output: "data_summary"
```

## Deployment

The chatbot is automatically deployed with the main application. No special configuration needed.

## Support & Feedback

For issues or improvements:
1. Check CHATBOT_FEATURES.md for usage guide
2. Review test cases in chatbot-utils.ts
3. Contact development team
4. Report bugs with console logs

## Version History

- **v2.0** (April 2026): Enhanced with voice input, copy responses, quick prompts
- **v1.0** (February 2026): Initial release with basic Q&A

## License

All chatbot code is part of the Barangay Santiago Portal project.
