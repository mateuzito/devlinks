// Function to load translations and initialize i18next with geolocation
async function initTranslations() {
  try {
    // Fetch user's country from an external API
    const geoResponse = await fetch("https://ipapi.co/json/");
    const geoData = await geoResponse.json();
    const countryCode = geoData.country_code.toLowerCase(); // e.g., "us", "br"

    // Map country codes to languages
    const languageMap = {
      br: "pt", // Brazil -> Portuguese
      us: "en", // USA -> English
      gb: "en", // UK -> English
    };
    const detectedLanguage = languageMap[countryCode] || "en"; // Default to English

    // Load translation files
    const enTranslations = await fetch("./locales/en/translation.json").then(
      (res) => res.json()
    );
    const ptTranslations = await fetch("./locales/pt/translation.json").then(
      (res) => res.json()
    );

    await i18next.init({
      lng: detectedLanguage, // Use language based on location
      fallbackLng: "en", // Fallback to English if not supported
      resources: {
        en: { translation: enTranslations },
        pt: { translation: ptTranslations },
      },
    });

    // Apply translations after initialization
    updateTranslations();
    // Update HTML lang attribute to match detected language
    document.documentElement.lang = i18next.language;
  } catch (error) {
    console.error("Failed to load translations or geolocation:", error);
    // Fallback to browser language if geolocation fails
    const fallbackLang = navigator.language.split("-")[0] || "en";
    await i18next.init({
      lng: fallbackLang,
      fallbackLng: "en",
      resources: {
        en: {
          translation: await fetch("./locales/en/translation.json").then(
            (res) => res.json()
          ),
        },
        pt: {
          translation: await fetch("./locales/pt/translation.json").then(
            (res) => res.json()
          ),
        },
      },
    });
    updateTranslations();
    document.documentElement.lang = i18next.language;
  }
}

// Start the translation process
initTranslations();

// Function to toggle theme and update translations
function toggleMode() {
  // Select the HTML root element and toggle the "light" class
  const html = document.documentElement;
  html.classList.toggle("light");

  // Get the profile image element
  const image = document.querySelector("#profile img");

  // Check if light mode is active and update image attributes
  if (html.classList.contains("light")) {
    image.setAttribute("src", "./assets/images/avatar-light.png");
    image.setAttribute("alt", i18next.t("profile.altLight"));
  } else {
    image.setAttribute("src", "./assets/images/avatar.png");
    image.setAttribute("alt", i18next.t("profile.alt"));
  }

  // Update all translations after theme change
  updateTranslations();
}

// Function to update all elements with data-i18n
function updateTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    // Check if it's an attribute translation (e.g., [aria-label] or [alt])
    if (key.startsWith("[")) {
      const match = key.match(/\[(\w+-?\w*)\](.*)/); // Match attribute and key (e.g., [aria-label]switch.ariaLabel)
      if (match) {
        const attr = match[1]; // e.g., "aria-label"
        const translationKey = match[2]; // e.g., "switch.ariaLabel"
        element.setAttribute(attr, i18next.t(translationKey));
      }
    } else {
      // Regular text content translation
      element.textContent = i18next.t(key);
    }
  });
}
