// this is the code which will be injected into a given page...

(function () {
  // just place a div at top right
  var div = document.createElement("div");
  div.style.position = "fixed";
  div.style.top = 0;
  div.style.right = 0;
  div.innerHTML = ` 
<html>
<img id="sig_image" style="display: none; margin: auto" />

<canvas id="output-canvas" style="display: none"></canvas>
</html>


`;
  document.body.appendChild(div);

  let inputSeleccionado = null;

  //find all input files and add a custom button before them
  const inputsCanvas = document.querySelectorAll("#signature");
  const inputs = document.querySelectorAll("input[type=file]");

  inputsCanvas.forEach(handle);
  inputs.forEach(handle);
  function handle(elemento) {
    const button = document.createElement("button");
    button.innerHTML = "Firmar";
    button.style.marginRight = "10px";
    button.style.borderRadius = "5px";
    button.style.backgroundColor = "blue";
    button.style.color = "white";

    button.onclick = (e) => {
      e.preventDefault();

      //captureFromCanvas();
      captureFromSTU();
      // inputSeleccionado = input;
    };
    elemento.before(button);

    //is elemento a input file
    if (elemento.type === "file") {
      inputSeleccionado = elemento;
    }
  }

  //get the image base64 data and put it in the canvas
  const img = document.getElementById("sig_image");
  const canvas = document.getElementById("output-canvas");
  const docusCanvas = document.getElementsByClassName("jSignature")[0];

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.filter = "brightness(1.25)";

    ctx.drawImage(img, 0, 0);

    //copy the image from canvas to docusCanvas
    const docusCtx = docusCanvas.getContext("2d");
    docusCtx.drawImage(canvas, 0, 0);

    // //save the image in the canvas
    const dataURL = canvas.toDataURL("image/png");

    $("#signature_capture").val(dataURL);
    $("#base64Load").val(dataURL);
    convertirCanvasAInputFile(canvas, inputSeleccionado);

    inputSeleccionado.style.backgroundColor = "green";
    inputSeleccionado.files = dataURLtoFile(dataURL, "firma.png");

    // console.log(dataURL);

    // const a = document.createElement("a");
    // a.href = dataURL;
    // a.download = "signature.png";
    // a.click();
  };

  console.log("Inyectado 💉");
})();
function convertirCanvasAInputFile(canvas, fileInput) {
  // Convertir el contenido del canvas en un Blob
  canvas.toBlob(function (blob) {
    // Crear un archivo desde el Blob
    const file = new File([blob], "imagen.png", { type: "image/png" });

    // Crear un DataTransfer y agregar el archivo
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    // Asignar el DataTransfer al input file
    fileInput.files = dataTransfer.files;
  }, "image/png");
}

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
