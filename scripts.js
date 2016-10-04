/**
 * Created by Madila on 22/09/2016.
 */
/**
 * Created by ruben on 20/09/2015.
 */
// Ensure fonts are loaded, then trigger the app.
jQuery.noConflict();
(function( $ ) {
    $(function() {

        window.fbAsyncInit = function() {
            FB.init({
                appId      : '632855303452563',
                xfbml      : true,
                version    : 'v2.5'
            });
        };

        // on Document Ready async loading of external js assets
        $(window).load(function() {

            (function(doc, script) {
                var js,
                    fjs = doc.getElementsByTagName(script)[0],
                    add = function(url, id) {
                        if (doc.getElementById(id)) {return;}
                        js = doc.createElement(script);
                        js.src = url;
                        js.async = true;
                        js.onload = js.onreadystatechange = function() {
                            $(document).trigger(id+'-loaded', [id]);
                        };
                        id && (js.id = id);
                        fjs.parentNode.insertBefore(js, fjs);
                    };

                // Mailchimp
                //add('//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js', 'mc');
                // Google Platform
                //add('https://apis.google.com/js/platform.js');
                //Google Ads
                //add('//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', 'adsbygoogle');
                // Facebook SDK
                //add('//connect.facebook.net/es_ES/all.js', 'facebook-jssdk');
                // Twitter SDK
                add('//platform.twitter.com/widgets.js', 'twitter-wjs');
                // Analytics
                add('//www.google-analytics.com/analytics.js', 'ga');
            }(document, 'script'));

        });

        // Specific Callbacks

        $(document).on('adsbygoogle-loaded', function() {
            //try{
            //    (adsbygoogle = window.adsbygoogle || []).push({});
            //} catch(ex){}
        });

        $(document).on('ga-loaded', function() {
            //console.log('google analytics setup');
            ga('create', 'UA-85042710-1', 'other.co.uk');
            ga('send', 'pageview');
        });

        $(document).on('twitter-wjs-loaded', function() {
            window.twttr.events.bind(
                'rendered',
                function (event) {
                    var blog = $('.blog-masonry');
                    if(blog.length > 0) {
                        blog.masonry({
                            itemSelector: 'article.post'
                        });
                    }
                }
            );
        });

        $(document).on('SiteReady SiteRefresh', function() {
            if(window.ga) {
                //console.log(window.location.href);
                ga('set', 'page', window.location.href);
                ga('send', 'pageview');
            }
            if (window.twttr) {
                window.twttr.widgets.load();
            }
        });

    });
})(jQuery);
/**
 * Created by Madila on 30/09/2016.
 */
jQuery(document).ready(function($) {
    $('.btn-down.reverse-up').on('click', function(e) {
        e.preventDefault();
        var element_id = $(this).data('target');

            var $element = $(element_id);

            console.log($element);

            if($element.length > 0) {
                var scrollTo = $element.offset().top;

                $('html, body').animate({
                    scrollTop: scrollTo - 100
                }, 300);
            }

    });
});

/**
 * Created by Madila on 14/07/2016.
 */
jQuery.noConflict();
(function ($) {
    $(function () {

        $(document).on('SiteRefresh SiteReady', function () {
            $('.dropdown-menu a[data-toggle="collapse"]').on('click', function(e) {
                var $target = $(this).data('target');
                $($target).collapse('hide');
            });
        });

    });
})(jQuery);
/* Google uses this function in a callback. */
var $google_maps;

