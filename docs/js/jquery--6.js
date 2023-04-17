import jquery from 'https://cdn.jsdelivr.net/npm/jquery@3.6.4/+esm'
import config from "/js/config--6.js"
import codec from "/js/structure--6.js"

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
                $(id).css({ visibility: 'inherit', width: '0'}).animate({ width: `${id.dataset.width}px` }, speed, "linear", () => {
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
        this.showAbout = () => {
            $('a#about > div').html("&check;&nbsp;About&hellip;")

            $('body').addClass('about')

            $('header.header').show()
            $('div.fullscreen.siegel#logoLeft').css({ left: "-111vw" }).show().animate({ left: 0 }, 2000)
            $('div.fullscreen.siegel#logoRight').css({ left: "+111vw" }).show().animate({ left: 0 }, 2000, undefined, () => {
                $("code#thanks").load('/_thanks.yaml', function (response, status, xhr) {
                    if (status == "success") {
                        Prism.highlightElement(this)
                        $('#credits').show()
                    }
                })
            })
            $('footer.footer').show()

            $('#gridContainerCol, #playerWrapper').css({ visibility: 'hidden' })
        }

        this.hideAbout = () => {
            $('a#about > div').html("About&hellip;")

            $('body').removeClass('about')

            $('header.header').hide()
            $('div.fullscreen.siegel#logoLeft').hide()
            $('div.fullscreen.siegel#logoRight').hide()
            $('#credits').hide()
            $('footer.footer').hide()

            $('#gridContainerCol, #playerWrapper').css({ visibility: 'visible' })
        }
        const _this = this
        $('a#about').on('click', (e) => {
            if (_this.about) {
                _this.hideAbout()
            } else {
                _this.showAbout()
            }
            _this.about = !_this.about
        })
    },

    setClickHandlers: (iso) => {
        const url = new URL(window.location)

        $('a[data-name-no-space-lowercase-no-diacritics]').on('click', (e) => {
            let location = `${url.pathname}video/${e.currentTarget.dataset.nameNoSpaceLowercaseNoDiacritics}.html`
            window.location = location
        })

        $('a#home').on('click', (e) => {
            window.location = url.pathname
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
