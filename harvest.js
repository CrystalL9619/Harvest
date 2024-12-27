const map = document.getElementById("map");
const canvas1 = document.getElementById("canvas1");
const canvas2 = document.getElementById("canvas2");
const canvas3 = document.getElementById("canvas3");

const squareCount= document.getElementById("squareCount");
const circleCount = document.getElementById("circleCount");
const rectangleCount = document.getElementById("rectangleCount");

const selectionCanvas = document.getElementById("selection");

const playButton = document.getElementById("play-button");
const resetButton = document.getElementById("reset-button");

let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

canvas1.width = 100;
canvas1.height = 100;
const ctx1 = canvas1.getContext("2d");
ctx1.fillStyle = "gold";
ctx1.fillRect(25, 25, 50, 50);

canvas2.width = 100;
canvas2.height = 100;
const ctx2 = canvas2.getContext("2d");
ctx2.fillStyle = "pink";
ctx2.beginPath();
ctx2.arc(50, 50, 25, 0, Math.PI * 2);
ctx2.fill();

canvas3.width = 100;
canvas3.height = 100;
const ctx3 = canvas3.getContext("2d");
ctx3.fillStyle = "green";
ctx3.fillRect(33, 25, 33, 50);

window.addEventListener("load", function () {
  map.innerHTML = ""; // Clear the map when the page loads

  let items = [];
  let isGameStarted = false; // Flag to check if the game has started
  let isMapClickable = true; // Flag to check if the map is clickable

  // Set initial button colors
  playButton.style.backgroundColor = "#4caf50";
  resetButton.style.backgroundColor = "#888e89";

  playButton.addEventListener("click", () => {
    if (!playButton.disabled) {
      items = generateRandomElements();
      isGameStarted = true; // Set the flag to true when the game starts
      isMapClickable = true; // Enable map click events
      playButton.disabled = true; // Disable the play button
      playButton.style.backgroundColor = "#888e89"; // Change play button color
      resetButton.style.backgroundColor = "#4caf50"; // Change reset button color
      console.log(items);
    }
  });

  function generateRandomElements() {
    const totalGrids = (1000 / 100) * (500 / 100);
    const elements = [canvas1, canvas2, canvas3];
    let items = []; // Initialize items array here

    for (let i = 0; i < totalGrids; i++) {
      const randomElementIndex = Math.floor(Math.random() * elements.length);

      const newCanvas = document.createElement("canvas");
      newCanvas.width = 100;
      newCanvas.height = 100;
      newCanvas.getContext("2d").drawImage(elements[randomElementIndex], 0, 0);
      map.appendChild(newCanvas);
      const x = (i % (1000 / 100)) * 100;
      const y = Math.floor(i / (1000 / 100)) * 100;
      newCanvas.style.position = "absolute";
      newCanvas.style.left = `${x}px`;
      newCanvas.style.top = `${y}px`;
      const item = { randomElementIndex, x, y };
      items.push(item);
    }
    return items;
  }

  let selection = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    path: [] // Store the path of the selection
  };

  if (selectionCanvas) {
    selectionCanvas.width = 1000;
    selectionCanvas.height = 500;

    const selection_canvas_bounding_box =
      selectionCanvas.getBoundingClientRect();
    let isSelecting = false;

    selection_canvas_context = selectionCanvas.getContext("2d");
    selection_canvas_context.lineWidth = 1; // Set the stroke weight

    selectionCanvas.addEventListener("mousedown", function (event) {
      if (!isGameStarted || !isMapClickable) return; // Prevent selection if the game hasn't started or map is not clickable
      isSelecting = true;
      selection.path = [];
      selection_canvas_context.clearRect(
        0,
        0,
        selectionCanvas.width,
        selectionCanvas.height
      );
      selection.path.push({
        x: event.clientX - selection_canvas_bounding_box.x,
        y: event.clientY - selection_canvas_bounding_box.y,
      });
    });

    selectionCanvas.addEventListener("mousemove", function (event) {
      if (!isSelecting) return;
      const point = {
        x: event.clientX - selection_canvas_bounding_box.x,
        y: event.clientY - selection_canvas_bounding_box.y,
      };
      selection.path.push(point);
      selection_canvas_context.lineTo(point.x, point.y);
      selection_canvas_context.stroke();
    });

    selectionCanvas.addEventListener("mouseup", function (event) {
      if (!isGameStarted || !isMapClickable) return; // Prevent selection if the game hasn't started or map is not clickable
      isSelecting = false;
      selection.path.push({
        x: event.clientX - selection_canvas_bounding_box.x,
        y: event.clientY - selection_canvas_bounding_box.y,
      });

      // Close the path
      selection_canvas_context.closePath();
      selection_canvas_context.stroke();

      // Calculate bounding box for selection
      const xs = selection.path.map(p => p.x);
      const ys = selection.path.map(p => p.y);
      selection.x = Math.min(...xs);
      selection.y = Math.min(...ys);
      selection.width = Math.max(...xs) - selection.x;
      selection.height = Math.max(...ys) - selection.y;

      console.log(selection);
      const itemsCount = countItemsInSelection(items, selection);
      console.log(itemsCount);
      squareCount.innerHTML = itemsCount[0];
      circleCount.innerHTML = itemsCount[1];
      rectangleCount.innerHTML = itemsCount[2];

      isMapClickable = false; // Disable map click events after selection
    });
  }

  function countItemsInSelection(items, selection) {
    const { path } = selection;
    let count = [0, 0, 0];

    function getGridCellsInPath() {
      const cells = new Set();
      path.forEach(point => {
        const gridX = Math.floor(point.x / 100);
        const gridY = Math.floor(point.y / 100);
        cells.add(`${gridX},${gridY}`);
      });
      return cells;
    }

    function isPointInPath(x, y) {
      selection_canvas_context.beginPath();
      selection_canvas_context.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        selection_canvas_context.lineTo(path[i].x, path[i].y);
      }
      selection_canvas_context.closePath();
      return selection_canvas_context.isPointInPath(x, y) || selection_canvas_context.isPointInStroke(x, y);
    }

    const cellsInPath = getGridCellsInPath();

    items.forEach((item) => {
      const gridX = Math.floor(item.x / 100);
      const gridY = Math.floor(item.y / 100);
      const itemCenterX = item.x + 50;
      const itemCenterY = item.y + 50;

      if (cellsInPath.has(`${gridX},${gridY}`) || isPointInPath(itemCenterX, itemCenterY)) {
        const itemIndex = item.randomElementIndex;
        if (itemIndex === 0) {
          count[0]++;
        } else if (itemIndex === 1) {
          count[1]++;
        } else {
          count[2]++;
        }
      }
    });

    return count;
  }

  resetButton.addEventListener("click", () => {
    location.reload();
    playButton.disabled = false; // Enable the play button
    playButton.style.backgroundColor = "#4caf50"; // Reset play button color
    resetButton.style.backgroundColor = "#888e89"; // Reset reset button color
  });
});
