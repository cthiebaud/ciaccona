import jquery from 'https://cdn.jsdelivr.net/npm/jquery@3.6.4/+esm'
import { setCookie } from "/index2_utils.js"

const $ = jquery

const Ω = {
    boot: () => {
        console.log('jquery is here', $)
        return true
    },

    About: function () {
        this.about = false;
        this.showAbout = () => {
            $('a#about > div').html("&check;&nbsp;About&hellip;")
            $('header.header').show()
            $('div.fullscreen.siegel#logoLeft').css({ left: "-111vw" }).show().animate({ left: 0 }, 2000)
            $('div.fullscreen.siegel#logoRight').css({ left: "+111vw" }).show().animate({ left: 0 }, 2000)
            $('footer.footer').show()

            $('body').css({ backgroundColor: '#ffffff40' })
            $('#gridContainerCol, #grid, .grid.brick, .brick, .score').css({ visibility: 'hidden' })
            $('#playerWrapper').css({ opacity: .25 })
        }

        this.hideAbout = () => {
            $('a#about > div').html("About&hellip;")

            $('header.header').hide()
            $('div.fullscreen.siegel#logoLeft').hide()
            $('div.fullscreen.siegel#logoRight').hide()
            $('footer.footer').hide()

            $('body').css({ backgroundColor: '#0e0e10' })
            $('#gridContainerCol, #grid, .grid.brick, .brick, .score').css({ visibility: 'visible' })
            $('#playerWrapper').css({ opacity: 1 })
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

    setClickHandlers: (fullWidthChecked) => {
        const url = new URL(window.location)

        $('a[data-yt]').on('click', (e) => {
            let location = `${url.pathname}?yt=${e.currentTarget.dataset.yt}`
            console.log("clicked!", e, location)
            window.location = location
        })
        $('a#home').on('click', (e) => {
            window.location = url.pathname
        })
        $("#dropdownCheck").on("click", function () {
            fullWidthChecked = !fullWidthChecked
            setCookie('fullscore', fullWidthChecked ? 'true' : 'false')
            if (fullWidthChecked) {
                $('#gridContainerCol').addClass('fullwidth')
                $('.grid-brick, .score').addClass('fullwidth')
            } else {
                $('#gridContainerCol').removeClass('fullwidth')
                $('.grid-brick, .score').removeClass('fullwidth')
            }
            $("#grid").isotope('layout')
        })
    },

    setArtist: (id, artist) => {
        $('.artist .name').html(artist === "Christophe Thiebaud" ? "Moi" : artist)
        $('.artist .url').attr({
            href: `https://youtu.be/${id}`,
            target: id
        })
        $('.artist, .artist .brick').css({ visibility: "visible" })
    },
    beforeCreatePlayer: (videoId) => {
        const idPlayer = "blah2"

        $("body").css({ "background-color": "#0E0E10" })
        $('#loading').css({ "background-color": "#00000080" })
        $('#gridContainerCol').css({ visibility: 'hidden' }).addClass('push2right')

        const $blah2 = $(`<div id="${idPlayer}" data-plyr-provider="youtube" data-plyr-embed-id="${videoId}">`)

        $("#playerWrapper").append($blah2)

        return '#' + idPlayer
    },
    afterCreatePlayer: () => {
        $('#playerWrapper').css({ visibility: "visible" })
        $('#gridContainerCol').css({ visibility: 'visible' })
    },

    afterCreateColoredBadges: (fullWidthChecked) => {
        if (fullWidthChecked) {
            $('#gridContainerCol').addClass('fullwidth')
            $('.grid-brick, .score').addClass('fullwidth')
            $("#grid").isotope('layout')
        }

        $(".brick").click(function (e) {
            const hadClass = $(e.currentTarget).parent().hasClass('playing')
            $('.grid-brick.playing .score').scrollLeft(0)
            $('.grid-brick.playing').removeClass('playing')
            if (!hadClass) {
                $(e.currentTarget).parent().addClass('playing')
            }
        });

        $('.grid-brick .score').scroll((event) => {
            const score = event.currentTarget;
            const obj = event.currentTarget.parentNode;
            // console.log(score.clientWidth, obj.clientWidth, score.scrollLeft)
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
