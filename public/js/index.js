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
