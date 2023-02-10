let passphrase = "Hello World";
chrome.storage.sync.get("videoPasscode").then((result) => {
  if (result.videoPasscode) {
    passphrase = videoPasscode;
  }
});

function setVideoPasscode(changes, area) {
  alert("Set video passcode!");
  alert(changes);
  if (changes?.videoPasscode) {
    alert("Setting passcode from listener!");
    videoPasscode = changes.videoPasscode.newValue;
  }
}
chrome.storage.onChanged.addListener(setVideoPasscode);

const genreWhitelist = ["Music"];
let videoFound = false;
let hiddenElements = [];

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (changeInfo.status == "complete") {
        console.log("Reset videoFound status");
        videoFound = false;
    }
});

const runCode = () => {
  if (videoFound) return;

  const genreContainer = document.querySelector('meta[itemprop="genre"]');
  if (!genreContainer) {
    console.log("No genre container found");
  }

  const genre = genreContainer.getAttribute("content");
  console.log(`Genre: ${genre}`);
  if (!!genre && genreWhitelist.includes(genre)) {
    console.log("Genre from whitelist");
    videoFound = true;
    return;
  }

  const player = document.getElementById("movie_player");
  if (!player) {
    console.log("No player found!");
    return;
  }

  // Check if the player has the class "ad-showing"
  if (player.classList.contains("ad-showing")) {
    console.log("Ad showing!");
    return;
  }

  // Find all the video elements that are descendants of the player div
  const videos = Array.from(player.getElementsByTagName("video"));
  console.log("Found some videos");
  videos.forEach((video) => {
    console.log("Paused!");
    video.pause();
  });
  if (videos.length === 0) {
    console.log("No videos");
    return;
  }

  videoFound = true;
  // Remove all descendants of the player
  hiddenElements = Array.from(player.children);
  hiddenElements.forEach((el) => {
    player.removeChild(el);
  });

  // Create the container div
  const container = document.createElement("div");
  container.style.color = "black";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";

  // Create the message element
  const message = document.createElement("p");
  message.innerHTML = `Type "${passphrase}"`;
  message.style.fontFamily = "sans-serif";
  message.style.fontSize = "1.5rem";
  message.style.color = "black";

  // Create the input element
  const input = document.createElement("input");
  input.type = "text";

  // Append the message and input elements to the container div
  container.appendChild(message);
  container.appendChild(input);

  // Get the parent node of the player element
  const parent = player.parentNode;
  // Insert the container element before the player element
  parent.insertBefore(container, player);

  // // Append the container div to the player div
  // player.appendChild(container);

  // Add an event listener to the input element that listens for the 'input' event
  input.addEventListener("input", (event) => {
    // If the user enters the correct message, show the videos again and remove the container div
    if (event.target.value === passphrase) {
      hiddenElements.forEach((el) => {
        player.appendChild(el);
      });
      parent.removeChild(container);
    }
  });
};
setInterval(runCode, 5000);
