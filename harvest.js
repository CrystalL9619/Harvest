const map = document.getElementById("map");
const canvas1 = document.getElementById("canvas1");
const canvas2 = document.getElementById("canvas2");
const canvas3 = document.getElementById("canvas3");

const goldcount = document.getElementById("goldcount");
const flowercount = document.getElementById("flowercount");
const grasscount = document.getElementById("grasscount");

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

  /*function startGame() {
    grid.innerHTML = "";
    generateRandomElements();
    //countElementsInSelection();
  }*/

  ////////////////////////////////////////
  /*
  if (selectionCanvas) {
    //Before we do anything, set the size of the canvas.
    selectionCanvas.width = 1000;
    selectionCanvas.height = 500;

    //If the selection canvas exists, try to setup event handlers
    //to render the selection.

    const selection_canvas_bounding_box =
      selectionCanvas.getBoundingClientRect();

    let selection_topleft = {};
    let selection_bottomright = {};

    selectionCanvas.onmousedown = function (event) {
      console.log(
        `mousedown event mouse coordinates : ${event.clientX}, ${event.clientY}`
      );
      console.log(selection_canvas_bounding_box);

      //Save the coordinates where the mouse cursor was first pressed.
      selection_topleft = {
        x: event.clientX - selection_canvas_bounding_box.x,
        y: event.clientY - selection_canvas_bounding_box.y,
      };

      console.log(selection_topleft);
    };

    selectionCanvas.onmouseup = function (event) {
      console.log(
        `mouseup event mouse coordinates : ${event.clientX}, ${event.clientY}`
      );
      console.log(selection_canvas_bounding_box);

      //Save the coordinates where the mouse cursor was released.
      selection_bottomright = {
        x: event.clientX - selection_canvas_bounding_box.x,
        y: event.clientY - selection_canvas_bounding_box.y,
      };

      console.log(selection_bottomright);

      //Now that we have both the top left and bottom right coordinates,
      //we can use this information to draw the selection box.

      //Since .rect() requires thestarting xy and the width & height of the box.
      //First we will calculate the width and the height.
      const height = selection_bottomright.y - selection_topleft.y;
      const width = selection_bottomright.x - selection_topleft.x;
      console.log(`calculated height : ${height}, calculated width: ${width}`);

      //Now that we have the width and the height, we can draw using .rect()
      //First get the selction canvas"s context.
      const selection_canvas_context = selectionCanvas.getContext("2d");

      //Since we only want a single box, we clear the rectangle before
      //drawing anything to the canvas.

      selection_canvas_context.clearRect(
        0,
        0,
        selectionCanvas.width,
        selectionCanvas.height
      );

      //Then draw using .rect()
      selection_canvas_context.strokeRect(
        selection_topleft.x,
        selection_topleft.y,
        width,
        height
      );
    };
  }

  */
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
  resetButton.addEventListener("click", () => {
    location.reload();
  });
});
