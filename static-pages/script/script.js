$(document).ready(function () {
    $('#feedContainer').scroll(function () {
        var scrollTop = $(this).scrollTop();
        var opacityVal = 1 - scrollTop * 0.001;
        var scaleVal = 1.2 - scrollTop * 0.001;
        var topVal = - scrollTop;
        $('#feedBanner').css({
            'opacity': opacityVal,
            'top': topVal,
        });
        $('#feedBannerImage').css({
            'transform': 'skewX(4.5deg) scale(' + scaleVal +')'
        });
    });
});
