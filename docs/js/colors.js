import tinycolor from 'https://cdn.jsdelivr.net/npm/tinycolor2@1.6.0/+esm'
import bezierEasing from 'https://cdn.jsdelivr.net/npm/bezier-easing@2.1.0/+esm'
import codec from "/js/structure.js?v=0.11.1"
import Jigsaw from '/js/jigsaw.js?v=0.11.1'
import { shuffleArray, normalizeVraiment, logFunc, generateElement } from "/js/utils.js?v=0.11.1"


export default function createColoredBadges(fullameNoSpaceLowercaseNoDiacritics) {

    // copied from index.svg#puzzle_filled
    let jigsawPath = () => "m329.278 242.223-18.053.024a11.795 11.795 0 0 0-8.459 3.592c-5.436 5.634-12.708 8.742-20.479 8.757-15.736.015-28.568-12.774-28.592-28.519 0-15.754 12.78-28.559 28.489-28.586 7.781-.02 15.066 3.064 20.518 8.666a11.791 11.791 0 0 0 8.454 3.562l18.048-.021a11.77 11.77 0 0 0 8.323-3.462 11.794 11.794 0 0 0 3.442-8.321v-.017l-.146-94.278a11.784 11.784 0 0 0-11.798-11.765l-103.405.162h-21.74l-.021-11.117v-.035c0-4.48 1.823-8.771 5.042-11.9 7.844-7.602 12.162-17.768 12.162-28.617v-.227c-.031-22.074-17.948-40.02-40-40.121-22.052.102-39.969 18.047-40 40.121v.227c0 10.85 4.318 21.016 12.162 28.617a16.603 16.603 0 0 1 5.042 11.9v.035l-.021 11.117h-21.74L33.1 91.855a11.784 11.784 0 0 0-11.798 11.765l-.144 94.278v.017c0 3.119 1.24 6.11 3.442 8.321a11.77 11.77 0 0 0 8.323 3.462l18.048.021a11.746 11.746 0 0 0 8.454-3.562c5.45-5.602 12.736-8.686 20.518-8.666 15.709.028 28.489 12.832 28.489 28.586-.021 15.741-12.854 28.53-28.592 28.519-7.77-.015-15.045-3.123-20.478-8.757a11.795 11.795 0 0 0-8.459-3.592l-18.053-.024c-6.502-.007-11.781 5.252-11.789 11.757l.122 96.268v.018c0 6.496 5.258 11.769 11.756 11.777l120.108.084a11.778 11.778 0 0 0 11.801-11.756l.019-9.994v-.022c0-3.185-1.296-6.232-3.583-8.455-5.572-5.398-8.64-12.623-8.64-20.33v-.159c.022-15.686 12.752-28.434 28.417-28.505 15.665.071 28.395 12.819 28.417 28.505v.159c0 7.707-3.067 14.932-8.64 20.33a11.797 11.797 0 0 0-3.584 8.455v.022l.02 9.994a11.766 11.766 0 0 0 3.463 8.32 11.786 11.786 0 0 0 8.338 3.436l120.108-.084c6.498-.01 11.756-5.281 11.756-11.777v-.018l.126-96.268c-.006-6.505-5.285-11.764-11.787-11.757z" 
    let jigsawViewBox = () => '-50 -50 462.125 462.125'

    if (true) {
        try {
            const xn = document.documentElement.style.getPropertyValue('--bpr')
            const yn = 36 / xn
            const randomSeed = normalizeVraiment(Math.random(), 0, 1, 0, 10000)
            const randomTabsize = normalizeVraiment(Math.random(), 0, 1, .06, .20)
            const randomJitter = normalizeVraiment(Math.random(), 0, 1, .04, .15)

            console.log('[jigsaw] seed', randomSeed, 'tabsize', randomTabsize, 'jitter', randomJitter)

            const jig = new Jigsaw({
                seed: randomSeed,
                width: xn * 120,
                height: yn * 120,
                radius: 0,
                seed: 12,
                tabsize: randomTabsize,
                jitter: randomJitter,
                xn: xn,
                yn: yn,
            })

            jigsawPath = (i) => {
                try {
                    return jig.getJigsawPiecePath(i)
                } catch (e) {
                    console.error(e);
                    return ''
                }
            }
            jigsawViewBox = (i) => {
                try {
                    return jig.getJigsawPieceViewBox(i)
                } catch (e) {
                    console.error(e);
                    return ''
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    const _widths_ = [
        { w: 268 }, // 00
        { w: 282 }, // 01
        { w: 290 }, // 02
        { w: 285 }, // 03
        { w: 293 }, // 04
        { w: 320 }, // 05
        { w: 320 }, // 06
        { w: 287 }, // 07
        { w: 345 }, // 08.1
        { w: 380 }, // 08.1
        { w: 330 }, // 09.1
        { w: 334 }, // 09.1
        { w: 407 }, // 10
        { w: 280 }, // 11
        { w: 250 }, // 12
        { w: 253 }, // 13
        { w: 250 }, // 14
        { w: 370 }, // 15
        { w: 325 }, // 16
        { w: 288 }, // 17
        { w: 290 }, // 18
        { w: 322 }, // 19
        { w: 322 }, // 20
        { w: 319 }, // 21
        { w: 320 }, // 22
        { w: 248 }, // 23
        { w: 257 }, // 24
        { w: 264 }, // 25
        { w: 260 }, // 26
        { w: 282 }, // 27
        { w: 324 }, // 29
        { w: 346 }, // 30
        { w: 307 }, // 31
        { w: 356 }, // 32
        { w: 255 }, // 33
        { w: 300 }, // 34 (max possible)
        { w: 0 }  // 35 ?
    ]

    let _first_color_ = [
        { rgb: "f3f3f2", p_rgb: "f2f1f0", sim: 97, pantone: "P 179-1 C", name: "Bleached Silk" }
    ]

    let _other_colors_ = [
        { rgb: "6a8d88", p_rgb: "6c8a82", sim: 98, pantone: "625 U", name: "Aspen Hush" },
        { rgb: "112222", p_rgb: "1b2f34", sim: 95, pantone: "5463 CP", name: "Black Feather" },
        { rgb: "222244", p_rgb: "252849", sim: 98, pantone: "282 CP", name: "Black Market" },
        { rgb: "2242c7", p_rgb: "24509a", sim: 91, pantone: "286 CP", name: "Blue Blue" },
        { rgb: "2a96d5", p_rgb: "1f95cd", sim: 98, pantone: "7508 UP", name: "Boyzone" },
        { rgb: "a3c1ad", p_rgb: "a6c2ad", sim: 99, pantone: "P 134-11 U", name: "Cambridge Blue" },
        { rgb: "f5a2a1", p_rgb: "f6a1a0", sim: 100, pantone: "15-1621 TPX", name: "Candy Heart Pink" },
        { rgb: "697f8e", p_rgb: "6a7f8e", sim: 100, pantone: "692 UP", name: "Cascade Tour" },
        { rgb: "3c1414", p_rgb: "4e2b1f", sim: 92, pantone: "7596 CP", name: "Dark Sienna" },
        { rgb: "355859", p_rgb: "335959", sim: 99, pantone: "19-5413 TCX", name: "Depth Charge" },
        { rgb: "3a445d", p_rgb: "3b4559", sim: 98, pantone: "2379 C", name: "Diplomatic" },
        { rgb: "ffd8bb", p_rgb: "ffd4b2", sim: 98, pantone: "13-1026 TPX", name: "Durazno Palido" },
        { rgb: "0abab5", p_rgb: "00baae", sim: 97, pantone: "3262 U", name: "Jade Gravel" },
        { rgb: "f7a233", p_rgb: "f9a12e", sim: 99, pantone: "15-1058 TPG", name: "Lightning Yellow" },
        { rgb: "b66a3c", p_rgb: "ba6a3b", sim: 99, pantone: "P 31-7 C", name: "Mincemeat" },
        { rgb: "6fea3e", p_rgb: "87e878", sim: 94, pantone: "902 U", name: "Miyazaki Verdant" },
        { rgb: "ec8430", p_rgb: "f38b3c", sim: 98, pantone: "144 U", name: "Navel" },
        { rgb: "a328b3", p_rgb: "9b26b6", sim: 98, pantone: "2592 C", name: "Pink Spyro" },
        { rgb: "fcffff", p_rgb: "c7dbf4", sim: 87, pantone: "2707 U", name: "Polar Bear In A Blizzard" },
        { rgb: "881166", p_rgb: "890c58", sim: 96, pantone: "228 C", name: "Possessed Purple" },
        { rgb: "11875d", p_rgb: "13955e", sim: 95, pantone: "P 145-8 U", name: "Primal Green" },
        { rgb: "8a3319", p_rgb: "8a391b", sim: 98, pantone: "7526 C", name: "Red Rust" },
        { rgb: "0c1793", p_rgb: "10069f", sim: 97, pantone: "Blue 072 C", name: "Royal" },
        { rgb: "e84998", p_rgb: "e44c9a", sim: 99, pantone: "Rhodamine Red U", name: "Schiaparelli Pink" },
        { rgb: "ffe670", p_rgb: "ffe671", sim: 100, pantone: "924 C", name: "Shandy" },
        { rgb: "7777ff", p_rgb: "6490e8", sim: 90, pantone: "2727 U", name: "Stargate Shimmer" },
        { rgb: "0c0c1f", p_rgb: "131e29", sim: 91, pantone: "7547 C", name: "Tristesse" },
        { rgb: "b12d35", p_rgb: "b42937", sim: 99, pantone: "P 58-8 C", name: "Unmatched Beauty" },
        { rgb: "e34244", p_rgb: "e73c3e", sim: 99, pantone: "2034 C", name: "Vermilion Cinnabar" },
        { rgb: "e3ac72", p_rgb: "e2a770", sim: 98, pantone: "721 CP", name: "Viva Gold" },
        { rgb: "4b57db", p_rgb: "275ea3", sim: 89, pantone: "10261 C", name: "Warm Blue" },
        { rgb: "bfd6d9", p_rgb: "bcd5d6", sim: 99, pantone: "5523 U", name: "Wind Speed" },
        { rgb: "889911", p_rgb: "9b9912", sim: 95, pantone: "391 CP", name: "Densetsu Green" },
        /* { rgb: "123456", p_rgb: "183859", sim: 99, pantone: "P 108-16 C", name: "Incremental Blue" }, */
    ];

    let _last_color_ = [
        /* { rgb: "000000", p_rgb: "232222", sim: 92, pantone: "Neutral Black C", name: "Bleached Silk" } */
        { rgb: "d8b998", p_rgb: "d8b998", sim: 92, pantone: "Pantone 13-1014 Tcx", name: "Mellow Buff" }
    ]

    let _colors_ = _first_color_.concat(shuffleArray(_other_colors_))
    _colors_.push(_last_color_[0])

    const transparency = .400
    // https://cubic-bezier.com/
    const easingVanishingContrast = bezierEasing(0, 1, 1, .4)
    const easingTheDarkerTheLighter = bezierEasing(0, 1.5, .166, .5)
    // logFunc(() => easingTheDarkerTheLighter)
    let k = 0
    for (let s of _colors_) {
        const k0_1normalized = normalizeVraiment(k++, 0, _colors_.length, 0, 1)
        const contrastChange = (1 - easingVanishingContrast(k0_1normalized)) * 100
        // console.log(s.p_rgb, tinycolor(s.p_rgb).isLight(), tinycolor(s.p_rgb).getLuminance())
        const lum = tinycolor(s.p_rgb).getLuminance()
        if (lum > .333) { // tinycolor(s.p_rgb).isLight()
            s.textColor = tinycolor(s.p_rgb).darken(contrastChange).toString("hex6").slice(1)
            s.puzzleColor = tinycolor(s.p_rgb).darken(15).toString("hex6").slice(1)
            s.stripeColor = tinycolor(s.p_rgb).darken(5).toString("hex6").slice(1)
            s.stripeColorAlpha = tinycolor(s.p_rgb).darken(5).setAlpha(transparency).toString("hex8").slice(1)
        } else {
            s.textColor = tinycolor(s.p_rgb).lighten(contrastChange).toString("hex6").slice(1)
            s.puzzleColor = tinycolor(s.p_rgb).lighten(12).toString("hex6").slice(1)
            s.stripeColor = tinycolor(s.p_rgb).lighten(5).toString("hex6").slice(1)
            s.stripeColorAlpha = tinycolor(s.p_rgb).lighten(5).setAlpha(transparency).toString("hex8").slice(1)
        }
        const luminance = tinycolor(s.p_rgb).getLuminance();
        const theDarkerTheLighter = easingTheDarkerTheLighter(luminance) * 100
        s.borderColor = tinycolor(s.p_rgb).lighten(theDarkerTheLighter).toString("hex6").slice(1)
        s.p_rgbAlpha = tinycolor(s.p_rgb).setAlpha(transparency).toString("hex8").slice(1)

        // some transparency to show video behind
        s.p_rgb_original = new tinycolor(s.p_rgb)
        if (fullameNoSpaceLowercaseNoDiacritics) {
            s.p_rgb = tinycolor(s.p_rgb_original).setAlpha(transparency).toString("hex8").slice(1)
            s.textColor = tinycolor(s.textColor).setAlpha(transparency).toString("hex8").slice(1)
            s.puzzleColor = tinycolor(s.puzzleColor).setAlpha(transparency).toString("hex8").slice(1)
            s.stripeColor = tinycolor(s.stripeColor).setAlpha(transparency).toString("hex8").slice(1)
            s.borderColor = tinycolor(s.borderColor).setAlpha(transparency).toString("hex8").slice(1)
        }
    }

    const temporaryContainer = generateElement("<template>");
    const templateForTheme =
        `
<div id="gb-ciaccona" data-sort="-1" class="grid-brick" >
    <div class="d-flex brick align-items-center justify-content-center mb-3" >
        <!-- style="border-radius: 0; background-image: url('/manuscriptFirstLine.jpg'); background-repeat: no-repeat; background-size: cover; background-position-y: center; height: 100%;" -->
        <div class="magnificent-card p-2" style="backdrop-filter: blur(1px);">
            &nbsp;Ciaccona&nbsp;
        </div>
    </div>
</div>`
    temporaryContainer.appendChild(generateElement(templateForTheme));

    const templateForArtist =
        `
<div id="gb-artist" data-sort="-2" class="grid-brick artist" style="${!fullameNoSpaceLowercaseNoDiacritics ? 'display: none;' : ''}">
    <div class="d-flex brick align-items-center justify-content-center mb-3" style="border-radius: 0; height: 100%;">
        <div class="p-2" style="white-space: nowrap;">
            <span class="fullname" style="color: #d0d0d0">${fullameNoSpaceLowercaseNoDiacritics}</span>
            <a id="youtube-url" class="btn btn-lihjt icon-base icon-youtube_external_link text-muted" target="_youtube" href="#" aria-label="Original Video...">
            </a>
            <a id="social" class="share btn btn-lihjt icon-base icon-share text-muted" target="_facebook" href="#" aria-label="Share...">
            </a>
            <a id="puzzle" class="share btn btn-lihjt icon-base icon-puzzle text-muted" data-a="${fullameNoSpaceLowercaseNoDiacritics}" target="_puzzle" href="#" aria-label="Puzzle...">
            </a>
        </div>
    </div>
</div>`
    temporaryContainer.appendChild(generateElement(templateForArtist));

    const twoZeroPad = (num) => String(num).padStart(2, '0')
    let i = 0;
    let barFrom = 0
    _colors_.forEach(function (c) {
        const tonality = codec.isMajor(i) ? "Δ" : "";
        const barsCount = codec.variation2barsCount(i)
        const warning = barsCount != 8 ? `(${barsCount})` : "";
        const barTo = barFrom + barsCount
        const bg = `background-color: #${c.p_rgb}`
        const bgAlpha = `background-color: #${c.p_rgbAlpha}`
        const bgstripe = !tonality ? bg : `background-image: linear-gradient(135deg, 
                #${c.stripeColor} 25%, 
                #${c.p_rgb} 25%, 
                #${c.p_rgb} 50%, 
                #${c.stripeColor} 50%, 
                #${c.stripeColor} 75%, 
                #${c.p_rgb} 75%, 
                #${c.p_rgb} 100%); 
                background-size: 16.97px 16.97px;`
        const bgstripeAlpha = !tonality ? bgAlpha : `background-image: linear-gradient(135deg, 
                #${c.stripeColorAlpha} 25%, 
                #${c.p_rgbAlpha} 25%, 
                #${c.p_rgbAlpha} 50%, 
                #${c.stripeColorAlpha} 50%, 
                #${c.stripeColorAlpha} 75%, 
                #${c.p_rgbAlpha} 75%, 
                #${c.p_rgbAlpha} 100%); 
                background-size: 16.97px 16.97px;`

        const svgOffsetX = codec.svgOffsetX(i)

        const templateVariations =
            `
<div id="gb${i}" data-sort="${twoZeroPad(i)}" data-variation="${i}" class="${tonality ? tonality + ' ' : ''}grid-brick hasScore" style="${bgstripeAlpha}; border-color: #${c.borderColor};">
    <div class="brick hasScore font-monospace d-flex align-items-center justify-content-between" style="${bgstripe}; ${i === codec.variationsCount - 1 ? 'border-radius: 0;' : ''} " data-bar="${barFrom}" data-variation="${i}" >
        <div class="score init" style="width: ${(_widths_[i].w) - 120}px;" data-width="${(_widths_[i].w) - 120}">

            <object id="o${i}" 
                    data="scores3/bwv-1004_5_for_SVGs-${i + 1}.svg" 
                    type="image/svg+xml"
                    style="pointer-events: none;" 
                    data-svg-offset-x = ${svgOffsetX}
                    aria-label="variation ${i}"> 
            </object>

            <span class="Δ" style="${bg}">
                ${tonality}
            </span>
        </div>
        <!-- div class="flex-grow-1"></!-->

        <div class="d-flex flex-grow-1 flex-column justify-content-between" style="height:100%; text-align: right; ${i === codec.variationsCount - 1 ? "display:none;" : ""}font-size:1.1rem; padding: 0 .3rem; border-right: .5px solid #${c.textColor}; color: #${c.textColor}">
            <div class="pt-1">${barFrom + 1}</div>
            <div style="${i === codec.variationsCount - 1 ? "display:none;" : ""}font-style: italic; font-size:.8rem; color: #${c.textColor};">
                ${warning}
            </div>
            <div class="pb-1">${barTo}</div>
        </div>
        <div class="" style="width: 3rem; height: 5rem; position:relative;overflow: hidden;">
            <svg xmlns="http://www.w3.org/2000/svg" 
                 id="gb-puzzle${i}-svg" 
                 width="80%" height="60%" 
                 style="visibility: hidden" 
                 viewBox="${jigsawViewBox(i + 1)}">
                <path d="${jigsawPath(i + 1)}"></path>
            </svg>
            <!--
            <object id="gb-puzzle${i}-background"
                    class="gb-puzzle-background" 
                    type="image/svg+xml"
                    style="display: none; object-fit: cover; height: 60%; width: 80%; visibility: hidden; transform: scale(1.4); overflow:hidden;" 
                    data-sel="#bonhomme${i + 1}"
                    data="puzzle.svg?v=0.11.1#bonhomme${i + 1}-view"
                    data-color="#${c.puzzleColor}"
                    > 
            </object>
            -->
            <div id="gb-puzzle${i}" 
                class="gb-puzzle fw-bold text-center" 
                data-a="${fullameNoSpaceLowercaseNoDiacritics}"
                data-v="${i}"
                style="position:absolute; bottom: 0.5rem; right:0; left: -.667rem; color: #${c.textColor};">
                ${i === 0 || i === codec.variationsCount - 1 ? "&nbsp;" : i}
            </div>
        </div>
    </div>
</div>
`
        const instanciatedVariation = generateElement(templateVariations)
        const jigsawPiece = instanciatedVariation.querySelector(`#gb-puzzle${i}-svg`)
        if (jigsawPiece) {
            jigsawPiece.addEventListener("load", e => {
                e.target.style.visibility = 'visible'
                e.target.style.fill = `#${c.puzzleColor}`
            })
        }
        temporaryContainer.appendChild(instanciatedVariation);

        // bumpers
        {
            barFrom = barTo
            i++
        }
    });

    const oblivion =
        `
<div id="gb-bwv1004" data-sort="${twoZeroPad(i)}" class="grid-brick">
    <div class="brick d-flex align-items-center justify-content-center">
        <a class="magnificent-card p-2" href="artists.html" aria-label="Artists or Puzzle...">
            &nbsp;BWV&nbsp;1004&nbsp;
        </a>
    </div>
</div>
`
    // temporaryContainer.appendChild(generateElement(oblivion))

    const bricks = temporaryContainer.children
    if (bricks?.length) {
        let gridE = document.getElementById("grid")
        if (gridE) {
            ;[...gridE.children].forEach(gb => gb.remove())
                ;[...bricks].forEach(gb => gridE.appendChild(gb))
        }
    }

    return {}
}
