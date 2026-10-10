// Interface languages. Each language lists the states where it is the main local language.
// To add a language: add an entry here and a block in NATIVE (missing keys fall back to English).
export const LANGS = [
  { code: 'EN', label: 'English', locale: 'en-IN', states: [] },
  { code: 'HI', label: 'हिन्दी', locale: 'hi-IN', states: ['Delhi', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Bihar', 'Haryana', 'Uttarakhand', 'Himachal Pradesh', 'Jharkhand', 'Chhattisgarh'] },
  { code: 'TA', label: 'தமிழ்', locale: 'ta-IN', states: ['Tamil Nadu', 'Puducherry'] },
  { code: 'TE', label: 'తెలుగు', locale: 'te-IN', states: ['Telangana', 'Andhra Pradesh'] },
  { code: 'KN', label: 'ಕನ್ನಡ', locale: 'kn-IN', states: ['Karnataka'] },
  { code: 'ML', label: 'മലയാളം', locale: 'ml-IN', states: ['Kerala'] },
  { code: 'MR', label: 'मराठी', locale: 'mr-IN', states: ['Maharashtra'] },
  { code: 'GU', label: 'ગુજરાતી', locale: 'gu-IN', states: ['Gujarat'] },
  { code: 'BN', label: 'বাংলা', locale: 'bn-IN', states: ['West Bengal', 'Tripura'] },
  { code: 'PA', label: 'ਪੰਜਾਬੀ', locale: 'pa-IN', states: ['Punjab'] },
]

export const langForState = (state) => LANGS.find((l) => l.states.includes(state))?.code || 'EN'

// Core interface strings. Anything not listed here shows in English until it is translated.
export const NATIVE = {
  TA: { nav_check: 'அறிகுறிகளைச் சரிபார்', nav_doctors: 'மருத்துவரைத் தேடுங்கள்', nav_guide: 'சுகாதார வழிகாட்டி', nav_records: 'என் பதிவுகள்', sign_in: 'உள்நுழை', sign_out: 'வெளியேறு', language: 'மொழி',
    hero_title: 'உங்கள் உடல் என்ன சொல்கிறது என்று அறியுங்கள். பிறகு அருகிலுள்ள சரியான மருத்துவரைக் கண்டுபிடியுங்கள்.', find_doctors: 'மருத்துவர்களைத் தேடு', state: 'மாநிலம்', city: 'நகரம்', area: 'பகுதி', all_states: 'அனைத்து மாநிலங்கள்', where_hurts: 'எங்கே வலிக்கிறது?', check_btn: 'என் அறிகுறிகளைச் சரிபார்', t_EMERGENCY: 'உடனடியாக அவசர உதவி பெறுங்கள்' },
  TE: { nav_check: 'లక్షణాలను తనిఖీ చేయండి', nav_doctors: 'వైద్యులను వెతకండి', nav_guide: 'ఆరోగ్య మార్గదర్శి', nav_records: 'నా రికార్డులు', sign_in: 'సైన్ ఇన్', sign_out: 'సైన్ అవుట్', language: 'భాష',
    hero_title: 'మీ శరీరం ఏమి చెబుతోందో తెలుసుకోండి. తర్వాత దగ్గరలోని సరైన వైద్యుడిని కనుగొనండి.', find_doctors: 'వైద్యులను వెతకండి', state: 'రాష్ట్రం', city: 'నగరం', area: 'ప్రాంతం', all_states: 'అన్ని రాష్ట్రాలు', where_hurts: 'ఎక్కడ నొప్పిగా ఉంది?', check_btn: 'నా లక్షణాలను తనిఖీ చేయండి', t_EMERGENCY: 'వెంటనే అత్యవసర సహాయం పొందండి' },
  KN: { nav_check: 'ಲಕ್ಷಣಗಳನ್ನು ಪರಿಶೀಲಿಸಿ', nav_doctors: 'ವೈದ್ಯರನ್ನು ಹುಡುಕಿ', nav_guide: 'ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶಿ', nav_records: 'ನನ್ನ ದಾಖಲೆಗಳು', sign_in: 'ಸೈನ್ ಇನ್', sign_out: 'ಸೈನ್ ಔಟ್', language: 'ಭಾಷೆ',
    hero_title: 'ನಿಮ್ಮ ದೇಹ ಏನು ಹೇಳುತ್ತಿದೆ ಎಂದು ತಿಳಿಯಿರಿ. ನಂತರ ಹತ್ತಿರದ ಸರಿಯಾದ ವೈದ್ಯರನ್ನು ಹುಡುಕಿ.', find_doctors: 'ವೈದ್ಯರನ್ನು ಹುಡುಕಿ', state: 'ರಾಜ್ಯ', city: 'ನಗರ', area: 'ಪ್ರದೇಶ', all_states: 'ಎಲ್ಲಾ ರಾಜ್ಯಗಳು', where_hurts: 'ಎಲ್ಲಿ ನೋವಾಗುತ್ತಿದೆ?', check_btn: 'ನನ್ನ ಲಕ್ಷಣಗಳನ್ನು ಪರಿಶೀಲಿಸಿ', t_EMERGENCY: 'ತಕ್ಷಣ ತುರ್ತು ಸಹಾಯ ಪಡೆಯಿರಿ' },
  ML: { nav_check: 'ലക്ഷണങ്ങൾ പരിശോധിക്കുക', nav_doctors: 'ഡോക്ടറെ കണ്ടെത്തുക', nav_guide: 'ആരോഗ്യ ഗൈഡ്', nav_records: 'എന്റെ രേഖകൾ', sign_in: 'സൈൻ ഇൻ', sign_out: 'സൈൻ ഔട്ട്', language: 'ഭാഷ',
    hero_title: 'നിങ്ങളുടെ ശരീരം എന്താണ് പറയുന്നതെന്ന് അറിയൂ. തുടർന്ന് അടുത്തുള്ള ശരിയായ ഡോക്ടറെ കണ്ടെത്തൂ.', find_doctors: 'ഡോക്ടർമാരെ കണ്ടെത്തുക', state: 'സംസ്ഥാനം', city: 'നഗരം', area: 'പ്രദേശം', all_states: 'എല്ലാ സംസ്ഥാനങ്ങളും', where_hurts: 'എവിടെയാണ് വേദന?', check_btn: 'എന്റെ ലക്ഷണങ്ങൾ പരിശോധിക്കുക', t_EMERGENCY: 'ഉടൻ അടിയന്തര സഹായം തേടുക' },
  MR: { nav_check: 'लक्षणे तपासा', nav_doctors: 'डॉक्टर शोधा', nav_guide: 'आरोग्य मार्गदर्शक', nav_records: 'माझ्या नोंदी', sign_in: 'साइन इन', sign_out: 'साइन आउट', language: 'भाषा',
    hero_title: 'तुमचे शरीर काय सांगत आहे ते जाणून घ्या. मग जवळचा योग्य डॉक्टर शोधा.', find_doctors: 'डॉक्टर शोधा', state: 'राज्य', city: 'शहर', area: 'परिसर', all_states: 'सर्व राज्ये', where_hurts: 'कुठे दुखत आहे?', check_btn: 'माझी लक्षणे तपासा', t_EMERGENCY: 'ताबडतोब आपत्कालीन मदत घ्या' },
  GU: { nav_check: 'લક્ષણો તપાસો', nav_doctors: 'ડૉક્ટર શોધો', nav_guide: 'આરોગ્ય માર્ગદર્શિકા', nav_records: 'મારા રેકોર્ડ', sign_in: 'સાઇન ઇન', sign_out: 'સાઇન આઉટ', language: 'ભાષા',
    hero_title: 'તમારું શરીર શું કહે છે તે જાણો. પછી નજીકના યોગ્ય ડૉક્ટરને શોધો.', find_doctors: 'ડૉક્ટર શોધો', state: 'રાજ્ય', city: 'શહેર', area: 'વિસ્તાર', all_states: 'બધા રાજ્યો', where_hurts: 'ક્યાં દુખે છે?', check_btn: 'મારા લક્ષણો તપાસો', t_EMERGENCY: 'તરત કટોકટીની મદદ લો' },
  BN: { nav_check: 'উপসর্গ পরীক্ষা করুন', nav_doctors: 'ডাক্তার খুঁজুন', nav_guide: 'স্বাস্থ্য নির্দেশিকা', nav_records: 'আমার রেকর্ড', sign_in: 'সাইন ইন', sign_out: 'সাইন আউট', language: 'ভাষা',
    hero_title: 'আপনার শরীর কী বলছে তা জানুন। তারপর কাছের সঠিক ডাক্তারকে খুঁজে নিন।', find_doctors: 'ডাক্তার খুঁজুন', state: 'রাজ্য', city: 'শহর', area: 'এলাকা', all_states: 'সব রাজ্য', where_hurts: 'কোথায় ব্যথা করছে?', check_btn: 'আমার উপসর্গ পরীক্ষা করুন', t_EMERGENCY: 'এখনই জরুরি সাহায্য নিন' },
  PA: { nav_check: 'ਲੱਛਣ ਜਾਂਚੋ', nav_doctors: 'ਡਾਕਟਰ ਲੱਭੋ', nav_guide: 'ਸਿਹਤ ਗਾਈਡ', nav_records: 'ਮੇਰੇ ਰਿਕਾਰਡ', sign_in: 'ਸਾਈਨ ਇਨ', sign_out: 'ਸਾਈਨ ਆਊਟ', language: 'ਭਾਸ਼ਾ',
    hero_title: 'ਜਾਣੋ ਤੁਹਾਡਾ ਸਰੀਰ ਕੀ ਕਹਿ ਰਿਹਾ ਹੈ। ਫਿਰ ਨੇੜੇ ਦਾ ਸਹੀ ਡਾਕਟਰ ਲੱਭੋ।', find_doctors: 'ਡਾਕਟਰ ਲੱਭੋ', state: 'ਰਾਜ', city: 'ਸ਼ਹਿਰ', area: 'ਇਲਾਕਾ', all_states: 'ਸਾਰੇ ਰਾਜ', where_hurts: 'ਕਿੱਥੇ ਦਰਦ ਹੈ?', check_btn: 'ਮੇਰੇ ਲੱਛਣ ਜਾਂਚੋ', t_EMERGENCY: 'ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਮਦਦ ਲਓ' },
}
