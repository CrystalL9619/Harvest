document.addEventListener("DOMContentLoaded", function () {
  const map = document.getElementById("map");
  const flowerScore = document.getElementById("flower-score");
  const grassScore = document.getElementById("grass-score");
  const goldScore = document.getElementById("gold-score");
  const playButton = document.getElementById("play-button");
  const harvestedItemsLists = document.getElementsByClassName("grid");
  let isSelecting = false;
  let startCoords = { x: 0, y: 0 };
  let selectedElements = { flower: 0, grass: 0, gold: 0 };

  playButton.addEventListener("click", startGame);

  function startGame() {
    resetSelectedElements();
    map.innerHTML = "";
    generateRandomElements();
    updateScores();
  }

  map.addEventListener("mousedown", (e) => {
    isSelecting = true;
    startCoords = { x: e.clientX, y: e.clientY };
    createSelectionBox();
  });

  document.addEventListener("mousemove", (e) => {
    if (isSelecting) {
      updateSelectionBox(e.clientX, e.clientY);
    }
  });

  document.addEventListener("mouseup", () => {
    if (isSelecting) {
      isSelecting = false;
      clearSelectionBox();
      collectItemsInSelection();
    }
  });

  function createSelectionBox() {
    const selectionBox = document.createElement("div");
    selectionBox.classList.add("selected-area");
    map.appendChild(selectionBox);
  }

  function updateSelectionBox(x, y) {
    const selectionBox = map.querySelector(".selected-area");
    const width = x - startCoords.x;
    const height = y - startCoords.y;

    selectionBox.style.width = `${Math.abs(width)}px`;
    selectionBox.style.height = `${Math.abs(height)}px`;
    selectionBox.style.left = `${width > 0 ? startCoords.x : x}px`;
    selectionBox.style.top = `${height > 0 ? startCoords.y : y}px`;
  }

  function clearSelectionBox() {
    const selectionBox = map.querySelector(".selected-area");
    if (selectionBox) {
      selectionBox.remove();
    }
  }

  function collectItemsInSelection() {
    const items = map.querySelectorAll(".grid img");
    const selectionBox = map.querySelector(".selected-area");

    items.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const boxRect = selectionBox.getBoundingClientRect();

      if (
        itemRect.left >= boxRect.left &&
        itemRect.right <= boxRect.right &&
        itemRect.top >= boxRect.top &&
        itemRect.bottom <= boxRect.bottom
      ) {
        // Item is inside the selection box
        const itemType = item.alt.toLowerCase();
        addHarvestedItem(itemType);
        item.remove();
      }
    });

    // Generate new items after collection
    generateRandomItems();
  }

  function addHarvestedItem(itemType) {
    for (let i = 0; i < harvestedItemsLists.length; i++) {
      let gridList = harvestedItemsLists[i].querySelector("ul");
      if (!gridList) {
        gridList = document.createElement("ul");
        harvestedItemsLists[i].appendChild(gridList);
      }
      const listItem = document.createElement("li");
      listItem.textContent = itemType;
      gridList.appendChild(listItem);
    }
  }

  // Ensure items are generated only once
  let itemsGenerated = false;
  function generateRandomElements() {
    if (!itemsGenerated) {
      const totalGrids = ((1300 / 100) * 700) / 100;
      for (let i = 0; i < totalGrids; i++) {
        const element = getRandomElement();
        const grid = document.createElement("div");
        grid.className = "grid";
        grid.classList.add(element);

        const img = document.createElement("img");
        img.src = `img/${element}.png`;
        img.alt = element;

        grid.appendChild(img);
        map.appendChild(grid);
      }
      itemsGenerated = true;
    }
  }

  function getRandomElement() {
    const elements = ["flower", "grass", "gold"];
    const randomIndex = Math.floor(Math.random() * elements.length);
    return elements[randomIndex];
  }

  function resetSelectedElements() {
    selectedElements = { flower: 0, grass: 0, gold: 0 };
  }

  function updateScores() {
    flowerScore.textContent = `Flower: ${selectedElements.flower}`;
    grassScore.textContent = `Grass: ${selectedElements.grass}`;
    goldScore.textContent = `Gold: ${selectedElements.gold}`;
  }
});
