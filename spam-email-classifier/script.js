/* =========================
   PAGE SWITCHING
========================= */
function showPage(pageId) {
    const pages = document.querySelectorAll(".page");
    pages.forEach(page => page.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
}

/* =========================
   EXAMPLE MESSAGES
========================= */
function loadExample(type) {
    const messageBox = document.getElementById("message");

    if (type === "spam") {
        messageBox.value =
            "Congratulations! You have won a free cash prize. Click the link urgently to claim your reward.";
    } else {
        messageBox.value =
            "Hi team, the project meeting is scheduled for tomorrow at 10 AM. Please be on time.";
    }
}

/* =========================
   CLASSIFICATION HISTORY
========================= */
let history = [];

function updateHistory(text, result, confidence) {
    history.unshift({
        text: text.substring(0, 40) + "...",
        result,
        confidence
    });

    if (history.length > 5) history.pop();

    const historyList = document.getElementById("history");
    historyList.innerHTML = "";

    history.forEach(item => {
        const li = document.createElement("li");
        li.innerText = `${item.text} → ${item.result} (${item.confidence}%)`;
        historyList.appendChild(li);
    });
}

/* =========================
   SPAM CLASSIFIER
========================= */
function classify() {
    const messageInput = document.getElementById("message");
    const message = messageInput.value.toLowerCase();

    const resultBox = document.getElementById("result");
    const confidenceBox = document.getElementById("confidence");
    const confidenceBar = document.getElementById("confidenceBar");
    const analysisBox = document.getElementById("analysis");

    const lengthBox = document.getElementById("length");
    const keywordCountBox = document.getElementById("keywordCount");
    const densityBox = document.getElementById("density");
    const highlightedBox = document.getElementById("highlightedText");

    const explainEnabled = document.getElementById("explainToggle").checked;

    if (message.trim() === "") {
        resultBox.innerText = "⚠️ Please enter a message.";
        resultBox.className = "result-box";
        return;
    }

    const spamKeywords = [
        "win", "free", "offer", "prize", "money",
        "urgent", "claim", "limited", "click",
        "congratulations", "lottery", "guaranteed",
        "bonus", "cash", "reward"
    ];

    let spamScore = 0;
    let detectedWords = [];

    spamKeywords.forEach(word => {
        if (message.includes(word)) {
            spamScore++;
            detectedWords.push(word);
        }
    });

    const messageLength = message.split(/\s+/).length;
    const keywordDensity = ((spamScore / messageLength) * 100).toFixed(2);

    let confidence = Math.min(
        Math.round((spamScore / spamKeywords.length) * 100 + keywordDensity),
        100
    );

    let classification, explanation;

    if (spamScore >= 3 || confidence > 60) {
        classification = "🚫 Spam Message";
        explanation =
            "The message contains multiple high-risk keywords commonly found in spam.";
        resultBox.className = "result-box spam";
    } else {
        classification = "✅ Not Spam";
        explanation =
            "The message does not significantly match known spam patterns.";
        resultBox.className = "result-box not-spam";
    }

    /* MAIN OUTPUT */
    resultBox.innerText = classification;
    confidenceBox.innerText = `Confidence Score: ${confidence}%`;
    confidenceBar.style.width = confidence + "%";

    /* ANALYTICS */
    lengthBox.innerText = messageLength;
    keywordCountBox.innerText = detectedWords.length;
    densityBox.innerText = `${keywordDensity}%`;

    /* EXPLAINABLE MODE */
    if (explainEnabled) {
        analysisBox.innerHTML = `
            <strong>Model Explanation:</strong><br>
            • Detected Keywords: ${detectedWords.length > 0 ? detectedWords.join(", ") : "None"}<br>
            • Keyword Risk Score: ${spamScore}<br><br>
            ${explanation}
        `;
    } else {
        analysisBox.innerHTML = "";
    }

    /* HIGHLIGHT KEYWORDS */
    let highlightedText = messageInput.value;
    detectedWords.forEach(word => {
        const regex = new RegExp(`(${word})`, "gi");
        highlightedText = highlightedText.replace(
            regex,
            `<span class="highlight">$1</span>`
        );
    });
    highlightedBox.innerHTML = highlightedText;

    /* UPDATE HISTORY */
    updateHistory(messageInput.value, classification, confidence);

    /* AUTO SWITCH */
    showPage("analytics");
}

/* =========================
   DEFAULT PAGE
========================= */
document.addEventListener("DOMContentLoaded", () => {
    showPage("home");
});
