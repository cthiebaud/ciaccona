import jquery from 'https://cdn.jsdelivr.net/npm/jquery@3.6.4/+esm'
import { setCookie } from "/js/_utils2.js"
/*
import jsYaml from 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/+esm'
*/

const $ = jquery

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

                $("code#artists").load('/_artists.yaml', function (response, status, xhr) {
                    if (status == "success") {
                        Prism.highlightElement(this)
                    }
                    $("code#thanks").load('/_thanks.yaml', function (response, status, xhr) {
                        if (status == "success") {
                            Prism.highlightElement(this)
                            $('#credits').show()
                        }
                    })
                })
            })
            $('footer.footer').show()

            $('#gridContainerCol, #grid, .grid.brick, .brick, .score, #playerWrapper').css({ visibility: 'hidden' })
        }

        this.hideAbout = () => {
            $('a#about > div').html("About&hellip;")

            $('body').removeClass('about')

            $('header.header').hide()
            $('div.fullscreen.siegel#logoLeft').hide()
            $('div.fullscreen.siegel#logoRight').hide()
            $('#credits').hide()
            $('footer.footer').hide()

            $('#gridContainerCol, #grid, .grid.brick, .brick, .score, #playerWrapper').css({ visibility: 'visible' })
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

    setClickHandlers: (fullWidthChecked, showHelpAtStartChecked, iso) => {
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
            setCookie('scoreDisplay', scoreDisplay )
            if (scoreDisplay === 'firstBar') {
                $('#gridContainerCol').removeClass('fullwidth')
                $('.grid-brick:not(.hasPerformer), .score').removeClass('fullwidth')
                $('.score').css({visibility: 'visible'})
            } else if (scoreDisplay === 'fullScore') {
                $('#gridContainerCol').addClass('fullwidth')
                $('.grid-brick:not(.hasPerformer), .score').addClass('fullwidth')
                $('.score').css({visibility: 'visible'})
            } else if (scoreDisplay === 'noScore') {
                $('#gridContainerCol').removeClass('fullwidth')
                $('.grid-brick:not(.hasPerformer), .score').removeClass('fullwidth')
                $('.score').css({visibility: 'hidden'})
            } 
            if (iso) iso.layout()
        })

        $("#fullWidthChecked").on("click", function () {
            fullWidthChecked = !fullWidthChecked
            setCookie('fullscore', fullWidthChecked ? 'true' : 'false')
            if (fullWidthChecked) {
                $('#gridContainerCol').addClass('fullwidth')
                $('.grid-brick, .score').addClass('fullwidth')
            } else {
                $('#gridContainerCol').removeClass('fullwidth')
                $('.grid-brick, .score').removeClass('fullwidth')
            }
            if (iso) iso.layout()
        })
        $("#helpAtStartCheck").on("click", function () {
            showHelpAtStartChecked = !showHelpAtStartChecked
            setCookie('showHelpAtStart', showHelpAtStartChecked ? 'true' : 'false', 30) // one month
        })
    },

    showArtist: (artist) => {
        $('.artist .name').html(artist.fullname === "Christophe Thiebaud" ? "Moi" : artist.fullname)
        $('.artist .url').attr({
            href: artist['▶'].youtubeTrueUrl ? artist['▶'].youtubeTrueUrl : artist['▶'].youtubeUrl,
            target: artist['▶'].id
        })
        $('.artist a#social').attr({
            href: artist.social
        })
        $('.artist, .artist .brick').css({ visibility: "visible" })
    },

    beforeCreatePlayer: (videoId) => {
        const idPlayer = "blah2"

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

    afterCreateColoredBadges: (fullWidthChecked, iso, scoreDisplay) => {
        if (fullWidthChecked) {
            $('#gridContainerCol').addClass('fullwidth')
            $('.grid-brick, .score').addClass('fullwidth')
            if (iso) iso.layout()
        }

        if (scoreDisplay === 'firstBar') {
            $('#gridContainerCol').removeClass('fullwidth')
            $('.grid-brick:not(.hasPerformer), .score').removeClass('fullwidth')
            $('.grid-brick, .score').css({visibility: 'visible'})
        } else if (scoreDisplay === 'fullScore') {
            $('#gridContainerCol').addClass('fullwidth')
            $('.grid-brick:not(.hasPerformer), .score').addClass('fullwidth')
            $('.grid-brick, .score').css({visibility: 'visible'})
        } else if (scoreDisplay === 'noScore') {
            $('#gridContainerCol').removeClass('fullwidth')
            $('.grid-brick:not(.hasPerformer), .score').removeClass('fullwidth')
            $('.grid-brick, .score').css({visibility: 'hidden'})
        } 
        if (iso) iso.layout()



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
