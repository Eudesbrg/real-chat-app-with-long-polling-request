(function () {
  let counter = 0;
  const output = document.getElementById("output");
  function makeRequest(method, url, callback) {
    baseUrl = `http://localhost:8080/`;
    url = baseUrl + url;
    const req = new XMLHttpRequest();
    req.open(method, url, true);
    req.send();
    req.onload = function () {
      let data = req.responseText;
      data = JSON.parse(data);
      callback(data);
    };
  }
  function showMessage() {
    const url = "poll" + counter;
    makeRequest("GET", url, function (data) {
      counter = data.count;
      output.textContent += data.append;
      showMessage();
    });
  }
  function sendMessage() {
    const message = document.getElementById("text");
    if (message.value.length != 0) {
      const url = "msg?message=" + encodeURI(message.value);
      makeRequest("POST", url, function (data) {
        console.log(data);
      });
      message.value = "";
    }
  }
  document.getElementById("send").addEventListener("click", sendMessage);
  showMessage();
})();
