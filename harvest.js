const map = document.getElementById("map");
const canvas1 = document.getElementById("canvas1");
const canvas2 = document.getElementById("canvas2");
const canvas3 = document.getElementById("canvas3");

const goldcount = document.getElementById("goldcount");
const flowercount = document.getElementById("flowercount");
const grasscount = document.getElementById("grasscount");

const selectionCanvas = document.getElementById("selection");

const playButton = document.getElementById("play-button");

let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

canvas1.width = 100;
canvas1.height = 100;
const ctx1 = canvas1.getContext("2d");
ctx1.beginPath();
ctx1.moveTo(25, 40);
ctx1.lineTo(75, 40);
ctx1.lineTo(90, 70);
ctx1.lineTo(10, 70);
ctx1.lineTo(25, 40);
ctx1.stroke();
ctx1.fillStyle = "gold";
ctx1.fill();

canvas2.width = 100;
canvas2.height = 100;
const ctx2 = canvas2.getContext("2d");
ctx2.fillStyle = "pink";
ctx2.beginPath();
ctx2.moveTo(50, 50);
ctx2.arc(50, 30, 20, 0, Math.PI * 2);
ctx2.moveTo(50, 50);
ctx2.arc(70, 50, 20, 0, Math.PI * 2);
ctx2.moveTo(50, 50);
ctx2.arc(50, 70, 20, 0, Math.PI * 2);
ctx2.moveTo(50, 50);
ctx2.arc(30, 50, 20, 0, Math.PI * 2);
ctx2.fill();
ctx2.fillStyle = "yellow";
ctx2.beginPath();
ctx2.arc(50, 50, 10, 0, Math.PI * 2);
ctx2.fill();

canvas3.width = 100;
canvas3.height = 100;
const ctx3 = canvas3.getContext("2d");
ctx3.beginPath();
ctx3.moveTo(15, 30);
ctx3.bezierCurveTo(10, 20, 15, 85, 60, 85);
ctx3.moveTo(55, 10);
ctx3.bezierCurveTo(20, 50, 50, 85, 60, 85);
ctx3.moveTo(85, 30);
ctx3.bezierCurveTo(80, 20, 20, 85, 60, 85);

ctx3.closePath();
ctx3.fillStyle = "green";
ctx3.fill();

window.addEventListener("load", function () {
  map.innerHTML = ""; // Clear the map when the page loads

  let items = [];
  playButton.addEventListener("click", () => {
    items = generateRandomElements();
    console.log(items);
  });

  function generateRandomElements() {
    const totalGrids = (1000 / 100) * (500 / 100);
    const elements = [canvas1, canvas2, canvas3];

    for (let i = 0; i < totalGrids; i++) {
      const randomElementIndex = Math.floor(Math.random() * elements.length);

      const newCanvas = document.createElement("canvas");
      newCanvas.width = 100;
      newCanvas.height = 100;
      newCanvas.getContext("2d").drawImage(elements[randomElementIndex], 0, 0);
      map.appendChild(newCanvas);
      const rect = newCanvas.getBoundingClientRect();
      const x = rect.left - map.getBoundingClientRect().left;
      const y = rect.top - map.getBoundingClientRect().top;
      const item = { randomElementIndex, x, y };
      items.push(item);
    }
    return items;
  }

  ////////////////////////////////////////////////////////////////////////
  let selection = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  if (selectionCanvas) {
    selectionCanvas.width = 1000;
    selectionCanvas.height = 500;

    const selection_canvas_bounding_box =
      selectionCanvas.getBoundingClientRect();
    let selection_topleft = {};
    let selection_bottomright = {};

    selection_canvas_context = selectionCanvas.getContext("2d");

    selectionCanvas.addEventListener("mousedown", function (event) {
      selection_topleft = {
        x: event.clientX - selection_canvas_bounding_box.x,
        y: event.clientY - selection_canvas_bounding_box.y,
      };
    });

    selectionCanvas.addEventListener("mouseup", function (event) {
      selection_bottomright = {
        x: event.clientX - selection_canvas_bounding_box.x,
        y: event.clientY - selection_canvas_bounding_box.y,
      };

      const height = selection_bottomright.y - selection_topleft.y;
      const width = selection_bottomright.x - selection_topleft.x;

      selection_canvas_context.clearRect(
        0,
        0,
        selectionCanvas.width,
        selectionCanvas.height
      );
      selection_canvas_context.strokeRect(
        selection_topleft.x,
        selection_topleft.y,
        width,
        height
      );

      // Calculate x, y, width, and height
      selection.x = Math.min(selection_topleft.x, selection_bottomright.x);
      selection.y = Math.min(selection_topleft.y, selection_bottomright.y);
      selection.width = Math.abs(selection_bottomright.x - selection_topleft.x);
      selection.height = Math.abs(
        selection_bottomright.y - selection_topleft.y
      );

      console.log(selection);
      const itemsCount = countItemsInSelection(items, selection);
      console.log(itemsCount);
      goldcount.innerHTML = itemsCount[0];
      flowercount.innerHTML = itemsCount[1];
      grasscount.innerHTML = itemsCount[2];
    });
  }

  function countItemsInSelection(items, selection) {
    const { x, y, width, height } = selection;
    let count = [0, 0, 0];

    items.forEach((item) => {
      const itemX = item.x + 100; // Assuming item.x represents the left edge of the item
      const itemY = item.y + 100; // Assuming item.y represents the top edge of the item
      const itemIndex = item.randomElementIndex;

      if (
        (item.x >= x &&
          item.x < x + width &&
          item.y >= y &&
          item.y < y + height) || // Top-left corner inside selection
        (itemX >= x &&
          itemX < x + width &&
          item.y >= y &&
          item.y < y + height) || // Top-right corner inside selection
        (item.x >= x &&
          item.x < x + width &&
          itemY >= y &&
          itemY < y + height) || // Bottom-left corner inside selection
        (itemX >= x && itemX < x + width && itemY >= y && itemY < y + height) // Bottom-right corner inside selection
      ) {
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
});
