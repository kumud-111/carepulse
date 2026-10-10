import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { LANGS, NATIVE, langForState } from './locales.js'
export { LANGS, langForState }

// English is the base. Other languages only override the strings they translate.
const en = {
  nav_check: 'Check symptoms', nav_doctors: 'Find doctors', nav_guide: 'Health guide', nav_records: 'My records',
  sign_in: 'Sign in', sign_out: 'Sign out', hi_name: 'Hi, {name}', language: 'Language',
  foot_emergency: 'Emergency?', foot_call: 'Call {a} or ambulance {b}. Mental-health support: Tele-MANAS {c} (free, 24x7).',
  foot_disclaimer: 'CarePulse gives general health information, not a diagnosis or prescription. Doctor profiles, addresses and phone numbers shown here are sample data for this demo, so verify before visiting.',

  hero_title: 'Know what your body is telling you. Then find the right doctor close by.',
  hero_lead: 'Tap where it hurts, get a clear next step, and compare nearby doctors by fee, rating and address.',
  state: 'State', city: 'City', area: 'Area', all_states: 'All states', all_cities: 'All cities', all_areas: 'All areas',
  pick_state_first: 'Pick a state first', pick_city_first: 'Pick a city first', find_doctors: 'Find doctors',
  free_hint: 'Free to use. Sign in only when you want to book or save your history.',
  where_hurts: 'Where does it hurt?',
  small_title: 'Start with the small things',
  small_lead: 'Most everyday problems are mild. See what usually helps at home and when to see a doctor.',
  see_all: 'See all illnesses',
  s_fever: 'Fever', s_cold: 'Cold & cough', s_acidity: 'Acidity', s_loose: 'Loose motions', s_head: 'Headache', s_back: 'Back pain', s_itch: 'Itching & rash', s_tooth: 'Toothache',
  f1_t: 'Safer symptom checks', f1_p: 'Warning signs like chest pain or breathing trouble are caught first and sent to emergency help. We never diagnose or suggest medicines.',
  f2_t: 'Doctors that fit your budget', f2_p: 'Filter by state, city and area, see the consultation fee up front, and sort by lowest fee, best rating or best value.',
  f3_t: 'Contact details at a glance', f3_p: 'Each doctor shows clinic, address and phone number. Call directly or book a time slot in a few taps.',

  front: 'Front', back: 'Back',
  chk_title: 'Check your symptoms', chk_lead: 'Pick everything that applies. You can also type in your own words below.',
  loading_symptoms: 'Loading symptoms…', your_symptoms: 'Your symptoms ({n})', none_selected: 'Nothing selected yet. Tap a body part, then a symptom.',
  own_words: 'Or describe it in your own words', own_ph: 'e.g. fever since yesterday and a sore throat',
  age: 'Age', years: 'Years', how_long: 'How long?', d1: 'Since today', d2: '2–3 days', d3: '4–7 days', d4: 'More than a week',
  check_btn: 'Check my symptoms', checking: 'Checking…', start_over: 'Start over', remove: 'Remove {x}',
  t_EMERGENCY: 'Get emergency help now', t_HIGH: 'See a doctor today', t_MODERATE: 'See a doctor in 1–2 days', t_LOW: 'You can likely manage this at home',
  sum_EMERGENCY: 'What you described can be a medical emergency. Please do not wait for an appointment.',
  sum_HIGH: 'Your symptoms need a doctor’s check-up soon. A {spec} is the best fit.',
  sum_MODERATE: 'This should be checked if it does not settle soon. A {spec} is the best fit.',
  sum_LOW: 'These look mild. Try the home-care steps below and watch for changes.',
  adv_EMERGENCY: ['Call 112 (or ambulance 108) right now.', 'Do not drive yourself. Ask someone nearby to stay with you.', 'Go to the nearest hospital emergency department.'],
  adv_HIGH: ['Visit a doctor or nearby hospital today.', 'Take someone with you and carry your old reports.', 'Go to the emergency department if it gets worse quickly.'],
  adv_MODERATE: ['Book a visit in the next 1–2 days.', 'Rest, drink enough water and eat light food meanwhile.', 'Go earlier if the symptoms get worse or new ones appear.'],
  adv_LOW: ['Rest, drink enough water and eat light food.', 'See a {spec} if there is no improvement in 3–5 days.', 'See a doctor sooner if a warning sign listed below appears.'],
  adv_selfharm: 'You are not alone. Talk to someone now: call Tele-MANAS 14416 (free, 24x7) or a person you trust.',
  call_n: 'Call {n}', simple_words: 'In simple words:', find_a: 'Find a {spec}', causes: 'Common causes that fit (not a diagnosis)',
  home_helps: 'What helps at home', see_if: 'See a doctor if', saved_in: 'Saved in', sign_in_to_save: 'to save this check in My records.',
  disclaimer: 'This is general health information, not a diagnosis or a prescription. It cannot replace a doctor. If you feel very unwell, go to a hospital.',

  doc_title: 'Find a doctor', doc_lead: 'Compare fees, ratings and addresses. Call the clinic or book a slot.',
  specialty: 'Specialty', all_specialties: 'All specialties', sort_by: 'Sort by',
  sort_value: 'Best value (rated 4.2+, lowest fee)', sort_fee: 'Lowest fee', sort_rating: 'Top rated', sort_exp: 'Most experienced',
  search_label: 'Search name or clinic', search_ph: 'e.g. Sharma', loading: 'Loading…',
  n_doctors: '{n} doctors found', one_doctor: '1 doctor found', no_match: 'No doctors match these filters. Try another area or choose All specialties.',
  best_value: 'Best value', consult: 'consultation', exp_years: '{n} years experience', speaks: 'Speaks {x}',
  call_phone: 'Call {p}', directions: 'Directions', book_slot: 'Book a slot', hide_times: 'Hide times',
  loading_times: 'Loading times…', no_times: 'No open times this week. Please call the clinic.',
  reason: 'Reason for visit (optional)', reason_ph: 'e.g. fever since 2 days', confirm: 'Confirm {when}', booking: 'Booking…',
  booked: 'Booked for {when}.', view_records: 'View in My records',

  guide_title: 'Health guide', guide_lead: 'Common illnesses, from the smallest to the more serious, with home care and clear warning signs. This is for learning, not for diagnosis.',
  guide_search: 'Search illnesses', guide_ph: 'Search: fever, acidity, back pain…', guide_none: 'Nothing matches “{q}”. Try a simpler word.',
  c_Very_common: 'Very common', c_Common: 'Common', c_Less_common: 'Less common',

  rec_title: 'My records', rec_signin: 'Sign in to see your appointments and past symptom checks.',
  upcoming: 'Upcoming patients', no_upcoming: 'No upcoming bookings yet.', appts: 'Appointments', no_appts: 'No appointments yet.',
  sym_checks: 'Symptom checks', no_checks: 'No saved checks yet.', cancel: 'Cancel', cancelled: 'Cancelled',
  confirm_cancel: 'Cancel this appointment?', no_reason: 'No reason given',
  lvl_EMERGENCY: 'Emergency', lvl_HIGH: 'High', lvl_MODERATE: 'Moderate', lvl_LOW: 'Low',

  detail_note: 'Detailed tips are shown in English.',
  welcome: 'Welcome back', create_title: 'Create your account', auth_sub: 'Save your symptom checks and manage your appointments in one place.',
  full_name: 'Full name', email: 'Email', password: 'Password', pref_lang: 'Preferred language', pref_lang_hint: 'You can change this anytime from the top bar.',
  lang_by_state: 'Pick your state to use its local language, or choose any language below.',
  please_wait: 'Please wait…', create_btn: 'Create account', new_here: 'New here?', already: 'Already registered?', close: 'Close',
}

