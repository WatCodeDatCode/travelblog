// https://github.com/hamburgcodingschool/javascript-for-web-2020-09/blob/master/PROJECT.md

// Form elements
const addEntryForm = document.getElementById("add-new-entry");
const cityInput = document.getElementById("city-input");
const countryInput = document.getElementById("country-input");
const tripFromDateInput = document.getElementById("from-date-input");
const tripToDateInput = document.getElementById("to-date-input");
const tripSummaryInput = document.getElementById("trip-summary-input");

// Elements for modal window
const modalWindow = document.getElementById("modal-window");
const openModalWindowButton = document.getElementById("open-modal-window");
const closeModalWindowSpan = document.getElementsByClassName("close")[0];

// ** MODAL WINDOW FUNCTIONS ** //
// When the user clicks on the button to add new entry, open modal form
openModalWindowButton.onclick = function() {
    modalWindow.style.display = "block";
}

// When the user clicks on span "x" of modal window, close window
closeModalWindowSpan.onclick = function() {
    modalWindow.style.display = "none";
}

// When the user clicks anywhere outside of the modal window, close it
window.onclick = function(event) {
    if (event.target == modalWindow) {
        modalWindow.style.display = "none";
    }
}
// ** END MODAL WINDOW FUNCTIONS ** //

// Variable for current date
let today = new Date();
let currentDay = today.getDate();
let currentMonth = today.getMonth() + 1; //January is 0!!
let currentYear = today.getFullYear();

// Function to set max input dates of trip to current date
const setMaxDateToCurrentDate = () => {
  if (currentDay < 10) {
    currentDay = "0" + currentDay;
  }
  if (currentMonth < 10) {
    currentMonth = "0" + currentMonth;
  }
  today = `${currentYear}-${currentMonth}-${currentDay}`;

  tripFromDateInput.setAttribute("max", today);
  tripToDateInput.setAttribute("max", today);
};

setMaxDateToCurrentDate();

// Set min of "trip to date" to entered value of "trip from date" on change
tripFromDateInput.onchange = function () {
  tripToDateInput.min = this.value;
  tripToDateInput.value = this.value;
};

// *** FORM FUNCTIONS *** //
const onSubmit = (event) => {
  event.preventDefault();

  const city = cityInput.value;
  const country = countryInput.value;
  const from_date = tripFromDateInput.value;
  const to_date = tripToDateInput.value;
  const trip_summary = tripSummaryInput.value;

  const entry = {
    city,
    country,
    from_date,
    to_date,
    trip_summary,
  };

  addEntry(entry);
  resetForm();
};

const addEntry = entry => {
    saveEntry(entry);
    // createEntriesHtml(); //TODO: Add function, also for singleEntriesHtml
}

const saveEntry = entry => {
    const entries = getEntries();
    entries.push(entry);
  
    const stringifiedEntries = JSON.stringify(entries);
    localStorage.setItem("entries", stringifiedEntries);
}

const getEntries = () => {
    const entries = localStorage.getItem("entries");

    if (!entries) {
      return [];
    }
  
    const parsedEntries = JSON.parse(entries);
    // const sortedEntries = sortEntries(parsedEntries);
  
    return parsedEntries;
}

const resetForm = () => {
  addEntryForm.reset();
};

addEntryForm.addEventListener("submit", onSubmit);
// *** END FORM FUNCTIONS *** //
