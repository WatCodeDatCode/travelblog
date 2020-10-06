// Scroll elements
const jumpToContentButton = document.getElementById("jump-to-content");
const contentElement = document.getElementById("content");

// Nav elements
const burgerMenu = document.getElementById("burger");
const navItemClass = document.querySelector(".nav-item");

// Form elements
const contactForm = document.getElementById("contact-form");

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

// Smooth scroll function
const scrollToContent = () => {
  contentElement.scrollIntoView({
    behavior: "smooth",
  });
};

// Scroll to content on button click
jumpToContentButton.addEventListener("click", scrollToContent);

// Elements for modal window
const modalWindow = document.getElementById("modal-window");
const openModalWindowButton = document.getElementById("open-modal-window");
const closeModalWindowSpan = document.getElementsByClassName("close-modal")[0];

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

// *** START FORM FUNCTIONS *** //
const onSubmit = (event) => {
  event.preventDefault();

  modalWindow.style.display = "none";
  alert('Your message has not been sent because this is just an example page. Feel free to contact me through my linked Github profile!')
  resetForm();

};

const resetForm = () => {
  contactForm.reset();
};

contactForm.addEventListener("submit", onSubmit);
// *** END FORM FUNCTIONS *** //
