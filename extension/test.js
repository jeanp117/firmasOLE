// this is the code which will be injected into a given page...

(function () {
  // just place a div at top right
  var div = document.createElement("div");
  div.style.position = "fixed";
  div.style.top = 0;
  div.style.right = 0;
  div.innerHTML = `<!--
    Copyright (C) 2023 Wacom.
	Use of this source code is governed by the MIT License that can be found in the LICENSE file.
-->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
    />
    <title>Signature SDK - Simple demo</title>

    <script src="../common/libs/signature_sdk/stu-sdk.min.js"></script>
    <!-- used to connect to STU devices -->
    <script src="../../sigCaptDialog/stu_capture/aes-ecb.js"></script>
    <!-- utility for STU encryption -->
    <script src="../../sigCaptDialog/stu_capture/stu_capture_encryption.js"></script>
    <!-- STU encryption functions -->

    <script src="../common/libs/signature_sdk/signature_sdk.js"></script>
    <!-- signature SDK -->

    <script src="../../sigCaptDialog/sigCaptDialog.js"></script>
    <script src="../../sigCaptDialog/stuCaptDialog.js"></script>

    <script src="simple.js"></script>
  </head>
  <body>
    <div
      id="initializeBanground"
      class="active"
      style="width: 100%; height: 100%; position: fixed; background: #cccccccc"
    >
      <div
        style="
          position: absolute;
          left: 50%;
          top: 50%;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
        "
      >
        <table>
          <tr>
            <td><div class="loader"></div></td>
            <td>Initializing, this could take a few seconds...</td>
          </tr>
        </table>
      </div>
    </div>
    <h1>Signature SDK <span id="version_txt"></span>- Simple demo</h1>
    <ul>
      <li>
        <br />
      </li>

      <li>
        Capture with STU device. This makes use of STU-SDK for javascript, and
        it is only supported on web browsers that supports WebHID. You can see
        <a href="https://caniuse.com/?search=webhid"
          >here the list of compatible browsers</a
        >. <br /><br /><button
          id="capture_stu_device"
          onClick="captureFromSTU()"
          disabled="disabled"
        >
          Capture with STU device
        </button>
      </li>
      <br />
      <li>
        <div>
          Capture the signature using standard javascript events.
          <br /><br />
          <input
            type="checkbox"
            name="allow_mouse_check"
            id="allow_mouse_check"
            checked="checked"
          />
          <label for="allow_mouse_check">Allow mouse input</label>
          &nbsp;&nbsp;
          <input
            type="checkbox"
            name="allow_touch_check"
            id="allow_touch_check"
            checked="checked"
          />
          <label for="allow_touch_check">Allow touch</label>
          &nbsp;&nbsp;
          <input
            type="checkbox"
            name="allow_pen_check"
            id="allow_pen_check"
            checked="checked"
          />
          <label for="allow_pen_check">Allow pen</label>
          &nbsp;&nbsp;
          <br /><br />
          <button
            type="button"
            id="canvas_capture_btn"
            onClick="captureFromCanvas()"
            disabled="disabled"
          >
            Capture with Generic Canvas
          </button>
        </div>
      </li>
    </ul>
    <fieldset
      id="signature_image"
      style="width:310px;height:210px; display: flex;justify-content: center;align-items: center;"
    >
      <legend>Signature image:</legend>
      <img id="sig_image" style="display: block; margin: auto" />
    </fieldset>
    <br />
    <fieldset id="signature_text" style="width: 620px; height: 210px">
      <legend>Signature text:</legend>
      <textarea id="sig_text" style="width: 100%; height: 100%"></textarea>
    </fieldset>
  </body>
</html>

`;
  document.body.appendChild(div);

  console.log("Inyectado 💉");
})();

function hola() {
  alert("Hola");
}
