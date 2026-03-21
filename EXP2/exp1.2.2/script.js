 const filter = document.getElementById("categoryFilter");
    const cards = document.querySelectorAll(".card");

    filter.addEventListener("change", () => {
      const selected = filter.value;

      cards.forEach(card => {
        const category = card.getAttribute("data-category");

        if (selected === "all" || category === selected) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });