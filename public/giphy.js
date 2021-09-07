/* const socket = io(); */

let APIKEY = "tr2OkLA6uZVI7cP4xHKh6u3empxNQ5rz";
const sendGif = document.getElementById("sendGif");
sendGif.addEventListener("click", checkForGif);
function checkForGif() {
  let url = `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&limit=1&q=`;
  let gifSelector = document.getElementById("message");

  console.log(gifSelector.value.substr(0, 1));
  console.log("bueno spanking");

  if (gifSelector.value.substr(0, 1) === "/") {
    let str = gifSelector.value;
    url = url.concat(str);
    fetch(url)
      .then((response) => response.json())
      .then((content) => {
        console.log(content.data);
        console.log("META", content.meta);
        let fig = document.createElement("figure");
        let img = document.createElement("img");
        img.src = content.data[0].images.downsized.url;
        img.alt = content.data[0].title;
        fig.appendChild(img);
        let out = document.querySelector("#message-box");
        out.appendChild(fig);

        //Empty input
        gifSelector.value = "";

        //Send GIF to server
        socket.emit("gif", content.data[0].images.downsized.url);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

//Listen for GIF
socket.on("gif", (gif) => {
  let fig = document.createElement("figure");
  let img = document.createElement("img");
  img.src = gif;
  fig.appendChild(img);
  let out = document.querySelector("#message-box");
  out.appendChild(fig);
});