function renderMap() {
    var geocoder = new google.maps.Geocoder();
    var $ = jQuery,
    $google_maps = $('.google-map');

    $google_maps.each(function() {
        var $this = $(this);

        if($this.is('[data-address]')) {


            var coords = new google.maps.LatLng( 0, 0 );
            //var styledMapType = [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}];

            var isDraggable = !('ontouchstart' in document.documentElement);
            var mapOptions = {
                center: coords,
                zoom: 16,
                //styles: styledMapType,
                draggable: isDraggable,
                scrollwheel: false
            };

            var map = new google.maps.Map(this, mapOptions);

            this.google_map = map;
            this.google_map_center = coords;

            var address = $this.data('address');
            var the_map = this;

            var image = $this.data('icon'),
                iconElement = new Image();
            iconElement.src = image;

            iconElement.onload = function() {
                geocoder.geocode( { 'address': address}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                        the_map.google_map_center = results[0].geometry.location;

                        console.log(iconElement.width, iconElement.height);

                        var marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location,
                            icon: {
                                url: image,
                                anchor: new google.maps.Point((iconElement.width / 2), iconElement.height),
                                size: new google.maps.Size(iconElement.width, iconElement.height),
                                origin: new google.maps.Point(0, 0)
                            }
                        });
                    } else {
                        console.log("failed to locate");
                    }
                });
            };

        } else {
            var map = new google.maps.Map(this, {
                center: {lat: $(this).data('lat'), lng: $(this).data('lng')},
                zoom: 16
            });
            var image = $this.data('icon');
            var marker = new google.maps.Marker({
                map: map,
                position: {lat: $(this).data('lat'), lng: $(this).data('lng')},
                icon: {
                    url: image,
                    anchor: new google.maps.Point(8, 130),
                    size: new google.maps.Size(151, 135),
                    origin: new google.maps.Point(0, 0)
                }
            });
            this.google_map = map;
            this.google_map_center = {lat: $(this).data('lat'), lng: $(this).data('lng')};

        }
    });

    google.maps.event.addDomListener(window, 'resize', function () {
        $google_maps.each(function() {
            this.google_map.setCenter(this.google_map_center);
        });
    });
}

function initMap() {
    var $ = jQuery,
        $google_maps = $('.google-map');
    if($google_maps.length > 0) {

        var $script = $('#google-map-api');

        if($script.length > 0) {
            renderMap();
        } else {

            var gm = document.createElement('script');
            gm.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB3oaih_ncHtyFooWHeZKrLVAav_R3S5J4';
            gm.type = 'text/javascript';
            gm.async = 'true';
            gm.id = 'google-map-api';
            gm.onload = gm.onreadystatechange = function() {
                renderMap();
            };
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(gm, s);

        }


    }
}

jQuery( window ).on('SiteReady SiteRefresh', function() {
    initMap();
});
/**
 * Created by Madila on 22/09/2016.
 */
jQuery.noConflict();
(function ($) {
    $(function () {

        $(document).on('SiteRefresh SiteReady', function() {
            var blog = $('.blog-masonry');
            if(blog.length > 0) {
                blog.masonry({
                    itemSelector: 'article.post'
                });
            }
        });

    });
})(jQuery);
(function($) {
    $(function() {
/*

        function animateScrollTop(target, duration) {
            duration = duration || 16;

            var $window = $('html, body');
            var scrollTopProxy = { value: $window.scrollTop() };
            var expectedScrollTop = scrollTopProxy.value;

            console.log(target.offset());

            $($window).animate(
                { scrollTop: target.offset().top },
                {
                    duration: duration,

                    step: function (stepValue) {
                        var roundedValue = Math.round(stepValue);
                        if ($window.scrollTop() !== expectedScrollTop) {
                            // The user has tried to scroll the page
                            $(scrollTopProxy).stop();
                        }
                        $window.scrollTop(roundedValue);
                        expectedScrollTop = roundedValue;
                    },

                    complete: function () {
                        if ($window.scrollTop() != target) {
                            setTimeout(function () {
                                animateScrollTop(target);
                            }, 16);
                        }
                    }
                }
            );
        }
*/
        var siteScrolled = false;

        function otherOnScrollHandler(e) {
            var sections = $('section[id]');
            var currentSection = null;

            var found = false;

            var currentScrollAmount = $(window).scrollTop();

            if(currentScrollAmount > 100 && siteScrolled == false) {
                $('body').addClass('site-scrolled');
                siteScrolled = true;
            } else if(currentScrollAmount <= 100 && siteScrolled == true) {
                $('body').removeClass('site-scrolled');
                siteScrolled = false;
            }

            sections.each(function() {
                var tempSection = $(this);
                if (tempSection.visible(true)) {
                    found = true;
                    currentSection = tempSection;
                }
            });

            if(!found) {
                currentSection = null;
            }

            if (currentSection != null) {
                if(!currentSection.hasClass('active')) {
                    var target = currentSection.attr('id');
                    sections.removeClass('active');
                    var targetLink = $('.nav-link[href="#' + target + '"]');

                    if (targetLink.length > 0) {
                        var parentLi = targetLink.parent('li');
                        var siblingLis = parentLi.parents('ul').find('li');
                        siblingLis.removeClass('active');
                        parentLi.addClass('active');
                    } else {
                        $('#site-navigation').find('.active').removeClass('active');
                    }
                    currentSection.addClass('active');
                }
            } else {
                sections.removeClass('active');
                $('#site-navigation').find('.active').removeClass('active');
            }
        }

        function otherOnMenuLinkClick(e) {
            e.preventDefault();
            var element_id = $(this).attr('href');
            var $element = $(element_id);

            if($element.length > 0) {
                var scrollTo = $element.offset().top;

                $('html, body').animate({
                    scrollTop: scrollTo - 50
                }, 300);
            }
        }

        $(window).on('SiteReady SiteRefresh', function() {
            scrollElement = $('html, body');
            $(window).on('scroll', otherOnScrollHandler);
            $('#site-navigation').find('a[href^="#"]').on('click', otherOnMenuLinkClick);
            $('a[data-scroll]').on('click', otherOnMenuLinkClick);
        });

        $(window).on('SiteRefresh', function() {
            $('[unresolved]').removeAttr('unresolved');
        });

    });
}(jQuery));
/**
 * Created by Madila on 15/08/2016.
 */

