function inyectar() {
  const inputsCanvas = document.querySelectorAll("#signature");
  const inputs = document.querySelectorAll("input[type=file]");

  inputsCanvas.forEach(crearBotonFirmar);
  inputsCanvas.forEach(crearBotonHuella);
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
    captureSignature({
      useSTU: true,
      onCanvasAdquired: ({ canvas, base64 }) => {
        let docusCanvas = document.getElementsByClassName("jSignature")[0];
        let base64Element = document.getElementById("base64Load");
        base64Element.value = base64;
        docusCanvas.getContext("2d").drawImage(canvas, 0, 0);
      },
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

    //show a simple modal with h1 and a button
    const modal = document.createElement("div");
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
    modal.innerHTML = `
      <div style="width: 33vh; background: white;">
        <h1>Coloque su dedo en el lector</h1>
      <button id="closeModal">Cerrar</button>
      </div>
    `;
    document.body.appendChild(modal);

    onStart();
  };

  input.before(button, input.nextSibling);

  return button;
}
