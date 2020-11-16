
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initTaxonomyMenu();
  initShowFilesOnly();
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

function  initShowFilesOnly() {
  if (window.location.hash == "#files") {
    showFilesOnly();
  } else {

    const el = document.querySelector("#quickView")

    if (el) {
      el.addEventListener("click", () => {
        showFilesOnly();
      });
    }
  }
}

function showFilesOnly() {
  document.querySelector("#quickView").style.display = "none";
  document.querySelector("#normalView").style.display = "inline-block";
  document.querySelector(".blog-post-content").classList.add("files-only")

  document.querySelectorAll('img[src*="#visible"]').forEach((image) => {
    image.parentElement.classList.add("visible")
  })

  document.querySelectorAll(".snippet-heading").forEach((heading) => {
    if (!heading.classList.contains("no-file-only")) {
      heading.classList.add("visible")
      heading.nextElementSibling.classList.add("visible")
    }
  })
}
