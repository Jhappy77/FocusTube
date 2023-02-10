const saveButton = document.getElementById("save-button");
const videoPasscode = document.getElementById("video-passcode");

saveButton.addEventListener("click", () => {
  browser.storage.sync.set({ videoPasscode: videoPasscode.value }, () => {
    alert("Options saved.");
  });
});
