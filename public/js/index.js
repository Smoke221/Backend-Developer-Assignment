const form = document.getElementById("url-form");
const websiteUrlInput = document.getElementById("website-url");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const websiteUrl = websiteUrlInput.value;

  fetch("http://localhost:8000/info/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
    body: JSON.stringify({ url: websiteUrl }),
  })
    .then((response) => response.json())
    .then((data) => {
      if(data.message === "Domain already exists"){
        showPopup("Data is already present, check the table");
      }else{
        location.reload();
      }
    })
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
        e.mediaLinks.slice(0, 4).forEach((link) => {
          const a = document.createElement("a");
          a.href = link;
          a.textContent = link;
          td5.appendChild(a);
        });
        const td6 = document.createElement("td");
        td6.className = "action-buttons";
        // Create the "Remove" button
        const removeButton = document.createElement("button");
        removeButton.textContent = "Delete";
        removeButton.className = "delete-button";
        removeButton.addEventListener("click", () => {
          deleteListing(e._id)
        });

        // Create the "Add to Fav" button
        const addToFavButton = document.createElement("button");
        const addToFavButtonText = e.favorite ? 'Remove fav' : 'Add fav';
        addToFavButton.className = e.favorite ? "remove-fav-button" : "add-fav-button";
        addToFavButton.textContent = addToFavButtonText
        addToFavButton.addEventListener("click", () => {
          const newFavoriteStatus = !e.favorite;
          updateFavoriteStatus(e._id, newFavoriteStatus);
          location.reload();
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
  .then((data) => location.reload())
  .catch((error) => {
      console.error("Error updating favorite status:", error);
  });
}

// Create function to delete a lisiting.
function deleteListing(id){
  fetch(`http://localhost:8000/info/delete/${id}`, {
      method: "DELETE",
  })
  .then((response) => response.json())
  .then((data) => location.reload())
  .catch((error) => {
      console.error("Error deleting", error);
  });
}

//function for popup message
function showPopup(message) {
  const popup = document.createElement("div");
  popup.textContent = message;
  popup.className = "popup";

  document.body.appendChild(popup);

  // Set a timeout to remove the popup after 2 seconds
  setTimeout(() => {
      popup.remove();
  }, 2000);
}