const hi = {
  nav_check: 'लक्षण जाँचें', nav_doctors: 'डॉक्टर खोजें', nav_guide: 'स्वास्थ्य गाइड', nav_records: 'मेरे रिकॉर्ड',
  sign_in: 'साइन इन', sign_out: 'साइन आउट', hi_name: 'नमस्ते, {name}', language: 'भाषा',
  foot_emergency: 'आपातकाल?', foot_call: '{a} या एम्बुलेंस {b} पर कॉल करें। मानसिक स्वास्थ्य सहायता: Tele-MANAS {c} (मुफ़्त, 24x7)।',
  foot_disclaimer: 'CarePulse सामान्य स्वास्थ्य जानकारी देता है, बीमारी की पहचान या दवा की सलाह नहीं। यहाँ दिखाए गए डॉक्टर, पते और फ़ोन नंबर डेमो के नमूना डेटा हैं, जाने से पहले जाँच लें।',
  hero_title: 'जानिए आपका शरीर क्या कह रहा है। फिर पास में सही डॉक्टर ढूँढिए।',
  hero_lead: 'जहाँ दर्द है वहाँ टैप करें, अगला कदम जानें और फ़ीस, रेटिंग और पते के हिसाब से पास के डॉक्टर देखें।',
  state: 'राज्य', city: 'शहर', area: 'इलाका', all_states: 'सभी राज्य', all_cities: 'सभी शहर', all_areas: 'सभी इलाके',
  pick_state_first: 'पहले राज्य चुनें', pick_city_first: 'पहले शहर चुनें', find_doctors: 'डॉक्टर खोजें',
  free_hint: 'मुफ़्त है। बुकिंग या हिस्ट्री सेव करने के लिए ही साइन इन करें।',
  where_hurts: 'कहाँ दर्द है?',
  small_title: 'छोटी परेशानियों से शुरू करें',
  small_lead: 'ज़्यादातर रोज़ की समस्याएँ हल्की होती हैं। देखें घर पर क्या मदद करता है और डॉक्टर को कब दिखाएँ।',
  see_all: 'सभी बीमारियाँ देखें',
  s_fever: 'बुखार', s_cold: 'सर्दी-खाँसी', s_acidity: 'एसिडिटी', s_loose: 'दस्त', s_head: 'सिरदर्द', s_back: 'कमर दर्द', s_itch: 'खुजली और दाने', s_tooth: 'दाँत दर्द',
  f1_t: 'सुरक्षित लक्षण जाँच', f1_p: 'सीने में दर्द या साँस की तकलीफ़ जैसे खतरे के संकेत सबसे पहले पकड़े जाते हैं और आपातकालीन मदद की सलाह दी जाती है। हम न बीमारी बताते हैं, न दवा।',
  f2_t: 'आपके बजट के डॉक्टर', f2_p: 'राज्य, शहर और इलाके से छाँटें, फ़ीस पहले ही देखें, और सबसे कम फ़ीस, बेहतरीन रेटिंग या बेस्ट वैल्यू से क्रम में लगाएँ।',
  f3_t: 'संपर्क की जानकारी एक नज़र में', f3_p: 'हर डॉक्टर का क्लिनिक, पता और फ़ोन नंबर दिखता है। सीधे कॉल करें या कुछ टैप में समय बुक करें।',
  front: 'आगे', back: 'पीछे',
  chk_title: 'अपने लक्षण जाँचें', chk_lead: 'जो भी लागू हो सब चुनें। नीचे अपने शब्दों में भी लिख सकते हैं।',
  loading_symptoms: 'लक्षण लोड हो रहे हैं…', your_symptoms: 'आपके लक्षण ({n})', none_selected: 'अभी कुछ नहीं चुना। शरीर का हिस्सा टैप करें, फिर लक्षण चुनें।',
  own_words: 'या अपने शब्दों में बताएँ', own_ph: 'जैसे: कल से बुखार है और गले में दर्द है',
  age: 'उम्र', years: 'साल', how_long: 'कितने समय से?', d1: 'आज से', d2: '2–3 दिन', d3: '4–7 दिन', d4: 'एक हफ़्ते से ज़्यादा',
  check_btn: 'मेरे लक्षण जाँचें', checking: 'जाँच हो रही है…', start_over: 'फिर से शुरू करें', remove: '{x} हटाएँ',
  t_EMERGENCY: 'तुरंत आपातकालीन मदद लें', t_HIGH: 'आज ही डॉक्टर को दिखाएँ', t_MODERATE: '1–2 दिन में डॉक्टर को दिखाएँ', t_LOW: 'आप इसे घर पर संभाल सकते हैं',
  sum_EMERGENCY: 'आपने जो बताया वह मेडिकल इमरजेंसी हो सकती है। कृपया अपॉइंटमेंट का इंतज़ार न करें।',
  sum_HIGH: 'आपके लक्षणों की जल्द डॉक्टर से जाँच ज़रूरी है। {spec} सबसे सही रहेंगे।',
  sum_MODERATE: 'अगर यह जल्दी ठीक न हो तो जाँच करवानी चाहिए। {spec} सबसे सही रहेंगे।',
  sum_LOW: 'ये हल्के लगते हैं। नीचे दिए घरेलू उपाय आज़माएँ और बदलाव पर नज़र रखें।',
  adv_EMERGENCY: ['अभी 112 (या एम्बुलेंस 108) पर कॉल करें।', 'खुद गाड़ी न चलाएँ। किसी को अपने साथ रहने को कहें।', 'सबसे नज़दीकी अस्पताल के इमरजेंसी विभाग में जाएँ।'],
  adv_HIGH: ['आज ही डॉक्टर या नज़दीकी अस्पताल जाएँ।', 'किसी को साथ ले जाएँ और पुरानी रिपोर्ट रखें।', 'तेज़ी से बिगड़े तो इमरजेंसी में जाएँ।'],
  adv_MODERATE: ['अगले 1–2 दिन में डॉक्टर से मिलें।', 'तब तक आराम करें, पानी पिएँ और हल्का खाना खाएँ।', 'लक्षण बढ़ें या नए आएँ तो जल्दी जाएँ।'],
  adv_LOW: ['आराम करें, पर्याप्त पानी पिएँ और हल्का खाना खाएँ।', '3–5 दिन में आराम न मिले तो {spec} को दिखाएँ।', 'नीचे लिखा कोई चेतावनी संकेत दिखे तो जल्दी डॉक्टर को दिखाएँ।'],
  adv_selfharm: 'आप अकेले नहीं हैं। अभी किसी से बात करें: Tele-MANAS 14416 (मुफ़्त, 24x7) पर कॉल करें या किसी भरोसेमंद व्यक्ति से बात करें।',
  call_n: '{n} पर कॉल करें', simple_words: 'सरल शब्दों में:', find_a: '{spec} खोजें', causes: 'मेल खाने वाले आम कारण (यह निदान नहीं है)',
  home_helps: 'घर पर क्या मदद करता है', see_if: 'डॉक्टर को कब दिखाएँ', saved_in: 'सेव हुआ:', sign_in_to_save: 'करें ताकि यह जाँच मेरे रिकॉर्ड में सेव हो।',
  disclaimer: 'यह सिर्फ़ सामान्य स्वास्थ्य जानकारी है, बीमारी की पहचान या दवा की सलाह नहीं। यह डॉक्टर की जगह नहीं ले सकती। ज़्यादा तबीयत खराब हो तो अस्पताल जाएँ।',
  doc_title: 'डॉक्टर खोजें', doc_lead: 'फ़ीस, रेटिंग और पते की तुलना करें। क्लिनिक को कॉल करें या समय बुक करें।',
  specialty: 'विशेषज्ञता', all_specialties: 'सभी विशेषज्ञता', sort_by: 'क्रम',
  sort_value: 'बेस्ट वैल्यू (रेटिंग 4.2+, सबसे कम फ़ीस)', sort_fee: 'सबसे कम फ़ीस', sort_rating: 'सबसे अच्छी रेटिंग', sort_exp: 'सबसे अनुभवी',
  search_label: 'नाम या क्लिनिक खोजें', search_ph: 'जैसे: Sharma', loading: 'लोड हो रहा है…',
  n_doctors: '{n} डॉक्टर मिले', one_doctor: '1 डॉक्टर मिला', no_match: 'इन फ़िल्टर से कोई डॉक्टर नहीं मिला। दूसरा इलाका चुनें या सभी विशेषज्ञता चुनें।',
  best_value: 'बेस्ट वैल्यू', consult: 'परामर्श फ़ीस', exp_years: '{n} साल का अनुभव', speaks: 'भाषाएँ: {x}',
  call_phone: 'कॉल करें {p}', directions: 'रास्ता', book_slot: 'समय बुक करें', hide_times: 'समय छिपाएँ',
  loading_times: 'समय लोड हो रहे हैं…', no_times: 'इस हफ़्ते कोई खाली समय नहीं। कृपया क्लिनिक को कॉल करें।',
  reason: 'मिलने का कारण (वैकल्पिक)', reason_ph: 'जैसे: 2 दिन से बुखार', confirm: 'पक्का करें: {when}', booking: 'बुक हो रहा है…',
  booked: '{when} के लिए बुक हो गया।', view_records: 'मेरे रिकॉर्ड में देखें',
  guide_title: 'स्वास्थ्य गाइड', guide_lead: 'छोटी से बड़ी आम बीमारियाँ, घरेलू देखभाल और साफ़ चेतावनी संकेतों के साथ। यह सीखने के लिए है, निदान के लिए नहीं।',
  guide_search: 'बीमारी खोजें', guide_ph: 'खोजें: बुखार, एसिडिटी, कमर दर्द…', guide_none: '“{q}” से कुछ नहीं मिला। कोई सरल शब्द आज़माएँ।',
  c_Very_common: 'बहुत आम', c_Common: 'आम', c_Less_common: 'कम आम',
  rec_title: 'मेरे रिकॉर्ड', rec_signin: 'अपने अपॉइंटमेंट और पुरानी जाँच देखने के लिए साइन इन करें।',
  upcoming: 'आने वाले मरीज़', no_upcoming: 'अभी कोई बुकिंग नहीं।', appts: 'अपॉइंटमेंट', no_appts: 'अभी कोई अपॉइंटमेंट नहीं।',
  sym_checks: 'लक्षण जाँच', no_checks: 'अभी कोई सेव की हुई जाँच नहीं।', cancel: 'रद्द करें', cancelled: 'रद्द',
  confirm_cancel: 'यह अपॉइंटमेंट रद्द करें?', no_reason: 'कारण नहीं बताया',
  lvl_EMERGENCY: 'आपातकाल', lvl_HIGH: 'ज़्यादा', lvl_MODERATE: 'मध्यम', lvl_LOW: 'कम',
  detail_note: 'विस्तृत सुझाव अभी अंग्रेज़ी में दिए गए हैं।',
  welcome: 'वापसी पर स्वागत है', create_title: 'अपना खाता बनाएँ', auth_sub: 'अपनी लक्षण जाँच सेव करें और अपॉइंटमेंट एक जगह संभालें।',
  full_name: 'पूरा नाम', email: 'ईमेल', password: 'पासवर्ड', pref_lang: 'पसंदीदा भाषा', pref_lang_hint: 'इसे ऊपर की पट्टी से कभी भी बदल सकते हैं।',
  please_wait: 'कृपया रुकें…', create_btn: 'खाता बनाएँ', new_here: 'नए हैं?', already: 'पहले से खाता है?', close: 'बंद करें',
}

