import jquery from 'https://cdn.jsdelivr.net/npm/jquery@3.6.4/+esm'
import config from "/js/config-1.js"

const $ = jquery

function showScoreDisplay(iso) {
    document.getElementById('grid').dataset.scoreDisplay = config.scoreDisplay 
    if (config.scoreDisplay === 'firstBar') {
        $('#gridContainerCol').removeClass('fullwidth')
        $('.grid-brick:not(.hasPerformer), .score').removeClass('fullwidth')
        $('.score').css({ visibility: 'inherit' })
    } else if (config.scoreDisplay === 'fullScore') {
        $('#gridContainerCol').addClass('fullwidth')
        $('.grid-brick:not(.hasPerformer), .score').addClass('fullwidth')
        $('.score').css({ visibility: 'inherit' })
    } else if (config.scoreDisplay === 'noScore') {
        $('#gridContainerCol').removeClass('fullwidth')
        $('.grid-brick:not(.hasPerformer), .score').removeClass('fullwidth')
        $('.score').css({ visibility: 'hidden' })
    }
    if (iso) iso.layout()
}

const Ω = {
    boot: () => {
        console.log('jquery is here')
        return true
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

        $("#firstBarChecked, #fullScoreChecked, #noScoreChecked").on("click", function (e) {
            const scoreDisplay = e.currentTarget.dataset.scoreDisplay
            config.scoreDisplay = scoreDisplay
            showScoreDisplay()
        })
    },

    showArtist: (artist) => {
        const $artist = $('.grid-brick.artist#gb-artist');

        $artist.css({ visibility: "inherit" })
        $artist.find('.fullname').html(artist.fullname === "Christophe Thiebaud" ? "Moi" : artist.fullname)
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
        $('#gridContainerCol').addClass('push2right') // css({ visibility: 'hidden' })

        const $blah2 = $(`<div id="${idPlayer}" data-plyr-provider="youtube" data-plyr-embed-id="${videoId}">`)

        $("#playerWrapper").append($blah2)

        return '#' + idPlayer
    },

    afterCreatePlayer: () => {
        $('#playerWrapper').css({ visibility: "visible" })
        $('#gridContainerCol').css({ visibility: 'visible' })
    },

    afterCreateColoredBadges: (iso) => {

        showScoreDisplay(iso)

        $(".brick.hasScore").click(function (e) {
            const hadClass = $(e.currentTarget).parent().hasClass('selected')
            $('.grid-brick.selected .score').scrollLeft(0)
            $('.grid-brick.selected').removeClass('selected')
            if (!hadClass) {
                $(e.currentTarget).parent().addClass('selected')
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


export { Ω }
