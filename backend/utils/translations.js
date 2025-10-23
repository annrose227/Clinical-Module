// Multilingual translations for HealthTech Scheduler

const translations = {
  en: {
    // Welcome & Basic
    welcome: "🏥 Welcome to HealthTech Scheduler!",
    hello: "Hello",
    selectLanguage: "Please select your preferred language:",
    languageSet: "✅ Language set to English",
    
    // Commands
    bookAppointment: "📅 Book Appointment",
    help: "❓ Help",
    checkStatus: "📋 Check Status",
    
    // Patient Type
    patientTypeQuestion: "Are you a new or existing patient?",
    newPatient: "👤 New Patient",
    existingPatient: "🔍 Existing Patient",
    
    // Lookup Methods
    lookupMethod: "How would you like to find your patient record?",
    patientId: "🆔 Patient ID",
    phoneNumber: "📱 Phone Number",
    
    // Registration Flow
    enterPhone: "Please provide your phone number.\n\nInclude country code:\n• +91 9778393574\n• +919778393574\n• 9778393574 (we'll add +91)\n\nThis will be used for appointment confirmations and reminders.",
    enterName: "Now, what's your full name?",
    enterDob: "What's your date of birth?\n\nPlease use format: YYYY-MM-DD\nExample: 1990-05-15",
    enterEmail: "What's your email address?\n\nYou can type \"skip\" if you prefer not to provide it.",
    
    // Patient Found
    patientFound: "🔍 Patient Found!",
    isThisYou: "Is this you?",
    yesThatsMe: "✅ Yes, that's me",
    noDifferent: "❌ No, different number",
    
    // Welcome Back
    welcomeBack: "✅ Welcome back",
    patientDetails: "📋 Patient Details:",
    patientIdLabel: "Patient ID:",
    phoneLabel: "Phone:",
    registeredLabel: "Registered:",
    
    // Symptoms
    enterSymptoms: "Please describe your symptoms or reason for this visit:",
    
    // Doctor Selection
    selectDoctor: "👨‍⚕️ Select a Doctor\n\nWhich doctor would you like to see for your symptoms?",
    drJohnson: "👨‍⚕️ Dr. Sarah Johnson (General Medicine)",
    drChen: "❤️ Dr. Michael Chen (Cardiology)",
    drRodriguez: "👶 Dr. Emily Rodriguez (Pediatrics)",
    drKim: "🦴 Dr. David Kim (Orthopedics)",
    
    // Slots
    availableSlots: "📅 Available Slots for",
    selectTime: "Please select your preferred time:",
    today: "Today",
    tomorrow: "Tomorrow",
    
    // Booking Summary
    bookingSummary: "📋 Booking Summary",
    patient: "👤 Patient:",
    doctor: "👨‍⚕️ Doctor:",
    department: "🏥 Department:",
    time: "📅 Time:",
    symptoms: "💬 Symptoms:",
    confirmBooking: "✅ Confirm Booking",
    cancelBooking: "❌ Cancel",
    
    // Confirmation
    appointmentConfirmed: "✅ Appointment Confirmed!",
    token: "🎫 Token:",
    dateTime: "📅 Date & Time:",
    important: "📱 Important:",
    arriveEarly: "• Arrive 15 minutes early",
    bringId: "• Bring valid ID and insurance card",
    showToken: "• Show your token at reception",
    qrCode: "🔲 Your Appointment QR Code",
    showQr: "Show this QR code at the hospital reception.",
    
    // Errors & Validation
    invalidPhone: "❌ Invalid Phone Number\n\nPlease provide a valid phone number with at least 10 digits.",
    invalidName: "Please provide a valid name (at least 2 characters).",
    invalidDob: "Please provide date of birth in YYYY-MM-DD format (e.g., 1990-05-15).",
    invalidEmail: "Please provide a valid email address or type \"skip\" to continue without email.",
    patientNotFound: "❌ Patient Not Found\n\nNo patient record found with this information.",
    
    // Help
    helpTitle: "🆘 HealthTech Scheduler Help",
    howToBook: "How to book an appointment:",
    step1: "1. Type /book or click \"Book Appointment\"",
    step2: "2. Choose if you're a new or existing patient",
    step3: "3. Provide required information",
    step4: "4. Select doctor and time slot",
    step5: "5. Confirm your booking",
    
    // Contact
    needHelp: "Need human assistance?",
    phone: "📞 Call: (555) 123-4567",
    email: "📧 Email: support@healthtech.com",
    hours: "🕒 Hours: Mon-Fri 8AM-6PM",
    
    // Status Check
    appointmentStatus: "📅 Appointment Status",
    status: "📊 Status:",
    room: "🚪 Room:",
    
    // Additional UI Elements
    language: "Language",
    available: "Available",
    platform: "Platform",
    quickActions: "Quick Actions",
    bookNewAppointment: "Book new appointment",
    checkAppointmentStatus: "Check appointment status",
    changeLanguage: "Change language",
    getHelpSupport: "Get help & support",
    tipUseBook: "Tip: Use /book for fastest booking!",
    readyToBook: "Ready to book your appointment?",
    contact: "Contact",
    
    // Registration Messages
    phoneConfirmed: "Phone Number Confirmed",
    validationError: "Validation Error",
    phoneValidationError: "Sorry, there was an error validating your phone number. Please try again.",
    foundExistingPatient: "We found an existing patient with this phone number:",
    name: "Name",
    great: "Great!",
    perfect: "Perfect!",
    dobFutureError: "Date of birth cannot be in the future. Please try again.",
    registrationComplete: "Registration Complete!",
    yourPatientId: "Your Patient ID",
    saveIdFuture: "Please save this ID for future appointments",
    registrationError: "Sorry, there was an error creating your patient record. Please try again with /book",
    
    // Lookup Messages
    patientIdLookup: "Patient ID Lookup",
    providePatientId: "Please provide your Patient ID.",
    formatPT: "Format: PT followed by 10 digits",
    examplePT: "Example: PT2024123456",
    findIdLocation: "You can find your Patient ID on previous appointment confirmations or discharge papers.",
    phoneNumberLookup: "Phone Number Lookup",
    provideRegisteredPhone: "Please provide your registered phone number.",
    formatIncludeCountry: "Format: Include country code",
    phoneExamples: "Examples:",
    phoneUsedRegistering: "This should be the phone number you used when registering.",
    
    // Process Messages
    typeBookHelp: "Type /book to start booking an appointment, or /help for assistance.",
    selectLookupMethod: "Please select a lookup method using the buttons above.",
    useButtonsConfirm: "Please use the buttons above to confirm if this is your record.",
    didntUnderstand: "I didn't understand that. Type /help for available commands.",
    somethingWentWrong: "Sorry, something went wrong. Please try again.",
    
    // Common
    yes: "Yes",
    no: "No",
    skip: "Skip",
    back: "Back",
    next: "Next",
    confirm: "Confirm",
    cancel: "Cancel"
  },
  
  ml: { // Malayalam
    // Welcome & Basic
    welcome: "🏥 ഹെൽത്ത്‌ടെക് ഷെഡ്യൂളറിലേക്ക് സ്വാഗതം!",
    hello: "നമസ്കാരം",
    selectLanguage: "ദയവായി നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക:",
    languageSet: "✅ ഭാഷ മലയാളത്തിലേക്ക് മാറ്റി",
    
    // Commands
    bookAppointment: "📅 അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക",
    help: "❓ സഹായം",
    checkStatus: "📋 സ്റ്റാറ്റസ് പരിശോധിക്കുക",
    
    // Patient Type
    patientTypeQuestion: "നിങ്ങൾ പുതിയ രോഗിയാണോ അതോ നിലവിലുള്ള രോഗിയാണോ?",
    newPatient: "👤 പുതിയ രോഗി",
    existingPatient: "🔍 നിലവിലുള്ള രോഗി",
    
    // Lookup Methods
    lookupMethod: "നിങ്ങളുടെ രോഗി രേഖ എങ്ങനെ കണ്ടെത്താൻ ആഗ്രഹിക്കുന്നു?",
    patientId: "🆔 രോഗി ഐഡി",
    phoneNumber: "📱 ഫോൺ നമ്പർ",
    
    // Registration Flow
    enterPhone: "ദയവായി നിങ്ങളുടെ ഫോൺ നമ്പർ നൽകുക.\n\nകൺട്രി കോഡ് ഉൾപ്പെടുത്തുക:\n• +91 9778393574\n• +919778393574\n• 9778393574 (ഞങ്ങൾ +91 ചേർക്കും)\n\nഇത് അപ്പോയിന്റ്മെന്റ് സ്ഥിരീകരണത്തിനും ഓർമ്മപ്പെടുത്തലുകൾക്കും ഉപയോഗിക്കും.",
    enterName: "ഇപ്പോൾ, നിങ്ങളുടെ പൂർണ്ണ നാമം എന്താണ്?",
    enterDob: "നിങ്ങളുടെ ജന്മതീയതി എന്താണ്?\n\nദയവായി ഈ ഫോർമാറ്റ് ഉപയോഗിക്കുക: YYYY-MM-DD\nഉദാഹരണം: 1990-05-15",
    enterEmail: "നിങ്ങളുടെ ഇമെയിൽ വിലാസം എന്താണ്?\n\nനൽകാൻ ആഗ്രഹിക്കുന്നില്ലെങ്കിൽ \"skip\" ടൈപ്പ് ചെയ്യുക.",
    
    // Patient Found
    patientFound: "🔍 രോഗി കണ്ടെത്തി!",
    isThisYou: "ഇത് നിങ്ങളാണോ?",
    yesThatsMe: "✅ അതെ, അത് ഞാനാണ്",
    noDifferent: "❌ ഇല്ല, വ്യത്യസ്ത നമ്പർ",
    
    // Welcome Back
    welcomeBack: "✅ തിരികെ സ്വാഗതം",
    patientDetails: "📋 രോഗി വിവരങ്ങൾ:",
    patientIdLabel: "രോഗി ഐഡി:",
    phoneLabel: "ഫോൺ:",
    registeredLabel: "രജിസ്റ്റർ ചെയ്തത്:",
    
    // Symptoms
    enterSymptoms: "ദയവായി നിങ്ങളുടെ ലക്ഷണങ്ങൾ അല്ലെങ്കിൽ സന്ദർശനത്തിന്റെ കാരണം വിവരിക്കുക:",
    
    // Doctor Selection
    selectDoctor: "👨‍⚕️ ഒരു ഡോക്ടറെ തിരഞ്ഞെടുക്കുക\n\nനിങ്ങളുടെ ലക്ഷണങ്ങൾക്കായി ഏത് ഡോക്ടറെ കാണാൻ ആഗ്രഹിക്കുന്നു?",
    drJohnson: "👨‍⚕️ ഡോ. സാറാ ജോൺസൺ (ജനറൽ മെഡിസിൻ)",
    drChen: "❤️ ഡോ. മൈക്കൽ ചെൻ (കാർഡിയോളജി)",
    drRodriguez: "👶 ഡോ. എമിലി റോഡ്രിഗസ് (പീഡിയാട്രിക്സ്)",
    drKim: "🦴 ഡോ. ഡേവിഡ് കിം (ഓർത്തോപീഡിക്സ്)",
    
    // Slots
    availableSlots: "📅 ലഭ്യമായ സമയങ്ങൾ",
    selectTime: "ദയവായി നിങ്ങളുടെ ഇഷ്ട സമയം തിരഞ്ഞെടുക്കുക:",
    today: "ഇന്ന്",
    tomorrow: "നാളെ",
    
    // Booking Summary
    bookingSummary: "📋 ബുക്കിംഗ് സംഗ്രഹം",
    patient: "👤 രോഗി:",
    doctor: "👨‍⚕️ ഡോക്ടർ:",
    department: "🏥 വിഭാഗം:",
    time: "📅 സമയം:",
    symptoms: "💬 ലക്ഷണങ്ങൾ:",
    confirmBooking: "✅ ബുക്കിംഗ് സ്ഥിരീകരിക്കുക",
    cancelBooking: "❌ റദ്ദാക്കുക",
    
    // Confirmation
    appointmentConfirmed: "✅ അപ്പോയിന്റ്മെന്റ് സ്ഥിരീകരിച്ചു!",
    token: "🎫 ടോക്കൺ:",
    dateTime: "📅 തീയതിയും സമയം:",
    important: "📱 പ്രധാനം:",
    arriveEarly: "• 15 മിനിറ്റ് നേരത്തെ എത്തുക",
    bringId: "• സാധുവായ ഐഡിയും ഇൻഷുറൻസ് കാർഡും കൊണ്ടുവരുക",
    showToken: "• റിസപ്ഷനിൽ നിങ്ങളുടെ ടോക്കൺ കാണിക്കുക",
    qrCode: "🔲 നിങ്ങളുടെ അപ്പോയിന്റ്മെന്റ് QR കോഡ്",
    showQr: "ഹോസ്പിറ്റൽ റിസപ്ഷനിൽ ഈ QR കോഡ് കാണിക്കുക.",
    
    // Additional UI Elements
    language: "ഭാഷ",
    available: "ലഭ്യമാണ്",
    platform: "പ്ലാറ്റ്ഫോം",
    quickActions: "വേഗത്തിലുള്ള പ്രവർത്തനങ്ങൾ",
    bookNewAppointment: "പുതിയ അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക",
    checkAppointmentStatus: "അപ്പോയിന്റ്മെന്റ് സ്റ്റാറ്റസ് പരിശോധിക്കുക",
    changeLanguage: "ഭാഷ മാറ്റുക",
    getHelpSupport: "സഹായവും പിന്തുണയും നേടുക",
    tipUseBook: "ടിപ്പ്: വേഗത്തിലുള്ള ബുക്കിംഗിനായി /book ഉപയോഗിക്കുക!",
    readyToBook: "നിങ്ങളുടെ അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യാൻ തയ്യാറാണോ?",
    contact: "ബന്ധപ്പെടുക",
    
    // Registration Messages
    phoneConfirmed: "ഫോൺ നമ്പർ സ്ഥിരീകരിച്ചു",
    validationError: "സാധുതാ പിശക്",
    phoneValidationError: "ക്ഷമിക്കണം, നിങ്ങളുടെ ഫോൺ നമ്പർ സാധൂകരിക്കുന്നതിൽ പിശകുണ്ടായി. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
    foundExistingPatient: "ഈ ഫോൺ നമ്പറിൽ നിലവിലുള്ള രോഗിയെ ഞങ്ങൾ കണ്ടെത്തി:",
    name: "പേര്",
    great: "മികച്ചത്!",
    perfect: "പെർഫെക്റ്റ്!",
    dobFutureError: "ജന്മതീയതി ഭാവിയിൽ ആകാൻ കഴിയില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
    registrationComplete: "രജിസ്ട്രേഷൻ പൂർത്തിയായി!",
    yourPatientId: "നിങ്ങളുടെ രോഗി ഐഡി",
    saveIdFuture: "ഭാവിയിലെ അപ്പോയിന്റ്മെന്റുകൾക്കായി ഈ ഐഡി സേവ് ചെയ്യുക",
    registrationError: "ക്ഷമിക്കണം, നിങ്ങളുടെ രോഗി രേഖ സൃഷ്ടിക്കുന്നതിൽ പിശകുണ്ടായി. /book ഉപയോഗിച്ച് വീണ്ടും ശ്രമിക്കുക",
    
    // Lookup Messages
    patientIdLookup: "രോഗി ഐഡി തിരയൽ",
    providePatientId: "ദയവായി നിങ്ങളുടെ രോഗി ഐഡി നൽകുക.",
    formatPT: "ഫോർമാറ്റ്: PT കഴിഞ്ഞ് 10 അക്കങ്ങൾ",
    examplePT: "ഉദാഹരണം: PT2024123456",
    findIdLocation: "മുമ്പത്തെ അപ്പോയിന്റ്മെന്റ് സ്ഥിരീകരണങ്ങളിലോ ഡിസ്ചാർജ് പേപ്പറുകളിലോ നിങ്ങളുടെ രോഗി ഐഡി കണ്ടെത്താം.",
    phoneNumberLookup: "ഫോൺ നമ്പർ തിരയൽ",
    provideRegisteredPhone: "ദയവായി നിങ്ങളുടെ രജിസ്റ്റർ ചെയ്ത ഫോൺ നമ്പർ നൽകുക.",
    formatIncludeCountry: "ഫോർമാറ്റ്: കൺട്രി കോഡ് ഉൾപ്പെടുത്തുക",
    phoneExamples: "ഉദാഹരണങ്ങൾ:",
    phoneUsedRegistering: "രജിസ്റ്റർ ചെയ്യുമ്പോൾ ഉപയോഗിച്ച ഫോൺ നമ്പർ ആയിരിക്കണം ഇത്.",
    
    // Process Messages
    typeBookHelp: "അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യാൻ /book ടൈപ്പ് ചെയ്യുക, അല്ലെങ്കിൽ സഹായത്തിനായി /help ടൈപ്പ് ചെയ്യുക.",
    selectLookupMethod: "ദയവായി മുകളിലുള്ള ബട്ടണുകൾ ഉപയോഗിച്ച് ഒരു തിരയൽ രീതി തിരഞ്ഞെടുക്കുക.",
    useButtonsConfirm: "ഇത് നിങ്ങളുടെ രേഖയാണോ എന്ന് സ്ഥിരീകരിക്കാൻ ദയവായി മുകളിലുള്ള ബട്ടണുകൾ ഉപയോഗിക്കുക.",
    didntUnderstand: "എനിക്ക് അത് മനസ്സിലായില്ല. ലഭ്യമായ കമാൻഡുകൾക്കായി /help ടൈപ്പ് ചെയ്യുക.",
    somethingWentWrong: "ക്ഷമിക്കണം, എന്തോ തെറ്റ് സംഭവിച്ചു. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
    
    // Common
    yes: "അതെ",
    no: "ഇല്ല",
    skip: "ഒഴിവാക്കുക",
    back: "തിരികെ",
    next: "അടുത്തത്",
    confirm: "സ്ഥിരീകരിക്കുക",
    cancel: "റദ്ദാക്കുക"
  },
  
  ta: { // Tamil
    // Welcome & Basic
    welcome: "🏥 ஹெல்த்டெக் ஷெட்யூலருக்கு வரவேற்கிறோம்!",
    hello: "வணக்கம்",
    selectLanguage: "தயவுசெய்து உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்:",
    languageSet: "✅ மொழி தமிழுக்கு மாற்றப்பட்டது",
    
    // Commands
    bookAppointment: "📅 அப்பாயிண்ட்மென்ட் புக் செய்யுங்கள்",
    help: "❓ உதவி",
    checkStatus: "📋 நிலையைச் சரிபார்க்கவும்",
    
    // Patient Type
    patientTypeQuestion: "நீங்கள் புதிய நோயாளியா அல்லது ஏற்கனவே உள்ள நோயாளியா?",
    newPatient: "👤 புதிய நோயாளி",
    existingPatient: "🔍 ஏற்கனவே உள்ள நோயாளி",
    
    // Lookup Methods
    lookupMethod: "உங்கள் நோயாளி பதிவை எப்படி கண்டுபிடிக்க விரும்புகிறீர்கள்?",
    patientId: "🆔 நோயாளி ஐடி",
    phoneNumber: "📱 தொலைபேசி எண்",
    
    // Registration Flow
    enterPhone: "தயவுசெய்து உங்கள் தொலைபேசி எண்ணை வழங்கவும்.\n\nநாட்டுக் குறியீட்டை சேர்க்கவும்:\n• +91 9778393574\n• +919778393574\n• 9778393574 (நாங்கள் +91 சேர்ப்போம்)\n\nஇது அப்பாயிண்ட்மென்ட் உறுதிப்படுத்தல் மற்றும் நினைவூட்டல்களுக்கு பயன்படுத்தப்படும்.",
    enterName: "இப்போது, உங்கள் முழு பெயர் என்ன?",
    enterDob: "உங்கள் பிறந்த தேதி என்ன?\n\nதயவுசெய்து இந்த வடிவத்தைப் பயன்படுத்துங்கள்: YYYY-MM-DD\nஉதாரணம்: 1990-05-15",
    enterEmail: "உங்கள் மின்னஞ்சல் முகவரி என்ன?\n\nவழங்க விரும்பவில்லை என்றால் \"skip\" என்று தட்டச்சு செய்யுங்கள்.",
    
    // Patient Found
    patientFound: "🔍 நோயாளி கண்டுபிடிக்கப்பட்டார்!",
    isThisYou: "இது நீங்கள்தானா?",
    yesThatsMe: "✅ ஆம், அது நான்தான்",
    noDifferent: "❌ இல்லை, வேறு எண்",
    
    // Welcome Back
    welcomeBack: "✅ மீண்டும் வரவேற்கிறோம்",
    patientDetails: "📋 நோயாளி விவரங்கள்:",
    patientIdLabel: "நோயாளி ஐடி:",
    phoneLabel: "தொலைபேசி:",
    registeredLabel: "பதிவு செய்யப்பட்டது:",
    
    // Symptoms
    enterSymptoms: "தயவுசெய்து உங்கள் அறிகுறிகள் அல்லது வருகைக்கான காரணத்தை விவரிக்கவும்:",
    
    // Doctor Selection
    selectDoctor: "👨‍⚕️ ஒரு மருத்துவரைத் தேர்ந்தெடுக்கவும்\n\nஉங்கள் அறிகுறிகளுக்கு எந்த மருத்துவரைப் பார்க்க விரும்புகிறீர்கள்?",
    drJohnson: "👨‍⚕️ டாக்டர் சாரா ஜான்சன் (பொது மருத்துவம்)",
    drChen: "❤️ டாக்டர் மைக்கேல் சென் (இதயவியல்)",
    drRodriguez: "👶 டாக்டர் எமிலி ரோட்ரிகஸ் (குழந்தைகள் மருத்துவம்)",
    drKim: "🦴 டாக்டர் டேவிட் கிம் (எலும்பியல்)",
    
    // Additional UI Elements
    language: "மொழி",
    available: "கிடைக்கிறது",
    platform: "தளம்",
    quickActions: "விரைவான செயல்கள்",
    bookNewAppointment: "புதிய அப்பாயிண்ட்மென்ட் புக் செய்யுங்கள்",
    checkAppointmentStatus: "அப்பாயிண்ட்மென்ட் நிலையைச் சரிபார்க்கவும்",
    changeLanguage: "மொழியை மாற்றவும்",
    getHelpSupport: "உதவி மற்றும் ஆதரவைப் பெறுங்கள்",
    tipUseBook: "குறிப்பு: வேகமான புக்கிங்கிற்கு /book பயன்படுத்துங்கள்!",
    readyToBook: "உங்கள் அப்பாயிண்ட்மென்ட் புக் செய்ய தயாரா?",
    contact: "தொடர்பு",
    
    // Registration Messages
    phoneConfirmed: "தொலைபேசி எண் உறுதிப்படுத்தப்பட்டது",
    validationError: "சரிபார்ப்பு பிழை",
    phoneValidationError: "மன்னிக்கவும், உங்கள் தொலைபேசி எண்ணை சரிபார்ப்பதில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
    foundExistingPatient: "இந்த தொலைபேசி எண்ணில் ஏற்கனவே உள்ள நோயாளியை நாங்கள் கண்டுபிடித்தோம்:",
    name: "பெயர்",
    great: "அருமை!",
    perfect: "சரியானது!",
    dobFutureError: "பிறந்த தேதி எதிர்காலத்தில் இருக்க முடியாது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
    registrationComplete: "பதிவு முடிந்தது!",
    yourPatientId: "உங்கள் நோயாளி ஐடி",
    saveIdFuture: "எதிர்கால அப்பாயிண்ட்மென்ட்களுக்காக இந்த ஐடியை சேமிக்கவும்",
    registrationError: "மன்னிக்கவும், உங்கள் நோயாளி பதிவை உருவாக்குவதில் பிழை ஏற்பட்டது. /book உடன் மீண்டும் முயற்சிக்கவும்",
    
    // Process Messages
    typeBookHelp: "அப்பாயிண்ட்மென்ட் புக் செய்ய /book டைப் செய்யுங்கள், அல்லது உதவிக்கு /help டைப் செய்யுங்கள்.",
    selectLookupMethod: "தயவுசெய்து மேலே உள்ள பட்டன்களைப் பயன்படுத்தி ஒரு தேடல் முறையைத் தேர்ந்தெடுக்கவும்.",
    useButtonsConfirm: "இது உங்கள் பதிவு என்பதை உறுதிப்படுத்த தயவுசெய்து மேலே உள்ள பட்டன்களைப் பயன்படுத்துங்கள்.",
    didntUnderstand: "எனக்கு அது புரியவில்லை. கிடைக்கும் கட்டளைகளுக்கு /help டைப் செய்யுங்கள்.",
    somethingWentWrong: "மன்னிக்கவும், ஏதோ தவறு நடந்தது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
    
    // Common
    yes: "ஆம்",
    no: "இல்லை",
    skip: "தவிர்க்கவும்",
    back: "பின்னால்",
    next: "அடுத்து",
    confirm: "உறுதிப்படுத்து",
    cancel: "ரத்து செய்"
  },
  
  hi: { // Hindi
    // Welcome & Basic
    welcome: "🏥 हेल्थटेक शेड्यूलर में आपका स्वागत है!",
    hello: "नमस्ते",
    selectLanguage: "कृपया अपनी भाषा चुनें:",
    languageSet: "✅ भाषा हिंदी में सेट की गई",
    
    // Commands
    bookAppointment: "📅 अपॉइंटमेंट बुक करें",
    help: "❓ सहायता",
    checkStatus: "📋 स्थिति जांचें",
    
    // Patient Type
    patientTypeQuestion: "क्या आप नए मरीज़ हैं या मौजूदा मरीज़ हैं?",
    newPatient: "👤 नया मरीज़",
    existingPatient: "🔍 मौजूदा मरीज़",
    
    // Lookup Methods
    lookupMethod: "आप अपना मरीज़ रिकॉर्ड कैसे खोजना चाहते हैं?",
    patientId: "🆔 मरीज़ आईडी",
    phoneNumber: "📱 फोन नंबर",
    
    // Registration Flow
    enterPhone: "कृपया अपना फोन नंबर प्रदान करें।\n\nकंट्री कोड शामिल करें:\n• +91 9778393574\n• +919778393574\n• 9778393574 (हम +91 जोड़ेंगे)\n\nइसका उपयोग अपॉइंटमेंट पुष्टि और रिमाइंडर के लिए किया जाएगा।",
    enterName: "अब, आपका पूरा नाम क्या है?",
    enterDob: "आपकी जन्म तिथि क्या है?\n\nकृपया इस प्रारूप का उपयोग करें: YYYY-MM-DD\nउदाहरण: 1990-05-15",
    enterEmail: "आपका ईमेल पता क्या है?\n\nयदि आप प्रदान नहीं करना चाहते तो \"skip\" टाइप करें।",
    
    // Additional UI Elements
    language: "भाषा",
    available: "उपलब्ध",
    platform: "प्लेटफॉर्म",
    quickActions: "त्वरित कार्य",
    bookNewAppointment: "नई अपॉइंटमेंट बुक करें",
    checkAppointmentStatus: "अपॉइंटमेंट स्थिति जांचें",
    changeLanguage: "भाषा बदलें",
    getHelpSupport: "सहायता और समर्थन प्राप्त करें",
    tipUseBook: "सुझाव: तेज़ बुकिंग के लिए /book का उपयोग करें!",
    readyToBook: "अपनी अपॉइंटमेंट बुक करने के लिए तैयार हैं?",
    contact: "संपर्क",
    
    // Registration Messages
    phoneConfirmed: "फोन नंबर की पुष्टि हो गई",
    validationError: "सत्यापन त्रुटि",
    phoneValidationError: "खुशी, आपके फोन नंबर को सत्यापित करने में त्रुटि हुई। कृपया पुनः प्रयास करें।",
    foundExistingPatient: "हमें इस फोन नंबर पर मौजूदा मरीज़ मिला:",
    name: "नाम",
    great: "बहुत बढ़िया!",
    perfect: "परफेक्ट!",
    dobFutureError: "जन्म तिथि भविष्य में नहीं हो सकती। कृपया पुनः प्रयास करें।",
    registrationComplete: "पंजीकरण पूर्ण!",
    yourPatientId: "आपकी मरीज़ आईडी",
    saveIdFuture: "भविष्य की अपॉइंटमेंट के लिए इस आईडी को सेव करें",
    registrationError: "खुशी, आपका मरीज़ रिकॉर्ड बनाने में त्रुटि हुई। /book के साथ पुनः प्रयास करें",
    
    // Process Messages
    typeBookHelp: "अपॉइंटमेंट बुक करने के लिए /book टाइप करें, या सहायता के लिए /help टाइप करें।",
    selectLookupMethod: "कृपया ऊपर दिए गए बटन का उपयोग करके एक खोज विधि चुनें।",
    useButtonsConfirm: "कृपया यह पुष्टि करने के लिए ऊपर दिए गए बटन का उपयोग करें कि यह आपका रिकॉर्ड है।",
    didntUnderstand: "मुझे वह समझ नहीं आया। उपलब्ध कमांड के लिए /help टाइप करें।",
    somethingWentWrong: "खुशी, कुछ गलत हुआ। कृपया पुनः प्रयास करें।",
    
    // Common
    yes: "हाँ",
    no: "नहीं",
    skip: "छोड़ें",
    back: "वापस",
    next: "अगला",
    confirm: "पुष्टि करें",
    cancel: "रद्द करें"
  },
  
  te: { // Telugu
    // Welcome & Basic
    welcome: "🏥 హెల్త్‌టెక్ షెడ్యూలర్‌కు స్వాగతం!",
    hello: "నమస్కారం",
    selectLanguage: "దయచేసి మీ భాషను ఎంచుకోండి:",
    languageSet: "✅ భాష తెలుగుకు మార్చబడింది",
    
    // Commands
    bookAppointment: "📅 అపాయింట్‌మెంట్ బుక్ చేయండి",
    help: "❓ సహాయం",
    checkStatus: "📋 స్థితిని తనిఖీ చేయండి",
    
    // Patient Type
    patientTypeQuestion: "మీరు కొత్త రోగి లేదా ఇప్పటికే ఉన్న రోగి?",
    newPatient: "👤 కొత్త రోగి",
    existingPatient: "🔍 ఇప్పటికే ఉన్న రోగి",
    
    // Additional UI Elements
    language: "భాష",
    available: "అందుబాటులో ఉంది",
    platform: "ప్లాట్‌ఫారమ్",
    quickActions: "త్వరిత చర్యలు",
    bookNewAppointment: "కొత్త అపాయింట్‌మెంట్ బుక్ చేయండి",
    checkAppointmentStatus: "అపాయింట్‌మెంట్ స్థితిని తనిఖీ చేయండి",
    changeLanguage: "భాష మార్చండి",
    getHelpSupport: "సహాయం మరియు మద్దతు పొందండి",
    tipUseBook: "చిట్కా: వేగవంతమైన బుకింగ్ కోసం /book ఉపయోగించండి!",
    readyToBook: "మీ అపాయింట్‌మెంట్ బుక్ చేయడానికి సిద్ధంగా ఉన్నారా?",
    contact: "సంప్రదించండి",
    
    // Process Messages
    typeBookHelp: "అపాయింట్‌మెంట్ బుక్ చేయడానికి /book టైప్ చేయండి, లేదా సహాయం కోసం /help టైప్ చేయండి.",
    selectLookupMethod: "దయచేసి పైన ఉన్న బటన్‌లను ఉపయోగించి శోధన పద్ధతిని ఎంచుకోండి.",
    useButtonsConfirm: "ఇది మీ రికార్డ్ అని నిర్ధారించడానికి దయచేసి పైన ఉన్న బటన్‌లను ఉపయోగించండి.",
    didntUnderstand: "నాకు అది అర్థం కాలేదు. అందుబాటులో ఉన్న కమాండ్‌ల కోసం /help టైప్ చేయండి.",
    somethingWentWrong: "క్షమించండి, ఏదో తప్పు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.",
    
    // Common
    yes: "అవును",
    no: "లేదు",
    skip: "దాటవేయండి",
    back: "వెనుకకు",
    next: "తదుపరి",
    confirm: "నిర్ధారించండి",
    cancel: "రద్దు చేయండి"
  }
};

// Helper function to get translation
function getTranslation(language, key, fallback = null) {
  const lang = translations[language] || translations['en'];
  return lang[key] || translations['en'][key] || fallback || key;
}

// Helper function to get available languages
function getAvailableLanguages() {
  return [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' }
  ];
}

module.exports = {
  translations,
  getTranslation,
  getAvailableLanguages
};