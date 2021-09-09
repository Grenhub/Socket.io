let EMOJIKEY = "9cc2042ea7737888e2ea5ecc68dd55ca33098ff2";

const sendEmojiBtn = document.getElementById("sendBtn");
sendEmojiBtn.addEventListener("click", findEmoji);
function findEmoji() {
  let url = `https://emoji-api.com/emojis/grinning-squinting-face?access_key=${EMOJIKEY}`;
  let emojiSelector = document.querySelector("#message");
  if (emojiSelector.value === "/xD") {
    fetch(url)
      .then((response) => response.json())
      .then((content) => {
        let chr = document.createElement("li");
        let out = document.querySelector("#message-box");
        chr.innerText = content[0].character;
        out.appendChild(chr);
        emojiSelector.value = "";
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
