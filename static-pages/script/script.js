$(document).ready(function () {

    $('#feedContainer').scroll(function () {

        var scrollTop = $(this).scrollTop();

        $('#feedBannerImage').css({
            'transform': 'skewX(4.5deg) scale(' + (1.5 - scrollTop * 0.001) +')',
            '-webkit-filter': 'blur(' + (scrollTop * 0.03) + 'px)'
        });

    });

});
