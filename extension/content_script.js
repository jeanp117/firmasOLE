let scripts = [
  "/sdk/stu-sdk.min.js",
  "sigCaptDialog/stu_capture/aes-ecb.js",
  "sigCaptDialog/stu_capture/stu_capture_encryption.js",
  "/sdk/signature_sdk.js",
  "sigCaptDialog/sigCaptDialog.js",
  "sigCaptDialog/stuCaptDialog.js",
  "manejador.js",
  "docus.js",
];

var s = document.createElement("script");

let hostList = ["grupo-esperanza.docus.com.co", "orglaesperanza.com.co"];

let currentHost = window.location.host;
if (hostList.includes(currentHost)) {
  scripts.forEach((script) => {
    var s = document.createElement("script");
    // Para que esto funcione deberías añadir "script.js" a web_accessible_resources en manifest.json
    s.src = chrome.runtime.getURL(script);
    s.onload = function () {
      this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
  });
}
