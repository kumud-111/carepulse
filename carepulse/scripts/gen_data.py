"""Generates symptoms.json, conditions.json and doctors.json (SAMPLE doctor data)."""
import json, random, os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend", "src", "main", "resources", "data")
GP, PED, DER, ENT, ORT, GYN, CAR, GAS, NEU, DEN, OPH, PSY, PUL, DIA = (
 "General Physician","Pediatrician","Dermatologist","ENT","Orthopedic","Gynecologist","Cardiologist",
 "Gastroenterologist","Neurologist","Dentist","Ophthalmologist","Psychiatrist","Pulmonologist","Diabetologist")

# id, region, English, Hindi, weight(1-5), specialty, keywords, redFlag
S = [
("headache","head","Headache","सिरदर्द",2,GP,["headache","sir dard","sar dard","sirdard"],0),
("migraine","head","One-sided throbbing headache, light bothers me","आधे सिर में तेज़ दर्द, रोशनी चुभती है",3,NEU,["migraine","aadhe sir"],0),
("dizziness","head","Dizziness","चक्कर आना",2,GP,["dizzy","dizziness","chakkar"],0),
("fainting","head","Fainting / blackout","बेहोशी जैसा लगना",4,NEU,["fainting","fainted","blackout","behosh hone"],0),
("sudden_headache","head","Sudden, worst headache of my life","अचानक बहुत तेज़ सिरदर्द",5,NEU,["worst headache","sudden headache"],1),
("stroke_signs","head","Face drooping, slurred speech or one-side weakness","चेहरा टेढ़ा, बोलने में दिक्कत, एक तरफ कमज़ोरी",5,NEU,["face droop","slurred","lakwa","one side weak"],1),
("red_eyes","eyes","Red or itchy eyes","आँखें लाल या खुजली",1,OPH,["red eye","eyes red","aankh lal","aankh me khujli"],0),
("watery_eyes","eyes","Watery eyes / discharge","आँखों से पानी या कीचड़",1,OPH,["watery eye","aankh se pani","eye discharge"],0),
("eye_pain","eyes","Eye pain","आँख में दर्द",2,OPH,["eye pain","aankh dard","aankh me dard"],0),
("blurry_vision","eyes","Blurry vision","धुंधला दिखना",3,OPH,["blurry","blurred vision","dhundhla"],0),
("sore_throat","ent","Sore throat","गले में खराश / दर्द",1,ENT,["sore throat","gala kharab","gale me dard","gala dard"],0),
("runny_nose","ent","Runny or blocked nose, sneezing","नाक बहना / बंद, छींकें",1,ENT,["runny nose","blocked nose","naak behna","naak band","sneez","chheenk"],0),
("ear_pain","ent","Ear pain","कान में दर्द",2,ENT,["ear pain","kaan dard","kaan me dard"],0),
("toothache","ent","Toothache / swollen gums","दाँत दर्द / मसूड़ों में सूजन",2,DEN,["toothache","daant dard","daant me dard","gums swollen","masoode"],0),
("loss_smell","ent","Loss of smell or taste","गंध या स्वाद न आना",2,ENT,["loss of smell","no smell","smell nahi","taste nahi"],0),
("cough","chest","Cough","खाँसी",1,GP,["cough","khansi","khasi"],0),
("breathless","chest","Shortness of breath","साँस फूलना",4,PUL,["shortness of breath","breathless","saans phoolna","saans fulna"],0),
("wheezing","chest","Wheezing / chest tightness","साँस में सीटी / सीने में जकड़न",3,PUL,["wheez","seene me jakdan","tightness"],0),
("palpitations","chest","Racing or irregular heartbeat","दिल की धड़कन तेज़ / अनियमित",3,CAR,["palpitation","dhadkan","heart racing"],0),
("chest_pain","chest","Chest pain or pressure","सीने में दर्द / दबाव",5,CAR,["chest pain","seene me dard","chest pressure","seene mein dard"],1),
("severe_breathless","chest","Cannot breathe / cannot speak full sentences","साँस नहीं आ रही",5,PUL,["can't breathe","cannot breathe","saans nahi","saans nahi aa rahi"],1),
("cough_blood","chest","Coughing up blood","खाँसी में खून",5,PUL,["cough blood","coughing blood","khoon ki khansi","khansi me khoon"],1),
("stomach_pain","abdomen","Stomach pain","पेट दर्द",2,GAS,["stomach pain","stomach ache","pet dard","pet me dard"],0),
("acidity","abdomen","Acidity / burning in chest or stomach","एसिडिटी / जलन",1,GAS,["acidity","heartburn","jalan","gas ban"],0),
("nausea","abdomen","Nausea","जी मिचलाना",1,GAS,["nausea","ji michlana","mitli"],0),
("vomiting","abdomen","Vomiting","उल्टी",2,GAS,["vomit","ulti","ulti ho"],0),
("diarrhea","abdomen","Loose motions","दस्त / लूज़ मोशन",2,GAS,["diarrhea","diarrhoea","loose motion","dast","patla potty"],0),
("constipation","abdomen","Constipation","कब्ज़",1,GAS,["constipation","kabz","kabj"],0),
("bloating","abdomen","Gas / bloating","गैस / पेट फूलना",1,GAS,["bloating","bloated","pet fulna","gas"],0),
("burning_urine","abdomen","Burning while passing urine","पेशाब में जलन",2,GP,["burning urine","urine burning","peshab me jalan","peshab jalan"],0),
("frequent_urine","abdomen","Passing urine very often","बार-बार पेशाब",2,DIA,["frequent urination","baar baar peshab","frequent urine"],0),
("period_pain","abdomen","Painful periods","माहवारी में दर्द",2,GYN,["period pain","menstrual cramp","periods me dard","mahwari dard"],0),
("irregular_periods","abdomen","Irregular or missed periods","अनियमित माहवारी",2,GYN,["irregular period","missed period","periods late","periods nahi"],0),
("severe_abd_pain","abdomen","Severe, sudden stomach pain","पेट में अचानक तेज़ दर्द",5,GAS,["severe stomach pain","unbearable stomach"],0),
("blood_stool","abdomen","Blood in stool or black stool","मल में खून / काला मल",4,GAS,["blood in stool","black stool","potty me khoon"],0),
("pregnancy_bleeding","abdomen","Heavy bleeding in pregnancy","गर्भावस्था में ज़्यादा रक्तस्राव",5,GYN,["bleeding in pregnancy","heavy bleeding","pregnancy bleeding"],1),
("back_pain","back","Lower back pain","कमर दर्द",2,ORT,["back pain","kamar dard","kamar me dard","backache"],0),
("neck_pain","back","Neck or shoulder pain","गर्दन / कंधे में दर्द",2,ORT,["neck pain","gardan dard","shoulder pain","kandhe me dard"],0),
("joint_pain","limbs","Joint pain or stiffness","जोड़ों में दर्द / अकड़न",2,ORT,["joint pain","jodon me dard","joints","ghutne me dard","knee pain"],0),
("muscle_pain","limbs","Muscle pain / body ache","माँसपेशियों / बदन में दर्द",1,GP,["body ache","muscle pain","badan dard","badan me dard"],0),
("numbness","limbs","Numbness or tingling","सुन्नपन / झुनझुनी",2,NEU,["numbness","tingling","jhunjhuni","sunn"],0),
("leg_swelling","limbs","Swollen feet or legs","पैरों में सूजन",3,CAR,["swollen feet","swollen legs","pair me sujan","pairon me sujan"],0),
("injury","limbs","Injury, suspected fracture or sprain","चोट / हड्डी टूटने का शक",4,ORT,["fracture","broken bone","sprain","haddi toot","chot"],0),
("rash","skin","Rash or red patches","दाने / लाल चकत्ते",2,DER,["rash","daane","chakatte"],0),
("itching","skin","Itching","खुजली",1,DER,["itching","itchy","khujli"],0),
("acne","skin","Pimples / acne","मुँहासे",1,DER,["acne","pimple","muhase"],0),
("hair_fall","skin","Hair fall / dandruff","बाल झड़ना / रूसी",1,DER,["hair fall","hairfall","baal jhadna","dandruff","roosi"],0),
("boil","skin","Boil, pus or skin infection","फोड़ा / पीप / त्वचा संक्रमण",2,DER,["boil","pus","fodha","skin infection"],0),
("burn_wound","skin","Burn or cut wound","जलना / कटना",3,GP,["burn","cut wound","jal gaya","kat gaya"],0),
("allergy_swelling","skin","Swelling of lips, face or throat","होंठ / चेहरे / गले में सूजन",5,GP,["lip swelling","throat swelling","face swelling","hont sujan"],1),
("fever","general","Fever","बुखार",2,GP,["fever","bukhar","bukhaar","temperature"],0),
("high_fever","general","High fever (above 103°F / 39.5°C)","तेज़ बुखार (103°F से ऊपर)",4,GP,["high fever","tez bukhar","103 fever"],0),
("chills","general","Chills / shivering","कंपकंपी / ठंड लगना",2,GP,["chills","shivering","thand lagna","kampkampi"],0),
("fatigue","general","Tiredness or weakness","थकान / कमज़ोरी",1,GP,["fatigue","tired","weakness","thakan","kamzori"],0),
("appetite_loss","general","Loss of appetite","भूख न लगना",1,GP,["loss of appetite","bhookh nahi","bhuk nahi"],0),
("weight_loss","general","Unexplained weight loss","बिना कारण वज़न घटना",3,GP,["weight loss","wajan kam","weight kam"],0),
("thirst","general","Very thirsty, dry mouth","बहुत प्यास लगना",2,DIA,["very thirsty","excessive thirst","pyaas zyada","pyas zyada"],0),
("night_sweats","general","Night sweats","रात में पसीना",2,GP,["night sweat","raat me pasina"],0),
("jaundice","general","Yellow skin or eyes","त्वचा / आँखें पीली",3,GAS,["jaundice","yellow eyes","peela","peeliya"],0),
("anxiety","mind","Anxiety / restlessness","घबराहट / बेचैनी",2,PSY,["anxiety","anxious","ghabrahat","bechaini","panic"],0),
("low_mood","mind","Feeling low or hopeless","उदासी / निराशा",3,PSY,["depressed","low mood","udaas","udasi","hopeless"],0),
("insomnia","mind","Trouble sleeping","नींद न आना",2,PSY,["insomnia","cannot sleep","neend nahi","neend na aana"],0),
("self_harm","mind","Thoughts of harming myself","खुद को नुकसान पहुँचाने के विचार",5,PSY,["suicide","kill myself","khudkushi","jeena nahi","harm myself","khud ko nuksan"],1),
]
HING_S={'headache': 'Sir dard', 'migraine': 'Aadhe sir mein tez dard, roshni chubhti hai', 'dizziness': 'Chakkar aana', 'fainting': 'Behoshi jaisa lagna', 'sudden_headache': 'Achanak bahut tez sir dard', 'stroke_signs': 'Chehra tedha, bolne mein dikkat, ek taraf kamzori', 'red_eyes': 'Aankhein laal ya khujli', 'watery_eyes': 'Aankhon se paani ya keechad', 'eye_pain': 'Aankh mein dard', 'blurry_vision': 'Dhundhla dikhna', 'sore_throat': 'Gale mein kharash / dard', 'runny_nose': 'Naak behna ya band, chheenkein', 'ear_pain': 'Kaan mein dard', 'toothache': 'Daant dard / masoodon mein sujan', 'loss_smell': 'Gandh ya swaad na aana', 'cough': 'Khaansi', 'breathless': 'Saans phoolna', 'wheezing': 'Saans mein seeti / seene mein jakdan', 'palpitations': 'Dil ki dhadkan tez ya aniyamit', 'chest_pain': 'Seene mein dard ya dabav', 'severe_breathless': 'Saans nahi aa rahi', 'cough_blood': 'Khaansi mein khoon', 'stomach_pain': 'Pet dard', 'acidity': 'Acidity / seene ya pet mein jalan', 'nausea': 'Ji michlana', 'vomiting': 'Ulti', 'diarrhea': 'Dast / loose motion', 'constipation': 'Kabz', 'bloating': 'Gas / pet phoolna', 'burning_urine': 'Peshab mein jalan', 'frequent_urine': 'Baar-baar peshab', 'period_pain': 'Mahwari mein dard', 'irregular_periods': 'Aniyamit mahwari', 'severe_abd_pain': 'Pet mein achanak tez dard', 'blood_stool': 'Mal mein khoon / kaala mal', 'pregnancy_bleeding': 'Pregnancy mein zyada bleeding', 'back_pain': 'Kamar dard', 'neck_pain': 'Gardan / kandhe mein dard', 'joint_pain': 'Jodon mein dard / akdan', 'muscle_pain': 'Maspeshiyon / badan mein dard', 'numbness': 'Sunnpan / jhunjhuni', 'leg_swelling': 'Pairon mein sujan', 'injury': 'Chot / haddi toote ka shak', 'rash': 'Daane / laal chakatte', 'itching': 'Khujli', 'acne': 'Muhaase', 'hair_fall': 'Baal jhadna / roosi', 'boil': 'Fodha / peep / skin infection', 'burn_wound': 'Jalna / katna', 'allergy_swelling': 'Hont / chehre / gale mein sujan', 'fever': 'Bukhar', 'high_fever': 'Tez bukhar (103°F se upar)', 'chills': 'Kampkampi / thand lagna', 'fatigue': 'Thakan / kamzori', 'appetite_loss': 'Bhookh na lagna', 'weight_loss': 'Bina wajah wazan ghatna', 'thirst': 'Bahut pyaas lagna', 'night_sweats': 'Raat mein paseena', 'jaundice': 'Skin / aankhein peeli', 'anxiety': 'Ghabrahat / bechaini', 'low_mood': 'Udaasi / nirasha', 'insomnia': 'Neend na aana', 'self_harm': 'Khud ko nuksan pahunchane ke vichar'}
symptoms=[dict(id=a,region=b,en=c,hi=d,hing=HING_S[a],weight=e,specialty=f,keywords=g,redFlag=bool(h)) for a,b,c,d,e,f,g,h in S]

