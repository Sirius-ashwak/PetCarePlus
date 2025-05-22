
# PetPal - Your AI-Powered Pet Companion 🐾

PetPal is a Next.js web application designed to help pet owners manage their pets' health, routines, and memories with the assistance of AI-powered tools.

## ✨ Features

*   **User Authentication**: Mock user login and signup.
*   **Pet Profiles**: Create, view, update, and delete profiles for multiple pets, including photo uploads.
*   **Daily Logs**: Track your pet's mood, eating habits, elimination, and activity.
*   **AI Symptom Checker**: Get AI-powered insights into your pet's symptoms. (Powered by Genkit & Gemini)
    *   Includes a tool to fetch (simulated) breed-specific health issues.
*   **AI Pet Name Generator**: Find the perfect name for your new companion. (Powered by Genkit & Gemini)
*   **AI Breed Identifier**: Upload a pet photo to identify its breed and learn more. (Powered by Genkit & Gemini)
*   **AI Voice Assistant ("Pal")**: Ask "Pal" your pet care questions via text input. (Powered by Genkit & Gemini)
*   **Pet Routine Scheduler**: Set and manage reminders for feeding, walks, medications, appointments, etc.
*   **Pet Memories Journal**: Upload photos with notes and dates to capture special moments with your pets.
*   **Emergency Hub**:
    *   Manage emergency contacts (vets, clinics, sitters).
    *   Vet Locator page with an integrated Google Map (search functionality pending).
*   **Allergies & Diet Information**: Static information page about common pet food allergies and safe/unsafe foods for dogs and cats.
*   **Light/Dark Theme Toggle**: User-selectable interface theme.
*   **Responsive Design**: UI adapts to different screen sizes.

## 🛠️ Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **AI Integration**: [Genkit (Firebase AI Logic)](https://firebase.google.com/docs/genkit) with Google's Gemini models.
*   **Backend**: [Firebase](https://firebase.google.com/)
    *   **Database**: Cloud Firestore
    *   **Storage**: Firebase Storage (for pet photos and memories)
    *   **Hosting**: (Assumed, standard for Firebase projects)
*   **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation.
*   **State Management**: React Context API (for Auth and App Data).
*   **Theme Switching**: `next-themes`

## 🚀 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (version 18.x or later recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   A Firebase project.

### 1. Firebase Project Setup

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project (or use an existing one).
2.  In your Firebase project, enable the following services:
    *   **Cloud Firestore** (Native mode).
    *   **Firebase Storage**.
    *   **Firebase Authentication** (even though we use mock auth now, it's good to enable for future App Check and real auth integration).
3.  **Register your Web App**:
    *   In Project settings, add a new Web App.
    *   Note down the Firebase configuration object provided.
4.  **App Check**:
    *   It's highly recommended to set up App Check for security.
    *   Go to "App Check" in the Firebase console.
    *   Register your web app, typically using the **reCAPTCHA Enterprise** provider. You'll need to enable the reCAPTCHA Enterprise API in your Google Cloud project and get a site key.
    *   Enforce App Check for Cloud Firestore, Authentication, and Firebase AI Logic (Vertex AI).

### 2. Google AI Studio API Key (for Genkit)

1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Create a new API key for your project. This key will be used by Genkit to access Google's Gemini models.

### 3. Google Maps API Key

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Ensure your project (the same one linked to Firebase) has billing enabled.
3.  Enable the **Maps JavaScript API** and **Places API (New)** for your project.
4.  Create an API key and restrict it to these APIs and your web app's domain for security.

### 4. Clone the Repository

```bash
git clone <repository-url>
cd petpal-project # Or your project's directory name
```

### 5. Install Dependencies

```bash
npm install
# or
yarn install
```

### 6. Environment Variables

Create a `.env.local` file in the root of your project and add your Firebase project configuration and API keys:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
# NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_FIREBASE_MEASUREMENT_ID # Optional

# Google AI Studio API Key (for Genkit)
GOOGLE_API_KEY=YOUR_GOOGLE_AI_STUDIO_API_KEY

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

Replace `YOUR_...` with your actual keys and configuration values.
**Important**: Ensure `.env.local` is added to your `.gitignore` file to prevent committing secrets.

### 7. Firebase Security Rules

You **MUST** set up security rules for Firestore and Firebase Storage to protect user data.

**Firestore Rules (`firestore.rules`):**
Refer to the [Firebase Console](https://console.firebase.google.com/) -> Your Project -> Firestore Database -> Rules.
A secure set of rules based on implemented features is:
```json
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pets/{petId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /logs/{logId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /reminders/{reminderId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /memories/{memoryId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /emergencyContacts/{contactId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```
**Note on Mock Auth**: The current application uses mock authentication. The `request.auth` object in these rules will be `null`. For development with mock auth, you might need to use temporarily permissive rules (e.g., `allow read, write: if true;` for relevant paths). Transition to real Firebase Authentication for these secure rules to function as intended.

**Firebase Storage Rules (`storage.rules`):**
Refer to the [Firebase Console](https://console.firebase.google.com/) -> Your Project -> Storage -> Rules.
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/pets/{petId}/profile/{fileName} {
      allow read;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId}/pets/{petId}/memories/{memoryId}/{fileName} {
      allow read;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 8. Running the Application

**Development Mode:**

There are two main processes to run: the Next.js frontend and the Genkit development server for AI flows.

1.  **Start the Next.js frontend:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    This will typically start the app on `http://localhost:9002`.

2.  **Start the Genkit development server (in a separate terminal):**
    ```bash
    npm run genkit:dev
    # or (for auto-reloading on Genkit flow changes)
    npm run genkit:watch
    ```
    This starts the Genkit server, usually on `http://localhost:3400`. The Next.js app is configured to proxy AI requests to this server.

**Production Build:**

```bash
npm run build
npm run start
```
For production, Genkit flows are typically deployed as Firebase Cloud Functions. Refer to Genkit documentation for deployment strategies.

## 🤖 Genkit (AI Flows)

*   Genkit flows are located in `src/ai/flows/`.
*   The main Genkit configuration is in `src/ai/genkit.ts`.
*   The `src/ai/dev.ts` file is used to import and run flows during local development with `genkit start`.
*   AI flows use the `googleAI` plugin to connect to Google's Gemini models. Ensure your `GOOGLE_API_KEY` is set in `.env.local`.

## 📜 Scripts

*   `npm run dev`: Starts the Next.js development server (Turbopack enabled, port 9002).
*   `npm run genkit:dev`: Starts the Genkit development server.
*   `npm run genkit:watch`: Starts the Genkit development server with file watching.
*   `npm run build`: Builds the Next.js application for production.
*   `npm run start`: Starts the Next.js production server.
*   `npm run lint`: Runs Next.js ESLint.
*   `npm run typecheck`: Runs TypeScript type checking.

## 💡 Future Enhancements (from User Wishlist)

*   Push notification alerts for Reminders.
*   Community & Adoption Hub.
*   Pet Tracker Integration.
*   Pet Essentials Marketplace.
*   Emergency Medical Guide.
*   Health Analytics Dashboard.
*   Multi-language Support.
*   Pet Sharing Mode.
*   Offline Mode & Data Sync.
*   Real Firebase Authentication.

## 🤝 Contributing

This project is currently under development. Contributions, issues, and feature requests are welcome!

---

Happy PetPal-ing! 🐕🐈
