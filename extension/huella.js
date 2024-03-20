function checkDeviceAvailabilityAndStartCapture() {
  return new Promise((resolve, reject) => {
    console.log("Iniciando captura de huella");
    const huellaSDK = new Fingerprint.WebApi();
    let calidad = "";
    let valor = "";
    // Verificar la disponibilidad del dispositivo
    huellaSDK.onDeviceConnected = function (e) {
      console.log("Lector de huella conectado");
      // Iniciar la captura una vez que el dispositivo esté disponible
      huellaSDK.startAcquisition(Fingerprint.SampleFormat.PngImage, valor);
    };

    huellaSDK.onDeviceDisconnected = function (e) {
      huellaSDK.stopAcquisition();
      reject("Device disconnected");
    };

    huellaSDK.onCommunicationFailed = function (e) {
      // Detects if there is a failure in communicating with U.R.U web SDK
      huellaSDK.stopAcquisition();
      reject("Communication Failed");
    };

    huellaSDK.onSamplesAcquired = function (s) {
      var sample = JSON.parse(s.samples);
      console.log("Intentos", sample);
      if (calidad == "Good") {
        const huella = Fingerprint.b64UrlTo64(sample[sample.length - 1]);

        resolve(huella);
        huellaSDK.stopAcquisition();
      } else {
        console.log("Huella no válida, intente de nuevo");
      }
    };

    huellaSDK.onQualityReported = function (e) {
      // Quality of sample acquired - Function triggered on every sample acquired
      console.log("CALIDAD", Fingerprint.QualityCode[e.quality]);
      calidad = Fingerprint.QualityCode[e.quality];
    };
  });
}
