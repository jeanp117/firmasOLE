let scripts = [
  "/sdk/signature_sdk.js",
  "/sdk/stu-sdk.min.js",
  "sigCaptDialog/sigCaptDialog.js",
  "sigCaptDialog/stuCaptDialog.js",
  "test.js",
  "simple.js",
];

var s = document.createElement("script");

scripts.forEach((script) => {
  var s = document.createElement("script");
  // Para que esto funcione deberías añadir "script.js" a web_accessible_resources en manifest.json
  s.src = chrome.runtime.getURL(script);
  s.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
});
