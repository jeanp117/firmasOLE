let myVal = "";
var FingerprintSdkTest = (function () {
  function FingerprintSdkTest() {
    var _instance = this;

    this.sdk = new Fingerprint.WebApi();

    this.sdk.onDeviceConnected = function (e) {
      // Detects if the device is connected for which acquisition started
      alert("Scan your finger");
    };
    this.sdk.onDeviceDisconnected = function (e) {
      // Detects if device gets disconnected - provides deviceUid of disconnected device
      alert("Device disconnected");
    };
    this.sdk.onCommunicationFailed = function (e) {
      // Detects if there is a failure in communicating with U.R.U web SDK
      alert("Communication Failed");
    };
    this.sdk.onSamplesAcquired = function (s) {
      sampleAcquired(s);
    };
    this.sdk.onQualityReported = function (e) {
      // Quality of sample acquired - Function triggered on every sample acquired
      console.log("CALIDAD", Fingerprint.QualityCode[e.quality]);
    };
  }

  FingerprintSdkTest.prototype.startCapture = function () {
    if (this.acquisitionStarted)
      // Monitoring if already started capturing
      return;
    this.operationToRestart = this.startCapture;
    this.sdk.startAcquisition(Fingerprint.SampleFormat.PngImage, myVal).then(
      function () {
        //Disabling start once started
        disableEnableStartStop();
      },
      function (error) {
        showMessage(error.message);
      }
    );
  };
  FingerprintSdkTest.prototype.stopCapture = function () {
    if (!this.acquisitionStarted)
      //Monitor if already stopped capturing
      return;
    var _instance = this;
    showMessage("");
    this.sdk.stopAcquisition().then(
      function () {
        _instance.acquisitionStarted = false;

        //Disabling stop once stoped
        disableEnableStartStop();
      },
      function (error) {
        showMessage(error.message);
      }
    );
  };

  FingerprintSdkTest.prototype.getInfo = function () {
    let lista = this.sdk.enumerateDevices();
    console.log(lista);
    return lista;
  };

  FingerprintSdkTest.prototype.getDeviceInfoWithID = function (uid) {
    return this.sdk.getDeviceInfo(uid);
  };

  return FingerprintSdkTest;
})();

var huellaSDK = null;
var currentFormat = Fingerprint.SampleFormat.PngImage;

window.onload = function () {
  huellaSDK = new FingerprintSdkTest();
  disableEnableExport(true);
};

function onStart() {
  return huellaSDK.startCapture();
}

function onStop() {
  return huellaSDK.stopCapture();
}

function sampleAcquired(s) {
  var samples = JSON.parse(s.samples);
  console.log(Fingerprint.b64UrlTo64(samples[0]));
}
