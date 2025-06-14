// Internationalization system for English and Uzbek

export interface Translations {
  // Navigation
  nav: {
    home: string;
    search: string;
    upload: string;
    collections: string;
    profile: string;
  };
  
  // Common
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    close: string;
    loading: string;
    error: string;
    success: string;
    tryAgain: string;
    continue: string;
    back: string;
    next: string;
    submit: string;
    confirm: string;
  };

  // Authentication
  auth: {
    signIn: string;
    signUp: string;
    signOut: string;
    email: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    createAccount: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    signInRequired: string;
    pleaseSignIn: string;
  };

  // Profile
  profile: {
    editProfile: string;
    profileInformation: string;
    username: string;
    bio: string;
    profilePhoto: string;
    uploadPhoto: string;
    uploading: string;
    languagePreference: string;
    chooseLanguage: string;
    maxFileSize: string;
    supportedFormats: string;
    saveChanges: string;
    saving: string;
    profileUpdated: string;
    loadingProfile: string;
  };

  // Upload Flow
  upload: {
    identifyWildlife: string;
    captureWildlife: string;
    uploadPhoto: string;
    choosePhoto: string;
    readyToIdentify: string;
    readyToAnalyze: string;
    analyzing: string;
    identifySpecies: string;
    speciesIdentified: string;
    identificationFailed: string;
    sharingDiscovery: string;
    aboutThisSpecies: string;
    habitat: string;
    diet: string;
    behavior: string;
    conservationStatus: string;
    interestingFacts: string;
    identificationNotes: string;
    aiAnalysis: string;
    saveToCollection: string;
    shareDiscovery: string;
    failedToIdentify: string;
    note: string;
    takeClearPictures: string;
    tipsForBetter: string;
    ensureGoodLighting: string;
    getCloseToSubject: string;
    avoidBlurryImages: string;
    includeDistinctive: string;
    chooseDifferentPhoto: string;
    confidence: string;
    high: string;
    medium: string;
    low: string;
  };

  // Post interactions
  posts: {
    like: string;
    comment: string;
    share: string;
    save: string;
    viewComments: string;
    addComment: string;
    noComments: string;
    writeComment: string;
    posting: string;
    discoverySaved: string;
    discoveryShared: string;
    missingInfo: string;
    errorCreating: string;
    errorSaving: string;
  };

  // Feed
  feed: {
    wildlife: string;
    discoveries: string;
    noPostsYet: string;
    startSharing: string;
    refreshFeed: string;
    loadingFeed: string;
    pullToRefresh: string;
  };

  // Search
  search: {
    searchWildlife: string;
    searchPlaceholder: string;
    noResults: string;
    searchResults: string;
    filterBy: string;
    allCategories: string;
    birds: string;
    mammals: string;
    plants: string;
    insects: string;
    reptiles: string;
  };

  // Collections
  collections: {
    myCollections: string;
    savedDiscoveries: string;
    noSavedItems: string;
    startExploring: string;
    removeFromCollection: string;
    addToCollection: string;
  };

  // Notifications
  notifications: {
    notifications: string;
    noNotifications: string;
    markAsRead: string;
    likedYourPost: string;
    commentedOnPost: string;
    newFollower: string;
    mentionedYou: string;
  };

  // Categories
  categories: {
    bird: string;
    mammal: string;
    plant: string;
    insect: string;
    reptile: string;
    amphibian: string;
    fish: string;
    fungi: string;
    marineLife: string;
  };

  // Time
  time: {
    now: string;
    minuteAgo: string;
    minutesAgo: string;
    hourAgo: string;
    hoursAgo: string;
    dayAgo: string;
    daysAgo: string;
    weekAgo: string;
    weeksAgo: string;
    monthAgo: string;
    monthsAgo: string;
    yearAgo: string;
    yearsAgo: string;
  };

  // Errors
  errors: {
    somethingWentWrong: string;
    networkError: string;
    fileTooBig: string;
    invalidFileType: string;
    uploadFailed: string;
    identificationError: string;
  };
}

