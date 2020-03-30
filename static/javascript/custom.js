
document.addEventListener("DOMContentLoaded", ()=> {
  initTheme();
})

function initTheme() {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get("theme") === "light") { toggleLightTheme() }

  initThemeTogglers(urlParams)
}

function toggleLightTheme() {
  document.querySelector("html").classList.add("light")
  document.querySelector("#light").style.display = "none"
  document.querySelector("#dark").style.display = "inline-block"

  appendThemeParamOnPageLinks();
}

function initThemeTogglers(paramObject) {
  document.querySelectorAll( ".toggle-theme" ).forEach((link) => {
    if (link.id === "light") {
      paramObject.set("theme", "light")
    } else {
      paramObject.set("theme", "dark")
    }

    link.href = window.location.pathname + "?" + paramObject.toString() + "#footer"
  })
}

function appendThemeParamOnPageLinks() {
  window.addEventListener("click", (e) => {
    let url = e.target.getAttribute("href")

    if ( url ) {
      let obj = new URLSearchParams(location.search);

      obj.set("theme", "light")

      location.href = url + "?" + obj.toString();

      e.preventDefault();
    }
  })
}