window.appbrowser = {};

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
            || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
        deferTimer;
    return function () {
        var context = scope || this;

        var now = +new Date,
            args = arguments;
        if (last && now < last + threshhold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
            }, threshhold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
}

var hasPrefix = function () {
    var styles = window.getComputedStyle(document.documentElement, ''),
        pre = (Array.prototype.slice
                .call(styles)
                .join('')
                .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1],
        dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
    return {
        dom: dom,
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1)
    };
};

/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
var detectIE = function() {
    var ua = window.navigator.userAgent;

    // Test values; Uncomment to check result �

    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

    // Edge 12 (Spartan)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

    // Edge 13
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
};

var version = detectIE();

if (version === false) {
    window.appbrowser.name = false;
    window.appbrowser.version = false;
} else if (version >= 12) {
    window.appbrowser.name = 'Edge';
    window.appbrowser.version = version;
} else {
    window.appbrowser.name = 'IE';
    window.appbrowser.version = version;
}

window.appbrowser.prefix = hasPrefix();

jQuery.noConflict();
(function ($) {
    $(function () {

        function wheel(event) {
            if (event.wheelDelta) delta = event.wheelDelta / 120;
            else if (event.detail) delta = -event.detail / 3;

            handle();
            if (event.preventDefault) event.preventDefault();
            event.returnValue = false;
        }

        function handle() {

            $('html, body').stop().animate({
                scrollTop: $(window).scrollTop() - (distance * delta)
            }, time);
        }

        var time = 200;
        var distance = 400;

        var ieScroll = function() {
            if(window.appbrowser.name && window.appbrowser.version) {
                if (window.addEventListener) window.addEventListener('DOMMouseScroll', wheel, false);
                window.onmousewheel = document.onmousewheel = wheel;

                $(document).keydown(function (e) {

                    switch (e.which) {
                        //up
                        case 38:
                            e.preventDefault();
                            $('html, body').stop().animate({
                                scrollTop: $(window).scrollTop() - distance
                            }, time);
                            break;

                        //down
                        case 40:
                            e.preventDefault();
                            $('html, body').stop().animate({
                                scrollTop: $(window).scrollTop() + distance
                            }, time);
                            break;
                    }
                });
            }
        };

        var parallax = function ($ele, $threshold, scrollTop, viewportRevealed, callback) {
            if($ele.length > 0 && $threshold.length > 0) {
                var _thresholdHeight = $threshold.height(),
                    _offsetTop = $threshold.offset().top;

                if (viewportRevealed > _offsetTop && scrollTop < (_offsetTop + _thresholdHeight)) {
                    var _elementScrolled = scrollTop - ($threshold.offset().top),
                        _ratio = (_elementScrolled / _thresholdHeight);


                        callback($ele, _ratio, $threshold);

                }
            }
        };

        /*
        var callback = function($ele, _ratio) {
            window.requestAnimationFrame(function(_ratio) {
                $ele.css(window.appbrowser.prefix.css+'transform', 'translate3d(0px, '+_ratio+'px, 0px');
            });
        };*/

        $(window).on('SiteReady SiteRefresh', function() {
            ieScroll();
        });

        $(window).on('SiteReady SiteRefresh', function() {

            console.log(window.appbrowser.prefix.css);

            var landing = $("#landing"),
                ourwork = $("#our-work"),
                blog = $("#blog"),
                playground = $('#playground');


            var parallax_sections = [
                {
                    "parent": landing,
                    "selector": ".scene",
                    "callback": function($ele, _ratio, $parent) {

                        window.requestAnimationFrame(function () {
                            $ele.find('.entry-content').css(window.appbrowser.prefix.css + 'transform', 'translate3d(0px, ' + (_ratio * ($parent.height() * -0.4)) + 'px, 0px');
                            $ele.find('.twenty-ani').css(window.appbrowser.prefix.css + 'transform', 'translate3d(0px, ' + (_ratio * ($parent.height() * -0.35)) + 'px, 0px');
                            $ele.find('.bg-clouds-one').css(window.appbrowser.prefix.css + 'transform', 'translate3d(0px, ' + (_ratio * ($parent.height() * -0.2)) + 'px, 0px');
                            $ele.find('.bg-clouds-two').css(window.appbrowser.prefix.css + 'transform', 'translate3d(0px, ' + (_ratio * ($parent.height() * 0.1)) + 'px, 0px');

                            $ele.find('.bg-wrapper-one').css(window.appbrowser.prefix.css + 'transform', 'translate3d(0px, ' + (_ratio * ($parent.height() * 0.1)) + 'px, 0px');
                            $ele.find('.bg-wrapper-two').css(window.appbrowser.prefix.css + 'transform', 'translate3d(0px, ' + (_ratio * ($parent.height() * 0.25)) + 'px, 0px');
                        });
                    }
                },
                {
                    "parent": ourwork,
                    "selector": ".scene",
                    "callback": function($ele, _ratio, $parent) {

                        window.requestAnimationFrame(function () {
                            $ele.find('.bg-clouds-two').css(window.appbrowser.prefix.css + 'transform', 'translate3d(0px, ' + (_ratio * ($parent.height() * -0.4)) + 'px, 0px');

                            $ele.find('.bg-wrapper-one').css(window.appbrowser.prefix.css + 'transform', 'translate3d(0px, ' + (_ratio * ($parent.height() * -0.5)) + 'px, 0px');
                            $ele.find('.bg-wrapper-two').css(window.appbrowser.prefix.css + 'transform', 'translate3d(0px, ' + (_ratio * ($parent.height() * -0.35)) + 'px, 0px');
                        });
                    }
                },
                {
                    "parent": blog,
                    "selector": ".scene",
                    "callback": function($ele, _ratio, $parent) {

                        window.requestAnimationFrame(function () {
                            $ele.find('.bg-clouds-one').css(window.appbrowser.prefix.css + 'transform', 'translate3d(0px, ' + (_ratio * ($parent.height() * -0.3)) + 'px, 0px');
                            $ele.find('.bg-clouds-two').css(window.appbrowser.prefix.css + 'transform', 'translate3d(0px, ' + (_ratio * ($parent.height() * -0.15)) + 'px, 0px');

                            $ele.find('.bg-wrapper-one').css(window.appbrowser.prefix.css + 'transform', 'translate3d(0px, ' + (_ratio * ($parent.height() * -0.3)) + 'px, 0px');
                            $ele.find('.bg-wrapper-two').css(window.appbrowser.prefix.css + 'transform', 'translate3d(0px, ' + (_ratio * ($parent.height() * -0.5)) + 'px, 0px');
                        });
                    }
                },
                {
                    "parent": playground,
                    "selector": ".scene",
                    "callback": function($ele, _ratio, $parent) {

                        window.requestAnimationFrame(function () {
                            $ele.find('.bg-clouds-one').css(window.appbrowser.prefix.css + 'transform', 'translate3d(0px, ' + (_ratio * ($parent.height() * -0.3)) + 'px, 0px');
                            $ele.find('.bg-clouds-two').css(window.appbrowser.prefix.css + 'transform', 'translate3d(0px, ' + (_ratio * ($parent.height() * -0.15)) + 'px, 0px');

                            $ele.find('.bg-wrapper-one').css(window.appbrowser.prefix.css + 'transform', 'translate3d(0px, ' + (_ratio * ($parent.height() * -0.4)) + 'px, 0px');
                            $ele.find('.bg-wrapper-two').css(window.appbrowser.prefix.css + 'transform', 'translate3d(0px, ' + (_ratio * ($parent.height() * -0.5)) + 'px, 0px');
                        });
                    }
                }
            ];

            $(window).on('scroll', throttle(function() {
                var scrollTop = $(window).scrollTop(),
                    viewportRevealed = scrollTop + window.outerHeight;
                //parallax($('#one'), $('#som-1'), scrollTop, viewportRevealed, callback);
                for (var i = 0, len = parallax_sections.length; i < len; i++) {
                    parallax(parallax_sections[i].parent.find(parallax_sections[i].selector), parallax_sections[i].parent, scrollTop, viewportRevealed, parallax_sections[i].callback);
                }
            }, 24));
            $(window).on('resize', function() {
                var windowW = window.outerWidth;
            });
        });

    });
})(jQuery);
(function($) {
    $(function() {
        $(window).on('SiteReady SiteRefresh', function() {

            $("#blog .blog-row").slick({
                slide : 'article',
                prevArrow: '<button type="button" data-role="none" class="slick-prev slick-arrow" aria-label="Previous" role="button"><i class="icon chevron-white-left"></i></button>',
                nextArrow: '<button type="button" data-role="none" class="slick-next slick-arrow" aria-label="Next" role="button"><i class="icon chevron-white-right"></i></button>',
                infinite: true,
                mobileFirst: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                responsive: [
                    {
                        breakpoint: 545,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3
                        }
                    }
                ]
            });

            var $studySlider = $(".study-slider");
            if($studySlider.length > 0) {
                $(".study-slider").slick({
                    'slide': '.study-slide',
                    'prevArrow': '<button type="button" data-role="none" class="slick-prev slick-arrow" aria-label="Previous" role="button"><i class="icon chevron-thin-left"></i></button>',
                    'nextArrow': '<button type="button" data-role="none" class="slick-next slick-arrow" aria-label="Next" role="button"><i class="icon chevron-thin-right"></i></button>',
                    'infinite': false
                });
            }


            var $container = $("#our-work .grid-row");

            if($container.length > 0) {
                console.log($container);
                $container.slick({
                    slide: '.grid-item',
                    prevArrow: '<button type="button" data-role="none" class="slick-prev slick-arrow" aria-label="Previous" role="button"><i class="icon chevron-thin-left"></i></button>',
                    nextArrow: '<button type="button" data-role="none" class="slick-next slick-arrow" aria-label="Next" role="button"><i class="icon chevron-thin-right"></i></button>',
                    mobileFirst: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    responsive: [
                        {
                            breakpoint: 767,
                            settings: "unslick"
                        },
                        {
                            breakpoint: 625,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3
                            }
                        }
                    ]
                });

                $(window).on('resize', $.throttle(50, function () {
                    if (window.innerWidth < 767 && !$container.hasClass('slick-initialized')) {
                        $container.slick('reinit');
                    }
                }));
            }
        });
    });
}(jQuery));
var smoothState;
function initiateSmoothState() {
    var options = {
        prefetch: true,
        cacheLength: 2,
        debug: true,
        forms: '.search-form',
        blacklist: '.no-transit, .gallery a, .no-transit a, a[target="_new"], a[rel="lightbox"], a[target="_blank"]',
        alterRequest: function (request) {
            return request;
        },
        onStart: {
            duration: 800, // Duration of our animation
            render: function ($container) {
                // Add your CSS animation reversing class
                $container.addClass('is-exiting');

                jQuery('html, body').animate({
                    scrollTop: 0
                }, 400);

                // Restart your animation
                smoothState.restartCSSAnimations();

                console.log("Loaded 1");
            }
        },
        onProgress: {
            duration: 400,
            render: function ($container) {
                jQuery('html').addClass('is-loading');
                console.log("Loaded 2");
            }
        },
        onReady: {
            duration: 800,
            render: function ($container, $newContent) {
                // Inject the new content
                $container.html($newContent);
                // Remove your CSS animation reversing class
                $container.removeClass('is-exiting').addClass('is-entering');

                jQuery(document).trigger('SiteRefresh');

                console.log("Loaded 3");

            }
        },
        onAfter: function ($container, $newContent) {
            $container.removeClass('is-entering is-reversing');
            jQuery('html').removeClass('is-loading');
        }
    };

    smoothState = jQuery('#site-canvas').smoothState(options).data('smoothState');

    window.onpopstate = function (e) {
        jQuery('#site-canvas').addClass('is-reversing');
        if (e.state !== null) {
            var url = window.location.href,
                $page = jQuery('#' + e.state.id),
                page = $page.data('smoothState');

            if (page.href !== url && !jQuery.smoothStateUtility.isHash(url, page.href)) {
                page.load(url, false);
            }
        }
    };

}




