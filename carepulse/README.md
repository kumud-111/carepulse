# CAREPULSE – PATIENT-FRIENDLY WEB APP & SYMPTOM CHECKER

**CAREPULSE** is an advanced web application bridging accessibility gaps between patients and primary healthcare services. It features a multi-language interface (English, हिन्दी, தமிழ், తెలుగు, ಕನ್ನಡ, മലയാളം, मराठी, ગુજરાતી, বাংলা, ਪੰਜਾਬੀ), an interactive tap-on-body symptom checker, 30+ health guides, a hierarchical city-wise doctor directory (17 states, 396 providers), and appointment booking.

## TECH STACK & ARCHITECTURE

* **BACKEND:** Spring Boot 3, Java 17, RESTful APIs, Spring Security (JWT-ready).
* **FRONTEND:** React (Vite) with responsive UI components.
* **DATABASE:** H2 Database (optional PostgreSQL migration support).

## CORE FEATURES

1. **TAP-ON-BODY SYMPTOM CHECKER:** Visual body map enabling symptom selection and rule-based preliminary guidance.
2. **MULTILINGUAL SUPPORT:** Full interface translation across 10 regional languages, saving preferences directly to user accounts.
3. **SAFETY RED-FLAG SYSTEM:** Instantly flags emergency symptoms (chest pain, breathing difficulty, stroke signs) directing users to helplines (`112`, `108`, Tele-MANAS `14416`).
4. **HEALTH GUIDE:** Structured details on 30+ common illnesses, home care tips, and bilingual warning signs.
5. **VERIFIED DOCTOR DIRECTORY:** State $\rightarrow$ City $\rightarrow$ Area doctor search filtering by specialty, fee, rating, and address with slot booking.

## LOCAL RUNNING INSTRUCTIONS (POWERSHELL)

### TERMINAL 1 – BACKEND:
```powershell
cd backend
mvn spring-boot:run
```
*(Wait for `"Started CarePulseApplication"`)*

### TERMINAL 2 – FRONTEND:
```powershell
cd frontend
npm install
npm run dev
```
*(Open `http://localhost:5173`)*

## DEMO LOGIN & ENVIRONMENT VARIABLES

* **PATIENT ACCOUNT:** Register directly from the web interface.
* **DEMO DOCTOR:** `dr.sharma@carepulse.test` / `Doctor@123`
* **OPTIONAL API:** `$env:GEMINI_API_KEY="your_key"` (adds a plain-language note to triage).
