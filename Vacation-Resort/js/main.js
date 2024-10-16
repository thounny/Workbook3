// Add event listener for form submission
document
  .getElementById("estimateForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const name = document.getElementById("name").value;
    const checkinDate = new Date(document.getElementById("checkin").value);
    const nights = parseInt(document.getElementById("nights").value);
    const roomType = document.querySelector(
      'input[name="room"]:checked'
    )?.value;
    const adults = parseInt(document.getElementById("adults").value);
    const children = parseInt(document.getElementById("children").value) || 0; // Default to 0 if empty
    const discount = document.querySelector(
      'input[name="discount"]:checked'
    )?.value;

    // Validation - Ensure all fields are filled
    if (
      !name ||
      !checkinDate ||
      !nights ||
      !roomType ||
      !adults ||
      discount === undefined
    ) {
      alert("Please fill out all fields before estimating the cost.");
      return;
    }

    // Validate room capacity
    const maxOccupancy = getMaxOccupancy(roomType);
    if (adults + children > maxOccupancy) {
      alert("The room you selected will not hold your party.");
      return;
    }

    // Calculate room rate
    const roomRate = getRoomRate(checkinDate, roomType);
    let discountAmount = 0;
    let discountedRate = roomRate; // Default to no discount

    // Apply discounts
    if (discount === "aaa") {
      discountAmount = roomRate * 0.1;
      discountedRate = roomRate - discountAmount;
    } else if (discount === "military") {
      discountAmount = roomRate * 0.2;
      discountedRate = roomRate - discountAmount;
    }

    // Calculate final cost
    const tax = discountedRate * 0.12;
    const totalCost = (discountedRate + tax) * nights;

    // Generate confirmation code
    const confirmation = generateConfirmation(
      name,
      checkinDate,
      nights,
      adults,
      children
    );

    // Inject cost details into the modal
    const modalBodyContent = document.getElementById("modalBodyContent");
    modalBodyContent.innerHTML = `
      <strong>Original Room Cost:</strong> $${roomRate.toFixed(2)} <br>
      ${
        discountAmount > 0
          ? `<strong>Discounted Room Cost:</strong> $${discountedRate.toFixed(
              2
            )} <br>`
          : ""
      }
      <strong>Tax:</strong> $${(tax * nights).toFixed(2)} <br>
      <strong>Total Cost for ${nights} Nights:</strong> $${totalCost.toFixed(
      2
    )} <br>
      <strong>Confirmation:</strong> <span id="confirmationText">${confirmation}</span> 
      <button id="copyButton" class="btn btn-secondary btn-sm ml-2">Copy</button>
    `;

    // Add event listener for copy button
    document
      .getElementById("copyButton")
      .addEventListener("click", function () {
        // Ensure the only thing copied is the confirmation text
        copyToClipboard(confirmation); // Copy only the confirmation code
      });

    // Show modal
    $("#resultModal").modal("show");
  });

// Generate confirmation function
function generateConfirmation(name, checkinDate, nights, adults, children) {
  const month = (checkinDate.getMonth() + 1).toString().padStart(2, "0"); // Get month as two digits
  const year = checkinDate.getFullYear().toString().slice(-2); // Get last 2 digits of year
  children = children || 0; // Default to 0 if undefined or empty
  return `${name
    .slice(0, 3)
    .toUpperCase()}-${month}${year}-${nights}:${adults}:${children}`;
}

// Function to copy the confirmation code to clipboard
function copyToClipboard(text) {
  const tempInput = document.createElement("input");
  tempInput.style.position = "absolute";
  tempInput.style.left = "-9999px"; // Move it off-screen to prevent display issues
  document.body.appendChild(tempInput);
  tempInput.value = text; // Set the input field's value to the confirmation code
  tempInput.select(); // Select the input field
  document.execCommand("copy"); // Copy the selected text
  document.body.removeChild(tempInput); // Remove the temporary input field
  alert("Confirmation copied to clipboard!"); // Alert the user
}
