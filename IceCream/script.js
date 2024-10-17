function getReceipt(
  numberOfScoops,
  isCup,
  wantsSprinkles,
  wantsWhipped,
  wantsFudge,
  wantsCherry
) {
  // console.log(arguments);

  // base price
  const basePrice = 1.0;
  // cost per scoop
  const costPerScoop = 1.25;

  const taxRate = 0.08;

  let total = basePrice + costPerScoop * numberOfScoops;
  if (isCup) {
    if (wantsSprinkles) {
      total += 0.5;
    }
    if (wantsWhipped) {
      total += 0.25;
    }
    if (wantsFudge) {
      total += 1.25;
    }
    if (wantsCherry) {
      total += 0.25;
    }
  }
  const taxAmount = total * taxRate;
  const totalDue = total + taxAmount;

  return `
  Base Price: $${total.toFixed(2)}
  Tax: $${taxAmount.toFixed(2)}
  Total Due: $${totalDue.toFixed(2)}
  `;
}

function onContainerClicked(e) {
  toppings.style.display = cup.checked ? "block" : "none";
}
document.addEventListener("DOMContentLoaded", () => {
  const scoops = document.getElementById("scoops");
  const cup = document.getElementById("cup");
  const cone = document.getElementById("cone");
  const sprinkles = document.getElementById("sprinkles");
  const whipped = document.getElementById("whipped");
  const fudge = document.getElementById("fudge");
  const cherry = document.getElementById("cherry");

  cup.addEventListener("click", onContainerClicked);
  cone.addEventListener("click", onContainerClicked);

  // button is working
  submitOrder.addEventListener("click", () => {
    outputReceipt.innerText = getReceipt(
      Number(scoops.value),
      cup.checked,
      sprinkles.checked,
      whipped.checked,
      fudge.checked,
      cherry.checked
    );
  });
});
