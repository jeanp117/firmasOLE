/**
 * Copyright (C) 2023 Wacom.
 * Use of this source code is governed by the MIT License that can be found in the LICENSE file.
 */

var mSigObj;
var mHash;

let estado = {
  licencia: null,
  webHID: null,
  set: function (key, value) {
    this[key] = value;
  },
};

Module.onAbort = (_) => {
  alert("Web browser not supported");
  document.getElementById("initializeBanground").style.display = "none";
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
          estado.set("licencia", true);
          estado.set("webHID", navigator.hid ? true : false);
          if (!estado.webHID) {
            alert("WebHID no soportado");
          }

          inyectar();
        }
      });
      promise.catch((error) => {
        alert(error);
        estado.licencia = false;
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
  try {
    const image = await mSigObj.renderBitmap(
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
    document.getElementById("sig_image").src = image;
    // document.getElementById("sig_text").value = await mSigObj.getTextData(
    // Module.TextFormat.BASE64
    // );
  } catch (e) {
    alert(e);
  }
}

function captureFromCanvas() {
  const config = {};

  config.source = {
    mouse: true,
    touch: true,
    pen: true,
  };

  const sigCaptDialog = new SigCaptDialog(config);

  sigCaptDialog.addEventListener("ok", function () {
    renderSignature();
  });

  sigCaptDialog.open(
    mSigObj,
    null,
    null,
    null,
    null,
    Module.KeyType.SHA512,
    mHash
  );
  sigCaptDialog.startCapture();
}

function captureFromSTU() {
  const stuCapDialog = new StuCaptDialog();
  stuCapDialog.addEventListener("ok", function () {
    renderSignature();
  });
  stuCapDialog.open(
    mSigObj,
    null,
    null,
    null,
    null,
    Module.KeyType.SHA512,
    mHash
  );
}
