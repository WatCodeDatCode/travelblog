// Scroll elements
const jumpToContentButton = document.getElementById("jump-to-content");
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