# id, name, hindi, symptom ids, about, homeCare, seeDoctorIf, specialty, how common
C = [
("common_cold","Common cold","आम सर्दी-ज़ुकाम",["runny_nose","sore_throat","cough","fatigue"],"A mild viral infection of nose and throat. Usually settles by itself in 5–7 days.",["Rest and drink plenty of warm fluids","Steam inhalation and warm salt-water gargles","Eat light, home-cooked food"],["Fever lasts more than 3 days","Breathing becomes difficult","Symptoms last more than 10 days"],GP,"Very common"),
("viral_fever","Viral fever / flu","वायरल बुखार / फ्लू",["fever","chills","muscle_pain","fatigue","headache"],"Fever with body ache, usually caused by a virus. Most people recover in 3–5 days with rest.",["Rest, drink water, ORS and coconut water","Sponge with lukewarm water if the temperature is high","Take fever medicine only as advised by a doctor or as per the label"],["Fever above 103°F or lasting more than 3 days","Rash, severe headache or pain behind the eyes (dengue is common in monsoon)","Child, pregnant woman or elderly person with fever"],GP,"Very common"),
("pharyngitis","Sore throat","गले में खराश",["sore_throat","fever","cough"],"Throat inflammation, most often viral. Sometimes bacterial and then needs a doctor's treatment.",["Warm salt-water gargles","Warm tea with honey and ginger (not for babies under 1 year)","Avoid cold drinks and dust"],["Cannot swallow","White patches on the throat","Pain lasts more than 5 days"],ENT,"Very common"),
("allergic_rhinitis","Allergic cold / hay fever","एलर्जी वाली सर्दी",["runny_nose","itching","watery_eyes","red_eyes"],"Sneezing and watery nose or eyes triggered by dust, pollen or smoke. Often worse in mornings.",["Avoid dust, wash bedsheets weekly in hot water","Wear a mask in dusty places","Saline nasal rinse"],["Symptoms every week for a month","Wheezing or breathing trouble"],ENT,"Very common"),
("sinusitis","Sinusitis","साइनस",["runny_nose","headache","eye_pain","fever"],"Blocked, inflamed sinuses causing pressure around the nose, forehead and cheeks.",["Steam inhalation twice a day","Warm compress on the face","Drink plenty of fluids"],["Pain with high fever","Symptoms last more than 10 days","Swelling around the eyes"],ENT,"Common"),
("bronchitis","Cough / bronchitis","खाँसी / ब्रोंकाइटिस",["cough","wheezing","fatigue","fever"],"Irritated airways causing lingering cough, sometimes with phlegm.",["Warm fluids and honey (not for babies under 1 year)","Avoid smoke and dust","Rest"],["Cough longer than 2–3 weeks","Blood in sputum","Breathlessness"],PUL,"Common"),
("asthma","Asthma flare-up","दमा / अस्थमा",["wheezing","breathless","cough"],"Narrowed airways causing wheeze, cough and tight chest, often at night or with dust and cold air.",["Sit upright and stay calm","Use your prescribed inhaler as your doctor has told you","Stay away from smoke and dust"],["Not relieved by your inhaler","Cannot speak in full sentences — this is an emergency"],PUL,"Common"),
("acidity","Acidity / GERD","एसिडिटी",["acidity","nausea","bloating","stomach_pain"],"Stomach acid moving up, causing burning in chest or throat, mostly after heavy or spicy meals.",["Eat small, light meals; avoid lying down right after eating","Cut down on spicy, oily food, tea and coffee","Raise the head of the bed slightly"],["Burning most days for 2+ weeks","Trouble swallowing","Black stool or vomiting blood"],GAS,"Very common"),
("gastroenteritis","Loose motions / food infection","दस्त / पेट का संक्रमण",["diarrhea","vomiting","stomach_pain","nausea","fever"],"Infection from contaminated food or water. Dehydration is the main danger.",["Sip ORS every few minutes","Eat banana, rice, curd, khichdi","Wash hands; drink boiled or filtered water"],["Signs of dehydration: very dry mouth, little urine, dizziness","Blood in stool","Diarrhea longer than 2 days, or any infant/elderly person with diarrhea"],GAS,"Very common"),
("constipation","Constipation","कब्ज़",["constipation","bloating","stomach_pain"],"Hard or infrequent stools, usually from low fibre and little water.",["More water, fruit, vegetables, whole grains","Walk daily","Do not strain for long"],["Blood in stool","Lasts more than 2 weeks","Unexplained weight loss"],GAS,"Very common"),
("uti","Urine infection (UTI)","पेशाब का संक्रमण",["burning_urine","frequent_urine","stomach_pain","fever"],"Bacterial infection of the urine passage. Needs a urine test and usually antibiotics from a doctor.",["Drink plenty of water","Do not hold urine","Do not self-medicate with antibiotics"],["Fever, back pain or blood in urine","Pregnant women with these symptoms","Symptoms not better in 1–2 days"],GP,"Common"),
("tension_headache","Tension headache","तनाव वाला सिरदर्द",["headache","neck_pain","anxiety","insomnia"],"Dull band-like headache from stress, poor sleep, long screen time or skipped meals.",["Drink water, eat on time, sleep 7–8 hours","Rest your eyes every 20 minutes of screen time","Gentle neck stretches"],["Headache daily for a week","Vomiting, vision changes or fever with headache","Sudden severe headache — emergency"],GP,"Very common"),
("migraine","Migraine","माइग्रेन",["migraine","headache","nausea","blurry_vision"],"Throbbing, often one-sided headache with nausea and sensitivity to light or sound.",["Rest in a dark, quiet room","Note triggers: sleep loss, hunger, strong smells","Keep a headache diary for the doctor"],["More than 2 attacks a month","New pattern or worsening attacks"],NEU,"Common"),
("conjunctivitis","Pink eye (conjunctivitis)","आँख आना",["red_eyes","watery_eyes","itching"],"Red, sticky or watery eyes. Viral and bacterial types spread easily.",["Wash hands often; do not share towels","Clean the eyes with clean, cooled boiled water","Avoid rubbing and avoid contact lenses"],["Pain or reduced vision","Pus-like discharge","Child with red eye"],OPH,"Common"),
("eye_strain","Eye strain","आँखों की थकान",["eye_pain","blurry_vision","headache","red_eyes"],"Tired, dry eyes from long phone or computer use.",["Follow the 20-20-20 rule: every 20 minutes look 20 feet away for 20 seconds","Blink often, adjust screen brightness","Get your eyes tested once a year"],["Vision keeps getting worse","Eye pain with redness"],OPH,"Very common"),
("ear_infection","Ear infection","कान का संक्रमण",["ear_pain","fever"],"Pain and sometimes discharge, common after colds or swimming.",["Keep the ear dry","Do not put oil, drops or buds in the ear","Warm compress outside the ear"],["Discharge from the ear","Hearing loss","Child pulling at ear with fever"],ENT,"Common"),
("dental_problem","Toothache / cavity","दाँत दर्द / कैविटी",["toothache"],"Pain from a cavity, infection or gum disease.",["Rinse with warm salt water","Brush twice a day and floss","Avoid very hot, cold or sweet food"],["Swelling of the face or jaw","Pain lasts more than 2 days"],DEN,"Very common"),
("acne","Acne","मुँहासे",["acne","itching"],"Blocked skin pores, common in teens and adults, often linked with oil, stress and hormones.",["Wash face twice a day with a mild cleanser","Do not squeeze pimples","Avoid heavy oily creams"],["Painful deep cysts or scarring","No improvement in 6–8 weeks"],DER,"Very common"),
("fungal_infection","Fungal infection / ringworm","फंगल इन्फेक्शन / दाद",["itching","rash"],"Itchy, ring-shaped red patches, worse in sweaty folds of the skin and in humid weather.",["Keep skin clean and dry","Wear loose cotton clothes","Do not share towels; avoid steroid creams unless a doctor prescribes them"],["Spreading fast","No relief in a week","Weak immunity or diabetes"],DER,"Very common"),
("eczema","Eczema / dermatitis","एक्ज़िमा",["rash","itching"],"Dry, itchy, inflamed skin that comes and goes.",["Moisturise right after bath","Use mild soap, avoid hot water","Wear soft cotton"],["Skin cracked, oozing or infected","Sleep disturbed by itching"],DER,"Common"),
("hair_fall","Hair fall","बाल झड़ना",["hair_fall"],"Often linked to stress, low iron, thyroid problems or poor diet.",["Protein-rich food and enough iron","Gentle hair care, avoid tight styles","Manage stress and sleep"],["Patchy bald spots","Sudden heavy hair loss"],DER,"Very common"),
("back_strain","Back strain","कमर दर्द",["back_pain","muscle_pain"],"Usually from posture, lifting or long sitting. Most cases improve in 1–2 weeks.",["Stay gently active — long bed rest makes it worse","Hot or cold pack for 15 minutes","Fix your sitting posture"],["Pain going down the leg with numbness","Loss of bladder or bowel control — emergency","Pain after a fall or injury"],ORT,"Very common"),
("neck_strain","Neck / shoulder strain","गर्दन / कंधे का दर्द",["neck_pain","headache","numbness"],"Stiffness from phone, laptop or bad sleeping position.",["Raise screens to eye level","Gentle neck and shoulder stretches","Use a thin pillow"],["Arm numbness or weakness","Pain after an accident"],ORT,"Very common"),
("arthritis","Joint pain / arthritis","जोड़ों का दर्द / गठिया",["joint_pain","muscle_pain","fatigue"],"Pain and stiffness of joints, especially knees, hands and hips.",["Keep moving with gentle exercise","Maintain a healthy weight","Warm compress for stiffness"],["Swollen, hot or red joint","Morning stiffness over 30 minutes","Pain affecting daily work"],ORT,"Common"),
("sprain","Muscle or ankle sprain","मोच",["injury","joint_pain","leg_swelling"],"Stretched ligaments or muscles after a twist or fall.",["Rest, ice for 15 minutes, light compression, raise the limb","Avoid heavy use for a few days"],["Cannot put weight on it","Obvious deformity or severe swelling","Numbness"],ORT,"Common"),
("anemia","Anaemia (low blood)","खून की कमी",["fatigue","dizziness","palpitations","hair_fall"],"Low haemoglobin, often from low iron. Common in women and teens.",["Eat iron-rich foods: leafy greens, jaggery, dates, lentils, with a source of vitamin C","Get a blood test (CBC) before taking any supplements"],["Breathlessness, fainting or chest pain","Heavy periods"],GP,"Common"),
("diabetes_signs","Possible high blood sugar","शुगर बढ़ने के लक्षण",["thirst","frequent_urine","fatigue","weight_loss","blurry_vision"],"These signs can mean high blood sugar. Only a blood test can confirm.",["Get a fasting sugar and HbA1c test","Cut sugary drinks; walk daily"],["Very high thirst with vomiting or confusion — go to hospital","Slow-healing wounds"],DIA,"Common"),
("low_bp","Low blood pressure / dehydration","लो बीपी / पानी की कमी",["dizziness","fatigue","fainting"],"Dizziness on standing, often from dehydration, skipped meals or heat.",["Drink water with a pinch of salt and sugar (ORS)","Rise slowly from lying down","Do not skip meals"],["Fainting","Dizziness with chest pain or palpitations"],GP,"Common"),
("anxiety_stress","Anxiety / stress","चिंता / तनाव",["anxiety","insomnia","palpitations","headache"],"Constant worry, restlessness, racing heart or poor sleep.",["Slow breathing: in for 4 counts, out for 6, for 5 minutes","Regular sleep and walks, less caffeine","Talk to someone you trust"],["Daily worry for 2+ weeks","Panic attacks","Thoughts of self-harm — call Tele-MANAS 14416 or 112 now"],PSY,"Common"),
("insomnia","Poor sleep","नींद की समस्या",["insomnia","anxiety","fatigue"],"Trouble falling or staying asleep.",["Fixed sleep and wake time","No phone for 1 hour before bed","Avoid tea or coffee after 4 pm"],["More than 3 weeks","Daytime sleepiness affecting work"],PSY,"Common"),
("menstrual_cramps","Period cramps","माहवारी का दर्द",["period_pain","back_pain","nausea"],"Lower belly pain before or during periods.",["Hot-water bag on the lower belly","Light walking and stretching","Warm drinks"],["Pain stops you from daily life","Very heavy bleeding","Periods suddenly irregular"],GYN,"Very common"),
("jaundice","Jaundice","पीलिया",["jaundice","appetite_loss","fatigue","nausea"],"Yellow skin or eyes from liver or bile problems. Needs a liver test.",["Rest, drink water, eat light food","Avoid alcohol and oily food; do not take herbal remedies blindly"],["See a doctor the same day — jaundice always needs a test"],GAS,"Less common"),
]
HING_C={'common_cold': 'Aam sardi-zukaam', 'viral_fever': 'Viral bukhar / flu', 'pharyngitis': 'Gale mein kharash', 'allergic_rhinitis': 'Allergy wali sardi', 'sinusitis': 'Sinus', 'bronchitis': 'Khaansi / bronchitis', 'asthma': 'Dama / asthma', 'acidity': 'Acidity', 'gastroenteritis': 'Dast / pet ka infection', 'constipation': 'Kabz', 'uti': 'Peshab ka infection (UTI)', 'tension_headache': 'Tanav wala sir dard', 'migraine': 'Migraine', 'conjunctivitis': 'Aankh aana', 'eye_strain': 'Aankhon ki thakan', 'ear_infection': 'Kaan ka infection', 'dental_problem': 'Daant dard / cavity', 'acne': 'Muhaase', 'fungal_infection': 'Fungal infection / daad', 'eczema': 'Eczema', 'hair_fall': 'Baal jhadna', 'back_strain': 'Kamar dard', 'neck_strain': 'Gardan / kandhe ka dard', 'arthritis': 'Jodon ka dard / gathiya', 'sprain': 'Moch', 'anemia': 'Khoon ki kami', 'diabetes_signs': 'Sugar badhne ke lakshan', 'low_bp': 'Low BP / paani ki kami', 'anxiety_stress': 'Chinta / stress', 'insomnia': 'Neend ki samasya', 'menstrual_cramps': 'Period cramps', 'jaundice': 'Peeliya'}
conditions=[dict(id=a,name=b,hing=HING_C[a],hi=c,symptoms=d,about=e,homeCare=f,seeDoctorIf=g,specialty=h,commonness=i) for a,b,c,d,e,f,g,h,i in C]

