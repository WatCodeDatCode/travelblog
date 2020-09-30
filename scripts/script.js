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

// ** MODAL WINDOW FUNCTIONS ** //
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
getWeatherInformation("Hamburg").then((data) => {
  const weather = {
    temp: data.main.temp.toFixed(1),
    temp_min: data.main.temp_min.toFixed(1),
    temp_max: data.main.temp_max.toFixed(1),
    image: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
  };
  console.log({ weather });
  return weather;
});

addEntryForm.addEventListener("submit", onSubmit);
// *** END FORM FUNCTIONS *** //

// Function to generate random number for random pic URL
const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

// Async function to fetch weather from API
async function getWeatherInformation(city) {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  );
  let data = await response.json();
  return data;
}

async function createSingleEntry(entry) {
  let randomImageUrl = `https://source.unsplash.com/random/1000x800?random=${randomNumber(
    1,
    900
  )}`;
  let randomImageUrlSmall = `https://source.unsplash.com/random/900x800?random=${randomNumber(
    1,
    900
  )}`;

  let city = entry.city;

  const data = await getWeatherInformation(city);
  const weather = {
    temp: data.main.temp.toFixed(1),
    temp_min: data.main.temp_min.toFixed(1),
    temp_max: data.main.temp_max.toFixed(1),
    image: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
  };
  let post = `
    <div class="card">
            <span class="badge">${entry.country}</span>
            <img
            class="w-full object-cover"
            src="${randomImageUrl}" 
            alt=""
            />
        <div class="px-6 py-4">
            <h3 class="text-primary-600 text-4xl text-center">${entry.city}</h3>
            <p><span class="font-bold">Arrival:</span> ${formatDate(
              entry.from_date
            )}</p>
            <p><span class="font-bold">Departure: </span> ${formatDate(
              entry.to_date
            )}</p>
            <p class="mt-3 whitespace-pre-wrap">${entry.trip_summary}</p>
        </div>
    </div>
    <div class="weather-card h-auto">
    <div
      class="col-span-3 md:col-span-1 w-full flex flex-wrap mb-6 px-2"
    >
      <div class="flex flex-wrap w-full">
        <p class="w-full text-xl md:text-4xl mt-8">Current weather</p>
        <img
          class="mx-auto text-xl self-start w-1/6 lg:w-1/3"
          src="${weather.image}"
          alt=""
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
    <img
      class="col-span-3 md:col-span-2 w-full object-contain"
      src="${randomImageUrlSmall}"
      alt=""
    />
  </div>

    `;

  // console.log(post)
  return post;
}

// Updates all entries
async function createEntries() {
  blogEntriesSection.innerHTML = ""; // Clears entries to avoid constantly re-adding the whole list

  for (const [index, entry] of getEntries().entries()) {
    const element = document.createElement("div");
    element.classList.add(
      "mt-6",
      "p-1",
      "md:p-4",
      "mx-1",
      "md:mx-10",
      "lg:mx-4",
      "bg-dark-500",
      "rounded",
      "relative"
    );

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
      if (confirmation == true) {
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

  //   createEntries();
  console.log(entries);
};

createEntries();
