// this is the code which will be injected into a given page...

(function () {
  // just place a div at top right
  var div = document.createElement("div");
  div.style.position = "fixed";
  div.style.top = 0;
  div.style.right = 0;
  div.innerHTML = ` <div style="z-index: 300;">
  <button id="capture_stu_device" onclick="captureFromSTU()"  >Capture with STU device</button>
  <fieldset id="signature_image" style="width:310px;height:210px;display: flex;justify-content: center;align-items: center;">
  <legend>Signature image:</legend>
  <img id="sig_image" style="display:block;margin: auto;">
</fieldset>
<br>
<fieldset id="signature_text" style="width:620px;height:210px;">
  <legend>Signature text:</legend>
  <textarea id="sig_text" style="width:100%; height:100%;"></textarea>
</fieldset>
  </div>
`;
  document.body.appendChild(div);

  console.log("Inyectado 💉");
})();

function hola() {
  alert("Hola");
}
