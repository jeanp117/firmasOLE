function inyectar() {
  const inputsCanvas = document.querySelectorAll("#signature");
  const inputs = document.querySelectorAll("input[type=file]");

  inputsCanvas.forEach(crearBotonFirmar);
  inputsCanvas.forEach(crearBotonHuella);

  //insert custom style
  const style = document.createElement("style");
  style.innerHTML = `
  #modalButtons{
    display: flex;
    justify-content: space-between;
  }
  #modalHuella{
    background: rgba(255, 0, 0, 0.5);
  }
  #huellaImagen{
    width: 100%;
    
  }
  `;
  document.head.appendChild(style);
}
inyectar();

//implementación de la firma y huella en Docus exclusivamente
function insertarBase64EnCanvas(base64, width, height) {
  let docusCanvas = document.getElementsByClassName("jSignature")[0];

  //se redefine el tamaño del canvas de Docus a gusto
  docusCanvas.width = width || 320;
  docusCanvas.height = height || 240;

  let img = new Image();
  img.src = base64;
  img.onload = function () {
    //dibujar en el canvas ajustando el tamaño de la imagen al canvas
    let ctx = docusCanvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    document.getElementById("base64Load").value =
      docusCanvas.toDataURL("image/png");
    document.getElementById("signature_capture").value =
      docusCanvas.toDataURL("image/png");
  };
}

function crearBotonFirmar(input) {
  const button = document.createElement("button");

  button.innerHTML = "Firmar ✒️";
  button.style.marginRight = "10px";
  button.style.borderRadius = "5px";
  button.style.backgroundColor = "blue";
  button.style.color = "white";
  button.onclick = (e) => {
    e.preventDefault();
    //Invoca al SDK de wacom, al obtener una firma, se hace tratamiento de la imagen y se devuelve la nueva imagen en base64
    captureSignature({
      useSTU: false,
      onCanvasAdquired: (base64) => insertarBase64EnCanvas(base64, 320, 240),
    });
  };

  input.before(button, input.nextSibling);

  return button;
}

function crearBotonHuella(input) {
  const button = document.createElement("button");

  button.innerHTML = "Huella 👆";
  button.style.marginRight = "10px";
  button.style.borderRadius = "5px";
  button.style.backgroundColor = "green";
  button.style.color = "white";
  button.onclick = (e) => {
    e.preventDefault();

    abrirModal();
    let huellaSDK = new Fingerprint.WebApi();
    let valor = "";
    let calidad = "";
    let huella = "";
    huellaSDK.startAcquisition(Fingerprint.SampleFormat.PngImage, valor);
    huellaSDK.onDeviceConnected = function (e) {
      // Detects if the device is connected for which acquisition started
      console.log("Lector de huella conectado");
    };
    huellaSDK.onDeviceDisconnected = function (e) {
      // Detects if device gets disconnected - provides deviceUid of disconnected device
      alert("Lector de huellas desconectado");
    };
    huellaSDK.onCommunicationFailed = function (e) {
      alert("No se pudo comunicar con el lector de huellas");
    };

    huellaSDK.onQualityReported = function (e) {
      console.log("CALIDAD", Fingerprint.QualityCode[e.quality]);
      calidad = Fingerprint.QualityCode[e.quality];
    };

    huellaSDK.onSamplesAcquired = function (s) {
      var sample = JSON.parse(s.samples);
      console.log("Intentos", sample);
      if (calidad == "Good") {
        huella = `data:image/png;base64,${Fingerprint.b64UrlTo64(
          sample[sample.length - 1]
        )}`;
        console.log("Huella", huella);
        document.getElementById("huellaImagen").src = huella;
        document.getElementById("modalButtonContinuar").disabled = false;
        document.getElementById("modalButtonContinuar").onclick = (e) => {
          e.preventDefault();
          cerrarModal();
          insertarBase64EnCanvas(huella, 400, 500);
        };
        huellaSDK.stopAcquisition();
      } else {
        console.log("Escanear otra vez");
      }
    };
  };

  input.before(button, input.nextSibling);

  return button;
}
function aceptarImagen() {
  document.getElementById("modalButtonContinuar").disabled = false;
}

function cerrarModal() {
  document.getElementById("modalHuella")?.remove();
}

function reintentar() {
  cerrarModal();
  abrirModal();
}

function abrirModal() {
  console.log("abrir modal");
  const modal = document.createElement("div");
  modal.id = "modalHuella";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "1000";
  modal.onclick = (e) => {
    if (e.target === modal) {
      cerrarModal();
    }
  };

  modal.innerHTML = `
  <div style="width: 33vh; background: white; padding:1em; border-radius:1em;" >
  <h2>Coloque su dedo en el lector</h2>

<img  id="huellaImagen"  src="data:image/gif;base64,${huellaGIF}">
<div id="modalButtons">
  <button  onclick="cerrarModal()">Cancelar</button>

  <button id="modalButtonContinuar" disabled onclick="aceptarImagen()" >Continuar</button>
</div>
</div>
  `;
  document.body.appendChild(modal);
}
