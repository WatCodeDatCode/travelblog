// Add dotenv requirement for env variables
require('dotenv').config();

// Variable for current date to be used in functions / example entry
let today = new Date();
let currentDay = today.getDate();
let currentMonth = today.getMonth() + 1; //January is 0!!
let currentYear = today.getFullYear();

// Example entry to be set as initial entry of blog before first posts made to local storage
let exampleEntry = [
  {
    city: "Hamburg",
    country: "DE",
    arrival_date: today,
    departure_date: today,
    trip_summary: `
    This is an example of how each post will look. A random image will automatically be generated and the current weather as well as the google map of that destination will be displayed under each summary.
    
    Delete this entry by clicking the 'x' in the upper right corner after adding your own. If all entries are deleted, then this example will appear again. It's not a bug, it's a feature. ;-)
    `,
  },
];

// Form elements
const addEntryForm = document.getElementById("add-new-entry");
const cityInput = document.getElementById("city-input");
const countryInput = document.getElementById("country-input");
const tripFromDateInput = document.getElementById("from-date-input");
const tripToDateInput = document.getElementById("to-date-input");
const tripSummaryInput = document.getElementById("trip-summary-input");

// Scroll elements
const jumpToContentButton = document.getElementById("jump-to-content");
const jumpUpToContentButton = document.getElementById("jump-up-to-content");
const contentElement = document.getElementById("content");

// Nav elements
const burgerMenu = document.getElementById("burger");
const navItemClass = document.querySelector(".nav-item");

// Function for responsive burger menu
burgerMenu.addEventListener("click", () => {
  if (navItemClass.style.display === "block") {
    document
      .querySelectorAll(".nav-item")
      .forEach((el) => (el.style.display = "none"));
  } else {
    document
      .querySelectorAll(".nav-item")
      .forEach((el) => (el.style.display = "block"));
  }
});

