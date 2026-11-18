
/* =========================
   PERSONAL SETTINGS
========================= */

const CONFIG = {
    herName: "BAJE",
    yourName: "COB",
    meetDate: "2026-5-7",
    togetherDate: "0-0-0"
};

// Change the names above.
// Dates must use YYYY-MM-DD format.

// =========================
// COURTING PAGE
// =========================

document.getElementById("herName").textContent = CONFIG.herName;

// YES BUTTON
document.getElementById("yesBtn").onclick = function () {
    document.getElementById("courtPage").classList.add("hidden");
    document.getElementById("couplePage").classList.remove("hidden");

    renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
};

// NO BUTTON
document.getElementById("noBtn").onclick = function () {
    document.getElementById("sadDog").classList.remove("hidden");
};

// =========================
// COUPLE WEBSITE
// =========================

document.getElementById("coupleHeader").textContent =
    CONFIG.yourName + " ♡ " + CONFIG.herName;

document.getElementById("names").textContent =
    CONFIG.yourName + " ♡ " + CONFIG.herName;

// TAB SWITCHER

function showTab(tabName) {
    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.add("hidden");
    });

    document.getElementById(tabName).classList.remove("hidden");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// =========================
// DAYS UNTIL WE MEET
// =========================

function updateMeetCountdown() {
    const today = new Date();
    const meeting = new Date(CONFIG.meetDate + "T00:00:00");

    today.setHours(0, 0, 0, 0);

    const difference = Math.ceil(
        (meeting - today) / (1000 * 60 * 60 * 24)
    );

    const display = document.getElementById("meetCountdown");

    if (difference > 0) {
        display.textContent = difference;
    } else if (difference === 0) {
        display.textContent = "TODAY ♡";
    } else {
        display.textContent = "245";
    }
}

// =========================
// DAYS TOGETHER
// =========================

function updateTogetherCounter() {
    const start = new Date(CONFIG.togetherDate + "T00:00:00");
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    let days = Math.floor(
        (today - start) / (1000 * 60 * 60 * 24)
    );

    document.getElementById("togetherDays").textContent =
        Math.max(0, days);
}

// =========================
// DAILY MESSAGES
// =========================

const messages = [
    "I hope something makes you smile today. You deserve happiness and peaceful days. ♡",
    "Don't forget to take care of yourself today. You're important too.",
    "I hope your day goes well. Always remember that you are appreciated.",
    "Another day, another reason to be thankful for you. ♡",
    "I hope you achieve something today that makes you proud of yourself.",
    "Take your time, breathe, and enjoy the little things today.",
    "Sending you a little reminder that you deserve kindness, happiness, and love."
];

function showDailyMessage() {
    const day = new Date().getDate();

    document.getElementById("dailyMessage").textContent =
        messages[(day - 1) % messages.length];
}

// =========================
// LOCAL STORAGE HELPERS
// =========================

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        return [];
    }
}

function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}

// =========================
// MEMORIES
// =========================

let memories = getData("memories");

