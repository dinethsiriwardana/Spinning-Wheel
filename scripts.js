// scripts.js

var data = [
  {
    label: "Item3",
    value: 1,
    text: "",
    img: "images/Comfort.png",
    stock: 50,
  },
  {
    label: "Item2",
    value: 2,
    text: "",
    img: "images/signal.png",
    stock: 300,
  },
  { label: "Item1", value: 3, text: "", img: "images/lb.png", stock: 50 },

  {
    label: "Item4",
    value: 4,
    text: "",
    img: "images/sunlight.png",
    stock: 300,
  },
  {
    label: "Item5",
    value: 5,
    text: "",
    img: "images/Comfort.png",
    stock: 50,
  },
  { label: "Item6", value: 6, text: "", img: "images/sunlight.png", stock: 60 },
  { label: "Item1", value: 3, text: "", img: "images/lb.png", stock: 50 },
  { label: "Item1", value: 3, text: "", img: "images/signal.png", stock: 50 },
];

// Function to save data to local storage
function saveAllDataToLocalStorage() {
  // Serialize the data array into a JSON string
  const dataToStore = JSON.stringify(data);

  // Save the JSON string to local storage under the key 'data'
  localStorage.setItem("data", dataToStore);

  console.log("Data has been saved to local storage.");
}

// Function to load data from local storage
function loadDataFromLocalStorage() {
  // Retrieve the JSON string from local storage using the key 'data'
  const dataFromStorage = localStorage.getItem("data");

  // Check if there is any data stored
  if (dataFromStorage) {
    // Parse the JSON string into an array and assign it to the 'data' variable
    data = JSON.parse(dataFromStorage);
    console.log("Data has been loaded from local storage.");
  } else {
    console.log("No data found in local storage.");
  }
}

// Function to update the stock of the item won
function updateStock(pickedIndex) {
  if (data[pickedIndex].stock > 0) {
    data[pickedIndex].stock -= 1; // Decrease stock by 1
    saveAllDataToLocalStorage(); // Save updated data to local storage
  } else {
    console.log("Item out of stock.");
  }
}

// Call the function to load data from local storage
loadDataFromLocalStorage();

// Call the function to save data to local storage
saveAllDataToLocalStorage();

var colors = [
  "#027937",
  "#FFFFFF",
  "#027937",
  "#FFFFFF",
  "#027937",
  "#FFFFFF",
  "#027937",
  "#FFFFFF",
];

var padding = { top: 20, right: 20, bottom: 2, left: 20 },
  w = 500 - padding.left - padding.right,
  h = 500 - padding.top - padding.bottom,
  r = Math.min(w, h) / 2,
  rotation = 0,
  oldrotation = 0,
  picked = 100000;

var svg = d3
  .select("#chart")
  .append("svg")
  .data([data])
  .attr("width", w + padding.left + padding.right)
  .attr("height", h + padding.top + padding.bottom);

var container = svg
  .append("g")
  .attr("class", "chartholder")
  .attr(
    "transform",
    "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")"
  );

var vis = container.append("g");

var pie = d3.layout
  .pie()
  .sort(null)
  .value(function (d) {
    return 1;
  });
var arc = d3.svg.arc().outerRadius(r);
var arcs = vis
  .selectAll("g.slice")
  .data(pie)
  .enter()
  .append("g")
  .attr("class", "slice");

// Update the arcs to handle both images and text
arcs
  .append("path")
  .attr("fill", function (d, i) {
    return colors[i];
  })
  .attr("d", function (d) {
    return arc(d);
  })
  .style("stroke", "#FFFFFF") // Border added
  .style("stroke-width", "5"); // Border width

// Add images
arcs
  .append("image")
  .attr("xlink:href", function (d, i) {
    return data[i].img ? data[i].img : "";
  })
  .attr("x", function (d, i) {
    var angle = (d.startAngle + d.endAngle) / 2;
    return Math.cos(angle - Math.PI / 2) * (r - 60) - 40; // Adjusted position
  })
  .attr("y", function (d, i) {
    var angle = (d.startAngle + d.endAngle) / 2;
    return Math.sin(angle - Math.PI / 2) * (r - 60) - 30; // Adjusted position
  })
  .attr("width", 80) // Image size
  .attr("height", 80) // Image size
  .attr("class", "wheel-image")
  .attr("transform", function (d) {
    var angle = (d.startAngle + d.endAngle) / 2;
    var x = Math.cos(angle - Math.PI / 2) * (r - 60);
    var y = Math.sin(angle - Math.PI / 2) * (r - 60);
    // Initial 90 degree rotation on load
    return "rotate(90," + x + "," + y + ")";
  })
  .style("visibility", function (d, i) {
    return data[i].img ? "visible" : "hidden";
  });

