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
    onStart();
    // checkDeviceAvailabilityAndStartCapture()
    //   .then((huella) => {
    //     // Huella capturada exitosamente
    //     console.log("Base64 de la huella:", huella);
    //     document.getElementById("huellaImagen").src = huella;
    //     document.getElementById("modalButtonContinuar").disabled = false;
    //     insertarBase64EnCanvas(huella, 320, 240);
    //   })
    //   .catch((error) => {
    //     alert("Error al capturar la huella " + error);
    //   });
  };

  input.before(button, input.nextSibling);

  return button;
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

  <button id="modalButtonContinuar" disabled >Continuar</button>
</div>
</div>
  `;
  document.body.appendChild(modal);
}
