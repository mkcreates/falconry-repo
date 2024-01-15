// style header when feed content is scrolled down
const feedScroll = (event) => {
    const header = document.querySelector('.header-container') // reference header container
    const { scrollTop } = event.target // get real time scroll position

    // add class when scroll down is greater than header height
    if (scrollTop > header.offsetHeight) {
      header.classList.add('feedIsScrolled')
    } else {
      header.classList.remove('feedIsScrolled')
    }
}

export default feedScroll