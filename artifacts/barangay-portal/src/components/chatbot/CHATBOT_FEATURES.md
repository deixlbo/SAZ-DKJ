# Barangay AI Chatbot - Feature Guide

## Overview
The Barangay Santiago AI Assistant is an intelligent chatbot integrated into both the Official and Resident portals. It provides context-aware help, real-time information, and process guidance.

---

## For Barangay Officials

### 1. Smart Assistant for Daily Tasks
**What it does:** Acts like a digital staff assistant answering quick questions.

**Example queries:**
- "How many pending documents today?"
- "Show residents in Purok 3"
- "Generate report for this week"
- "List unpaid document requests"

**Benefits:** Saves time navigating dashboards for quick lookups.

---

### 2. Real-Time Data Insights
**What it does:** Connected to your Supabase database, providing instant summaries.

**Can retrieve:**
- Total residents count
- Active blotter cases
- Document request status breakdown
- Residents by Purok
- Payment status

**Example:** "You have 23 pending requests and 5 hearings scheduled today"

---

### 3. Auto Report Generator
**What it does:** Generate professional reports without manual compilation.

**Generates:**
- Monthly document summaries
- Blotter case summaries
- Resident statistics
- Output formats: Printable layouts, Excel-ready data

---

### 4. Document Assistance
**What it does:** Explains requirements and validates submissions.

**Features:**
- Explains document requirements
- Suggests required attachments
- Flags incomplete submissions
- Provides submission checklists

**Example:** "What is needed for Barangay Clearance?" → Lists all requirements instantly

---

### 5. Blotter Case Assistance
**What it does:** Streamlines case management workflows.

**Features:**
- Suggest next steps (mediation, hearing scheduling)
- Auto-generate case summaries
- Help write formal blotter descriptions
- Track case status

---

### 6. Notification Assistant
**What it does:** Manages who needs to be notified and what message to send.

**Features:**
- Suggests who to notify (respondents, residents, complainants)
- Generates message content templates
- Drafts notification emails

**Example:** "Create a hearing notification for Juan Dela Cruz on April 25"

---

### 7. Resident Search & Insights
**What it does:** Advanced filtering without manual search.

**Can filter by:**
- Senior citizens in specific Purok
- Residents without submitted documents
- Residents by civil status
- Residents by address

**Benefits:** Faster targeting for announcements and services.

---

### 8. Event & Announcement Generator
**What it does:** Creates professional announcements automatically.

**Features:**
- Create event announcements
- Suggest event wording
- Professional formatting
- Multi-language support (English/Filipino)

**Example:** "Create announcement for barangay clean-up drive on May 1"

---

### 9. Smart Validation Assistant
**What it does:** Catches errors before processing.

**Flags:**
- Missing documents
- Incorrect submissions
- Incomplete data
- Suggests corrections

---

### 10. Email Automation (Gmail Integration Ready)
**What it does:** Draft and send emails to residents.

**Features:**
- Draft emails to specific residents
- Request missing documents
- Send notifications
- Track sent communications

**Example:** "Request missing ID from Juan Dela Cruz"

---

## For Residents

### 1. Guided Assistant (Step-by-Step Help)
**What it does:** Personal guide for completing tasks.

**Example:** "How do I request a Barangay Clearance?" 
Response: Step-by-step instructions → Required documents → Upload guide

---

### 2. Document Request Assistant
**What it does:** Guides residents through document requests.

**Features:**
- Choose correct document type
- Understand requirements
- Upload guide
- Prevents incomplete submissions

---

### 3. Smart Checklist System
**What it does:** Interactive tracking of required documents.

**Features:**
- Shows all required documents
- Tracks completed uploads
- Cannot submit without all documents (enforced)
- Shows what's missing

**Example:** 
- ❌ Valid ID
- ✓ Proof of Residency
- ❌ Income Certificate

---

### 4. Request Status Tracker
**What it does:** Instant status updates without checking dashboard.

**Can ask:**
- "What is the status of my request?"
- "Is my clearance ready?"
- "When will my documents be processed?"

Response: Pending / Processing / Approved / Ready for Pickup

---

### 5. Notification Assistant
**What it does:** Explains notifications clearly.

**Features:**
- Simplifies notification language
- Reminds about missing requirements
- Alerts for upcoming events
- Tracks deadlines

---

### 6. Barangay Information Assistant
**What it does:** Answers common questions.

**Can answer:**
- Office hours
- Office location
- Available services
- Contact information
- Holiday schedules

**Example:** "When is Barangay Santiago open?" "Where is the office?"

---

### 7. Announcements Explainer
**What it does:** Simplifies formal announcements.

**Features:**
- Converts formal language to easy language
- Explains what you need to do
- Highlights deadlines
- Great for seniors or non-tech users

---

### 8. Blotter Guidance (Resident Side)
**What it does:** Explains mediation/hearing process transparently.

**Can explain:**
- How to file a complaint
- What happens in mediation
- Hearing procedures
- Your rights and responsibilities

---

### 9. Personal Profile Assistant
**What it does:** Help managing your profile.

**Can help with:**
- "What is my registered information?"
- "How do I update my details?"
- "How do I change my password?"

---

### 10. Event & Participation Helper
**What it does:** Discover and join barangay events.

**Features:**
- Show nearby events
- Explain how to join
- Send reminders

**Example:** "What events can I join this week?"

---

### 11. Email & Request Helper
**What it does:** Help composing professional requests.

**Features:**
- Help write requests
- Draft emails to officials
- Format documents
- Improve language

---

### 12. Multilingual Support
**What it does:** Respond in preferred language.

**Supports:**
- English
- Filipino (Tagalog)
- Taglish

**Example:** "Pwede ba ako kumuha ng clearance?" (Can I get a clearance?)

---

### 13. Voice Assistant (Optional)
**What it does:** Hands-free interaction.

**Features:**
- Speak your question
- AI understands Philippine English/accent
- Great for seniors or busy residents
- Responds with text

---

## How to Use Voice Input

1. Click the **Microphone icon** in the chatbot
2. Speak your question clearly
3. The AI will transcribe and respond
4. Works with: English, Tagalog, Taglish

**Pro tip:** Works even with accents and colloquial language!

---

## Quick Tips

- Use **Copy button** on responses to save helpful information
- **Quick prompts** appear at the start - click any for instant answers
- **Clear chat** button resets conversation (Trash icon)
- Messages are **not stored permanently** - for privacy
- Always verify official info at the barangay hall

---

## Limitations

- AI may make mistakes - verify official documents with barangay staff
- Works best with clear, specific questions
- Cannot process complex legal matters (refer to officials)
- Internet connection required
- Voice input requires microphone permission

---

## Contact & Support

For issues or feedback about the chatbot:
1. Contact the Barangay Office directly
2. Report via the portal's support section
3. Visit during office hours

---

**Last Updated:** April 2026
**Version:** 2.0 (Enhanced with voice input, voice features, and role-based assistance)
