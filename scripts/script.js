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

// Blog element
const blogEntriesSection = document.getElementById("blog-entries");

// Variable for weather API
const apiKey = "03bbfddd33521d0c17e64ea09b10e111";

// Function to fetch weather from API
const fetchWeather = city => {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  ).then((response) => response.json());
};

// ** MODAL WINDOW FUNCTIONS ** //
// When the user clicks on the button to add new entry, open modal form
openModalWindowButton.onclick = function() {
  modalWindow.style.display = "block";
};

// When the user clicks on span "x" of modal window, close window
closeModalWindowSpan.onclick = function() {
  modalWindow.style.display = "none";
};

// When the user clicks anywhere outside of the modal window, close it
window.onclick = function(event) {
  if (event.target == modalWindow) {
    modalWindow.style.display = "none";
  }
};
// ** END MODAL WINDOW FUNCTIONS ** //

// ** DATE FUNCTIONS ** //
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
// ** END DATE FUNCTIONS ** //

// *** FORM FUNCTIONS *** //
const onSubmit = event => {
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
  modalWindow.style.display = "none";
  resetForm();
};

const formatDate = date => {
  const value = new Date(date);
  const formatted_date = `${value.getDate()}-${
    value.getMonth() + 1
  }-${value.getFullYear()}`;
  return formatted_date;
};

const addEntry = entry => {
  saveEntry(entry);
  createEntries();
};

const saveEntry = entry => {
  const entries = getEntries();
  entries.push(entry);

  const stringifiedEntries = JSON.stringify(entries);
  localStorage.setItem("entries", stringifiedEntries);
};

const getEntries = () => {
  const entries = localStorage.getItem("entries");

  if (!entries) {
    return [];
  }

  const parsedEntries = JSON.parse(entries);

  return parsedEntries;
};

const resetForm = () => {
  addEntryForm.reset();
};

addEntryForm.addEventListener("submit", onSubmit);
// *** END FORM FUNCTIONS *** //

//Creates HTML entry for new post
const createSingleEntry = entry => {
  let post = `
    <div class="px-6 py-4">
    <div class="font-bold text-4xl mb-2">Trip to ${entry.city}, ${
    entry.country
  }</b></div>
    <p class="text-lg">
      Arrival: ${formatDate(entry.from_date)}
    </p>
    <p class="text-lg">
      Departure: ${formatDate(entry.to_date)}
    </p>
    </div>
    <p class="m-2 whitespace-pre-line">${entry.trip_summary}</p>
    `;
    
    return post;
};

// TODO: Add weather to entries!
const createCityInformation = city => {
  fetchWeather(city).then((data) => {
    const temperature = JSON.stringify(data.main.temp);
    const feelsLike = JSON.stringify(data.main.feels_like);
    const tempMin = JSON.stringify(data.main.temp_min);
    const tempMax = JSON.stringify(data.main.temp_max);
    const imageUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    let weather = `<h3>Current weather:</h3>
    <img src="${imageUrl}"/>
    <p>Current temperature: ${temperature}</p>
    <p>Feels like: ${feelsLike}</p>
    <p>Low: ${tempMin}</p>
    <p>High: ${tempMax}</p>
    `;

    return weather;
  });
};

// Updates all entries
const createEntries = () => {
  blogEntriesSection.innerHTML = ""; // Clears entries to avoid constantly re-adding the whole list

  getEntries().forEach((entry, index) => {
    const element = document.createElement("div");
    element.classList.add(
      "container",
      "mx-auto",
      "text-center",
      "m-4",
      "p-4",
      "bg-blue-200",
      "rounded"
    );
    
    const post = createSingleEntry(entry);
    const weather = createCityInformation(entry.city); //TODO: Figure out why it keeps returning undefined even when weather prints successfully to console
    element.innerHTML = post;

    const button = document.createElement("button");
    button.classList.add(
      "bg-red-400",
      "text-white",
      "mt-2",
      "px-3",
      "py-2",
      "text-sm",
      "rounded"
    );
    button.innerHTML =
      '<span class="text-black font-bold hover:font-bolder">X</span> Remove';
    element.appendChild(button);

    button.addEventListener("click", () => {
      let confirmation = confirm("Are you sure you want to delete this entry? This CANNOT be undone!");
      if (confirmation == true) {
        removeEntry(index);
        createEntries();
      }
    });

    blogEntriesSection.appendChild(element);
  });
};

// Function for removing entry from locale storage
const removeEntry = index => {
  const entries = getEntries();
  entries.splice(index, 1);

  const stringifiedEntries = JSON.stringify(entries);
  localStorage.setItem("entries", stringifiedEntries);

  console.log(entries);
};

createEntries();
