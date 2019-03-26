import '../js/highlight.min.js'
import '../js/instantclick.min.js'

if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", user => {
    if (!user) {
      window.netlifyIdentity.on("login", () => {
        document.location.href = "/admin/";
      });
    }
  });
}

document.querySelector(`.carousel`).addEventListener(`click`, e => {
  const realTarget = e.target.parentNode
  if (realTarget.classList.contains(`slide`)) {
    const count = realTarget.parentNode.childElementCount - 1
    const next = realTarget.classList.contains(`slide-${count}`) ? document.querySelector(`.slide-0`) : realTarget.nextElementSibling
    realTarget.classList.replace(`flex`, `hidden`)
    next.classList.replace(`hidden`, `flex`)
  }
}, true)
