const form = document.getElementById("url-form");
const websiteUrlInput = document.getElementById("website-url");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const websiteUrl = websiteUrlInput.value;

  fetch("http://localhost:8000/info/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: websiteUrl }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => {
      console.error("Error:", error);
    });
});

let table = document.querySelector("#table");
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8000/info/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((re) => {
      const data = re.data;
      console.log(data);
      data.forEach((e) => {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.textContent = e.domain;
        const td2 = document.createElement("td");
        td2.textContent = e.wordCount;
        const td3 = document.createElement("td");
        td3.textContent = e.favorite;
        const td4 = document.createElement("td");
        td4.textContent = arrayToTdString(e.webLinks, 4);
        const td5 = document.createElement("td");
        td5.textContent = arrayToTdString(e.mediaLinks, 4);
        const td6 = document.createElement("td");
        // Create the "Remove" button
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => {
          // Handle the removal action here
          // You can remove the corresponding row or perform other actions
        });

        // Create the "Add to Fav" button
        const addToFavButton = document.createElement("button");
        addToFavButton.textContent = "Add to Fav";
        addToFavButton.addEventListener("click", () => {
          const newFavoriteStatus = !e.favorite;
          updateFavoriteStatus(e.id, newFavoriteStatus);
      });
        td6.append(removeButton,addToFavButton)

        tr.append(td1, td2, td3, td4, td5, td6);
        table.append(tr);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// function to convert items in an array to string.
function arrayToTdString(arr, limit) {
  return arr.slice(0, limit).join(", ");
}
// Create a function to handle updating the "favorite" status
function updateFavoriteStatus(id, isFavorite) {
  fetch("http://localhost:8000/info/update", {
      method: "PATCH",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, favorite: isFavorite }),
  })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => {
      console.error("Error updating favorite status:", error);
  });
}