function addMemory() {
    const file = document.getElementById("memoryFile").files[0];
    const caption = document.getElementById("memoryCaption").value;
    const favorite = document.getElementById("favoriteMemory").checked;

    if (!file) {
        alert("Please select a photo first!");
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {
        memories.unshift({
            image: reader.result,
            caption: caption,
            date: new Date().toISOString(),
            favorite: favorite
        });

        saveData("memories", memories);

        document.getElementById("memoryFile").value = "";
        document.getElementById("memoryCaption").value = "";
        document.getElementById("favoriteMemory").checked = false;

        renderMemories();
    };

    reader.readAsDataURL(file);
}

function toggleFavorite(index) {
    memories[index].favorite = !memories[index].favorite;

    saveData("memories", memories);
    renderMemories();
}

function deleteMemory(index) {
    if (confirm("Delete this memory?")) {
        memories.splice(index, 1);
        saveData("memories", memories);
        renderMemories();
    }
}

function renderMemories() {
    const gallery = document.getElementById("memoryGallery");
    const favorites = document.getElementById("favoriteGallery");

    gallery.innerHTML = "";
    favorites.innerHTML = "";

    memories.forEach((memory, index) => {
        const card = document.createElement("div");
        card.className = "memory-card";

        card.innerHTML = `
            <img src="${memory.image}" alt="Memory photo">

            <p>${escapeHTML(memory.caption)}</p>

            <small>
                ${new Date(memory.date).toLocaleDateString()}
            </small>

            <div>
                <button onclick="toggleFavorite(${index})">
                    ${memory.favorite ? "♥ Favorited" : "♡ Favorite"}
                </button>

                <button onclick="deleteMemory(${index})">
                    Delete
                </button>
            </div>
        `;

        gallery.appendChild(card);

        if (memory.favorite) {
            const favoriteCard = document.createElement("div");
            favoriteCard.className = "memory-card";

            favoriteCard.innerHTML = `
                <img src="${memory.image}" alt="Favorite memory">
                <p>${escapeHTML(memory.caption)}</p>
                <small>${new Date(memory.date).toLocaleDateString()}</small>
            `;

            favorites.appendChild(favoriteCard);
        }
    });

    if (memories.length === 0) {
        gallery.innerHTML = "<p>No memories yet. Add your first photo ♡</p>";
    }

    if (!memories.some(memory => memory.favorite)) {
        favorites.innerHTML = "<p>No favorite moments yet.</p>";
    }
}

// =========================
// LOVE LETTERS
// =========================

let letters = getData("letters");

function saveLetter() {
    const title = document.getElementById("letterTitle").value;
    const sender = document.getElementById("letterSender").value;
    const content = document.getElementById("letterContent").value;

    if (!content.trim()) {
        alert("Write your letter first!");
        return;
    }

    letters.unshift({
        title: title || "A little letter ♡",
        sender: sender,
        content: content,
        date: new Date().toISOString()
    });

    saveData("letters", letters);

    document.getElementById("letterTitle").value = "";
    document.getElementById("letterContent").value = "";

    renderLetters();
}

function deleteLetter(index) {
    letters.splice(index, 1);
    saveData("letters", letters);
    renderLetters();
}

function renderLetters() {
    const container = document.getElementById("letterGallery");

    container.innerHTML = "";

    letters.forEach((letter, index) => {
        const card = document.createElement("div");
        card.className = "saved-card";

        card.innerHTML = `
            <h3>${escapeHTML(letter.title)}</h3>
            <small>From: ${escapeHTML(letter.sender)}</small>
            <p>${escapeHTML(letter.content)}</p>
            <small>${new Date(letter.date).toLocaleString()}</small>
            <button onclick="deleteLetter(${index})">Delete</button>
        `;

        container.appendChild(card);
    });
}

// =========================
// SURPRISE MESSAGES
// =========================

let surprises = getData("surprises");

function saveSurprise() {
    const title = document.getElementById("surpriseTitle").value;
    const content = document.getElementById("surpriseContent").value;

    if (!content.trim()) {
        alert("Write your surprise message!");
        return;
    }

    surprises.unshift({
        title: title || "Surprise Message ♡",
        content: content,
        date: new Date().toISOString()
    });

    saveData("surprises", surprises);

    document.getElementById("surpriseTitle").value = "";
    document.getElementById("surpriseContent").value = "";

    renderSurprises();
}

function deleteSurprise(index) {
    surprises.splice(index, 1);
    saveData("surprises", surprises);
    renderSurprises();
}

function renderSurprises() {
    const container = document.getElementById("surpriseGallery");

    container.innerHTML = "";

    surprises.forEach((message, index) => {
        const card = document.createElement("div");
        card.className = "saved-card";

        card.innerHTML = `
            <h3>🎁 ${escapeHTML(message.title)}</h3>
            <p>${escapeHTML(message.content)}</p>
            <button onclick="deleteSurprise(${index})">Delete</button>
        `;

        container.appendChild(card);
    });
}

// =========================
// DAILY REASONS
// =========================

let reasons = getData("reasons");

function saveReason() {
    const content = document.getElementById("reasonContent").value;

    if (!content.trim()) {
        alert("Write a reason first!");
        return;
    }

    reasons.unshift({
        content: content,
        date: new Date().toISOString()
    });

    saveData("reasons", reasons);

    document.getElementById("reasonContent").value = "";

    renderReasons();
}

function renderReasons() {
    const container = document.getElementById("reasonGallery");

    container.innerHTML = "";

    reasons.forEach(reason => {
        const card = document.createElement("div");
        card.className = "saved-card";

        card.innerHTML = `
            <small>${new Date(reason.date).toLocaleDateString()}</small>
            <p>${escapeHTML(reason.content)}</p>
        `;

        container.appendChild(card);
    });
}

// =========================
// SPECIAL DATES
// =========================

let specialDates = getData("specialDates");

function addDate() {
    const title = document.getElementById("dateTitle").value;
    const date = document.getElementById("dateInput").value;

    if (!title || !date) {
        alert("Please enter the date and title.");
        return;
    }

    specialDates.unshift({
        title: title,
        date: date
    });

    saveData("specialDates", specialDates);

    document.getElementById("dateTitle").value = "";
    document.getElementById("dateInput").value = "";

    renderDates();
}

function deleteDate(index) {
    specialDates.splice(index, 1);
    saveData("specialDates", specialDates);
    renderDates();
}

function renderDates() {
    const container = document.getElementById("dateGallery");

    container.innerHTML = "";

    specialDates.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "saved-card";

        card.innerHTML = `
            <h3>${escapeHTML(item.title)}</h3>
            <p>${new Date(item.date + "T00:00:00").toLocaleDateString()}</p>
            <button onclick="deleteDate(${index})">Delete</button>
        `;

        container.appendChild(card);
    });
}

