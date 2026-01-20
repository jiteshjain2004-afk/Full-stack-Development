const textarea = document.getElementById("message");
const counter = document.getElementById("charCount");
const counterBox = document.querySelector(".counter");

const MAX = 150;

textarea.addEventListener("input", () => {
  const length = textarea.value.length;
  counter.textContent = length;

  counterBox.classList.remove("warning", "danger");

  if (length >= 120 && length < MAX) {
    counterBox.classList.add("warning");
  } else if (length === MAX) {
    counterBox.classList.add("danger");
  }
});
