# TARI WB: Whistleblower Compliance Tracking Demo

Welcome to the TARI WB (Whistleblower Compliance Tracking) interactive demo! This platform is designed for organizations to securely receive, triage, and investigate whistleblower reports. 

This guide will walk you through how to use and demonstrate the platform's features.

---

## 🚀 Getting Started

Since this is a local Next.js application, ensure the development server is running:

```bash
npm install
npm run dev
```

Navigate to `http://localhost:3000` in your web browser.

---

## 👤 Authentication (Personas)

The demo uses an entirely in-memory state management system (Zustand). There is no actual backend database, meaning **all data resets if you refresh the page**. 

When you first load the app, you will land on the **Interactive Demo Login** (Role Selector). You can choose between different personas to experience the platform:

1. **Investigator (e.g., Rohan Mehta, Ananya Rao)**: 
   - Has access to investigate specific cases, correspond with whistleblowers, and leave internal notes.
   - The "Cases" view filters down to "My Cases" (cases assigned specifically to them).
2. **SysAdmin (e.g., Priya Sharma)**:
   - Has a global view of all cases across all organizations.
   - Can access system-wide audit logs and configuration.

Click on a persona card to immediately "log in" and enter the platform.

---

## 🧭 Navigating the Platform

Once logged in, use the left sidebar to navigate through the core modules:

### 1. Dashboard
Your command center. It provides a high-level compliance overview:
- **Metrics**: Total open cases, cases needing triage, high/critical severity cases, and average resolution time.
- **Recent Cases**: A quick-access table of recently updated cases (ordered by Organization).
- **Unlinked Hotline Calls**: Recent voicemails or hotline transcripts that haven't yet been attached to a specific case.

### 2. Intake Queue
The staging area for brand new reports. When a new email or hotline call is received by the system, it lands here. Investigators review these items, classify them, and either create a new case or link them to an existing one.

### 3. All Cases / My Cases
A structured directory of active and closed investigations.
- **Organization Buckets**: First, you will see cards for each client organization (e.g., Acme Corp, Globex Inc) along with their total case count.
- **Case Directory**: Clicking an organization reveals a table of cases specific to that company. 
- Click on any blue **Case Number** to enter the detailed Case View.

### 4. Unlinked Calls
A dedicated space to review raw hotline audio/transcripts. From here, you can listen to the calls and formally attach them to an ongoing investigation.

---

## 🔎 Deep Dive: The Case View

When you click on a specific case (e.g., `TARI-2023-0041`), you enter the **Case Details Workspace**. This is where the actual investigation happens. It features several tabs:

- **Overview**: Shows the core report details, severity, status, incident date, and the assigned investigators.
- **Correspondence**: Simulates a secure, anonymous messaging portal between the investigator and the whistleblower. 
- **Internal Notes**: Private comments visible only to staff/investigators. Use this to document evidence, strategy, or internal findings.
- **Audit Log**: An immutable, chronological record of every action taken on the case (e.g., "Status changed", "Note added"). 

---

## 🎮 Interactive Features to Try

To get the most out of the demo, try performing the following actions:

1. **Simulate a New Report**
   - Click the **"Simulate Incoming Email"** button in the top right navigation bar.
   - This triggers a mock webhook that injects a brand new case into the system.
   - Check the **Dashboard** or **Intake Queue** to see it instantly appear!

2. **Correspond with a Whistleblower**
   - Open a case, navigate to the **Correspondence** tab, and type a message.
   - Notice how your message is logged with your persona's name and a timestamp.

3. **Leave an Internal Note**
   - Switch to the **Internal Notes** tab on a case.
   - Add a note detailing your "investigation findings." Check the **Audit Log** to see your action recorded automatically.

4. **Switch Personas**
   - Click your user profile in the bottom left corner of the sidebar and click **"Log out"**.
   - Select a different persona (e.g., switch from Investigator to SysAdmin) and notice how the dashboard metrics and accessible cases change based on your role permissions.

---

## 🛠️ Technical Notes

- **Tech Stack**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui, Zustand, Framer Motion, Lucide React.
- **Data**: All mock data (users, cases, logs) is stored in `src/lib/mock-data.ts`. The data is highly detailed and spans several months to simulate a realistic production environment.
- **Resetting**: To reset the demo to its pristine state, simply refresh your browser window (`Cmd + R` or `Ctrl + R`).
