document.addEventListener("DOMContentLoaded", () => {
  let mapMain, mapStatus, mainCarMarker, statusCarMarker;
  let mainTile, statusTile;
  let currentMapType = "osm";

  const initMaps = () => {
    const mapEl1 = document.getElementById("map-main");
    if (mapEl1 && typeof L !== "undefined") {
      mapMain = L.map("map-main", { zoomControl: false }).setView(
        [41.311081, 69.240562],
        13,
      );
      mainTile = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ).addTo(mapMain);

      const carIcon = L.divIcon({
        className: "custom-car-icon",
        html: '<div style="font-size:35px; text-shadow: 0 4px 10px rgba(0,0,0,0.3);">🚕</div>',
        iconSize: [35, 35],
        iconAnchor: [17, 17],
      });
      mainCarMarker = L.marker([41.311081, 69.240562], { icon: carIcon }).addTo(
        mapMain,
      );
    }

    const mapEl2 = document.getElementById("map-status");
    if (mapEl2 && typeof L !== "undefined") {
      mapStatus = L.map("map-status", {
        zoomControl: false,
        dragging: false,
        touchZoom: false,
      }).setView([41.311081, 69.240562], 14);
      statusTile = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ).addTo(mapStatus);

      const carIcon = L.divIcon({
        className: "custom-car-icon",
        html: '<div style="font-size:35px; text-shadow: 0 4px 10px rgba(0,0,0,0.3);">🚕</div>',
        iconSize: [35, 35],
        iconAnchor: [17, 17],
      });
      statusCarMarker = L.marker([41.311081, 69.240562], {
        icon: carIcon,
      }).addTo(mapStatus);
    }
  };

  initMaps();

  // Select all iPhone frames to navigate between them
  const frames = document.querySelectorAll(".iphone-frame");

  // Function to smooth scroll to a specific frame
  const goToFrame = (index) => {
    if (frames[index]) {
      frames[index].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      setTimeout(() => {
        if (index === 1 && typeof mapMain !== "undefined")
          mapMain.invalidateSize();
        if (index === 10 && typeof mapStatus !== "undefined")
          mapStatus.invalidateSize();
      }, 300);
    }
  };

  // 1. Login Page (Frame 0)
  const loginBtn = frames[0]?.querySelector(".btn-black");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      goToFrame(1); // Go to Main Page
    });
  }

  // 2. Main Page (Frame 1)
  const burgerBtn = frames[1]?.querySelector(".profile-chip");
  if (burgerBtn) {
    burgerBtn.addEventListener("click", () => {
      goToFrame(2); // Go to Menu
    });
  }

  const confirmBtn = frames[1]?.querySelector(".btn-black");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      goToFrame(10); // Go to Driver Status
    });
  }

  // Map Navigator Button (Frame 1)
  const navBtn = frames[1]?.querySelector(".car-pulse");
  if (navBtn) {
    navBtn.addEventListener("click", () => {
      navBtn.style.transform = "scale(0.8)";
      navBtn.style.transition = "0.2s";

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            navBtn.style.transform = "scale(1)";

            if (mapMain) {
              mapMain.flyTo([lat, lon], 16, { duration: 1.5 });
              mainCarMarker.setLatLng([lat, lon]);
            }
            if (mapStatus) {
              mapStatus.setView([lat, lon], 16);
              statusCarMarker.setLatLng([lat, lon]);
            }

            // Reverse geocode via Nominatim
            fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
            )
              .then((res) => res.json())
              .then((data) => {
                let locName =
                  data?.address?.road ||
                  data?.address?.suburb ||
                  "Mening manzilim";
                if (data?.address?.city) locName += `, ${data.address.city}`;

                const addrInputs =
                  frames[1].querySelectorAll(".addr-row input");
                if (addrInputs && addrInputs.length > 0) {
                  addrInputs[0].value = locName;
                  addrInputs[0].style.color = "#000";
                  if (document.body.classList.contains("dark-mode")) {
                    addrInputs[0].style.color = "#fff";
                  }
                }
              })
              .catch(() => {});
          },
          () => {
            alert("Joylashuvni aniqlash ruxsati berilmadi!");
            navBtn.style.transform = "scale(1)";
          },
        );
      } else {
        alert("Joylashuvni aniqlash imkoni yo'q.");
        navBtn.style.transform = "scale(1)";
      }
    });
  }

  // Tariff selection logic
  const tariffs = frames[1]?.querySelectorAll(".t-item");
  const driverStatusInfo = frames[10]?.querySelector(".info-badge span");
  const driverStatusPrice = frames[10]?.querySelector(".price-text");
  const driverCarBrand = frames[10]?.querySelector(".mashina-marka");
  const driverCarNumber = frames[10]?.querySelector(".mashina-nomer");

  const tariffDetails = {
    Start: {
      price: "22,000 so'm",
      car: "Chevrolet Spark",
      num: "01 | A 111 AA",
    },
    Comfort: {
      price: "30,000 so'm",
      car: "Chevrolet Malibu",
      num: "01 | A 777 BA",
    },
    Business: {
      price: "45,000 so'm",
      car: "Mercedes-Benz E-Class",
      num: "01 | M 888 ER",
    },
    Yetkazish: {
      price: "20,000 so'm",
      car: "Chevrolet Cobalt",
      num: "01 | X 555 YA",
    },
    Samokat: { price: "5,000 so'm", car: "Ninebot Max", num: "S-1234" },
  };

  if (tariffs) {
    tariffs.forEach((tariff) => {
      tariff.addEventListener("click", () => {
        tariffs.forEach((t) => t.classList.remove("active"));
        tariff.classList.add("active");

        const tariffName = tariff.querySelector("span")?.innerText;
        if (tariffName && tariffDetails[tariffName] && driverStatusInfo) {
          driverStatusInfo.innerText = `${tariffName} ➔ 5 daq.`;
          if (driverStatusPrice)
            driverStatusPrice.innerText = tariffDetails[tariffName].price;
          if (driverCarBrand)
            driverCarBrand.innerText = tariffDetails[tariffName].car;
          if (driverCarNumber)
            driverCarNumber.innerText = tariffDetails[tariffName].num;
        }
      });
    });
  }

  // Autocomplete logic
  const fromAddrInput = frames[1]?.querySelector("#from-address");
  const suggestionsBox = frames[1]?.querySelector("#autocomplete-suggestions");
  if (fromAddrInput && suggestionsBox) {
    fromAddrInput.addEventListener("focus", () => {
      suggestionsBox.style.display = "block";
    });

    // Hide when clicking outside
    document.addEventListener("click", (e) => {
      if (e.target !== fromAddrInput && !suggestionsBox.contains(e.target)) {
        suggestionsBox.style.display = "none";
      }
    });

    const suggItems = suggestionsBox.querySelectorAll(".sugg-item");
    suggItems.forEach((item) => {
      item.addEventListener("click", () => {
        fromAddrInput.value = item.innerText;
        suggestionsBox.style.display = "none";
      });
    });
  }

  // 3. Navigation Menu (Frame 2)
  const blurSidebar = frames[2]?.querySelector(".blur-sidebar");
  if (blurSidebar) {
    blurSidebar.addEventListener("click", () => {
      goToFrame(1); // Back to Main Page
    });
  }

  const menuLinks = frames[2]?.querySelectorAll(".m-link");
  if (menuLinks) {
    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const text = link.innerText.toLowerCase();
        if (text.includes("safarlar tarixi")) goToFrame(3);
        else if (text.includes("to'lov usullari")) goToFrame(4);
        else if (text.includes("bonuslar")) goToFrame(5);
        else if (text.includes("sozlamalar")) goToFrame(6);
        else if (text.includes("yordam")) goToFrame(7);
        else if (text.includes("parolni almashtirish")) goToFrame(8);
        else if (text.includes("chiqish"))
          goToFrame(0); // Exit to Login
        else if (text.includes("hisobni o'chirish")) goToFrame(9);

        // Mark active visually
        menuLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      });
    });
  }

  // Profile link in menu
  const menuProfileLink = frames[2]?.querySelector(".profile-link");
  if (menuProfileLink) {
    menuProfileLink.addEventListener("click", (e) => {
      e.preventDefault();
      goToFrame(11); // Go to Profile
    });
  }

  // Universal Back Buttons "〈" in Headings (Frames 3-9)
  frames.forEach((frame, index) => {
    if (index >= 3 && index <= 9) {
      const header = frame.querySelector(".page-header");
      if (header && header.innerText.includes("〈")) {
        // Make the header clickable to go back to Menu
        header.style.cursor = "pointer";
        header.addEventListener("click", (e) => {
          // Back to Menu
          goToFrame(2);
        });
      }
    }
  });

  // Delete Account Confirmation (Frame 9)
  const hisobBekorBtn = frames[9]?.querySelector(".btn-outline");
  if (hisobBekorBtn) {
    hisobBekorBtn.addEventListener("click", () => goToFrame(2)); // Back to Menu
  }
  const hisobOchirishBtn = frames[9]?.querySelector(".btn-red");
  if (hisobOchirishBtn) {
    hisobOchirishBtn.addEventListener("click", () => goToFrame(0)); // Exit to Login
  }

  // 4. Payment Methods Selection (Frame 4)
  const payCards = frames[4]?.querySelectorAll(".pay-card");
  if (payCards) {
    payCards.forEach((card) => {
      card.addEventListener("click", () => {
        payCards.forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
      });
    });
  }

  // 5. Settings Toggle (Frame 6)
  const tungiRejimSetRow =
    frames[6]?.querySelector(".dumaloq")?.parentElement?.parentElement;
  if (tungiRejimSetRow) {
    const toggleSpan = tungiRejimSetRow.querySelector("span");

    // Basic styling for the toggle container
    toggleSpan.style.width = "50px";
    toggleSpan.style.height = "28px";
    toggleSpan.style.background = "#e5e5ea";
    toggleSpan.style.borderRadius = "20px";
    toggleSpan.style.display = "flex";
    toggleSpan.style.alignItems = "center";
    toggleSpan.style.padding = "4px";
    toggleSpan.style.cursor = "pointer";
    toggleSpan.style.transition = "0.3s";

    const dumaloq = toggleSpan.querySelector(".dumaloq");
    dumaloq.style.transition = "0.3s";
    dumaloq.style.width = "20px";
    dumaloq.style.height = "20px";
    dumaloq.style.background = "#fff";
    dumaloq.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";

    let isNightMode = false;
    toggleSpan.addEventListener("click", () => {
      isNightMode = !isNightMode;
      if (isNightMode) {
        toggleSpan.style.background = "#34c759"; // iOS Green
        dumaloq.style.transform = "translateX(22px)";
        document.body.classList.add("dark-mode");
      } else {
        toggleSpan.style.background = "#e5e5ea"; // iOS Gray
        dumaloq.style.transform = "translateX(0)";
        document.body.classList.remove("dark-mode");
      }
    });
  }

  // Map Type Toggle
  const mapTypeToggle = frames[6]?.querySelector(".map-type-toggle");
  if (mapTypeToggle) {
    const mapTypeLabel = mapTypeToggle.querySelector("#map-type-label");

    mapTypeToggle.addEventListener("click", () => {
      currentMapType = currentMapType === "osm" ? "google" : "osm";
      const src =
        currentMapType === "osm"
          ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          : "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";

      if (mapTypeLabel)
        mapTypeLabel.innerText =
          currentMapType === "osm" ? "Ochiq Xarita" : "Google Hybrid";
      if (mainTile) mainTile.setUrl(src);
      if (statusTile) statusTile.setUrl(src);
    });
  }

  // Save Password Button (Frame 8)
  const passSaveBtn = frames[8]?.querySelector(".btn-black");
  if (passSaveBtn) {
    passSaveBtn.addEventListener("click", () => {
      alert("Parol muvaffaqiyatli saqlandi!");
      goToFrame(2); // Back to Menu
    });
  }

  // Driver Status Page (Frame 10)
  const driverProfileLink = frames[10]?.querySelector(".profile-link");
  if (driverProfileLink) {
    driverProfileLink.addEventListener("click", (e) => {
      e.preventDefault();
      goToFrame(12); // Go to Driver Profile
    });
  }

  const cancelRideBtn = frames[10]?.querySelector(".btn-red");
  if (cancelRideBtn) {
    cancelRideBtn.addEventListener("click", () => {
      goToFrame(1); // Back to Main Menu
    });
  }

  const callBtn = frames[10]?.querySelector(".btn-black");
  if (callBtn) {
    callBtn.addEventListener("click", () => {
      alert("Haydovchiga qo'ng'iroq qilinmoqda...");
    });
  }

  // Profile Page (Frame 11)
  const profileBackBtn = frames[11]?.querySelector(".back-link");
  if (profileBackBtn) {
    profileBackBtn.addEventListener("click", (e) => {
      e.preventDefault();
      goToFrame(2); // Back to Menu
    });
  }

  // Driver Profile Page (Frame 12)
  const driverProfileBackBtn = frames[12]?.querySelector(".back-link");
  if (driverProfileBackBtn) {
    driverProfileBackBtn.addEventListener("click", (e) => {
      e.preventDefault();
      goToFrame(10); // Back to Driver Status
    });
  }

  // Remaining Buttons that don't have dedicated pages
  const registerBtn = frames[0]?.querySelector(".btn-outline");
  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      // Go to Register Page (Frame 13)
      goToFrame(13);
    });
  }

  // Register Interactions (Frame 13)
  const regSubmitBtn = frames[13]?.querySelector(".btn-black");
  if (regSubmitBtn) {
    regSubmitBtn.addEventListener("click", () => {
      alert("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
      goToFrame(1); // Go to Main Page
    });
  }

  const regBack = frames[13]?.querySelector(".back-link");
  if (regBack) {
    regBack.addEventListener("click", (e) => {
      e.preventDefault();
      goToFrame(0); // Back to Login
    });
  }

  const addCardBtn = frames[4]?.querySelector(".btn-outline");
  if (addCardBtn) {
    addCardBtn.addEventListener("click", () => {
      // Go to Add Card Page (Frame 14)
      goToFrame(14);
    });
  }

  // Add Card Interactions (Frame 14)
  const addCardSubmitBtn = frames[14]?.querySelector(".btn-black");
  const addCardInputs = frames[14]?.querySelectorAll(".input-field");
  if (addCardSubmitBtn) {
    addCardSubmitBtn.addEventListener("click", () => {
      let cNum = addCardInputs[0]?.value || "";
      if (cNum.length < 4) cNum = "0000 0000 0000 0000";
      const last4 = cNum.slice(-4);

      const newCard = document.createElement("div");
      newCard.className = "pay-card";
      newCard.innerHTML = `💳 **** **** **** ${last4} <span style="float:right;color:#888;">Yangi</span>`;

      const contentP = frames[4]?.querySelector(".content-p");
      const addBtn = frames[4]?.querySelector(".btn-outline");
      if (contentP && addBtn) {
        contentP.insertBefore(newCard, addBtn);
        newCard.addEventListener("click", () => {
          const payCards = frames[4].querySelectorAll(".pay-card");
          payCards.forEach((c) => c.classList.remove("active"));
          newCard.classList.add("active");
        });
      }

      alert("Karta muvaffaqiyatli qo'shildi!");
      goToFrame(4); // Back to Payment Methods
      if (addCardInputs[0]) addCardInputs[0].value = "";
      if (addCardInputs[1]) addCardInputs[1].value = "";
    });
  }

  const addCardBack = frames[14]?.querySelector(".back-link");
  if (addCardBack) {
    addCardBack.addEventListener("click", (e) => {
      e.preventDefault();
      goToFrame(4); // Back to Payment Methods
    });
  }

  const seeGiftsBtn = frames[5]?.querySelector(".btn-black");
  if (seeGiftsBtn) {
    seeGiftsBtn.addEventListener("click", () => {
      alert("Sovg'alar bo'limi tez kunda ishga tushadi!");
    });
  }

  const operatorBtn = frames[7]?.querySelector(".btn-black");
  if (operatorBtn) {
    operatorBtn.addEventListener("click", () => {
      alert("Operator bilan bog'lanilmoqda...");
    });
  }

  const editProfileBtn = frames[11]?.querySelector(".btn-profile-save");
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      goToFrame(15);
    });
  }

  // Edit Profile Interactions (Frame 15)
  const saveProfileData = frames[15]?.querySelector(".btn-save-profile-data");
  if (saveProfileData) {
    saveProfileData.addEventListener("click", () => {
      const eName = document.getElementById("e-name").value;
      const ePhone = document.getElementById("e-phone").value;

      if (eName) {
        const pNameElement = frames[11].querySelector(".profile-name");
        const pMenuElement = frames[2].querySelector(".menu-head h3");
        if (pNameElement) pNameElement.innerText = eName;
        if (pMenuElement) pMenuElement.innerText = eName;
      }
      if (ePhone) {
        const phoneElement1 = frames[11].querySelector(".profile-phone");
        const phoneElement2 = frames[11].querySelector(".edit-phone");
        if (phoneElement1) phoneElement1.innerText = ePhone;
        if (phoneElement2) phoneElement2.innerText = ePhone;
      }
      alert("Ma'lumotlar muvaffaqiyatli saqlandi!");
      goToFrame(11);
    });
  }

  const editProfileBack = frames[15]?.querySelector(".back-link");
  if (editProfileBack) {
    editProfileBack.addEventListener("click", (e) => {
      e.preventDefault();
      goToFrame(11); // Back to profile
    });
  }

  const editPhone = frames[11]?.querySelector(".edit-phone");
  if (editPhone) {
    editPhone.addEventListener("click", () => {
      goToFrame(15);
    });
  }

  // FAQ interactions
  const faqLink = document.getElementById("faq-link");
  if (faqLink) {
    faqLink.addEventListener("click", () => {
      goToFrame(16); // FAQ Page is 16
    });
  }

  const faqBack = frames[16]?.querySelector(".back-link");
  if (faqBack) {
    faqBack.addEventListener("click", (e) => {
      e.preventDefault();
      goToFrame(7); // Back to Help
    });
  }

  // Card Removal functionality
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-card")) {
      const card = e.target.closest(".pay-card");
      if (card && confirm("Kartani o'chirishni xohlaysizmi?")) {
        card.remove();
      }
    }
  });

  // Full Translation Logic
  const uDict = {
    "Xush kelibsiz": ["Xush kelibsiz", "Добро пожаловать", "Welcome"],
    KIRISH: ["KIRISH", "ВОЙТИ", "LOGIN"],
    "RO'YXATDAN O'TISH": ["RO'YXATDAN O'TISH", "РЕГИСТРАЦИЯ", "REGISTER"],
    TASDIQLASH: ["TASDIQLASH", "ПОДТВЕРДИТЬ", "CONFIRM"],
    "Safarlar tarixi": ["Safarlar tarixi", "История поездок", "Ride History"],
    "To'lov usullari": ["To'lov usullari", "Способы оплаты", "Payment Methods"],
    Bonuslar: ["Bonuslar", "Бонусы", "Bonuses"],
    Sozlamalar: ["Sozlamalar", "Настройки", "Settings"],
    Yordam: ["Yordam", "Помощь", "Help"],
    "Parolni almashtirish": [
      "Parolni almashtirish",
      "Сменить пароль",
      "Change Password",
    ],
    Chiqish: ["Chiqish", "Выйти", "Logout"],
    "Hisobni o'chirish": [
      "Hisobni o'chirish",
      "Удалить аккаунт",
      "Delete Account",
    ],
    "Karta qo'shish": ["Karta qo'shish", "Добавить карту", "Add Card"],
    SAQLASH: ["SAQLASH", "СОХРАНИТЬ", "SAVE"],
    "Bekor qilish": ["Bekor qilish", "Отменить", "Cancel"],
    "MA'LUMOTLARNI TAHRIRLASH": [
      "MA'LUMOTLARNI TAHRIRLASH",
      "РЕДАКТИРОВАТЬ ДАННЫЕ",
      "EDIT DATA",
    ],
    "Oltin mijoz": ["Oltin mijoz", "Золотой клиент", "Gold Client"],
    "Tungi rejim": ["Tungi rejim", "Ночной режим", "Dark Mode"],
    Til: ["Til", "Язык", "Language"],
    "Xarita turi": ["Xarita turi", "Тип карты", "Map Type"],
    "Qo'llab-quvvatlash xizmati": [
      "Qo'llab-quvvatlash xizmati",
      "Служба поддержки",
      "Support Service",
    ],
    "Ko'p beriladigan savollar": [
      "Ko'p beriladigan savollar",
      "Частые вопросы",
      "FAQ",
    ],
    "Mening profilim": ["Mening profilim", "Мой профиль", "My Profile"],
    "Haydovchi profili": [
      "Haydovchi profili",
      "Профиль водителя",
      "Driver Profile",
    ],
    Parol: ["Parol", "Пароль", "Password"],
    "Joriy parol": ["Joriy parol", "Текущий пароль", "Current Password"],
    "Yangi parol": ["Yangi parol", "Новый пароль", "New Password"],
    "Ismingiz (masalan, Dostonbek)": [
      "Ismingiz (masalan, Dostonbek)",
      "Ваше имя (например, Достонбек)",
      "Your name (e.g. Dostonbek)",
    ],
    Familiyangiz: ["Familiyangiz", "Ваша фамилия", "Your surname"],
    Tirbandlik: ["Tirbandlik", "Пробки", "Traffic"],
    Start: ["Start", "Старт", "Start"],
    Comfort: ["Comfort", "Комфорт", "Comfort"],
    Business: ["Business", "Бизнес", "Business"],
    Yetkazish: ["Yetkazish", "Доставка", "Delivery"],
    Samokat: ["Samokat", "Самокат", "Scooter"],
    "so'm": ["so'm", "сум", "UZS"],
    "daq.": ["daq.", "мин.", "min."],
    Asosiy: ["Asosiy", "Основной", "Main"],
    Yangi: ["Yangi", "Новый", "New"],
    "SOVG'ALARNI KO'RISH": [
      "SOVG'ALARNI KO'RISH",
      "ПОСМОТРЕТЬ ПОДАРКИ",
      "VIEW GIFTS",
    ],
    "OPERATOR BILAN BOG'LANISH": [
      "OPERATOR BILAN BOG'LANISH",
      "СВЯЗАТЬСЯ С ОПЕРАТОРОМ",
      "CONTACT OPERATOR",
    ],
    "HA, O'CHIRILSIN": ["HA, O'CHIRILSIN", "ДА, УДАЛИТЬ", "YES, DELETE"],
    "BEKOR QILISH": ["BEKOR QILISH", "ОТМЕНИТЬ", "CANCEL"],
    "Qo'ng'iroq": ["Qo'ng'iroq", "Позвонить", "Call"],
    Reyting: ["Reyting", "Рейтинг", "Rating"],
    Safar: ["Safar", "Поездки", "Rides"],
    Status: ["Status", "Статус", "Status"],
    Faol: ["Faol", "Активен", "Active"],
    "Telefon raqami": ["Telefon raqami", "Номер телефона", "Phone Number"],
    Ism: ["Ism", "Имя", "Name"],
    Familiya: ["Familiya", "Фамилия", "Surname"],
    "Tug'ilgan sana": ["Tug'ilgan sana", "Дата рождения", "Date of Birth"],
    Pochta: ["Pochta", "Почта", "Email"],
    "Qo'shilmagan": ["Qo'shilmagan", "Не добавлено", "Not added"],
    Tahrirlash: ["Tahrirlash", "Редактировать", "Edit"],
    "Keyingi darajagacha 6,000 ball qoldi": [
      "Keyingi darajagacha 6,000 ball qoldi",
      "До следующего уровня осталось 6,000 баллов",
      "6,000 points left to next level",
    ],
    "Hisobingizni o'chirib tashlaganingizdan so'ng,": [
      "Hisobingizni o'chirib tashlaganingizdan so'ng,",
      "После удаления аккаунта,",
      "After deleting your account,",
    ],
    "barcha bonuslar va safarlar tarixi tiklanmaydigan qilib o'chiriladi.": [
      "barcha bonuslar va safarlar tarixi tiklanmaydigan qilib o'chiriladi.",
      "все бонусы и история поездок будут безвозвратно удалены.",
      "all bonuses and ride history will be permanently deleted.",
    ],
    "Ro'yxatdan o'tish": ["Ro'yxatdan o'tish", "Регистрация", "Registration"],
    "Ishonchingiz komilmi?": [
      "Ishonchingiz komilmi?",
      "Вы уверены?",
      "Are you sure?",
    ],
    "Yangi parolni kiriting": [
      "Yangi parolni kiriting",
      "Введите новый пароль",
      "Enter new password",
    ],
    "Telegram bot roqali bog'lanish": [
      "Telegram bot orqali bog'lanish",
      "Связаться через Telegram бот",
      "Contact via Telegram bot",
    ],
    "Karta qanday qo'shiladi?": [
      "Karta qanday qo'shiladi?",
      "Как добавить карту?",
      "How to add a card?",
    ],
    "To'lov usullari bo'limidan qo'shishingiz mumkin.": [
      "To'lov usullari bo'limidan qo'shishingiz mumkin.",
      "Вы можете добавить её в разделе Способы оплаты.",
      "You can add it in the Payment Methods section.",
    ],
    "Kutish vaqti pullikmi?": [
      "Kutish vaqti pullikmi?",
      "Время ожидания платное?",
      "Is waiting time paid?",
    ],
    "Belgilangan bepul kutish vaqtidan so'ng har bir daqiqa uchun tarif bo'yicha hisoblanadi.":
      [
        "Belgilangan bepul kutish vaqtidan so'ng har bir daqiqa uchun tarif bo'yicha hisoblanadi.",
        "После установленного бесплатного времени ожидания каждая минута рассчитывается по тарифу.",
        "After the designated free waiting time, each minute is calculated according to the tariff.",
      ],
    "Bonuslar nima uchun kerak?": [
      "Bonuslar nima uchun kerak?",
      "Зачем нужны бонусы?",
      "What are bonuses for?",
    ],
    "Ularni navbatdagi safarlaringizda chegirma sifatida ishlatishingiz mumkin.":
      [
        "Ularni navbatdagi safarlaringizda chegirma sifatida ishlatishingiz mumkin.",
        "Вы можете использовать их как скидку на следующие поездки.",
        "You can use them as a discount on your next rides.",
      ],
    "Amal qilish muddati (OO/YY)": [
      "Amal qilish muddati (OO/YY)",
      "Срок действия (ММ/ГГ)",
      "Expiry date (MM/YY)",
    ],
    "Karta raqami": [
      "Karta raqami (0000 0000 0000 0000)",
      "Номер карты (0000 0000 0000 0000)",
      "Card Number (0000 0000 0000 0000)",
    ],
  };

  // Language Toggle (Frame 6)
  const langLabel = document.getElementById("lang-label");
  if (langLabel) {
    const parentRow = langLabel.parentElement;
    parentRow.style.cursor = "pointer";
    let langs = ["O'zbekcha", "Русский", "English"];
    let idx = 0;

    // Sort keys by length so longer phrases get translated first
    const dictKeys = Object.keys(uDict).sort((a, b) => b.length - a.length);

    parentRow.addEventListener("click", () => {
      idx = (idx + 1) % langs.length;
      langLabel.innerText = langs[idx];

      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false,
      );

      let n;
      while ((n = walker.nextNode())) {
        let val = n.nodeValue;
        if (val.trim() === "" || val.trim() === "〈") continue;

        for (let i = 0; i < dictKeys.length; i++) {
          const k = dictKeys[i];
          for (let j = 0; j < uDict[k].length; j++) {
            const knownWord = uDict[k][j];
            if (val.includes(knownWord)) {
              val = val.replace(knownWord, uDict[k][idx]);
            }
          }
        }
        n.nodeValue = val;
      }

      document.querySelectorAll("input").forEach((inp) => {
        let p = inp.placeholder;
        if (p) {
          for (let i = 0; i < dictKeys.length; i++) {
            const k = dictKeys[i];
            for (let j = 0; j < uDict[k].length; j++) {
              const knownWord = uDict[k][j];
              if (p.includes(knownWord)) {
                p = p.replace(knownWord, uDict[k][idx]);
              }
            }
          }
          inp.placeholder = p;
        }
      });
    });
  }
});