function updateImageRotation() {
  arcs.selectAll("image").attr("transform", function (d) {
    var angle = (d.startAngle + d.endAngle) / 2;
    var x = Math.cos(angle - Math.PI / 2) * (r - 60);
    var y = Math.sin(angle - Math.PI / 2) * (r - 60);
    // Counter-rotate the image to keep it upright
    return "rotate(" + -((rotation % 360) - 90) + "," + x + "," + y + ")";
  });
}
// Add text
arcs
  .append("text")
  .attr("transform", function (d) {
    d.innerRadius = 0;
    d.outerRadius = r;
    d.angle = (d.startAngle + d.endAngle) / 2;
    return (
      "rotate(" +
      ((d.angle * 180) / Math.PI - 90) +
      ")" +
      "translate(" +
      (d.outerRadius - 40) +
      ")"
    );
  })
  .attr("text-anchor", "end")
  .text(function (d, i) {
    // Show "Try Again" text if no image, otherwise show the item's text
    return data[i].img ? "" : data[i].text || "Try Again";
  })
  .style("fill", "white")
  .style("font-size", "16px")
  .style("font-weight", "bold")
  .attr("dy", ".35em"); // Vertical alignment

// Function to close modal on clicking anywhere in the browser window
window.addEventListener("click", function (event) {
  var modal = document.getElementById("modal");

  if (modal.style.display === "block") {
    // Close the modal
    modal.style.display = "none";

    // Check and update stock
    // checkAndUpdateStock();
  } else {
    // If the modal is not visible, spin the wheel
    spin();
  }
});

function rotTween(to) {
  var i = d3.interpolate(oldrotation % 360, rotation);
  return function (t) {
    return "rotate(" + i(t) + ")";
  };
}

// Function to check stock and update items if necessary
function checkAndUpdateStock() {
  // Loop through each item to check stock
  data.forEach((item, index) => {
    if (item.stock <= 0) {
      // Update the item with 'Try Again' if out of stock
      data[index] = { ...item, text: "Try Again", img: null };
    }
  });

  // Save updated data to local storage
  localStorage.setItem("data", JSON.stringify(data));
}

var lastPicked = -1; // Initialize with a value that can't be a valid index

function spin(d) {
  container.on("click", null); // Disable clicking during spin

  var ps = 360 / data.length,
    pieslice = Math.round(1440 / data.length),
    rng = Math.floor(Math.random() * 2880 + 720); // Random spin

  rotation = Math.round(rng / ps) * ps;
  picked = Math.round(data.length - (rotation % 360) / ps);
  picked = picked >= data.length ? picked % data.length : picked;

  // Ensure the picked item is not the same as the last one
  while (picked === lastPicked) {
    rng = Math.floor(Math.random() * 2880 + 720);
    rotation = Math.round(rng / ps) * ps;
    picked = Math.round(data.length - (rotation % 360) / ps);
    picked = picked >= data.length ? picked % data.length : picked;
  }

  lastPicked = picked; // Store the current picked item

  rotation += 90 - Math.round(ps / 2); // Rotate to the middle of the slice

  // Custom easing function: starts fast, ends slow
  var customEase = function (t) {
    return 1 - Math.pow(1 - t, 3);
  };

  vis
    .transition()
    .duration(5000) // Adjust duration for faster spin
    .attrTween("transform", rotTween)
    .ease(customEase) // Apply custom easing function
    .each("end", function () {
      // Reset image rotation to keep them upright after spin
      updateImageRotation();

      d3.select(".slice:nth-child(" + (picked + 1) + ") path");
      var giftText = data[picked].text;
      var giftImage = data[picked].img;
      var congratulationsMessage = "Congratulations You Have Won";

      document.getElementById("congratulations").innerText =
        giftText === "Try Again" ? "" : congratulationsMessage;
      document.getElementById("text").innerText =
        giftText === "Try Again" ? "Try Again" : giftText;
      document.getElementById("gift-image").src = giftImage;
      document.getElementById("gift-image").style.display = giftImage
        ? "block"
        : "none";

      document.getElementById("modal").style.display = "block";
      oldrotation = rotation;
      updateStock(picked); // Update the stock of the selected item
      container.on("click", spin); // Re-enable clicking to spin again
    });
}
svg
  .append("g")
  .attr(
    "transform",
    "translate(" +
      (w + padding.left + padding.right) +
      "," +
      (h / 2 + padding.top) +
      ")"
  )
  .append("path")
  .attr("d", "M-" + r * 0.15 + ",0L0," + r * 0.05 + "L0,-" + r * 0.05 + "Z")
  .style({ fill: "white" });

