export const media = key => {
    const breakpoints = {
        desktop: [false, 1200],
        laptop: [true, 1199.98],
        tablet: [true, 991.98],
        phablet: [true, 767.98],
        mobile: [true, 575.98]
    }
    const name = breakpoints[key][0] ? 'max-width' : 'min-width'
    return style => `@media (${name}: ${breakpoints[key][1]}px) { ${style} }`
}