// Async function to fetch weather from API
async function getWeatherInformation(city) {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=03bbfddd33521d0c17e64ea09b10e111`
  );
  let data = await response.json();
  return data;
}

// Smooth scroll function
const scrollToContent = () => {
  contentElement.scrollIntoView({
    behavior: "smooth",
  });
};

// Scroll to content on button click
jumpToContentButton.addEventListener("click", scrollToContent);
jumpUpToContentButton.addEventListener("click", scrollToContent);

// Sort select elements
const sortDiv = document.getElementById("sort-div");
const orderSelect = document.getElementById("order-select");

// Elements for modal window
const modalWindow = document.getElementById("modal-window");
const openModalWindowButton = document.getElementById("open-modal-window");
const closeModalWindowSpan = document.getElementsByClassName("close-modal")[0];

// Blog element
const blogEntriesSection = document.getElementById("blog-entries");

// *** MODAL WINDOW FUNCTIONS *** //
// When the user clicks on the button to add new entry, open modal form
openModalWindowButton.onclick = function () {
  modalWindow.style.display = "block";
};

// When the user clicks on span "x" of modal window, close window
closeModalWindowSpan.onclick = function () {
  modalWindow.style.display = "none";
};

// When the user clicks anywhere outside of the modal window, close it
window.onclick = function (event) {
  if (event.target == modalWindow) {
    modalWindow.style.display = "none";
  }
};
// *** END MODAL WINDOW FUNCTIONS *** //

// *** DATE FUNCTIONS *** //
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
// *** END DATE FUNCTIONS *** //

// *** SORT FUNCTIONS *** //
// Only show sorting option if more than one object exists for entries
const showSortDiv = () => {
  let entries = localStorage.getItem("entries");

  if (JSON.parse(entries)[1]) {
    sortDiv.style.display = "block";
  } else {
    sortDiv.style.display = "none";
  }
};

// Sort entries from latest trips to oldest by default
let sortDirection = "DESC";

const onOrderSelectChange = (event) => {
  sortDirection = event.target.value;
  createEntries();
};

orderSelect.addEventListener("change", onOrderSelectChange);

// Function for sorting entries
const sortEntries = (entries) => {
  if (sortDirection === "DESC") {
    return entries.sort(
      (a, b) => Date.parse(b.arrival_date) - Date.parse(a.arrival_date)
    );
  }

  if (sortDirection === "ASC") {
    return entries.sort(
      (a, b) => Date.parse(a.arrival_date) - Date.parse(b.arrival_date)
    );
  }
};

// *** END SORT FUNCTIONS *** //

// *** FORM FUNCTIONS *** //
const onSubmit = (event) => {
  event.preventDefault();

  const city = cityInput.value;
  const country = countryInput.value;
  const arrival_date = tripFromDateInput.value;
  const departure_date = tripToDateInput.value;
  const trip_summary = tripSummaryInput.value;

  const entry = {
    city,
    country,
    arrival_date,
    departure_date,
    trip_summary,
  };

  modalWindow.style.display = "none";
  resetForm();

  addEntry(entry);
};

const formatDate = (date) => {
  const value = new Date(date);
  const formatted_date = `${value.getDate()}-${
    value.getMonth() + 1
  }-${value.getFullYear()}`;
  return formatted_date;
};

const addEntry = (entry) => {
  saveEntry(entry);
  createEntries();
};

const saveEntry = (entry) => {
  const entries = getEntries();
  entries.push(entry);

  const stringifiedEntries = JSON.stringify(entries);
  localStorage.setItem("entries", stringifiedEntries);
};

const getEntries = () => {
  let entries = localStorage.getItem("entries");

  if (!entries || entries == "[]") {
    sortDiv.style.display = "none";
    return exampleEntry;
  }

  const parsedEntries = JSON.parse(entries);
  const sortedEntries = sortEntries(parsedEntries);
  showSortDiv();

  return sortedEntries;
};

// Initialize entries
getEntries();

const resetForm = () => {
  addEntryForm.reset();
};

addEntryForm.addEventListener("submit", onSubmit);
// *** END FORM FUNCTIONS *** //

// Function to generate random number for random pic URL
const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

async function createSingleEntry(entry) {
  let randomImageUrl = `https://source.unsplash.com/random/${randomNumber(800, 900)}x${randomNumber(700, 800)}?random=${randomNumber(
    1,
    900
  )}`;

  let city = entry.city;

  const data = await getWeatherInformation(city);
  const weather = {
    temp: data.main.temp.toFixed(1),
    temp_min: data.main.temp_min.toFixed(1),
    temp_max: data.main.temp_max.toFixed(1),
    image: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
  };
  let post = `
    <div class="card">
    <span class="badge">${entry.country}</span>
    <img class="w-full max-h-40 object-cover" src="${randomImageUrl}" alt="Random image from picsum" />
    <div class="px-6 py-4">
        <h3
        class="text-primary-600 text-3xl sm:text-4xl xl:text-6xl text-center"
        >
        ${entry.city}
        </h3>
        <div class="flex justify-around px-3 py-1 text-lg sm:text-2xl">
        <div class="mx-3 sm:mx-6 lg:mx-10 xl:mx-18">
            <p class="font-bold">Arrival:</p>
            <p>${formatDate(entry.arrival_date)}</p>
        </div>
        <div class="mx-3 sm:mx-6 lg:mx-10 xl:mx-18">
            <p class="font-bold">Departure:</p>
            <p>${formatDate(entry.departure_date)}</p>
        </div>
        </div>
        <p class="mx-1 sm:mx-3 lg:mx-10 text-lg sm:text-xl my-3 whitespace-pre-wrap">${entry.trip_summary}</p>
    </div>
    </div>
    <div class="weather-card h-auto">
    <div class="col-span-3 md:col-span-1 w-full flex flex-wrap mb-6 px-2">
        <div class="flex flex-wrap w-full">
        <p class="w-full text-xl md:text-2xl xl:text-4xl mt-8">Current weather in ${
          entry.city
        }</p>
        <img
            class="mx-auto self-start max-h-30 w-1/6 lg:w-1/3"
            src="${weather.image}"
            alt="Current weather icon"
        />

        <div class="w-full text-3xl md:text-5xl tracking-tighter">
            <p class="tracking-normal text-sm text-dark-400">
            Temperature &#8451;
            </p>
            ${weather.temp}
        </div>
        <div class="w-1/2 text-xl md:text-3xl">
            <p class="text-xs lg:text-lg mx-2 text-dark-400">Low:</p>
            ${weather.temp_min}
        </div>
        <div class="w-1/2 text-xl md:text-3xl">
            <p class="text-xs lg:text-lg mx-2 text-dark-400">High:</p>
            ${weather.temp_max}
        </div>
        </div>
    </div>
    <iframe
      class="h-full min-h-30 w-full col-span-3 md:col-span-2"
      frameborder="0" style="border:0"
      src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCLtPYNl2W9WNdJVCMjXURmGwnTJrTaeOQ&q=${
    entry.city
  }" allowfullscreen>
    </iframe>
    </div>

    `;

  return post;
}

// Updates all entries
async function createEntries() {
  blogEntriesSection.innerHTML = ""; // Clears entries to avoid constantly re-adding the whole list

  for (const [index, entry] of getEntries().entries()) {
    const element = document.createElement("article");
    element.classList.add("entry");

    const post = await createSingleEntry(entry);
    element.innerHTML = post;

    const deleteEntry = document.createElement("span");
    deleteEntry.classList.add("delete", "hover:text-dark-300");
    deleteEntry.innerHTML = "&times;";

    element.appendChild(deleteEntry);

    deleteEntry.addEventListener("click", () => {
      let confirmation = confirm(
        "Are you sure you want to delete this entry? This CANNOT be undone!"
      );
      if (confirmation === true) {
        removeEntry(index);
        createEntries();
      }
    });
    blogEntriesSection.appendChild(element);
  }
}

// Function for removing entry from locale storage
const removeEntry = (index) => {
  const entries = getEntries();
  entries.splice(index, 1);

  const stringifiedEntries = JSON.stringify(entries);
  localStorage.setItem("entries", stringifiedEntries);
};

createEntries();
