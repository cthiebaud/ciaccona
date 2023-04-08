import tinycolor from 'https://cdn.jsdelivr.net/npm/tinycolor2@latest/+esm'
import jquery from 'https://cdn.jsdelivr.net/npm/jquery@3.6.4/+esm'
/*
import IsotopeLayout from 'https://cdn.jsdelivr.net/npm/isotope-layout@3.0.6/+esm'
import isotopeFitColumns from 'https://cdn.jsdelivr.net/npm/isotope-fit-columns@1.1.4/+esm'
*/
import bezierEasing from 'https://cdn.jsdelivr.net/npm/bezier-easing@2.1.0/+esm'
import { shuffleArray } from "/js/_utils.js"
import { index2duration } from "/js/_timings.js"

const $ = jquery

export default function createColoredBadges(video_Id) {
    const thisFunctionName = "createColoredBadges"
    return new Promise((resolve) => {

        const _widths_ = [
            { w: 268 }, // 00
            { w: 282 }, // 01
            { w: 290 }, // 02
            { w: 285 }, // 03
            { w: 293 }, // 04
            { w: 320 }, // 05
            { w: 320 }, // 06
            { w: 287 }, // 07
            { w: 277 }, // 08
            { w: 326 }, // 09
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
        ];

        let _last_color_ = [
            { rgb: "000000", p_rgb: "232222", sim: 92, pantone: "Neutral Black C", name: "Bleached Silk" }
        ]

        let _colors_ = _first_color_.concat(_other_colors_)

        for (let s of _colors_) {
            s.luminance = tinycolor(s.p_rgb).getLuminance();
        }
        _colors_ = _colors_.sort((a, b) => b.luminance - a.luminance)
        const max = _colors_[0].luminance
        const min = _colors_[_colors_.length - 1].luminance
        const normalize = (val, max, min) => (val - min) / (max - min)
        _colors_ = _first_color_.concat(shuffleArray(_other_colors_))
        let k = 0
        const transparency = .600
        _colors_.push(_last_color_[0])
        for (let s of _colors_) {
            // https://cubic-bezier.com/
            let easing = bezierEasing(.5, .5, .5, .5)
            easing = bezierEasing(0, 1, 1, .4)
            // const nl = normalize(s.luminance, max, min)
            s.nl = normalize(k++, (_colors_.length - 1) + 1, 0)
            s.brightnessChange = (1 - easing(s.nl)) * 100 // s.luminance *100 // 
            if (tinycolor(s.p_rgb).isLight()) {
                s.textColor = tinycolor(s.p_rgb).darken(s.brightnessChange).toString("hex6").slice(1)
                s.stripeColor = tinycolor(s.p_rgb).darken(10).toString("hex6").slice(1)
                s.borderColor = tinycolor(s.p_rgb).darken(20).toString("hex6").slice(1)
            } else {
                s.textColor = tinycolor(s.p_rgb).lighten(s.brightnessChange).toString("hex6").slice(1)
                s.stripeColor = tinycolor(s.p_rgb).lighten(10).toString("hex6").slice(1)
                s.borderColor = tinycolor(s.p_rgb).lighten(20).toString("hex6").slice(1)
            }
            // some transparency to show video behind
            if (video_Id) {
                s.p_rgb_original = new tinycolor(s.p_rgb).toRgbString()
                s.p_rgb = tinycolor(s.p_rgb).setAlpha(transparency).toString("hex8").slice(1)
                s.textColor = tinycolor(s.textColor).setAlpha(transparency).toString("hex8").slice(1)
                s.stripeColor = tinycolor(s.stripeColor).setAlpha(transparency).toString("hex8").slice(1)
                // s.borderColor = tinycolor(s.borderColor).setAlpha(transparency).toString("hex8").slice(1)
            }
        }

        const $bricksTemporaryContainer = $("<span>");
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
        $bricksTemporaryContainer.append($(templateForTheme));

        const templateForArtist =
            `
<div id="gb-artist" data-sort="-2" class="grid-brick artist">
    <div class="d-flex brick align-items-center justify-content-center mb-3" style="border-radius: 0; height: 100%;">
        <div class="p-2" >
            <span class="name" style="color: #d0d0d0">?</span>
            <a class="url text-muted" href="#">
                <svg width="20" height="20" preserveAspectRatio="xMidYMid meet">
                    <use xlink:href="#external-link"></use>
                </svg>
            </a>
            <a id="social" class="share text-muted" target=_facebook" href="#">
                <svg width="20" height="20" preserveAspectRatio="xMidYMid meet">
                    <use xlink:href="#share"></use>
                </svg>
            </a>
        </div>
    </div>
</div>`
        $bricksTemporaryContainer.append($(templateForArtist));

        const twoZeroPad = (num) => String(num).padStart(2, '0')
        let i = 0;
        let barFrom = 0
        _colors_.forEach(function (c) {
            const tonality = (17 <= i && i < 27) ? "Δ" : "";
            const duration = index2duration(i)
            const warning = duration != 8 ? `(${duration})` : "";
            const barTo = barFrom + duration
            const bg = true ? // !tonality ?
                `background-color: #${c.p_rgb}`
                :
                `background-image: linear-gradient(135deg, 
        #${c.stripeColor} 10%, 
        #${c.p_rgb} 10%, 
        #${c.p_rgb} 50%, 
        #${c.stripeColor} 50%, 
        #${c.stripeColor} 60%, 
        #${c.p_rgb} 60%, 
        #${c.p_rgb} 100%); 
        background-size: 16.97px 16.97px;`

            const svgOffsetX = (i == 0 || i == 17 || i == 27 || i == 33 ? "0" : "6.5")

            const templateVariations =
                `
<div id="gb${i}" data-sort="${twoZeroPad(i)}" class="${tonality ? tonality + ' ' : ''}grid-brick hasScore" style="border-color: #${c.borderColor};"> <!-- background-color: ${c.p_rgb_original}; -->
    <div class="brick hasScore font-monospace d-flex align-items-center justify-content-between" style="${bg};" data-bar="${barFrom}">
        <div class="score" style="width: ${(_widths_[i].w) - 120}px; visibility: hidden;" data-width="${(_widths_[i].w) - 120}">

            <object id="o${i}" 
                    data="scores/bwv-1004_5_for_PNGs-${i + 1}.svg" 
                    type="image/svg+xml"
                    style="pointer-events: none;" 
                    data-svg-offset-x = ${svgOffsetX}> 
            </object>

            <span class="Δ" style="${bg}">
                ${tonality}
            </span>
        </div>
        <!-- div class="flex-grow-1"></!-->
        
        <div class="d-flex flex-grow-1 flex-column justify-content-between" style="height:100%; text-align: right; ${i == _colors_.length - 1 ? "display:none;" : ""}font-size:1.1rem; padding: 0 .3rem; border-right: .5px solid #${c.textColor}; color: #${c.textColor}">
            <div class="pt-1">${barFrom + 1}</div>
            <div style="${i == _colors_.length - 1 ? "display:none;" : ""}font-style: italic; font-size:.8rem; color: #${c.textColor};">
                ${warning}
            </div>
            <div class="pb-1">${barTo}</div>
        </div>
        <div class="fw-bold text-center" style="${i == _colors_.length - 1 ? "display:none;" : ""}margin-top: auto; margin-bottom: .5rem; min-width: 3rem; color: #${c.textColor};">
            ${i == 0 ? "" : i}
        </div>
    </div>
</div>
`
            $bricksTemporaryContainer.append($(templateVariations));

            // bumpers
            barFrom = barFrom += duration
            i++
        });

        const oblivion =
            `
<div id="gb-bwv1004" data-sort="${twoZeroPad(i)}" class="grid-brick">
    <!-- style="background-image: url(svg/facsimile.jpg);" -->
    <div class="brick d-flex align-items-center justify-content-center">
        <div class="magnificent-card p-2">
            &nbsp;BWV&nbsp;1004&nbsp;
        </div>
    </div>
</div>
`
        $bricksTemporaryContainer.append($(oblivion))

        const $bricks = $bricksTemporaryContainer.children().detach()

        let $gridById = $("#grid")
        $gridById.children('.grid-brick').remove()
        $gridById.append($bricks)

        resolve({ key: thisFunctionName, value: { iso: undefined } })
    })
}
