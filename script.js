function toggleMode() {
  // Select the HTML root element and toggle the "light" class
  const html = document.documentElement;
  html.classList.toggle("light");

  // Get the profile image element
  const image = document.querySelector("#profile img");

  // Check if light mode is active and update image attributes
  if (html.classList.contains("light")) {
    image.setAttribute("src", "./assets/images/avatar-light.png");
    image.setAttribute(
      "alt",
      "Photo of Mateus Silva serious, wearing glasses and gray shirt, mustache, and light pink background"
    );
  } else {
    image.setAttribute("src", "./assets/images/avatar.png");
    image.setAttribute(
      "alt",
      "Photo of Mateus Silva serious, wearing glasses and gray shirt, mustache, and white background"
    );
  }
}
