// Synonym button বানানোর জন্য
const createElements = (arr) => {
    if (!arr || arr.length === 0) return "N/A";
    const htmlElements = arr.map(el => `<span class="btn btn-sm m-1">${el}</span>`);
    return htmlElements.join(" ");
};
function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
}
const manageSpinner = (status) => {
    if (status === true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    } else {
        document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }
}

// সব লেসন লোড করবে
const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(json => displayLessons(json.data))
        .catch(err => console.error("Error loading lessons:", err));
};

// নির্দিষ্ট লেভেলের word লোড করবে
const loadLevelWord = (id) => {
    manageSpinner(true); // fixed typo
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => displayLevelWord(data.data))
        .catch(err => console.error("Error loading words:", err));
};

// Word card গুলো দেখাবে
const displayLevelWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = ""; // আগের word clear করবে

    if (words.length == 0) {
        wordContainer.innerHTML = `
        <div class="text-center col-span-full rounded-xl py-10 space-y-6 font-bangla">
            <img class="mx-auto" src="./assets/alert-error.png" />
            <p class="text-xl font-medium text-gray-400">এই লেসনে এখনো কোন ভোকাবুলারি এড হয়নি</p>
            <h2 class="font-bold text-4xl">নেক্সট লেসনে যান</h2>
        </div>`;
        manageSpinner(false);
        return;
    }

    words.forEach((word) => {
        const card = document.createElement("div");
        card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
            <h2 class="font-bold text-2xl">${word.word}</h2>
            <p class="font-semibold">Meaning / Pronunciation</p>
            <div class="text-2xl font-medium font-bangla">
                ${word.word ? word.word : "শব্দ পাওয়া যায়নি"} / 
                ${word.pronunciation ? word.pronunciation : "উচ্চারন পাওয়া যায়নি"}
            </div>
            <div class="flex justify-between items-center">
                <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]" 
                    onclick="showWordDetails('${word.word}', '${word.meaning}', '${word.pronunciation}', '${word.example}', ${JSON.stringify(word.synonyms)})">
                    <i class="fa-solid fa-circle-info"></i>
                </button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
        </div>`;
        wordContainer.append(card);
    });
    manageSpinner(false);
};

// Modal দেখানোর জন্য
const showWordDetails = (word, meaning, pronunciation, example, synonyms) => {
    const modal = document.getElementById("word_modal");
    const modalContent = document.getElementById("modal-content");

    modalContent.innerHTML = `
        <div>
            <h2 class="text-2xl font-bold">${word} 
                (<i class="fa-solid fa-microphone-lines"></i> : ${pronunciation ? pronunciation : "N/A"})
            </h2>
        </div>
        <div class="mt-2">
            <h2 class="font-bold">Meaning</h2>
            <p>${meaning ? meaning : "N/A"}</p>
        </div>
        <div class="mt-2">
            <h2 class="font-bold">Example</h2>
            <p>${example ? example : "N/A"}</p>
        </div>
        <div class="mt-2">
            <h2 class="font-bold">Synonym</h2>
            <div class="flex flex-wrap">${createElements(synonyms)}</div>
        </div>
    `;

    modal.showModal(); // <dialog> element open করবে
};

// লেসন বাটন তৈরি করবে
const displayLessons = (lessons) => {
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";

    lessons.forEach((lesson) => {
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
            <button onclick="loadLevelWord(${lesson.level_no})" 
                class="btn btn-outline btn-primary m-2">
                <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
            </button>`;
        levelContainer.appendChild(btnDiv);
    });
};

// শুরুতে সব লেসন লোড হবে
loadLessons();

document.getElementById("btn-search").addEventListener("click", () => {
    const input = document.getElementById("input-search");
    const searchValue = input.value.trim().toLowerCase(); 

    fetch("https://openapi.programming-hero.com/api/words/all")
        .then(res => res.json())
        .then(data => {
            const allWords = data.data;
            // case-insensitive + whitespace remove করে match
            const filterWords = allWords.filter(word =>
                word.word.toLowerCase().includes(searchValue)
            );
            displayLevelWord(filterWords);
        })
        .catch(err => console.error("Error searching words:", err));
});
