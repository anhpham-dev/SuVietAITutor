export const config = {
    firebase: {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    },
    ai: {
        geminiKey: import.meta.env.VITE_GEMINI_API_KEY,
        veoKey: import.meta.env.VITE_VEO_API_KEY,
    },
    admin: {
        email: import.meta.env.VITE_ADMIN_EMAIL,
    }
};