// =========================
// MONTHSARY COUNTDOWN
// =========================

function saveStartDate() {
    const date = document.getElementById("startDate").value;

    if (!date) {
        alert("Select your start date!");
        return;
    }

    localStorage.setItem("monthsaryStart", date);
    updateMonthsary();
}

function updateMonthsary() {
    const savedDate = localStorage.getItem("monthsaryStart");

    if (!savedDate) {
        document.getElementById("monthsaryCountdown").textContent =
            "Set your start date first ♡";
        return;
    }

    const start = new Date(savedDate + "T00:00:00");
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    let next = new Date(
        today.getFullYear(),
        today.getMonth(),
        start.getDate()
    );

    if (next <= today) {
        next.setMonth(next.getMonth() + 1);
    }

    const days = Math.ceil((next - today) / (1000 * 60 * 60 * 24));

    document.getElementById("monthsaryCountdown").textContent =
        days === 0
            ? "Happy Monthsary! ♡"
            : days + " days until your next monthsary ♡";
}

// =========================
// BUCKET LIST
// =========================

let bucketList = getData("bucketList");

function addBucket() {
    const item = document.getElementById("bucketItem").value;
    const category = document.getElementById("bucketCategory").value;

    if (!item.trim()) {
        alert("Write something you want to do together!");
        return;
    }

    bucketList.unshift({
        item: item,
        category: category,
        done: false
    });

    saveData("bucketList", bucketList);

    document.getElementById("bucketItem").value = "";

    renderBucket();
}

function toggleBucket(index) {
    bucketList[index].done = !bucketList[index].done;

    saveData("bucketList", bucketList);
    renderBucket();
}

function deleteBucket(index) {
    bucketList.splice(index, 1);
    saveData("bucketList", bucketList);
    renderBucket();
}

function renderBucket() {
    const container = document.getElementById("bucketGallery");

    container.innerHTML = "";

    bucketList.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "saved-card";

        card.innerHTML = `
            <h3>${escapeHTML(item.category)}</h3>

            <label>
                <input type="checkbox"
                    ${item.done ? "checked" : ""}
                    onchange="toggleBucket(${index})">

                ${escapeHTML(item.item)}
            </label>

            <button onclick="deleteBucket(${index})">Remove</button>
        `;

        container.appendChild(card);
    });
}

// =========================
// LOAD EVERYTHING
// =========================

function renderAll() {
    renderMemories();
    renderLetters();
    renderSurprises();
    renderReasons();
    renderDates();
    renderBucket();
    updateMonthsary();
}

updateMeetCountdown();
updateTogetherCounter();
showDailyMessage();
updateMonthsary();
renderAll();
