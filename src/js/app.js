if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", user => {
    if (!user) {
      window.netlifyIdentity.on("login", () => {
        document.location.href = "/admin/";
      });
    }
  });
}

//document.querySelector(`.carousel`).addEventListener(`click`, e => {
//  //console.log(e.target)
//  const realTarget = e.target.parentNode
//  if (realTarget.classList.contains(`slide`)) {
//    const count = realTarget.parentNode.childElementCount - 1
//    const next = realTarget.classList.contains(`slide-${count}`) ? document.querySelector(`.slide-0`) : realTarget.nextElementSibling
//    const prev = realTarget.previousElementSibling === null ? document.querySelector(`.slide-0`) : realTarget.previousElementSibling
//    //console.log('next        : ', next)
//    //console.log('prev        : ', prev)
//    realTarget.classList.replace(`flex`, `hidden`)
//    next.classList.replace(`hidden`, `flex`)
//  }
//}, true)


// simple infinite carousel
let i = 0;
const count = Array.from(document.querySelector('.carousel').children).length - 1
document.body.addEventListener(`click`, e => {
  console.log(i)
  if (e.target.classList.contains('next')) {
    if (i === count) {
      document.querySelector(`.slide-${count}`).classList.replace(`flex`, `hidden`)
      i = 0
      document.querySelector(`.slide-${i}`).classList.replace(`hidden`, `flex`)
      return
    }
    document.querySelector(`.slide-${i}`).classList.replace(`flex`, `hidden`)
    i++ // go to next slide
    document.querySelector(`.slide-${i}`).classList.replace(`hidden`, `flex`)
  }

  if (e.target.classList.contains('prev')) {
    document.querySelector(`.slide-${i}`).classList.replace(`flex`, `hidden`)
    i--
    if (i === -1) {
      i = count
    }
    document.querySelector(`.slide-${i}`).classList.replace(`hidden`, `flex`)
  }
})