container.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 60).style({
  fill: "#FFFFFF",
  cursor: "pointer",
  stroke: "#027937", // border color
  "stroke-width": "5", // border width
});

container
  .append("text")
  .attr("x", 0)
  .attr("y", 15)
  .attr("text-anchor", "middle")
  .text("")
  .style({ "font-weight": "bold", "font-size": "30px" });

// Add the logo image to the center of the wheel
container
  .append("image")
  .attr("xlink:href", "images/Logo.png") // Replace with the path to your logo
  .attr("x", -37) // Adjust based on the size of your logo
  .attr("y", -37) // Adjust based on the size of your logo
  .attr("width", 80) // Set the width of the logo
  .attr("height", 80) // Set the height of the logo
  .attr("class", "wheel-logo");

function rotTween(to) {
  var i = d3.interpolate(oldrotation % 360, rotation);
  return function (t) {
    return "rotate(" + i(t) + ")";
  };
}

document.getElementById("close").onclick = function () {
  document.getElementById("modal").style.display = "none";
};

// Function to close modal on clicking anywhere in the browser window
window.addEventListener("click", function (event) {
  var modal = document.getElementById("modal");

  // Check if the click was on the modal itself or anywhere else
  if (modal.style.display === "block") {
    modal.style.display = "none";
    // Call the function to check and update stock
    // checkAndUpdateStock();
  }
});

function closePopup() {
  document.getElementById("modal").style.display = "none";
}

// Function to handle form submission and update data
function handleFormSubmit(event) {
  event.preventDefault(); // Prevent the default form submission

  // Loop through items (assuming 8 items)
  for (let i = 1; i <= 8; i++) {
    // Get the label for each item (static)
    const label = `Item${i}`;
    // Get form values for text and image
    const text = document.getElementById(`text${i}`).value;
    const img = document.getElementById(`img${i}`).value || null;

    // Update the corresponding item in the data array
    const itemIndex = data.findIndex((item) => item.label === label);
    if (itemIndex !== -1) {
      data[itemIndex] = { ...data[itemIndex], text, img };
    }
  }

  // Save updated data to local storage
  localStorage.setItem("data", JSON.stringify(data));

  // Alert the updated data
  alert(`Data submitted: \n${JSON.stringify(data, null, 2)}`);

  console.log("Data has been updated and saved to local storage.");
}

// Attach the form submit event handler
document
  .getElementById("updateForm")
  .addEventListener("submit", handleFormSubmit);

// Function to check stock and update items if out of stock
// Function to check stock and update items if out of stock
function checkAndUpdateStock() {
  // Load data from local storage
  const dataFromStorage = localStorage.getItem("data");
  if (dataFromStorage) {
    // Parse the JSON string into an array
    const data = JSON.parse(dataFromStorage);

    // Flag to check if any updates were made
    let updated = false;

    // Loop through items and check stock
    // data.forEach((item) => {
    //   if (item.stock <= 0) {
    //     // Update item if out of stock
    //     item.text = "Try Again";
    //     item.stock = "300";
    //     item.img = null;
    //     updated = true;
    //   }
    // });

    // If there were updates, save the updated data back to local storage
    if (updated) {
      localStorage.setItem("data", JSON.stringify(data));
      console.log("Stock updated and data saved to local storage.");
      // Refresh the page
      window.location.reload();
    } else {
      console.log("No items were out of stock.");
    }
  } else {
    console.log("No data found in local storage.");
  }
}
