let scripts = [
  "sdk/firmas/sdk/stu-sdk.min.js",
  "sdk/firmas/sdk/signature_sdk.js",
  "sdk/firmas/sigCaptDialog/stu_capture/aes-ecb.js",
  "sdk/firmas/sigCaptDialog/stu_capture/stu_capture_encryption.js",
  "sdk/firmas/sigCaptDialog/sigCaptDialog.js",
  "sdk/firmas/sigCaptDialog/stuCaptDialog.js",
  "sdk/huella/scripts/es6-shim.js",
  "sdk/huella/scripts/fingerprint.sdk.min.js",
  "sdk/huella/scripts/websdk.client.bundle.min.js",
  "firma.js",
  "huella.js",
  "implementaciones/docus.js",
  "imagenes.js",
];

//load after the page is ready to avoid conflicts

window.onload = function () {
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
};
