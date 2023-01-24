const saveButton = document.getElementById("save-button");
const videoPasscode = document.getElementById("video-passcode");

saveButton.addEventListener("click", () => {
  chrome.storage.sync.set({ videoPasscode: videoPasscode.value }, () => {
    alert("Options saved.");
  });
});
