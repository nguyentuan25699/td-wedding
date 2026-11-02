// All site content lives here. Placeholders are marked TODO and must be filled before sending the link.
window.WEDDING_CONFIG = {
  couple: {
    names: "Tuấn & Dung", // short form for the script names, same order as the logo
    bride: "Võ Thị Dung", // full name, shown in the hero
    groom: "Nguyễn Đình Minh Tuấn", // full name, shown in the hero and the family section
    first: "Tuấn", // first name, stacked above the & in the hero
    second: "Dung", // second name, stacked below the &
    // Logo as transparent PNGs: light for the burgundy seal, burgundy for the ivory closing mark and placeholders
    monogram: {
      left: "T",
      right: "D",
      image: "assets/img/monogram-td.png",
      imageOnLight: "assets/img/monogram-td-burgundy.png",
    },
  },

  // Solar date and lunar date. The lunar date is typed by hand, never calculated.
  date: {
    iso: "2027-01-17", // YYYY-MM-DD. Empty hides the calendar and countdown.
    solar: "Chủ nhật · 17.01.2027",
    // Looked up online (baolamdong.vn, xemlicham.com), typed by hand. NEEDS MANUAL CHECK against a lunar calendar before sending.
    lunar: "Tức ngày 10 tháng 12 năm Bính Ngọ",
  },

  // Nhà trai is the left column, Nhà gái the right. Each side: father, mother, address ('' hides it).
  family: {
    bride: { father: "Ông Võ Viết Bảy", mother: "Bà Lê Thị Thoa", address: "" }, // address TODO
    groom: {
      father: "Ông Nguyễn Hoàng Hoa",
      mother: "Bà Bùi Thị Thuý",
      address: "",
    }, // address TODO
  },

  // The wedding ceremony card: time, place, and the two buttons (map link and calendar file)
  event: {
    time: "10:00",
    venue: "Trống đồng palace - Phòng Seraphine 2 tầng 3",
    address:
      "Tòa nhà Hancorp Plaza, Trần Đăng Ninh/72 Plaza, Làng Quốc tế Thăng Long, Cầu Giấy, Hà Nội",
    map: "https://maps.app.goo.gl/NL9vRXx32bXFJg9c8",
    hours: 3,
    sketch: "lanterns", // drawing at the top of the card (assets/js/sketches.js)
  },

  // Programme rows, each with a hand-drawn sketch. [] hides the section.
  program: [
    // TODO confirm times and titles
    { sketch: "houseBride", time: "TODO", key: "eventVuQuy", note: "" },
    { sketch: "tea", time: "TODO", key: "eventThanhHon", note: "" },
    { sketch: "cake", time: "TODO", key: "eventTiec", note: "" },
  ],

  // Hero photo and album. Empty values show the designed placeholders.
  photos: {
    hero: "", // TODO: portrait 3:4, under 300KB, e.g. assets/images/hero.webp
    // Album: { src, alt, w, h } with the real pixel size of each file.
    album: [], // TODO: 6–12 photos, 150–300KB each, e.g. assets/images/album/01.webp
  },

  // Calendar style: 'bloc' is a tear-off wall calendar, 'page' a month page with the day circled.
  calendar: { style: "bloc" },

  // Apps Script web app URL (apps-script/Code.gs). Empty shows a "not open yet" message instead of sending.
  rsvp: {
    url: "https://script.google.com/macros/s/AKfycbwkvPgGuGweJlYmj10i9sARibbQPuWLqnh9ldkz96celgW6Qm7tH0YAg8NmOwXO9Rk/exec",
    deadline: {
      vi: "Vui lòng phản hồi trước ngày 10/01/2027",
      en: "Kindly reply by 10/01/2027",
    }, // 7 days before the wedding (17/01/2027)
  },

  defaultGuest: "bạn thân mến",
  music: {
    src: "assets/music/background.mp3", // TODO add file, 128 kbps, 2–3 min, ≤ 3MB
    volume: 0.6,
  },

  text: {
    vi: {
      title: "Thiệp mời",
      dear: "Thân gửi",
      open: "Mở thiệp",
      invite: "Trân trọng kính mời",
      heroKicker: "Lễ thành hôn",
      brideLabel: "Cô dâu",
      groomLabel: "Chú rể",
      heroLead: "Trân trọng kính mời Quý khách đến dự tiệc cưới của chúng tôi",
      heroQuote:
        "Có những điều đến đúng lúc,\nvà có những người đáng để chờ đợi.", // \n breaks the line
      familyTitle: "Gia đình hai bên",
      familyIntro: "Trân trọng báo tin lễ thành hôn của con chúng tôi",
      nhaGai: "Nhà gái",
      nhaTrai: "Nhà trai",
      eventsTitle: "Lễ cưới",
      factTime: "Giờ",
      factDate: "Ngày",
      factLunar: "Âm lịch",
      factWhere: "Địa chỉ",
      directions: "Chỉ đường",
      addCalendar: "Lưu vào lịch",
      calendarIcs: "Tải tệp .ics",
      calendarGoogle: "Google Calendar",
      eventTitle: "Lễ thành hôn",
      programTitle: "Chương trình",
      eventVuQuy: "Lễ vu quy",
      eventThanhHon: "Lễ thành hôn",
      eventTiec: "Tiệc cưới",
      whenTitle: "Ngày chung đôi",
      daysLeft: "Còn {n} ngày nữa",
      dayLeft: "Còn {n} ngày nữa",
      countdownDone: "Hôm nay là ngày trọng đại",
      lunarLabel: "Âm lịch",
      monthLabel: "Tháng {m} · {y}",
      weekdays: [
        "Chủ nhật",
        "Thứ hai",
        "Thứ ba",
        "Thứ tư",
        "Thứ năm",
        "Thứ sáu",
        "Thứ bảy",
      ],
      weekdaysShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
      photoLabel: "Ảnh cưới",
      albumPhoto: "Ảnh",
      albumTitle: "Khoảnh khắc",
      albumSoon: "Album ảnh sẽ được cập nhật sau",
      albumClose: "Đóng",
      albumPrev: "Ảnh trước",
      albumNext: "Ảnh sau",
      rsvpTitle: "Xác nhận tham dự",
      nameLabel: "Họ và tên",
      phoneLabel: "Số điện thoại",
      attendLabel: "Bạn có tham dự không?",
      attendYes: "Có, mình sẽ đến",
      attendNo: "Rất tiếc, mình không đến được",
      countLabel: "Số người tham dự",
      guestOfLabel: "Bạn là khách của",
      messageLabel: "Lời nhắn",
      submit: "Gửi xác nhận",
      sending: "Đang gửi…",
      thanksTitle: "Cảm ơn bạn!\nHẹn gặp bạn trong ngày vui.", // \n breaks the line
      thanksEdit: "Sửa câu trả lời",
      rsvpNameRequired: "Vui lòng nhập họ và tên.",
      rsvpPhoneRequired: "Vui lòng nhập số điện thoại để chúng mình liên lạc.",
      rsvpMissing: "Mục xác nhận chưa mở. Vui lòng thử lại sau.",
      rsvpError: "Có lỗi khi gửi. Vui lòng thử lại.",
      closingTitle: "Trân trọng cảm ơn",
      closingText: "Sự hiện diện của bạn là niềm vui lớn nhất của chúng mình.",
      credit: "Mẫu thiệp gốc của quanbui210 trên GitHub",
      musicStart: "Bật nhạc",
      musicStop: "Tắt nhạc",
    },
    en: {
      title: "Wedding invitation",
      dear: "Dear",
      open: "Open the invitation",
      invite: "With joy, we invite you",
      heroKicker: "Wedding ceremony",
      brideLabel: "Bride",
      groomLabel: "Groom",
      heroLead: "We joyfully invite you to our wedding celebration",
      heroQuote:
        "Some things arrive at exactly the right time,\nand some people are worth the wait.",
      familyTitle: "Our families",
      familyIntro: "With joy, we announce the wedding of our children",
      nhaGai: "Bride's family",
      nhaTrai: "Groom's family",
      eventsTitle: "The ceremony",
      factTime: "Time",
      factDate: "Date",
      factLunar: "Lunar",
      factWhere: "Address",
      directions: "Directions",
      addCalendar: "Add to calendar",
      calendarIcs: "Download .ics",
      calendarGoogle: "Google Calendar",
      eventTitle: "Wedding ceremony",
      programTitle: "Programme",
      eventVuQuy: "Bride's arrival ceremony",
      eventThanhHon: "Wedding ceremony",
      eventTiec: "Wedding reception",
      whenTitle: "The day",
      daysLeft: "{n} days to go",
      dayLeft: "{n} day to go",
      countdownDone: "Today is the day",
      lunarLabel: "Lunar",
      monthLabel: "Month {m} · {y}",
      weekdays: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      weekdaysShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      photoLabel: "Wedding photo",
      albumPhoto: "Photo",
      albumTitle: "Moments",
      albumSoon: "The album will be shared soon",
      albumClose: "Close",
      albumPrev: "Previous photo",
      albumNext: "Next photo",
      rsvpTitle: "Please confirm",
      nameLabel: "Full name",
      phoneLabel: "Phone number",
      attendLabel: "Will you attend?",
      attendYes: "Yes, I will come",
      attendNo: "Sorry, I cannot come",
      countLabel: "Number of guests",
      guestOfLabel: "You are a guest of",
      messageLabel: "Message",
      submit: "Send",
      sending: "Sending…",
      thanksTitle: "Thank you!\nSee you on the day.",
      thanksEdit: "Edit my answer",
      rsvpNameRequired: "Please enter your name.",
      rsvpPhoneRequired: "Please enter a phone number so we can reach you.",
      rsvpMissing: "The RSVP is not open yet. Please try again later.",
      rsvpError: "Something went wrong. Please try again.",
      closingTitle: "With gratitude",
      closingText: "Your presence is the greatest joy for us.",
      credit: "Original template by quanbui210 on GitHub",
      musicStart: "Music on",
      musicStop: "Music off",
    },
  },
};