export const translations: Record<'en' | 'uz', Translations> = {
  en: {
    nav: {
      home: "Home",
      search: "Search",
      upload: "Upload",
      collections: "Collections",
      profile: "Profile"
    },
    common: {
      save: "Save",
      cancel: "Cancel", 
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      tryAgain: "Try Again",
      continue: "Continue",
      back: "Back",
      next: "Next",
      submit: "Submit",
      confirm: "Confirm"
    },
    auth: {
      signIn: "Sign In",
      signUp: "Sign Up",
      signOut: "Sign Out",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      forgotPassword: "Forgot Password?",
      createAccount: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      signInRequired: "Sign in required",
      pleaseSignIn: "Please sign in to identify wildlife"
    },
    profile: {
      editProfile: "Edit Profile",
      profileInformation: "Profile Information",
      username: "Username",
      bio: "Bio",
      profilePhoto: "Profile Photo",
      uploadPhoto: "Upload Photo",
      uploading: "Uploading...",
      languagePreference: "Language Preference",
      chooseLanguage: "Choose your preferred language for wildlife species information",
      maxFileSize: "Max 5MB. JPG, PNG, GIF supported.",
      supportedFormats: "Supported formats",
      saveChanges: "Save Changes",
      saving: "Saving...",
      profileUpdated: "Profile updated successfully!",
      loadingProfile: "Loading profile..."
    },
    upload: {
      identifyWildlife: "Identify Wildlife",
      captureWildlife: "Capture Wildlife",
      uploadPhoto: "Upload a photo and let AI identify the species in your preferred language",
      choosePhoto: "Choose Photo",
      readyToIdentify: "Ready to Identify",
      readyToAnalyze: "Ready to analyze this photo?",
      analyzing: "Analyzing...",
      identifySpecies: "Identify Species",
      speciesIdentified: "Species Identified",
      identificationFailed: "Identification Failed",
      sharingDiscovery: "Sharing Discovery...",
      aboutThisSpecies: "About This Species",
      habitat: "Habitat",
      diet: "Diet", 
      behavior: "Behavior",
      conservationStatus: "Conservation Status",
      interestingFacts: "Interesting Facts",
      identificationNotes: "Identification Notes",
      aiAnalysis: "AI analysis provided",
      saveToCollection: "Save to Collection",
      shareDiscovery: "Share Discovery",
      failedToIdentify: "Failed to identify species",
      note: "Note:",
      takeClearPictures: "Take clear pictures of animals, birds, and plants. Upload again to Semurg for better identification results.",
      tipsForBetter: "Tips for better results:",
      ensureGoodLighting: "Ensure good lighting",
      getCloseToSubject: "Get close to the subject",
      avoidBlurryImages: "Avoid blurry images",
      includeDistinctive: "Include distinctive features",
      chooseDifferentPhoto: "Choose Different Photo",
      confidence: "Confidence",
      high: "High",
      medium: "Medium",
      low: "Low"
    },
    posts: {
      like: "Like",
      comment: "Comment",
      share: "Share",
      save: "Save",
      viewComments: "View Comments",
      addComment: "Add a comment...",
      noComments: "No comments yet",
      writeComment: "Write a comment...",
      posting: "Posting...",
      discoverySaved: "Discovery saved to your collection!",
      discoveryShared: "Discovery shared successfully!",
      missingInfo: "Missing required information",
      errorCreating: "Error creating post",
      errorSaving: "Error saving discovery"
    },
    feed: {
      wildlife: "Wildlife",
      discoveries: "Discoveries",
      noPostsYet: "No posts yet",
      startSharing: "Start sharing your wildlife discoveries!",
      refreshFeed: "Refresh Feed",
      loadingFeed: "Loading feed...",
      pullToRefresh: "Pull to refresh"
    },
    search: {
      searchWildlife: "Search Wildlife",
      searchPlaceholder: "Search for species, locations...",
      noResults: "No results found",
      searchResults: "Search Results",
      filterBy: "Filter by:",
      allCategories: "All Categories",
      birds: "Birds",
      mammals: "Mammals", 
      plants: "Plants",
      insects: "Insects",
      reptiles: "Reptiles"
    },
    collections: {
      myCollections: "My Collections",
      savedDiscoveries: "Saved Discoveries",
      noSavedItems: "No saved items yet",
      startExploring: "Start exploring and save discoveries!",
      removeFromCollection: "Remove from Collection",
      addToCollection: "Add to Collection"
    },
    notifications: {
      notifications: "Notifications",
      noNotifications: "No notifications yet",
      markAsRead: "Mark as Read",
      likedYourPost: "liked your post",
      commentedOnPost: "commented on your post", 
      newFollower: "started following you",
      mentionedYou: "mentioned you"
    },
    categories: {
      bird: "Bird",
      mammal: "Mammal",
      plant: "Plant",
      insect: "Insect",
      reptile: "Reptile",
      amphibian: "Amphibian",
      fish: "Fish",
      fungi: "Fungi",
      marineLife: "Marine Life"
    },
    time: {
      now: "now",
      minuteAgo: "1 minute ago",
      minutesAgo: "minutes ago",
      hourAgo: "1 hour ago", 
      hoursAgo: "hours ago",
      dayAgo: "1 day ago",
      daysAgo: "days ago",
      weekAgo: "1 week ago",
      weeksAgo: "weeks ago",
      monthAgo: "1 month ago",
      monthsAgo: "months ago",
      yearAgo: "1 year ago",
      yearsAgo: "years ago"
    },
    errors: {
      somethingWentWrong: "Something went wrong",
      networkError: "Network error. Please check your connection.",
      fileTooBig: "File size must be less than 5MB",
      invalidFileType: "Please select an image file",
      uploadFailed: "Upload failed. Please try again.",
      identificationError: "Failed to identify species"
    }
  },
  uz: {
    nav: {
      home: "Bosh sahifa",
      search: "Qidiruv", 
      upload: "Yuklash",
      collections: "Kolleksiyalar",
      profile: "Profil"
    },
    common: {
      save: "Saqlash",
      cancel: "Bekor qilish",
      delete: "O'chirish",
      edit: "Tahrirlash",
      close: "Yopish",
      loading: "Yuklanmoqda...",
      error: "Xato",
      success: "Muvaffaqiyat",
      tryAgain: "Qayta urinish",
      continue: "Davom etish",
      back: "Orqaga",
      next: "Keyingi",
      submit: "Yuborish",
      confirm: "Tasdiqlash"
    },
    auth: {
      signIn: "Kirish",
      signUp: "Ro'yxatdan o'tish",
      signOut: "Chiqish",
      email: "Elektron pochta",
      password: "Parol",
      confirmPassword: "Parolni tasdiqlash",
      forgotPassword: "Parolni unutdingizmi?",
      createAccount: "Hisob yaratish",
      alreadyHaveAccount: "Hisobingiz bormi?",
      dontHaveAccount: "Hisobingiz yo'qmi?",
      signInRequired: "Kirish talab qilinadi",
      pleaseSignIn: "Yovvoyi tabiatni aniqlash uchun tizimga kiring"
    },
    profile: {
      editProfile: "Profilni tahrirlash",
      profileInformation: "Profil ma'lumotlari",
      username: "Foydalanuvchi nomi",
      bio: "Biografiya",
      profilePhoto: "Profil rasmi",
      uploadPhoto: "Rasm yuklash",
      uploading: "Yuklanmoqda...",
      languagePreference: "Til tanlovi",
      chooseLanguage: "Yovvoyi tabiat turlari ma'lumotlari uchun til tanlang",
      maxFileSize: "Maksimal 5MB. JPG, PNG, GIF qo'llab-quvvatlanadi.",
      supportedFormats: "Qo'llab-quvvatlanadigan formatlar",
      saveChanges: "O'zgarishlarni saqlash",
      saving: "Saqlanmoqda...",
      profileUpdated: "Profil muvaffaqiyatli yangilandi!",
      loadingProfile: "Profil yuklanmoqda..."
    },
    upload: {
      identifyWildlife: "Yovvoyi tabiatni aniqlash",
      captureWildlife: "Yovvoyi tabiatni suratga olish",
      uploadPhoto: "Rasmni yuklang va AI tanlagan tilingizda turlarni aniqlasin",
      choosePhoto: "Rasm tanlash",
      readyToIdentify: "Aniqlashga tayyor",
      readyToAnalyze: "Bu rasmni tahlil qilishga tayyormisiz?",
      analyzing: "Tahlil qilinmoqda...",
      identifySpecies: "Turlarni aniqlash",
      speciesIdentified: "Tur aniqlandi",
      identificationFailed: "Aniqlash muvaffaqiyatsiz",
      sharingDiscovery: "Kashfiyot bo'lishilmoqda...",
      aboutThisSpecies: "Bu tur haqida",
      habitat: "Yashash joyi",
      diet: "Oziq-ovqat",
      behavior: "Xatti-harakati",
      conservationStatus: "Muhofaza holati",
      interestingFacts: "Qiziqarli faktlar",
      identificationNotes: "Aniqlash eslatmalari",
      aiAnalysis: "AI tahlili taqdim etildi",
      saveToCollection: "Kolleksiyaga saqlash",
      shareDiscovery: "Kashfiyotni bo'lishish",
      failedToIdentify: "Turni aniqlab bo'lmadi",
      note: "Eslatma:",
      takeClearPictures: "Hayvonlar, qushlar va o'simliklarning aniq rasmlarini oling. Yaxshi natijalar uchun Semurgga qayta yuklang.",
      tipsForBetter: "Yaxshi natijalar uchun maslahatlar:",
      ensureGoodLighting: "Yaxshi yoritilishni ta'minlang",
      getCloseToSubject: "Ob'ektga yaqinroq yuring",
      avoidBlurryImages: "Loyqa rasmlardan saqlaning",
      includeDistinctive: "O'ziga xos xususiyatlarni kiriting",
      chooseDifferentPhoto: "Boshqa rasm tanlash",
      confidence: "Ishonch",
      high: "Yuqori",
      medium: "O'rta",
      low: "Past"
    },
    posts: {
      like: "Yoqtirish",
      comment: "Izoh",
      share: "Bo'lishish",
      save: "Saqlash",
      viewComments: "Izohlarni ko'rish",
      addComment: "Izoh qo'shish...",
      noComments: "Hali izohlar yo'q",
      writeComment: "Izoh yozing...",
      posting: "Joylanmoqda...",
      discoverySaved: "Kashfiyot kolleksiyangizga saqlandi!",
      discoveryShared: "Kashfiyot muvaffaqiyatli bo'lishildi!",
      missingInfo: "Kerakli ma'lumot yo'q",
      errorCreating: "Post yaratishda xato",
      errorSaving: "Kashfiyotni saqlashda xato"
    },
    feed: {
      wildlife: "Yovvoyi tabiat",
      discoveries: "Kashfiyotlar",
      noPostsYet: "Hali postlar yo'q",
      startSharing: "Yovvoyi tabiat kashfiyotlaringizni bo'lishishni boshlang!",
      refreshFeed: "Lentani yangilash",
      loadingFeed: "Lenta yuklanmoqda...",
      pullToRefresh: "Yangilash uchun torting"
    },
    search: {
      searchWildlife: "Yovvoyi tabiatni qidirish",
      searchPlaceholder: "Turlar, joylar qidiring...",
      noResults: "Natijalar topilmadi",
      searchResults: "Qidiruv natijalari",
      filterBy: "Bo'yicha filtrlash:",
      allCategories: "Barcha kategoriyalar",
      birds: "Qushlar",
      mammals: "Sutemizuvchilar",
      plants: "O'simliklar", 
      insects: "Hasharotlar",
      reptiles: "Sudralib yuruvchilar"
    },
    collections: {
      myCollections: "Mening kolleksiyalarim",
      savedDiscoveries: "Saqlangan kashfiyotlar",
      noSavedItems: "Hali saqlangan narsalar yo'q",
      startExploring: "Kashf qilishni boshlang va kashfiyotlarni saqlang!",
      removeFromCollection: "Kolleksiyadan olib tashlash",
      addToCollection: "Kolleksiyaga qo'shish"
    },
    notifications: {
      notifications: "Bildirishnomalar",
      noNotifications: "Hali bildirishnomalar yo'q",
      markAsRead: "O'qilgan deb belgilash",
      likedYourPost: "postingizni yoqtirdi",
      commentedOnPost: "postingizga izoh qoldirdi",
      newFollower: "sizni kuzatishni boshladi",
      mentionedYou: "sizni eslatdi"
    },
    categories: {
      bird: "Qush",
      mammal: "Sutemizuvchi",
      plant: "O'simlik",
      insect: "Hasharot",
      reptile: "Sudralib yuruvchi",
      amphibian: "Amfibiya",
      fish: "Baliq",
      fungi: "Qo'ziqorin",
      marineLife: "Dengiz hayoti"
    },
    time: {
      now: "hozir",
      minuteAgo: "1 daqiqa oldin",
      minutesAgo: "daqiqa oldin",
      hourAgo: "1 soat oldin",
      hoursAgo: "soat oldin",
      dayAgo: "1 kun oldin",
      daysAgo: "kun oldin",
      weekAgo: "1 hafta oldin",
      weeksAgo: "hafta oldin",
      monthAgo: "1 oy oldin",
      monthsAgo: "oy oldin",
      yearAgo: "1 yil oldin",
      yearsAgo: "yil oldin"
    },
    errors: {
      somethingWentWrong: "Nimadir noto'g'ri ketdi",
      networkError: "Tarmoq xatosi. Ulanishingizni tekshiring.",
      fileTooBig: "Fayl hajmi 5MB dan kam bo'lishi kerak",
      invalidFileType: "Iltimos, rasm faylini tanlang",
      uploadFailed: "Yuklash muvaffaqiyatsiz. Qayta urinib ko'ring.",
      identificationError: "Turni aniqlab bo'lmadi"
    }
  }
};

export type LanguageCode = 'en' | 'uz';

export const getTranslations = (language: LanguageCode): Translations => {
  return translations[language] || translations.en;
};