(function ($) {
    'use strict';
    /*
     * On window load (after everything has been loaded, including images - I hope
     */

    jQuery(window).load(function () {
        $(document).trigger('SiteReady');
    });

    $(document).ready(function () {
        initiateSmoothState();
    });


}(jQuery));
/**
 * Created by Madila on 29/09/2016.
 */


jQuery(document).ready(function($) {

    $('#play-142 a').on('click', function(e) {
        e.preventDefault();
        var $this = $(this),
            $parent = $this.parents('.play-item'),
            $defcontainer = $this.find('.definition');

        $defcontainer.removeClass('in');
        $parent.addClass('spin');
        $('.island-element-4').addClass('fade');
        setTimeout(function() {
            $parent.removeClass('spin');
        }, 4000);

        // This does the ajax request
        $.ajax({
            url: ajaxparams.ajaxurl,
            dataType: 'json',
            data: {
                'action':'definition_ajax_request'
            },
            success:function(data) {
                // This outputs the result of the ajax request
                console.log(data[0]);
                var definition = '<div class="spinner-lights"></div><i class="flying-dictionary"></i><h2>'+data[0].post_title+'</h2><p>'+data[0].post_content+'</p><i class="icon spin-again"></i>';
                console.log(definition);
                $defcontainer.empty();
                $(definition).appendTo($defcontainer);
                $defcontainer.addClass('in');
            },
            error: function(errorThrown){
                $parent.removeClass('spin');
                console.log(errorThrown);
            }
        });
    });

});

