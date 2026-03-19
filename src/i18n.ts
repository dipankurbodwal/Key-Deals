import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        crm: 'CRM',
        marketplace: 'Marketplace',
        settings: 'Settings',
        admin: 'Admin',
        subscription: 'Subscription'
      },
      buttons: {
        addProperty: 'Add Property',
        saveClient: 'Save Client',
        captureLocation: 'Capture Location',
        unlockContact: 'Unlock Contact',
        shareSummary: 'Share Summary',
        upgrade: 'Upgrade to Pro',
        login: 'Login',
        logout: 'Logout',
        save: 'Save Changes'
      },
      placeholders: {
        search: 'Search properties...',
        searchLandmark: 'Search by landmark...',
        enterClientName: 'Enter client name...',
        searchProperty: 'Search properties...',
        searchLeads: 'Search by name or phone...'
      },
      status: {
        verified: 'Verified',
        pending: 'Pending',
        subscribed: 'Subscribed',
        new: 'New',
        contacted: 'Contacted',
        qualified: 'Qualified'
      },
      settings: {
        language: 'Language',
        darkMode: 'Dark Mode',
        biometrics: 'Biometric Login',
        companyProfile: 'Company Profile',
        whatsappTemplates: 'WhatsApp Templates'
      },
      dashboard: {
        aiMatchScore: 'AI Client Search',
        selectClient: 'Select Client'
      },
      aiMatch: 'AI Client Search'
    }
  },
  hi: {
    translation: {
      nav: {
        home: 'होम',
        crm: 'सीआरएम',
        marketplace: 'मार्केटप्लेस',
        settings: 'सेटिंग्स',
        admin: 'एडमिन',
        subscription: 'सब्सक्रिप्शन'
      },
      buttons: {
        addProperty: 'प्रॉपर्टी जोड़ें',
        saveClient: 'क्लाइंट सहेजें',
        captureLocation: 'लोकेशन कैप्चर करें',
        unlockContact: 'संपर्क अनलॉक करें',
        shareSummary: 'सारांश साझा करें',
        upgrade: 'प्रो में अपग्रेड करें',
        login: 'लॉगिन',
        logout: 'लॉगआउट',
        save: 'परिवर्तन सहेजें'
      },
      placeholders: {
        searchLandmark: 'लैंडमार्क द्वारा खोजें...',
        enterClientName: 'क्लाइंट का नाम दर्ज करें...',
        searchProperty: 'प्रॉपर्टी खोजें...',
        searchLeads: 'नाम या फोन द्वारा खोजें...'
      },
      status: {
        verified: 'सत्यापित',
        pending: 'लंबित',
        subscribed: 'सब्सक्राइब किया गया',
        new: 'नया',
        contacted: 'संपर्क किया गया',
        qualified: 'योग्य'
      },
      settings: {
        language: 'भाषा',
        darkMode: 'डार्क मोड',
        biometrics: 'बायोमेट्रिक लॉगिन',
        companyProfile: 'कंपनी प्रोफाइल',
        whatsappTemplates: 'व्हाट्सएप टेम्पलेट्स'
      },
      aiMatch: 'एआई क्लाइंट मैच स्कोर'
    }
  },
  mr: {
    translation: {
      nav: {
        home: 'होम',
        crm: 'सीआरएम',
        marketplace: 'मार्केटप्लेस',
        settings: 'सेटिंग्ज',
        admin: 'अ‍ॅडमिन',
        subscription: 'सबस्क्रिप्शन'
      },
      buttons: {
        addProperty: 'प्रॉपर्टी जोडा',
        saveClient: 'क्लायंट जतन करा',
        captureLocation: 'लोकेशन कॅप्चर करा',
        unlockContact: 'संपर्क अनलॉक करा',
        shareSummary: 'सारांश शेअर करा',
        upgrade: 'प्रो मध्ये अपग्रेड करा',
        login: 'लॉगिन',
        logout: 'लॉगआउट',
        save: 'बदल जतन करा'
      },
      placeholders: {
        searchLandmark: 'लँडमार्कनुसार शोधा...',
        enterClientName: 'क्लायंटचे नाव प्रविष्ट करा...',
        searchProperty: 'प्रॉपर्टी शोधा...',
        searchLeads: 'नाव किंवा फोनद्वारे शोधा...'
      },
      status: {
        verified: 'सत्यापित',
        pending: 'प्रलंबित',
        subscribed: 'सबस्क्राइब केलेले',
        new: 'नवीन',
        contacted: 'संपर्क साधला',
        qualified: 'पात्र'
      },
      settings: {
        language: 'भाषा',
        darkMode: 'डार्क मोड',
        biometrics: 'बायोमेट्रिक लॉगिन',
        companyProfile: 'कंपनी प्रोफाइल',
        whatsappTemplates: 'व्हॉट्सअ‍ॅप टेम्पलेट्स'
      },
      aiMatch: 'एआय क्लायंट मॅच स्कोअर'
    }
  },
  te: {
    translation: {
      nav: {
        home: 'హోమ్',
        crm: 'CRM',
        marketplace: 'మార్కెట్‌ప్లేస్',
        settings: 'సెట్టింగ్‌లు',
        admin: 'అడ్మిన్',
        subscription: 'సబ్‌స్క్రిప్షన్'
      },
      buttons: {
        addProperty: 'ప్రాపర్టీని జోడించండి',
        saveClient: 'క్లయింట్‌ను సేవ్ చేయండి',
        captureLocation: 'స్థానాన్ని క్యాప్చర్ చేయండి',
        unlockContact: 'కాంటాక్ట్‌ను అన్‌లాక్ చేయండి',
        shareSummary: 'సారాంశాన్ని షేర్ చేయండి',
        upgrade: 'ప్రోకి అప్‌గ్రేడ్ చేయండి',
        login: 'లాగిన్',
        logout: 'లాగౌట్',
        save: 'మార్పులను సేవ్ చేయండి'
      },
      placeholders: {
        searchLandmark: 'ల్యాండ్‌మార్క్ ద్వారా వెతకండి...',
        enterClientName: 'క్లయింట్ పేరును నమోదు చేయండి...',
        searchProperty: 'ప్రాపర్టీలను వెతకండి...',
        searchLeads: 'పేరు లేదా ఫోన్ ద్వారా వెతకండి...'
      },
      status: {
        verified: 'ధృవీకరించబడింది',
        pending: 'పెండింగ్‌లో ఉంది',
        subscribed: 'సబ్‌స్క్రైబ్ చేయబడింది',
        new: 'కొత్తది',
        contacted: 'సంప్రదించబడింది',
        qualified: 'అర్హత పొందింది'
      },
      settings: {
        language: 'భాష',
        darkMode: 'డార్క్ మోడ్',
        biometrics: 'బయోమెట్రిక్ లాగిన్',
        companyProfile: 'కంపెనీ ప్రొఫైల్',
        whatsappTemplates: 'వాట్సాప్ టెంప్లేట్లు'
      },
      aiMatch: 'AI క్లయింట్ మ్యాచ్ స్కోర్'
    }
  },
  ta: {
    translation: {
      nav: {
        home: 'முகப்பு',
        crm: 'CRM',
        marketplace: 'சந்தை',
        settings: 'அமைப்புகள்',
        admin: 'நிர்வாகி',
        subscription: 'சந்தா'
      },
      buttons: {
        addProperty: 'சொத்தை சேர்',
        saveClient: 'வாடிக்கையாளரை சேமி',
        captureLocation: 'இருப்பிடத்தைப் பிடி',
        unlockContact: 'தொடர்பைத் திற',
        shareSummary: 'சுருக்கத்தைப் பகிர்',
        upgrade: 'ப்ரோவுக்கு மேம்படுத்து',
        login: 'உள்நுழை',
        logout: 'வெளியேறு',
        save: 'மாற்றங்களைச் சேமி'
      },
      placeholders: {
        searchLandmark: 'அடையாளம் மூலம் தேடு...',
        enterClientName: 'வாடிக்கையாளர் பெயரை உள்ளிடுக...',
        searchProperty: 'சொத்துக்களைத் தேடு...',
        searchLeads: 'பெயர் அல்லது தொலைபேசி மூலம் தேடு...'
      },
      status: {
        verified: 'சரிபார்க்கப்பட்டது',
        pending: 'நிலுவையில் உள்ளது',
        subscribed: 'சந்தா கட்டப்பட்டது',
        new: 'புதியது',
        contacted: 'தொடர்பு கொள்ளப்பட்டது',
        qualified: 'தகுதியானது'
      },
      settings: {
        language: 'மொழி',
        darkMode: 'இருண்ட பயன்முறை',
        biometrics: 'பயோமெட்ரிக் உள்நுழைவு',
        companyProfile: 'நிறுவனத்தின் சுயவிவரம்',
        whatsappTemplates: 'வாட்ஸ்அப் வார்ப்புருக்கள்'
      },
      aiMatch: 'AI வாடிக்கையாளர் பொருத்தம் மதிப்பெண்'
    }
  },
  bn: {
    translation: {
      nav: {
        home: 'হোম',
        crm: 'CRM',
        marketplace: 'মার্কেটপ্লেস',
        settings: 'সেটিংস',
        admin: 'অ্যাডমিন',
        subscription: 'সাবস্ক্রিপশন'
      },
      buttons: {
        addProperty: 'প্রপার্টি যোগ করুন',
        saveClient: 'ক্লায়েন্ট সেভ করুন',
        captureLocation: 'লোকেশন ক্যাপচার করুন',
        unlockContact: 'কন্টাক্ট আনলক করুন',
        shareSummary: 'সারাংশ শেয়ার করুন',
        upgrade: 'প্রো-তে আপগ্রেড করুন',
        login: 'লগইন',
        logout: 'লগআউট',
        save: 'পরিবর্তন সেভ করুন'
      },
      placeholders: {
        searchLandmark: 'ল্যান্ডমার্ক দিয়ে খুঁজুন...',
        enterClientName: 'ক্লায়েন্টের নাম লিখুন...',
        searchProperty: 'প্রপার্টি খুঁজুন...',
        searchLeads: 'নাম বা ফোন দিয়ে খুঁজুন...'
      },
      status: {
        verified: 'যাচাইকৃত',
        pending: 'পেন্ডিং',
        subscribed: 'সাবস্ক্রাইব করা',
        new: 'নতুন',
        contacted: 'যোগাযোগ করা হয়েছে',
        qualified: 'যোগ্য'
      },
      settings: {
        language: 'ভাষা',
        darkMode: 'ডার্ক মোড',
        biometrics: 'বায়োমেট্রিক লগইন',
        companyProfile: 'কোম্পানি প্রোফাইল',
        whatsappTemplates: 'হোয়াটসঅ্যাপ টেমপ্লেট'
      },
      aiMatch: 'AI ক্লায়েন্ট ম্যাচ স্কোর'
    }
  },
  gu: {
    translation: {
      nav: {
        home: 'હોમ',
        crm: 'CRM',
        marketplace: 'માર્કેટપ્લેસ',
        settings: 'સેટિંગ્સ',
        admin: 'એડમિન',
        subscription: 'સબ્સ્ક્રિપ્શન'
      },
      buttons: {
        addProperty: 'પ્રોપર્ટી ઉમેરો',
        saveClient: 'ક્લાયંટ સાચવો',
        captureLocation: 'લોકેશન કેપ્ચર કરો',
        unlockContact: 'સંપર્ક અનલોક કરો',
        shareSummary: 'સારાંશ શેર કરો',
        upgrade: 'પ્રોમાં અપગ્રેડ કરો',
        login: 'લોગિન',
        logout: 'લોગઆઉટ',
        save: 'ફેરફારો સાચવો'
      },
      placeholders: {
        searchLandmark: 'લેન્ડમાર્ક દ્વારા શોધો...',
        enterClientName: 'ક્લાયંટનું નામ દાખલ કરો...',
        searchProperty: 'પ્રોપર્ટી શોધો...',
        searchLeads: 'નામ અથવા ફોન દ્વારા શોધો...'
      },
      status: {
        verified: 'ચકાસાયેલ',
        pending: 'બાકી',
        subscribed: 'સબ્સ્ક્રાઇબ કરેલ',
        new: 'નવું',
        contacted: 'સંપર્ક કર્યો',
        qualified: 'લાયક'
      },
      settings: {
        language: 'ભાષા',
        darkMode: 'ડાર્ક મોડ',
        biometrics: 'બાયોમેટ્રિક લોગિન',
        companyProfile: 'કંપની પ્રોફાઇલ',
        whatsappTemplates: 'વોટ્સએપ ટેમ્પલેટ્સ'
      },
      aiMatch: 'AI ક્લાયંટ મેચ સ્કોર'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
