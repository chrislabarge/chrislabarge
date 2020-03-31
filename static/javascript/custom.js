
document.addEventListener("DOMContentLoaded", ()=> {
  initTheme();
  initTaxonomyMenu();
})

function initTheme() {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get("theme") === "light") { toggleLightTheme() }

  initThemeTogglers(urlParams)
}

function initTaxonomyMenu() {
  let menuItems = document.querySelectorAll(".taxonomy-options li a");

  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      activateTaxonomyItem(item);
    })
  })
}

function activateTaxonomyItem(item) {
  let listClass = item.dataset.listClass
  let tax = document.querySelector(".taxonomy-options a.active")
  let list = document.querySelector(".taxonomy-list.active")

  if ( tax ) { tax.classList.remove("active") }
  if ( list ) { list.classList.remove("active") }

  item.classList.add("active")

  document.querySelector(`.taxonomy-list.${listClass}`)
    .classList.add("active")
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
