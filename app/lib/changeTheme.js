import gsap from 'gsap'

const changeTheme = (setThemeIcon) => {
    /* cool ass theme change effect coming right up 😉 */

    // reference to slider element
    const themeSlider = document.getElementById('themeSlider')

    // get current theme of the app. dark | light
    const currentTheme = document.documentElement.classList[0]

    let themeMode = String
    if (currentTheme == 'light') {
        themeMode = 'dark'
        setThemeIcon('dark')
    } else {
        themeMode = 'light'
        setThemeIcon('light')
    }

    // animate in theme slider to left
    const slideChange = gsap.timeline({
        defaults: { ease: "linear", delay: 0 },
        onStart: () => { // before the animation starts
            // remove all page css transitions
            setTransition(`* {transition: none}`) // find function below
        },
        onComplete: () => { // when the animation finishes
            // restore all page css transitions
            setTransition(`* {transition: all}`)

            // set theme in localStorage
            localStorage.theme = themeMode
        }
    })
    slideChange.to(themeSlider, { display: 'block', duration: 0 }) // show slider
    slideChange.to(themeSlider, { background: currentTheme == "dark" ? "#161D27" : "#F1F1F1" }, "-=5") // set bg
    slideChange.to(themeSlider, {
        translateX: 0, duration: 0.4,
        // after slider has moved to left, change theme
        onComplete: () => {
            document.documentElement.classList.remove("dark", "light")
            document.documentElement.classList.add(themeMode)
            document.querySelector('meta[name=theme-color]').setAttribute("content", themeMode == 'dark' ? "#161D27" : "#F1F1F1")
        }
    })
    // then slide out to left to reveal the the new look
    slideChange.to(themeSlider, { translateX: '-100%', duration: 0.5 })
    slideChange.to(themeSlider, { display: 'none' }) // hide slider
    slideChange.to(themeSlider, { translateX: '100%', duration: 0 }) // restore to default position

    // method to toggle on/off page transitions. Used at top
    const setTransition = (css) => {
        let style = document.createElement('style')
        style.innerText = css
        document.head.appendChild(style)
    }
}

export default changeTheme