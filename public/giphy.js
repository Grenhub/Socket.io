//API key for giphy
let APIKEY = "tr2OkLA6uZVI7cP4xHKh6u3empxNQ5rz";
const sendGif = document.getElementById("sendBtn");
sendGif.addEventListener("click", checkForGif);
// Calling giphy API
function checkForGif() {
  let url = `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&limit=1&q=`;
  let gifSelector = document.getElementById("message");
  //Checking if first character is /
  if (gifSelector.value.substr(0, 1) === "/") {
    if(gifSelector.value === '/xD') {
      return;
    }
    let searchGif = gifSelector.value;
    url = url.concat(searchGif);
    fetch(url)
      .then((response) => response.json())
      .then((content) => {
        //Creating HTML elements which retrieves downsized gifs
        let fig = document.createElement("figure");
        let img = document.createElement("img");
        img.src = content.data[0].images.downsized.url;
        img.alt = content.data[0].title;
        img.classList.add('gif');
        fig.appendChild(img);
        let messageBox = document.getElementById("message-box");
        messageBox.appendChild(fig);
        
        messageBox.scrollTop = messageBox.scrollHeight;

        //Empty input
        gifSelector.value = "";
        showDatalist();

        //Send GIF to server
        socket.emit("gif", content.data[0].images.downsized.url);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

//Ignores first action onto our input/datalist and calls for datalist whenever first character is "/"
function showDatalist() {
  let inputField = document.getElementById("message");
  let datalist = document.querySelector("datalist");
  if (inputField.value.substr(0, 1) === "/") {
    datalist.id = "listGif";
  } else {
    datalist.id = "";
  }
}

//Listen for GIF
socket.on("gif", (gif) => {
  let fig = document.createElement("figure");
  let img = document.createElement("img");
  img.classList.add('gif');
  img.src = gif;
  fig.appendChild(img);
  let messageBox = document.getElementById("message-box");
  messageBox.appendChild(fig);
});
