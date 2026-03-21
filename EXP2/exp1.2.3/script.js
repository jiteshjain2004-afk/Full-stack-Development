const svg = document.getElementById("svg");
const undoBtn = document.getElementById("undoBtn");
const countText = document.getElementById("count");

let count = 0;

svg.addEventListener("click", function (e) {
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  circle.setAttribute("cx", e.offsetX);
  circle.setAttribute("cy", e.offsetY);
  circle.setAttribute("r", 8);
  circle.setAttribute("fill", "blue");

  svg.appendChild(circle);

  count++;
  countText.innerText = "Circles drawn: " + count;
});

undoBtn.addEventListener("click", function () {
  if (svg.children.length > 1) {
    svg.removeChild(svg.lastChild);
    count--;
    countText.innerText = "Circles drawn: " + count;
  }
});