const DICT = { EN: en, HI: { ...en, ...hi }, ...Object.fromEntries(Object.entries(NATIVE).map(([k, v]) => [k, { ...en, ...v }])) }
const safeLang = (l) => (DICT[l] ? l : 'EN') // also maps the retired HINGLISH choice to English
const SPEC_HI = {
  'General Physician': 'सामान्य चिकित्सक', Pediatrician: 'बाल रोग विशेषज्ञ', Dermatologist: 'त्वचा रोग विशेषज्ञ', ENT: 'कान-नाक-गला (ENT) विशेषज्ञ',
  Orthopedic: 'हड्डी रोग विशेषज्ञ', Gynecologist: 'स्त्री रोग विशेषज्ञ', Cardiologist: 'हृदय रोग विशेषज्ञ', Gastroenterologist: 'पेट रोग विशेषज्ञ',
  Neurologist: 'न्यूरोलॉजिस्ट', Dentist: 'दंत चिकित्सक', Ophthalmologist: 'नेत्र रोग विशेषज्ञ', Psychiatrist: 'मनोचिकित्सक',
  Pulmonologist: 'फेफड़े के रोग विशेषज्ञ', Diabetologist: 'मधुमेह विशेषज्ञ',
}
const REGION_L = {
  head: ['Head', 'सिर', 'Sir'], eyes: ['Eyes', 'आँखें', 'Aankhein'], ent: ['Ear, nose, throat, teeth', 'कान, नाक, गला, दाँत', 'Kaan, naak, gala, daant'],
  chest: ['Chest & breathing', 'सीना और साँस', 'Seena aur saans'], abdomen: ['Stomach, urine, periods', 'पेट, पेशाब, माहवारी', 'Pet, peshab, mahwari'],
  back: ['Back & neck', 'कमर और गर्दन', 'Kamar aur gardan'], limbs: ['Arms, legs, joints', 'हाथ, पैर, जोड़', 'Haath, pair, jod'],
  skin: ['Skin & hair', 'त्वचा और बाल', 'Skin aur baal'], general: ['Fever & whole body', 'बुखार, पूरा शरीर', 'Bukhar, poora sharir'], mind: ['Mind & sleep', 'मन और नींद', 'Mann aur neend'],
}

