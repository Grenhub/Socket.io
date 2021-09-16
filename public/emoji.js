// API key for emojis
let EMOJIKEY = "9cc2042ea7737888e2ea5ecc68dd55ca33098ff2";

const sendEmojiBtn = document.getElementById("sendBtn");
sendEmojiBtn.addEventListener("click", findEmoji);
// Calling emoji API
function findEmoji() {
  let url = `https://emoji-api.com/emojis/grinning-squinting-face?access_key=${EMOJIKEY}`;
  let emojiSelector = document.querySelector("#message");
  // Checking if input is equal to /xD
  if (emojiSelector.value === "/xD") {
    fetch(url)
      .then((response) => response.json())
      .then((content) => {
        let chr = document.createElement("li");
        let out = document.querySelector("#message-box");
        chr.innerText = content[0].character;
        out.appendChild(chr);
        emojiSelector.value = "";
        out.scrollTop = out.scrollHeight;
        // Send Emoji to server
        socket.emit("emoji", content[0].character);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

// Listen for Emoji
socket.on("emoji", (emoji) => {
  let chr = document.createElement("li");
  let out = document.querySelector("#message-box");
  chr.innerText = emoji;
  out.appendChild(chr);
});
