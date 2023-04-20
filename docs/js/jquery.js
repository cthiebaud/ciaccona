import jquery from 'https://cdn.jsdelivr.net/npm/jquery@3.6.4/+esm'
import config from "/js/config.js?v=0.8.21"
import codec from "/js/structure.js?v=0.8.21"
import { shuffleArray } from "/js/utils.js?v=0.8.21"

const $ = jquery

const Ω = {
    boot: () => {
        console.log('jquery is here')
        return true
    },

    animateUnveilScores: () => {
        const speed = 50 //  (1700/34)
        // https://css-tricks.com/why-using-reduce-to-sequentially-resolve-promises-works/
        function methodThatReturnsAPromise(id) {
            return new Promise((resolve) => {
                id.classList.remove('init')
                // console.log( 'id.dataset.width', id.dataset.width )
                $(id).css({ visibility: 'inherit', width: '0' }).animate({ width: `${id.dataset.width}px` }, speed, "linear", () => {
                    resolve(id)
                })
            })
        }
        let result = $('.score').toArray().reduce((accumulatorPromise, nextID) => {
            return accumulatorPromise.then(() => {
                return methodThatReturnsAPromise(nextID);
            });
        }, Promise.resolve());

        result.then(e => {
            console.log("'unveil scores' animation complete")
        });
    },

    showScoreDisplay: function (iso) {
        document.getElementById('grid').dataset.scoreDisplay = config.scoreDisplay
        if (config.scoreDisplay === 'firstBar') {
            $('#gridContainerCol').removeClass('fullwidth')
            $('.grid-brick:not(.hasPerformer), .score').removeClass('fullwidth')
        } else if (config.scoreDisplay === 'fullScore') {
            $('#gridContainerCol').addClass('fullwidth')
            $('.grid-brick:not(.hasPerformer), .score').addClass('fullwidth')
        }

        if (iso) iso.layout()
    },

    showScoreInBricks: function () {
        document.getElementById('grid').dataset.scoreInBricks = config.scoreInBricks
        if (config.scoreInBricks === 'allBricks') {
            $('#grid').removeClass('selectedBrick')
        } else if (config.scoreInBricks === 'selectedBrick') {
            $('#grid').addClass('selectedBrick')
        }
    },

    About: function () {
        this.about = false;
        const pos = [
            { left: '-111vw', top: 0 },
            { left: '+111vw', top: 0 },
            { left: 0, top: '+111vh' },
            { left: 0, top: '-111vh' },
        ]
        this.animations = []
        for (let i = 0; i < pos.length; i++) {
            for (let j = 0; j < pos.length; j++) {
                if (i != j) {
                    this.animations.push({ fore: pos[i], back: pos[j] })
                }
            }
        }
        this.animations = shuffleArray(this.animations)
        this.a = 0;
        this.showAbout = () => {
            console.log('BEGIN show about')
            $('#config-menu a#about > label').html("&check; About&hellip;")

            $('body').addClass('about')

            $('div#logoLeft').css(this.animations[this.a].fore)
            $('div#logoRight').css(this.animations[this.a].back)
            $('div#logoLeft').show()
            $('div#logoRight').show()
            window.requestAnimationFrame(() => {
                $('div#logoLeft').animate({ left: 0, top: 0 }, 1800, 'swing')
                $('div#logoRight').animate({ left: 0, top: 0 }, 1800, 'swing', () => {
                    console.log('MIDDLE show about')
                    $('header.header').show()
                    $('#close-about').show()
                    $('footer.footer').show()
                    $('#gridContainerCol').animate({ opacity: 0 }, 600)
                    $('#playerWrapper').animate({ opacity: 0 }, 600, 'linear', () => {
                        $('#gridContainerCol, #playerWrapper').hide()
                        this.a = (this.a + 1) % this.animations.length
                        console.log('FIN show about')
                    })
                })
            });
            this.about = true
        }
        this.hideAbout = () => {
            console.log('BEGIN hide about')
            $('#config-menu a#about > label').html("About&hellip;")

            $('header.header').hide()
            $('#close-about').hide()
            $('footer.footer').hide()
            window.requestAnimationFrame(() => {
                $('#gridContainerCol').show().animate({ opacity: 1 }, 600, 'linear')
                $('#playerWrapper').show().animate({ opacity: 1 }, 600, 'linear', () => {
                    console.log('MIDDLE hide about')
                    $('div#logoLeft ').animate(this.animations[this.a].fore, 1800, 'swing')
                    $('div#logoRight').animate(this.animations[this.a].back, 1800, 'swing', () => {
                        $('div#logoLeft').hide()
                        $('div#logoRight').hide()
                        $('body').removeClass('about')
                        console.log('FIN hide about')
                    })
                })
            })
            this.about = false
        }
        const _this = this
        $('a#about').on('click', (e) => {
            if (_this.about) {
                _this.hideAbout()
            } else {
                _this.showAbout()
            }
        })
        $('#close-about').on('click', (e) => {
            _this.hideAbout()
        })
    },

    setClickHandlers: (iso) => {
        const url = new URL(window.location)

        document.querySelectorAll('a[data-name-no-space-lowercase-no-diacritics]').forEach((e) => {
            const nameNoSpaceLowercaseNoDiacritics = e.dataset.nameNoSpaceLowercaseNoDiacritics
            if (nameNoSpaceLowercaseNoDiacritics === '') {
                e.setAttribute('href', url.pathname)
            } else {
                e.setAttribute('href', `${url.pathname}video/${nameNoSpaceLowercaseNoDiacritics}.html`)
            }
        })

        $("#firstBarChecked, #fullScoreChecked").on("click", function (e) {
            const scoreDisplay = e.currentTarget.dataset.scoreDisplay
            config.scoreDisplay = scoreDisplay
            Ω.showScoreDisplay(iso)
        })

        $("#allBricksChecked, #selectedBrickChecked").on("click", function (e) {
            const scoreInBricks = e.currentTarget.dataset.scoreInBricks
            config.scoreInBricks = scoreInBricks
            Ω.showScoreInBricks()
        })

        $("#autoplayChecked").on("click", function (e) {
            config.autoplay = !config.autoplay
        })

    },

    showArtist: (artist) => {
        const $artist = $('.grid-brick.artist#gb-artist');

        const fullname = artist.fullname === "Christophe Thiebaud" ? "Moi" : artist.fullname;

        $('#loading #message').html(fullname);
        $artist.css({ visibility: "inherit" })
        $artist.find('.fullname').html(fullname)
        $artist.find('a#youtube-url').attr({
            href: artist['▶'].youtubeTrueUrl ? artist['▶'].youtubeTrueUrl : artist['▶'].youtubeUrl,
            target: artist['▶'].id
        })
        $artist.find('a#social').attr({
            href: artist.social
        })
    },

    beforeCreatePlayer: (videoId) => {
        const idPlayer = "blah2"

        $('#loading').css({ "background-color": "#00000080" })

        const $blah2 = $(`<div id="${idPlayer}" data-plyr-provider="youtube" data-plyr-embed-id="${videoId}">`)

        $("#playerWrapper").append($blah2)

        return '#' + idPlayer
    },

    afterIsotope: (iso) => {

        Ω.setClickHandlers(iso)

        $(".brick.hasScore").click(function (e) {
            const hadClass = $(e.currentTarget).parent().hasClass('selected')
            $('.grid-brick.selected .score').scrollLeft(0)
            $('.grid-brick.selected').removeClass('selected')
            $('.grid-brick.goodbye').removeClass('goodbye')
            $('.grid-brick.hello').removeClass('hello')
            if (!hadClass) {
                e.currentTarget.parentNode.classList.add('selected')
                const variation = e.currentTarget.parentNode.dataset.variation
                const startBar = codec.variation2bar(variation)
                config.startBarOfLastSelectedVariation = startBar
            }
        });

        $('.grid-brick .score').scroll((event) => {
            const score = event.currentTarget;
            const obj = event.currentTarget.parentNode;
            if (score.scrollLeft <= 0) {
                score.style['border-radius'] = "0 3rem 3rem 0"
            } else if (obj.clientWidth <= score.scrollLeft + score.clientWidth) {
                score.style['border-radius'] = "3rem 0 0 3rem"
            } else {
                score.style['border-radius'] = "3rem 3rem 3rem 3rem"
            }
        })
    }
}


export default Ω
