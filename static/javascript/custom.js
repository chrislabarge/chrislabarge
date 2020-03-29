
document.addEventListener("DOMContentLoaded", ()=> {
  initTheme();
})

function initTheme() {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get("theme") === "light") {
    document.querySelector("html").classList.add("light")
    document.querySelector("#light").style.display = "none"
    document.querySelector("#dark").style.display = "inline-block"
    appendThemeParamOnNav();
  }
}

function appendThemeParamOnNav() {
  window.addEventListener("click", (e) => {
    let url = e.target.getAttribute("href")

    if ( url ) {
      params = getUrlParams(url)

      let obj = new URLSearchParams(params);

      obj.set("theme", "light")

      location.href = url + "?" + obj.toString();

      e.preventDefault();
    }
  })
}

function getUrlParams(string) {
    let vars = {};

    string.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });

    return vars;
}
