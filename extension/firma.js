var mSigObj;
var mHash;

Module.onAbort = (_) => {
  alert("No se puede cargar la libreria WACOM");
};

Module.onRuntimeInitialized = (_) => {
  mSigObj = new Module.SigObj();
  mHash = new Module.Hash(Module.HashType.SHA512);

  fetch(
    "https://grupo-esperanza.docus.com.co/plugin/docus_webservices/api/ajax?e=a8f7c698f1176d496cc95af5ebd8d9db",
    {
      mode: "no-cors",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      const promise = mSigObj.setLicence(data.key, data.secret);
      promise.then((value) => {
        if (value) {
          console.log("Licencia WACOM cargada correctamente");
          if (!navigator.hid) {
            alert("WebHID no soportado");
          }
        }
      });
      promise.catch((error) => {
        alert(error);
        document.getElementById("initializeBanground").style.display = "none";
      });
    })
    .catch((error) => {
      alert("Error al cargar la licencia WACOM");
    });
};

async function renderSignature() {
  //pixels = dpi*mm/25.4mm
  let width = Math.trunc((96 * mSigObj.getWidth(false) * 0.01) / 25.4);
  let height = Math.trunc((96 * mSigObj.getHeight(false) * 0.01) / 25.4);

  let scaleWidth = 300 / width;
  let scaleHeight = 200 / height;
  let scale = Math.min(scaleWidth, scaleHeight);

  let renderWidth = Math.trunc(width * scale);
  const renderHeight = Math.trunc(height * scale);

  // render with must be multiple of 4
  if (renderWidth % 4 != 0) {
    renderWidth += renderWidth % 4;
  }

  const inkColor = "#000";
  return mSigObj.renderBitmap(
    renderWidth,
    renderHeight,
    "image/png",
    4,
    inkColor,
    "white",
    0,
    0,
    0x400000
  );
}

function extractSignatureFromCanvas() {
  return renderSignature().then(async (base64) => {
    let drawPromise = new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.filter = "brightness(1.25)";
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = (error) => {
        reject(error);
      };
    });

    return drawPromise;
  });
}

function captureSignature({ useSTU = false, onCanvasAdquired = () => {} }) {
  const config = {};

  config.source = {
    mouse: true,
    touch: true,
    pen: true,
  };

  const modalFirma = useSTU ? new StuCaptDialog() : new SigCaptDialog(config);

  modalFirma.addEventListener("ok", function () {
    extractSignatureFromCanvas().then(onCanvasAdquired);
  });

  modalFirma.open(mSigObj, null, null, null, null);
  modalFirma.startCapture();
}

function convertirCanvasAInputFile(canvas, fileInput) {
  canvas.toBlob(function (blob) {
    const file = new File([blob], "imagen.png", { type: "image/png" });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;
  }, "image/png");

  let modal = document.getElementById("huellaModal");
  //append img tag
  let img = document.createElement("img");
  img.src = canvas.toDataURL();
  modal.appendChild(img);
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
