const faqData = [
  {
    question: "Paano ako makaka-order sa website?", // Filipino
    altQuestions: [
      "How can I order on the website?", // English
      "Unsaon nako pag-order sa website?" // Bisaya
    ],
    answer: {
      en: "Go to the product page and click the 'Order Now' button.",
      tl: "Pumunta lang sa page ng produkto at i-click ang 'Order Now' button.",
      ceb: "Adto sa product page ug i-click ang 'Order Now' button."
    },
    followUps: [
      "Paano ang delivery?",
      "May bayad ba ang shipping?"
    ]
  },
  {
    question: "Paano ang delivery?",
    altQuestions: [
      "How is the delivery?",
      "Unsa ang delivery process?"
    ],
    answer: {
      en: "Delivery usually takes 3-5 working days depending on your location.",
      tl: "Ang delivery ay kadalasang 3-5 working days depende sa lokasyon.",
      ceb: "Kasagaran 3-5 working days ang delivery depende sa inyong location."
    },
    followUps: [
      "May bayad ba ang shipping?",
      "Pwede bang i-cancel ang order?"
    ]
  },
  {
    question: "May bayad ba ang shipping?",
    altQuestions: [
      "Is shipping free?",
      "Libre ba ang shipping?",
      "Naa bay bayad ang delivery?"
    ],
    answer: {
      en: "Shipping is free for orders over ₱500.",
      tl: "Libre ang shipping para sa mga order lampas ₱500.",
      ceb: "Libre ang delivery kung lapas ₱500 ang order nimo."
    },
    followUps: [
      "Paano ang delivery?",
      "Paano ako makaka-order sa website?"
    ]
  },
  {
    question: "Pwede bang i-cancel ang order?",
    altQuestions: [
      "Can I cancel the order?",
      "Pwede ba nako i-cancel ang order?"
    ],
    answer: {
      en: "Yes, as long as it hasn't been shipped yet. Go to 'My Orders' and click 'Cancel'.",
      tl: "Oo, basta hindi pa ito nai-ship. Pumunta sa 'My Orders' at i-click ang 'Cancel'.",
      ceb: "Pwede ka maka-cancel basta wala pa na-ship. Adto sa 'My Orders' ug i-click ang 'Cancel'."
    },
    followUps: [
      "Paano ako makaka-order sa website?"
    ]
  },
  {
  question: "kinsa nag ingon na kargakidor rako taman?",
  altQuestions: [],
  answer: {
    tl: "hahaha",
    ceb: "hahaha",
    en: "hahaha",
   }
  },
  {
    question: "sino ang crush mo?",
    altQuestions: [
        "Kinsa imong crush?",
        "Who is your crush?",
    ],
    answer: {
        tl: "secret",
        ceb: "secret",
        en: "secret",
    },
    hideFromList: true
  }
];

const chatbox = document.getElementById("chatbox");
const questionButtons = document.getElementById("question-buttons");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Load questions on sidebar
faqData.forEach((item) => {
    // I-skip ang display kung ayaw mong lumabas sa listahan
  if (item.hideFromList) return;

  const li = document.createElement("li");
  li.textContent = item.question;
  li.addEventListener("click", () => {
    userInput.value = item.question;
  });
  questionButtons.appendChild(li);
});

// Fuzzy matching with basic similarity
function findClosestMatch(input) {
  input = input.toLowerCase();
  let highestScore = 0;
  let bestMatch = null;

  faqData.forEach(item => {
    const scoreMain = getSimilarity(input, item.question.toLowerCase());
    if (scoreMain > highestScore) {
      highestScore = scoreMain;
      bestMatch = item;
    }

    if (item.altQuestions) {
      item.altQuestions.forEach(alt => {
        const scoreAlt = getSimilarity(input, alt.toLowerCase());
        if (scoreAlt > highestScore) {
          highestScore = scoreAlt;
          bestMatch = item;
        }
      });
    }
  });

  return highestScore >= 0.4 ? bestMatch : null;
}

// Detect language (basic)
function detectLanguage(text) {
  const lowerText = text.toLowerCase();
  if (/[?]$/.test(text)) text = text.slice(0, -1);

  if (
    /(how|what|can|is|are|do|does|when|where|why|who)/i.test(lowerText)
  ) return 'en';
  if (
    /(paano|pwede|may|kailan|saan|ano|sino|hindi|oo)/i.test(lowerText)
  ) return 'tl';
  if (
    /(unsa|naa|lapas|pila|wala|pwede)/i.test(lowerText)
  ) return 'ceb';

  return null;
}

// Very basic similarity score (word overlap) with special character handling
function getSimilarity(str1, str2) {
  // Remove special characters and lowercase
  str1 = str1.replace(/[^\w\s]|_/g, "").toLowerCase();
  str2 = str2.replace(/[^\w\s]|_/g, "").toLowerCase();

  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);

  let matchCount = 0;

  words1.forEach(w1 => {
    words2.forEach(w2 => {
      if (w1 === w2) matchCount++;
    });
  });

  const maxLength = Math.max(words1.length, words2.length);
  return matchCount / maxLength;
}

// Handle Send
sendBtn.addEventListener("click", () => {
  const userText = userInput.value.trim();
  if (userText === "") return;

  addChatBubble("user", userText);

  const item = findClosestMatch(userText);

  if (item) {
  const language = detectLanguage(userText); // 🔍 detect the language
  const answerText = item.answer[language] || item.answer['en']; // ✅ piliin ang tamang sagot
  setTimeout(() => {
    const language = detectLanguage(userText);
    const answerText = item.answer[language] || item.answer['en'];
    addChatBubble("bot", answerText, item.followUps); // 💬 show translated answer
  }, 800);


  } else {
    setTimeout(() => {
      addChatBubble("bot", "Paumanhin, hindi ko alam ang sagot sa tanong na iyan.");
    }, 800);
  }

  userInput.value = "";
});

// Support Enter key
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

// Display bubbles
function addChatBubble(sender, text, followUps = []) {
  const bubble = document.createElement("div");
  bubble.classList.add("chat-bubble", sender);
  bubble.innerText = text;
  chatbox.appendChild(bubble);

  if (sender === "bot" && followUps.length > 0) {
    const followUpContainer = document.createElement("div");
    followUpContainer.classList.add("follow-up-container");

    followUps.forEach(fq => {
      const btn = document.createElement("button");
      btn.textContent = fq;
      btn.classList.add("follow-up-btn");
      btn.addEventListener("click", () => {
        userInput.value = fq;
      });
      followUpContainer.appendChild(btn);
    });

    chatbox.appendChild(followUpContainer);
  }

  chatbox.scrollTop = chatbox.scrollHeight;
}
