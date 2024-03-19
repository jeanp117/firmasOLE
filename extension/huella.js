let myVal = "";
var FingerprintSdkTest = (function () {
  function FingerprintSdkTest() {
    var _instance = this;
    this.operationToRestart = null;
    this.acquisitionStarted = false;
    this.sdk = new Fingerprint.WebApi();
    this.sdk.onDeviceConnected = function (e) {
      // Detects if the deveice is connected for which acquisition started
      alert("Scan your finger");
    };
    this.sdk.onDeviceDisconnected = function (e) {
      // Detects if device gets disconnected - provides deviceUid of disconnected device
      alert("Device disconnected");
    };
    this.sdk.onCommunicationFailed = function (e) {
      // Detects if there is a failure in communicating with U.R.U web SDK
      alert("Communinication Failed");
    };
    this.sdk.onSamplesAcquired = function (s) {
      // Sample acquired event triggers this function
      sampleAcquired(s);
    };
    this.sdk.onQualityReported = function (e) {
      // Quality of sample aquired - Function triggered on every sample acquired
      document.getElementById("qualityInputBox").value =
        Fingerprint.QualityCode[e.quality];
    };
  }

  FingerprintSdkTest.prototype.startCapture = function () {
    if (this.acquisitionStarted)
      // Monitoring if already started capturing
      return;
    var _instance = this;
    this.operationToRestart = this.startCapture;
    this.sdk.startAcquisition(currentFormat, myVal).then(
      function () {
        _instance.acquisitionStarted = true;

        //Disabling start once started
        disableEnableStartStop();
      },
      function (error) {
        alert(error.message);
      }
    );
  };
  FingerprintSdkTest.prototype.stopCapture = function () {
    if (!this.acquisitionStarted)
      //Monitor if already stopped capturing
      return;
    var _instance = this;
    alert("");
    this.sdk.stopAcquisition().then(
      function () {
        _instance.acquisitionStarted = false;

        //Disabling stop once stoped
        disableEnableStartStop();
      },
      function (error) {
        alert(error.message);
      }
    );
  };

  FingerprintSdkTest.prototype.getInfo = function () {
    var _instance = this;
    return this.sdk.enumerateDevices();
  };

  FingerprintSdkTest.prototype.getDeviceInfoWithID = function (uid) {
    var _instance = this;
    return this.sdk.getDeviceInfo(uid);
  };

  return FingerprintSdkTest;
})();

var huellaSDK = null;
currentFormat = Fingerprint.SampleFormat.PngImage;

window.onload = function () {
  huellaSDK = new FingerprintSdkTest();
  readersDropDownPopulate(true); //To populate readers for drop down selection
  disableEnable(); // Disabling enabling buttons - if reader not selected
  enableDisableScanQualityDiv("content-reader"); // To enable disable scan quality div
  disableEnableExport(true);
};

function onStart() {
  if (currentFormat == "") {
    alert("Please select a format.");
  } else {
    huellaSDK.startCapture();
  }
}

function onStop() {
  huellaSDK.stopCapture();
}

function sampleAcquired(s) {
  var samples = JSON.parse(s.samples);
  console.log(Fingerprint.b64UrlTo64(samples[0]));
}
