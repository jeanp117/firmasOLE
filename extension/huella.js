let huellaSDK = new Fingerprint.WebApi();
let valor = "";
let calidad = "";
let huella = "";
huellaSDK.startAcquisition(Fingerprint.SampleFormat.PngImage, valor);
huellaSDK.onDeviceConnected = function (e) {
  // Detects if the device is connected for which acquisition started
  alert("Escanee");
};
huellaSDK.onDeviceDisconnected = function (e) {
  // Detects if device gets disconnected - provides deviceUid of disconnected device
  alert("Device disconnected");
};
huellaSDK.onCommunicationFailed = function (e) {
  // Detects if there is a failure in communicating with U.R.U web SDK
  alert("Communication Failed");
};

huellaSDK.onQualityReported = function (e) {
  // Quality of sample acquired - Function triggered on every sample acquired
  console.log("CALIDAD", Fingerprint.QualityCode[e.quality]);
  calidad = Fingerprint.QualityCode[e.quality];
};