(function($){

    /**
     * Copyright 2012, Digital Fusion
     * Licensed under the MIT license.
     * http://teamdf.com/jquery-plugins/license/
     *
     * @author Sam Sehnert
     * @desc A small plugin that checks whether elements are within
     *       the user visible viewport of a web browser.
     *       only accounts for vertical position, not horizontal.
     */
    var $w = $(window);
    $.fn.visible = function(partial,hidden,directionval){

        if (this.length < 1) {
            return;
        }

        var $t        = this.length > 1 ? this.eq(0) : this,
            t         = $t.get(0),
            vpWidth   = $w.width(),
            vpHeight  = $w.height() * 0.85,
            direction = (directionval) ? directionval : 'both',
            clientSize = hidden === true ? t.offsetWidth * t.offsetHeight : true;

        if (typeof t.getBoundingClientRect === 'function'){

            // Use this native browser method, if available.
            var rec = t.getBoundingClientRect(),
                tViz = rec.top    >= 0 && rec.top    <  vpHeight,
                bViz = rec.bottom >  0 && rec.bottom <= vpHeight,
                lViz = rec.left   >= 0 && rec.left   <  vpWidth,
                rViz = rec.right  >  0 && rec.right  <= vpWidth,
                vVisible   = partial ? tViz || bViz : tViz && bViz,
                hVisible   = partial ? lViz || rViz : lViz && rViz;

            if(direction === 'both') {
                return clientSize && vVisible && hVisible;
            } else if(direction === 'vertical') {
                return clientSize && vVisible;
            } else if(direction === 'horizontal') {
                return clientSize && hVisible;
            }
        } else {

            var viewTop         = $w.scrollTop() - 150,
                viewBottom      = viewTop + vpHeight,
                viewLeft        = $w.scrollLeft(),
                viewRight       = viewLeft + vpWidth,
                offset          = $t.offset(),
                _top            = offset.top,
                _bottom         = _top + $t.height(),
                _left           = offset.left,
                _right          = _left + $t.width(),
                compareTop      = partial === true ? _bottom : _top,
                compareBottom   = partial === true ? _top : _bottom,
                compareLeft     = partial === true ? _right : _left,
                compareRight    = partial === true ? _left : _right;

            if(direction === 'both') {
                return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop)) && ((compareRight <= viewRight) && (compareLeft >= viewLeft));
            } else if(direction === 'vertical') {
                return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop));
            } else if(direction === 'horizontal') {
                return !!clientSize && ((compareRight <= viewRight) && (compareLeft >= viewLeft));
            }
        }
    };

})(jQuery);