const Ctx = createContext(null)
export const useLang = () => useContext(Ctx)

export function LangProvider({ initial, children }) {
  const [lang, setLangState] = useState(safeLang(initial || localStorage.getItem('cp_lang') || 'EN'))
  const setLang = useCallback((l) => { const c = safeLang(l); localStorage.setItem('cp_lang', c); setLangState(c) }, [])
  useEffect(() => { document.documentElement.lang = (LANGS.find((x) => x.code === lang) || LANGS[0]).locale }, [lang])

  const value = useMemo(() => {
    const d = DICT[lang] || en
    const fill = (s, v) => (typeof s === 'string' && v ? s.replace(/\{(\w+)\}/g, (_, k) => (v[k] ?? '')) : s)
    const idx = lang === 'HI' ? 1 : 0
    return {
      lang, setLang,
      t: (k, v) => { const s = d[k] ?? en[k] ?? k; return Array.isArray(s) ? s.map((x) => fill(x, v)) : fill(s, v) },
      sym: (s) => (lang === 'HI' ? s.hi : s.en),
      cond: (c) => (lang === 'HI' ? c.hi : c.name),
      spec: (n) => (lang === 'HI' ? SPEC_HI[n] || n : n),
      region: (id) => REGION_L[id][idx],
      locale: (LANGS.find((x) => x.code === lang) || LANGS[0]).locale,
    }
  }, [lang, setLang])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