# ---- sample doctors (fictional), grouped State > City > Area ----
random.seed(7)
# state -> city -> (areas, local language, price factor, doctors in city)
STATES = {
"Tamil Nadu": {"Chennai": (["Adyar","T. Nagar","Anna Nagar","Velachery","Tambaram","Porur"],"Tamil",1.0,18),
               "Coimbatore": (["RS Puram","Gandhipuram","Peelamedu","Saibaba Colony"],"Tamil",.85,12),
               "Madurai": (["Anna Nagar","KK Nagar","Thallakulam","Villapuram"],"Tamil",.8,12)},
"Maharashtra": {"Mumbai": (["Andheri West","Bandra","Dadar","Borivali","Thane","Powai"],"Marathi",1.15,18),
                "Pune": (["Kothrud","Hadapsar","Baner","Shivajinagar","Wakad","Viman Nagar"],"Marathi",1.0,18),
                "Nagpur": (["Dharampeth","Sitabuldi","Manish Nagar","Sadar"],"Marathi",.85,12)},
"Delhi": {"Delhi": (["Lajpat Nagar","Dwarka","Rohini","Saket","Karol Bagh","Janakpuri"],"Punjabi",1.1,18)},
"Haryana": {"Gurugram": (["DLF Phase 1","Sohna Road","Sector 56","Golf Course Road"],"",1.0,12)},
"Karnataka": {"Bengaluru": (["Indiranagar","Jayanagar","Whitefield","Koramangala","Malleshwaram","HSR Layout"],"Kannada",1.1,18),
              "Mysuru": (["Vijayanagar","Kuvempunagar","Jayalakshmipuram","Saraswathipuram"],"Kannada",.8,12)},
"Telangana": {"Hyderabad": (["Banjara Hills","Madhapur","Kukatpally","Secunderabad","Gachibowli","Dilsukhnagar"],"Telugu",1.0,18)},
"Andhra Pradesh": {"Visakhapatnam": (["MVP Colony","Dwaraka Nagar","Gajuwaka","Madhurawada"],"Telugu",.8,12)},
"Kerala": {"Kochi": (["Edappally","Kakkanad","Panampilly Nagar","Fort Kochi"],"Malayalam",.9,12),
           "Thiruvananthapuram": (["Kowdiar","Pattom","Vazhuthacaud","Technopark"],"Malayalam",.9,12)},
"West Bengal": {"Kolkata": (["Salt Lake","Park Street","Behala","Dum Dum","Garia","Howrah"],"Bengali",.9,18)},
"Gujarat": {"Ahmedabad": (["Navrangpura","Maninagar","Satellite","Bopal","Vastrapur","Naranpura"],"Gujarati",.9,18),
            "Surat": (["Adajan","Vesu","Varachha","Athwa"],"Gujarati",.85,12)},
"Rajasthan": {"Jaipur": (["Malviya Nagar","Vaishali Nagar","C-Scheme","Mansarovar","Jagatpura","Tonk Road"],"",.8,18),
              "Jodhpur": (["Sardarpura","Paota","Ratanada","Shastri Nagar"],"",.75,12)},
"Uttar Pradesh": {"Lucknow": (["Gomti Nagar","Hazratganj","Aliganj","Indira Nagar","Alambagh","Chowk"],"",.8,18),
                  "Varanasi": (["Lanka","Sigra","Bhelupur","Godowlia"],"",.75,12),
                  "Kanpur": (["Kakadeo","Swaroop Nagar","Civil Lines","Arya Nagar"],"",.75,12)},
"Punjab": {"Ludhiana": (["Model Town","Sarabha Nagar","Civil Lines","Dugri"],"Punjabi",.85,12)},
"Bihar": {"Patna": (["Boring Road","Kankarbagh","Rajendra Nagar","Patliputra"],"",.75,12)},
"Madhya Pradesh": {"Indore": (["Vijay Nagar","Palasia","Rajendra Nagar","Saket"],"",.8,12),
                   "Bhopal": (["MP Nagar","Arera Colony","Kolar Road","Shahpura"],"",.8,12)},
"Assam": {"Guwahati": (["Dispur","Beltola","Ganeshguri","Paltan Bazaar"],"Assamese",.8,12)},
"Odisha": {"Bhubaneswar": (["Saheed Nagar","Patia","Nayapalli","Jaydev Vihar"],"Odia",.8,12)},
}
FIRST_M=["Anil","Rajesh","Suresh","Vikram","Arjun","Karthik","Imran","Rohit","Sanjay","Manoj","Prakash","Deepak","Naveen","Faisal","Harish","Amit"]
FIRST_F=["Priya","Anita","Kavita","Sneha","Meera","Divya","Farah","Neha","Lakshmi","Pooja","Radhika","Shalini","Ritu","Swati","Nandini","Aisha"]
LAST=["Sharma","Iyer","Reddy","Patel","Khan","Das","Mehta","Nair","Gupta","Joshi","Verma","Rao","Banerjee","Kulkarni","Singh","Menon","Shah","Pillai","Chopra","Mishra","Kumar","Bose","Naidu","Jain"]
QUAL={GP:"MBBS, MD (Medicine)",PED:"MBBS, MD (Pediatrics)",DER:"MBBS, MD (Dermatology)",ENT:"MBBS, MS (ENT)",ORT:"MBBS, MS (Orthopaedics)",GYN:"MBBS, MS (OB-GYN)",CAR:"MBBS, MD, DM (Cardiology)",GAS:"MBBS, MD, DM (Gastroenterology)",NEU:"MBBS, MD, DM (Neurology)",DEN:"BDS, MDS",OPH:"MBBS, MS (Ophthalmology)",PSY:"MBBS, MD (Psychiatry)",PUL:"MBBS, MD (Pulmonary Medicine)",DIA:"MBBS, MD, Diabetology fellowship"}
BASE={GP:250,PED:350,DER:400,ENT:400,ORT:450,GYN:450,CAR:700,GAS:600,NEU:700,DEN:300,OPH:350,PSY:500,PUL:550,DIA:400}
SPECS=[GP,PED,DER,ENT,ORT,GYN,CAR,GAS,NEU,DEN,OPH,PSY,PUL,DIA,GP,GP,PED,DEN]
doctors=[]; used=set(["Dr. Anil Sharma"])
for state,cities in STATES.items():
  for city,(areas,local,k,count) in cities.items():
    for i,sp in enumerate(SPECS[:count]):
        fem = sp==GYN or random.random()<0.45
        while True:
            n=f"Dr. {random.choice(FIRST_F if fem else FIRST_M)} {random.choice(LAST)}"
            if n not in used: used.add(n); break
        if city=="Chennai" and i==0: n="Dr. Anil Sharma"
        area=areas[i%len(areas)] if i<len(areas) else random.choice(areas)
        exp=random.randint(3,32)
        fee=int(round(BASE[sp]*k*(0.7+random.random()*0.7)*(1+exp/80)/10.0)*10)
        langs=["English","Hindi"]+([local] if local and local!="Punjabi" or local=="Punjabi" and city!="Delhi" else [])
        clinic=random.choice([f"{n.split()[-1]} Clinic",f"{area} Health Centre",f"CarePlus {sp} Clinic",f"{n.split()[-1]} Polyclinic"])
        doctors.append(dict(name=n,specialty=sp,state=state,city=city,area=area,
          address=f"{random.randint(1,120)}, {random.choice(['Main Road','2nd Cross','Station Road','Market Street','Temple Road','Ring Road'])}, {area}, {city}, {state}",
          phone="+91 %d%03d %05d"%(random.choice([98,99,97,96,90,88]),random.randint(0,999),random.randint(0,99999)),
          clinic=clinic,fee=max(fee,150),rating=round(3.9+random.random()*1.0,1),experienceYears=exp,
          qualification=QUAL[sp],languages=", ".join(dict.fromkeys(langs)),
          about=f"{sp} with {exp} years of experience, practising in {area}, {city}."))
for name,data in (("symptoms",symptoms),("conditions",conditions),("doctors",doctors)):
    with open(os.path.join(OUT,name+".json"),"w",encoding="utf-8") as f:
        json.dump(data,f,ensure_ascii=False,indent=1)
print(len(symptoms),"symptoms",len(conditions),"conditions",len(doctors),"doctors",len(STATES),"states")
