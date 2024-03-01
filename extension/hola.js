intermediarioWS({
  url: "getDirAre",
  metodo: "POST",
  body: {
    codigo: "01064",
    suc: "CUC",
  },
});

function intermediarioWS(config) {
  let { url, metodo, body } = config;

  function getToken() {
    return fetch("https://grupo-esperanza.docus.com.co/ajax/funciones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metodo: "get_js_webservice",
        metodoAjax: "POST",
        url: "http://api.orglaesperanza.com:82/wsle/v2/login",
        parametros: JSON.stringify({
          user: "pruebas",
          pwd: "1n32kjd7@",
        }),
      }),
    })
      .then((respuesta) => {
        if (respuesta.status !== 200) throw "TOKEN NO OBTENIDO";
        return respuesta.json();
      })
      .then((respuesta) => respuesta.token);
  }

  return getToken().then((token) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", `XSRF-TOKEN=${token};`);

    const bodyDOCUS = JSON.stringify({
      metodo: "get_js_webservice",
      metodoAjax: "POST",
      url: "http://api.orglaesperanza.com:82/wsle/v2/getNomEmp",
      parametros: JSON.stringify(body),
      header: `{\"Authorization\":\"Bearer ${token}\"}`,
    });

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: bodyDOCUS,
    };

    fetch("https://grupo-esperanza.docus.com.co/ajax/funciones", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  });
}
