
# 🧭 GeoQuest AI - Kutaisi Edition 🇬🇪

**An AI-powered, gamified city guide for guests of Mari Apartment in Kutaisi, Georgia.**

---

## 💡 Inspiration
As a host in Kutaisi, I often found my guests overwhelmed by the city's history or struggling with language barriers. They would miss the subtle magic of the **White Bridge** or get lost trying to find the **Green Bazaar**. I wanted to be their personal guide 24/7, but I couldn't clone myself.

That's when **GeoQuest AI** was born. I wanted to turn tourism into a treasure hunt—combining the thrill of "Pokémon GO" with the depth of a professional tour guide, all powered by the latest AI to make the experience seamless and magical.

## 📱 What it does
GeoQuest is a Progressive Web App (PWA) that transforms Kutaisi into an open-world game:

1.  **AI Vision Scanner:** Guests point their camera at a landmark (like the Bagrati Cathedral). The app sends the image + GPS coordinates to **Gemini 3 Flash**, which visually confirms the location and validates the "quest."
2.  **Smart Audio Guide:** Once a location is found, the app generates an instant audio narration using **Gemini 2.5 Flash TTS**, telling the history and hidden legends of the spot.
3.  **Digital Passport:** Users collect digital stamps and earn XP for every discovery. Leveling up unlocks real rewards (like a "Grandma's Kitchen" recipe book with secret Khinkali recipes).
4.  **The "Driver Card":** A utility feature that displays the destination in large, bold Georgian text to show taxi drivers, bridging the language gap instantly.
5.  **Concierge:** An AI-curated list of the best local spots (restaurants, cafes) that I personally recommend as a host.

## ⚙️ How we built it
The app is built on a modern, high-performance stack:

*   **Frontend:** React 19 + Vite for a blazing fast UI, styled with Tailwind CSS for that premium "glassmorphism" look.
*   **The Brain (AI):** We used the **Google GenAI SDK**.
    *   `gemini-3-flash-preview`: Used for the **Vision Scanner**. It analyzes the video frame relative to the user's GPS to prevent "hallucinations" (ensuring a wall isn't mistaken for a castle).
    *   `gemini-2.5-flash-preview-tts`: Powers the **Audio Guide**.
*   **Maps:** `react-leaflet` with OpenStreetMap, customized with a proximity radar to guide users to hidden gems.
*   **Backend:** Firebase Authentication (Google/Guest login) and Firestore for the real-time leaderboard and user progress tracking.
*   **Resilience:** We implemented a "Hybrid Audio System". If the AI API hits a rate limit, the app seamlessly falls back to the browser's native `SpeechSynthesis` API, ensuring the user is never left in silence.

## 🚧 Challenges we ran into
*   **AI Rate Limits:** During testing, we hit the free tier quota for the Gemini API, causing the audio to crash. **Fix:** We built a fallback mechanism that switches to the device's offline Text-to-Speech engine if the API returns a 429 error.
*   **GPS vs. Vision:** Sometimes the AI would identify a photo correctly, but the user was 5km away (using a photo of a photo). **Fix:** We added strict geospatial grounding—the AI vision result is cross-referenced with the device's physical coordinates.
*   **iOS Safari Quirks:** The camera scanner initially showed a black screen on iPhones because of Apple's strict autoplay policies. **Fix:** We had to explicitly add `playsInline` and ensuring user interaction before audio playback.

## 🏆 Accomplishments that we're proud of
*   **The "Driver Card":** It's a simple feature, but beta testers loved it the most. It solves a real, anxiety-inducing problem for tourists.
*   **Aesthetics:** We achieved a polished, native-app feel using CSS animations (scanners, floating cards) inside a web browser.
*   **The "Grandma's Kitchen" Unlockable:** Gamifying culture—locking recipes behind exploration—proved to be a huge motivator for users to walk more steps.

## 🧠 What we learned
*   **Prompt Engineering is UI:** The way the AI responds (JSON structure) dictates the entire frontend experience. Strict system instructions are crucial.
*   **PWA Power:** You don't need a native app store to build a powerful mobile experience. Modern web APIs (Camera, Geolocation, Speech) are incredibly capable.
*   **Context Matters:** AI Vision is 10x more accurate when you feed it the user's GPS context ("I am likely near Bagrati Cathedral, is this it?") rather than asking blindly ("What is this?").

## 🚀 What's next for GeoQuest
*   **AR Arrows:** Overlaying walking directions on the camera view using basic AR.
*   **Social Quests:** Allow guests staying at the apartment to form teams and compete on the leaderboard together.
*   **Multi-Language Support:** Using Gemini to translate the guide into German, Russian, and French in real-time.
*   **Monetization:** Partnering with the listed restaurants to offer real-world discounts to users who reach Level 5.

---

### 🛠️ Tech Stack Overview

*   **Frontend:** React 19, Vite, TypeScript
*   **Styling:** Tailwind CSS
*   **AI:** Google Gemini API (`@google/genai`)
*   **Maps:** React Leaflet
*   **Backend:** Firebase

*Designed and Developed in Kutaisi, Georgia by Mariam Bukhaidze.*
