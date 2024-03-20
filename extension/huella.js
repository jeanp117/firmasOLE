let huellaSDK = new Fingerprint.WebApi();

huellaSDK.onDeviceConnected = function (e) {
  // Detects if the device is connected for which acquisition started
  alert("Scan your finger");
};
huellaSDK.onDeviceDisconnected = function (e) {
  // Detects if device gets disconnected - provides deviceUid of disconnected device
  alert("Device disconnected");
};
huellaSDK.onCommunicationFailed = function (e) {
  // Detects if there is a failure in communicating with U.R.U web SDK
  alert("Communication Failed");
};
huellaSDK.onSamplesAcquired = function (s) {
  sampleAcquired(s);
};
huellaSDK.onQualityReported = function (e) {
  // Quality of sample acquired - Function triggered on every sample acquired
  console.log("CALIDAD", Fingerprint.QualityCode[e.quality]);
};
function sampleAcquired(s) {
  var samples = JSON.parse(s.samples);
  console.log(Fingerprint.b64UrlTo64(samples[0]));
}

function leerHuella() {
  huellaSDK.startAcquisition(Fingerprint.SampleFormat.PngImage, "");
}
function detenerLectura() {
  huellaSDK.stopAcquisition();
}

function leer() {
  return new Promise((resolve, reject) => {
    leerHuella();
    huellaSDK.onSamplesAcquired = function (s) {
      var samples = JSON.parse(s.samples);
      resolve(Fingerprint.b64UrlTo64(samples[0]));
      console.log(Fingerprint.b64UrlTo64(samples[0]));
      detenerLectura();
    };
  });
}
