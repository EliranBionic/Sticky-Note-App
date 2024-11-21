const taskText = document.getElementById("taskText");
const taskTime = document.getElementById("taskTime");
const taskDate = document.getElementById("taskDate");

const notesContainer = document.getElementById("notesContainer");

const noteArr = [];

function addNote() {
    addNoteData();
    displayDataInNotes();
    clearUI();
}

function getNoteData() {
    // Fetch data from local storage
    const data = localStorage.getItem("notes");
    // If data exists
    if (data) {
        // Parse the data and add it to noteArr
        noteArr.push(...JSON.parse(data));
        // Display the data
        displayDataInNotes();
    }
}

function saveNoteData() {
    // Save new note data to local storage
    localStorage.setItem("notes", JSON.stringify(noteArr));
}

function addNoteData() {
    const id = noteArr.length + 1;
    const text = taskText.value;
    const time = taskTime.value;
    const date = taskDate.value;

    // Validate that the note does not already exist
    for (const item of noteArr) {
        if (item.text === text) {
            alert("Note already exists");
            return;
        }
    }
    const oneNote = { id, text, date, time };
    noteArr.push(oneNote);

    saveNoteData();
}

function displayDataInNotes() {
    let content = "";
    for (const item of noteArr) {
        content += `
        <div class="sticky-note ${
            item.id === noteArr.length && item.id !== 0 ? "new-note" : ""
        }"  data-note-id="${item.id}">
            <div class="note-main">
                <div class="note-content">
                    <p>${item.text}</p>
                </div>
                <div class="note-footer">
                    <p class="task-date">${item.date}</p>
                    <p class="task-time">${item.time}</p>
                </div>
                <button class="delete-btn" onclick="deleteNote(${
                    item.id
                })">❌</button>
            </div>
        </div>
        `;
    }

    notesContainer.innerHTML = content;
}

// Delete a note
function deleteNote(id) {
    const sure = confirm("Are You sure you want to delete note?");
    if (!sure) return;

    let index = 0;
    for (let i = 0; i < noteArr.length; i++) {
        if (noteArr[i].id === id) {
            index = i;
            break;
        }
    }

    noteArr.splice(index, 1);

    // Save the updated noteArr
    saveNoteData();

    // Remove the specific note element from DOM
    const noteElement = document.querySelector(
        `.sticky-note[data-note-id="${id}"]`
    );
    if (noteElement) {
        noteElement.remove();
    }
}

function clearUI() {
    taskText.value = "";
    taskTime.value = "";
    taskDate.value = "";

    taskText.focus();
}

// Set minimum date and time
function setMinDateTime() {
    const dateInput = document.getElementById("taskDate");
    const timeInput = document.getElementById("taskTime");

    // Set min date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    // Set min date to today
    dateInput.min = formattedDate;

    // Set min time to current time for today's date only
    dateInput.addEventListener("change", (event) => {
        // Check if the selected date is today
        if (event.target.value === formattedDate) {
            const now = new Date();
            const HH = String(now.getHours()).padStart(2, "0");
            const MM = String(now.getMinutes()).padStart(2, "0");
            timeInput.min = `${HH}:${MM}`; // Set min time to current time
        } else {
            timeInput.min = ""; // No time restriction for future dates
        }
    });
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", () => {
    setMinDateTime();
    getNoteData();
});
