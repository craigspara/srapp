/**
 * @namespace
 * @type {srapp|*|{}}
 */
var srapp = app.srapp || {};

/**
 *
 */
(function(srapp, $) {
    "use strict";

    /*
        A dev tool to see what has happened on the page.
        to include a function in object declare a new property at the top of the function set to an empty array the when function is initialized
        push to that property with the info you want included.
    */
    //srapp.pageRepository = {};

    /**
     *
     */
    srapp.init = function() {
        srapp.widgets.accordionify.init();
        //srapp.widgets.shoppify.init();
        srapp.widgets.animateify.init();
        srapp.widgets.revealer.init();
        //app.srapp.cardify();
        srapp.widgets.flexsliderify.init();
        srapp.widgets.featureify.init();
        //app.modStretchWide.init();

    };

})( window.app.srapp = window.app.srapp || {}, jQuery);

/* OLD:
 accordionify
 Loops through page elements with the class 'accordionify' and creates accordioned elements from its child nodes.

 REQUIREMENTS:
 A set of data attributes included on accordionify classed nodes, listed below. Please include full selector.
 - data-accorwrapper: the element that contains a single accordion
 - data-accortrigger: the trigger for the accordion
 - data-accorheader: the intial-state displayed content for the accordion
 - data-accorcontent: the initial-state hidden content for the accordion
 - data-accorbutton: a boolean to toggle the addition of a button to trigger the accordion
 */
(function (app, srapp, $) {
    "use strict";

    srapp.widgets = {};

    /**
     *
     * @param target
     * @param classname
     */
    function accorToggle( target, classname ) {

        target.toggleClass(classname);

    }

    /**
     * @name accordionify
     * @module
     * @public
     * @description
     * @type {{defaults: {accorWrapper: string, accorTrigger: string, accorHeader: string, accorContent: string, accorButton: boolean}, init: Function}}
     */
    srapp.widgets.accordionify = {

        // TODO: Add a function to pause the slideshow if a slide that contains an accordion is open. Restart slideshow when accordion closes.

        defaults: {
            accorWrapper: 'accor-source',
            accorTrigger: 'accor-trigger',
            accorHeader: 'accor-header',
            accorContent: 'accor-content',
            accorButton: true
        },

        init: function () {

            //srapp.pageRepository.accordions = [];

            var targets = $('.accordionify'); // collection of all instance of the accordionify widget on a page

            if ( targets.length > 0 ) {

                // enumerate over all instances of .accordionify
                jQuery.each( targets, function ( i, val ) {

                    var target = $(this), // the specific instance of the widget to be manipulated
                        accordions = {},
                        trigger = {};

                    // build configs from defaults and settings
                    srapp.util.configurator.buildConfigs( target, 'accor-options', srapp.widgets.accordionify );

                    if ( target.length > 0 ) {

                        // enumerate over each specific instance of .accordionify
                        jQuery.each( target, function( i, val ) {

                            accordions = $(this).find( '.' + srapp.widgets.accordionify.configs.accorWrapper );

                            // enumerate over each accorWrapper within a specific instance of .accordionify

                            jQuery.each( accordions, function( i, val ) {

                                var accordion = $(this);

                                if ( srapp.widgets.accordionify.configs.accorButton === true ) {

                                    accordion.prepend( '<div class="accor-button ' + srapp.widgets.accordionify.configs.accorTrigger + '">+</div>' );

                                }


                                if ( srapp.widgets.accordionify.configs.accorTrigger !== undefined ) {

                                    trigger = accordion.find( '.' + srapp.widgets.accordionify.configs.accorTrigger );

                                }


                                // Adds classes

                                accordion.addClass( 'accor-source' );

                                accordion.find( '.' + srapp.widgets.accordionify.configs.accorHeader ).addClass( 'accor-header' );

                                accordion.find( '.' + srapp.widgets.accordionify.configs.accorContent ).addClass( 'accor-content' );

                                trigger.on( 'click', function (el) {

                                    // trigger toggle to add .accorOpened class to accorContent and AccorButton
                                    accorToggle( accordion, 'accor-opened' );

                                });

                            });

                        });

                    }

                });
            }

        }

    };


    /**
     *
     * @param value
     * @param message
     * @returns {*}
     */
    function animateifyException( value, message ) {
        this.value = value;
        this.message = message;

        return console.log( 'animateify exception thrown: "' + value + '" ' + message );

    }

    /**
     * @name animateify
     * @module
     * @public
     * @description Cycles through the element of an array containing the direct children of the animateifyFrameWrapper, forward on first triggering, then backward on second triggering. Any element classes with 'animateify' will be animated. Accepts three parameters that can either be the default values or customized through the addition of a data-animateify-options attribute.
     * @type {{defaults: {animateifyFrameWrapper: string, animateifyTrigger: string, animateifyAnimationSpeed: number}, play: Function, init: Function}}
     */
    srapp.widgets.animateify = {

        defaults: {
            animateifyFrameWrapper: 'animateify-frame-wrapper',
            animateifyTrigger: 'animateify-animation-trigger',
            animateifyAnimationSpeed: 300

        },

        /**
         * @name Play
         * @description
         * @public
         * @param {array} animationFrames - an array of all the individual frames for the animation. Frames can be containers of elements or a single element.
         */
        play: function ( animationFrames ) {

            var frameCount = animationFrames.length,
                frameSpeed = srapp.widgets.animateify.configs.animateifyAnimationSpeed,
                frameIndex,
                animationDirection,
                prevFrameNum,
                nextFrameNum,
                animation;

            if ( $(animationFrames[0]).hasClass( 'animateify-current-frame' ) !== true ) {

                animationDirection = 'backward';
                frameIndex = frameCount - 1;

            } else {

                animationDirection = 'forward';
                frameIndex = 0;

            }

            switch ( animationDirection ) {
             case 'backward':

                 animation = setInterval( function() {

                     prevFrameNum = ( frameIndex%frameCount + ( frameCount - 1 ) )%frameCount;

                     $( animationFrames[prevFrameNum] ).addClass( 'animateify-current-frame' );
                     $( animationFrames[frameIndex] ).removeClass( 'animateify-current-frame' );

                     if ( prevFrameNum === 0 ) {

                         clearInterval(animation);
                         return;
                     }

                     frameIndex -= 1;

                 }, frameSpeed);

                break;
             case 'forward':

                 animation = setInterval( function() {

                     nextFrameNum = ( frameIndex%frameCount + ( frameCount + 1 ) )%frameCount;

                     $( animationFrames[nextFrameNum] ).addClass( 'animateify-current-frame' );
                     $( animationFrames[frameIndex] ).removeClass( 'animateify-current-frame' );

                     if ( nextFrameNum === frameCount - 1 ) {

                         clearInterval(animation);
                        return
                     }

                     frameIndex += 1;

                 }, frameSpeed);

                break;
             default:

                    console.log('error with animation direction');

             }

        },


        init: function () {
            //srapp.widgets.pageRepository.animateify = [];

            var targets = $( '.animateify' ); // collection of all instance of the animateify widget on a page

            if ( targets.length > 0 ) {

                // enumerate over all instances of .animateify
                jQuery.each( targets, function ( i, val ) {

                    var target = $(this), // the specific instance of the widget to be manipulated
                        animationFramesWrapper = {},
                        animationFrames,
                        animationFramesLength = 0,
                        animationTrigger;


                    // build configs from defaults and settings
                    srapp.util.configurator.buildConfigs( target, 'animateify-options', app.srapp.widgets.animateify );


                    // Update vars with configs values
                    animationFramesWrapper = target.find( '.' + srapp.widgets.animateify.configs.animateifyFrameWrapper );

                    // collect all animation frames into an array and store array length
                    animationFrames = animationFramesWrapper.children().toArray();
                    animationFramesLength = animationFrames.length;

                    // Find animation trigger
                    animationTrigger = target.find( '.' + srapp.widgets.animateify.configs.animateifyTrigger );


                    //Set required classes
                    animationFramesWrapper.addClass( 'animateify-frame-wrapper clearfix' );

                    for ( var j = 0; j < animationFramesLength; j += 1 ) {

                        // For each animation frame
                        $(animationFrames[j]).addClass( 'animateify-frame' );

                        // For currently active frame
                        $(animationFrames[0]).addClass( 'animateify-current-frame' );
                    }

                    // Add event to trigger animation
                    animationTrigger.on( 'click', function(el) {

                        srapp.widgets.animateify.play( animationFrames );

                    });

                });

            }
        }
    };

    /**
     * @name setFirstFeatureItem
     * @description function called by init to copy first slide into the feature-wrapper.
     * @private
     * @param {object} source : contains indexed array-like object of feature-items
     * @param {object} destination : container for feature-item
     */
    function setFirstFeatureItem( source, destination ) {

        // Filter cloned slides from flexslider (if present)
        var snippet = source.not('.clone').first();

        swapFeatureItem ( snippet, destination );
        setFeatureItemActiveClass( source, snippet );
    }

    /**
     * @name swapFeaturedItem
     * @description Event driven function to copy triggered featured-item html fragment into the feature-wrapper.
     * @private
     * @param {object} snippet : contains indexed array-like object of feature-items
     * @param {object} destination : container for feature-item
     */
    function swapFeatureItem ( snippet, destination ) {

        destination.html(snippet.html());

    }

    /**
     * @name setFeatureItemActiveClass
     * @description
     * @param {object} source : contains indexed array-like object of feature-items
     * @param {object} snippet : active individual LI element .featureify-item
     */
    function setFeatureItemActiveClass ( source, snippet ) {

        if ( snippet.hasClass('featureify-item-active') !== true ) {

            // Remove any existing instances of 'featured-item-active' class in this list of featured items
            jQuery.each(source, function() {
                if ( $(this).hasClass('featureify-item-active') === true ) {
                    $(this).removeClass('featureify-item-active');
                }
            });

            // Add 'featured-item-active' to the currently featured LI element
            snippet.addClass('featureify-item-active');
        }
    }

    function featureItemException( value, message ) {
        this.value = value;
        this.message = message;

        return console.log('featureifyItem exception thrown: "' + value + '" ' + message);

    }

    srapp.widgets.featureify = {

        // Defaults are handled using the decorator pattern and extended through buildConfig function
        defaults: {
            source: 'featureify-source',
            destination: 'featureify-wrapper',
            item: 'featureify-item',
            featureToTop: true
        },

        /**
         * @name init
         * @function
         * @description : Initialize featureify by configuring defaults, populating first featureify-wrapper, and attaching event handlers
         * @public
         */
        init: function () {

            var targets = $('.featureify'); // collection of all instances of the widget on a page

            if (targets.length > 0) {

                // Iterate over all targets
                jQuery.each(targets, function (i, val) {

                    var target = $(this), // the specific instance of the widget to be manipulated
                        snippet = {}, // the individual LI item
                        source = {}, // the collection of LI items in each target
                        destination = {}; // The container that the featured item will be rendered

                    // Get data- values for this instance and parse string to return an object
                    srapp.util.configurator.buildConfigs( target, 'featureify-options', srapp.widgets.featureify );

                    // update vars with values from config
                    source = target.find('.' + srapp.widgets.featureify.configs.source);
                    snippet = source.html();
                    destination = target.find('.' + srapp.widgets.featureify.configs.destination);


                    // copies first feature item into destination
                    setFirstFeatureItem( source, destination );

                    // Attach event related functions to each source item
                    source.on('click', function(el) {

                        snippet = $(this);

                        swapFeatureItem( snippet, destination );
                        setFeatureItemActiveClass( source, snippet );

                        // featureToTop call
                        if ( srapp.widgets.featureify.configs.featureToTop === true && srapp.widgets.featureify.configs.destination !== undefined ) {

                            srapp.util.featureToTop.execute( {target: $(destination), notebookOffset: 90} );

                        }
                        /*else {
                            try {
                                throw featureItemException;
                            }
                            catch(e) {
                                if ( srapp.widgets.featureify.configs.featureToTop === false ) {
                                    new featureItemException( 'false', 'featureToTop truth test returned.' );
                                    console.log(e);
                                }
                                if ( srapp.widgets.featureify.configs.destination === undefined ) {
                                    new featureItemException( 'undefined', 'featureToTop  test returned.' );
                                    console.log(e);
                                }
                            }
                        }*/

                    });
                });
            }
        }
    };
    //
    /**
     * @name toggleRevealer
     * @private
     * @description Finds current message and toggles read more or read less as needed target obj is the inserted anchor
     * @param firstText The text block to which the trigger element is added
     * @param moreText The trigger element's consumer facing message to show more. Uses value from app.resources.READ_MORE_LINK_TEXT by default
     * @param lessText The trigger element's consumer facing message to show less text. Uses value from app.resources.READ_LESS_LINK_TEXT by default
     */
    function toggleRevealer( firstText, moreText, lessText ) {

        var triggerTextWrapper = firstText.find( 'a' ),
            triggerText = triggerTextWrapper.text();

        if ( triggerText === moreText ) {

            triggerTextWrapper.text( lessText );

        } else {

            triggerTextWrapper.text( moreText );
        }
    }

    srapp.widgets.revealer = {

        defaults: {
            firstTextLine: 'p:first-of-type',
            revealMoreLinkClass: 'show-content',
            revealMoreLinkText: '', // updated during init() with site-wide value
            revealLessLinkText: '', //updated during init() with site-wide value
            hiddenTextClass: 'unrevealed-text'
        },

        init: function() {

            var targets = $( '.revealer' );

            // Before building configs, get site-wide values from app.resources and add them to defaults
            srapp.widgets.revealer.defaults.revealMoreLinkText = app.resources.READ_MORE_LINK_TEXT;
            srapp.widgets.revealer.defaults.revealLessLinkText = app.resources.READ_LESS_LINK_TEXT;


            if ( targets.length > 0 ) {

                // iterate through targets to specific target, revealer, instance
                jQuery.each( targets, function( i, val ) {

                    var target = $(this),
                        trigger = {},
                        hiddenTextBlock = {},
                        firstText = "",
                        moreText = "",
                        lessText = "";

                    // Build configs from defaults and data-revealer-options
                    srapp.util.configurator.buildConfigs( target, 'revealer-options', srapp.widgets.revealer );

                    // assign values to vars based on configs
                    hiddenTextBlock = target.find( '.' + srapp.widgets.revealer.configs.hiddenTextClass );

                    firstText = target.find( srapp.widgets.revealer.configs.firstTextLine );

                    moreText = srapp.widgets.revealer.configs.revealMoreLinkText;
                    lessText = srapp.widgets.revealer.configs.revealLessLinkText;

                    // initial setup tasks
                    if ( target.length > 0 && hiddenTextBlock.length > 0 ) {

                        hiddenTextBlock.addClass( 'unrevealed' );

                        // Add trigger to DOM
                        firstText.append( '<a class="' + srapp.widgets.revealer.configs.revealMoreLinkClass + '" href="">' + srapp.widgets.revealer.configs.revealMoreLinkText + '</a>' );

                        trigger = target.find( '.' + srapp.widgets.revealer.configs.revealMoreLinkClass );

                        // Add event handler
                        if ( trigger.length > 0 ) {
                            $( trigger ).on( 'click', function(el) {

                                el.preventDefault();

                                hiddenTextBlock.toggleClass('unrevealed');
                                toggleRevealer( firstText, moreText, lessText );

                            });
                        }
                    }
                })
            }

        }
    };


    srapp.widgets.flexsliderify = {

        defaults: {
            namespace: "flx-",
            selector: "ul > li",
            animation: 'slide',
            slideshow: true,
            touch: true,
            useCSS: true,
            controlNav: true,
            directionNav: true,
            keyboard: true,
            multipleKeyboard: false,
            pauseOnHover: true,
            pauseOnAction: true,
            animationSpeed: 1000,
            slideshowSpeed: 6000,
            prevText: '',
            nextText: '',
            start: function (target) {
                // needed on some pages where there's a sudden resize of the slider -> images are smaller than the container
                target.resize();
            }
        },

        /**
         * @name init
         * @function
         * @description : Initialize flexsliderify by configuring defaults, populating first feature-wrapper, and attaching event handlers
         * @public
         */

        init: function () {

            var targets = $('.flexsliderify'); // collection of all instances of the widget on a page

            if (targets.length > 0) {

                // Iterate over all targets
                jQuery.each(targets, function(i, val) {

                    var target = $(this); // the specific instance of the widget to be manipulated

                    // Init slider with variables
                    if (target.length > 0) {

                        srapp.util.configurator.buildConfigs( target, 'flexsliderify-options', srapp.widgets.flexsliderify);

                        target.flexslider(srapp.widgets.flexsliderify.configs);

                    }

                });
            }

        }
    };

})( window.app = window.app || {}, window.app.srapp = window.app.srapp || {}, jQuery );


/*
 cardify
 Loops through page elements with the class 'cardify' and creates a set of expandable cards from each child element.

 REQUIREMENTS:
 This assumes the following structure on the divs.
 Container class="cardify":
 Card Container div:
 Initially visible Content Container div
 Content visible on hover Container div
 */
/*(function (srapp, $) {
    //"use strict";
    app.srapp.cardify = function() {
        var decks = [],
            deckCounter = 0,
            cardCounter = 0,
            isOldie = $('html').hasClass('oldie'); //A little unusual since it's depedent on a feature of the stride rite website...
        $('.cardify').each(function() {
            deckCounter += 1;
            var theDeck = $(this);
            theDeck.children().each(function() {
                cardCounter += 1;
                $(this).addClass('cardifyCard');
                $(this).attr('id', 'dId' + deckCounter + 'cId' + cardCounter);
            });
            theDeck.data('deck-info', {id: deckCounter, cardcount: cardCounter});
            decks.push(theDeck);
            cardCounter = 0;
        });
        for (var i = 0; i < decks.length; i++) {
            var theDeck = decks[i],
                cards = theDeck.children('.cardifyCard'),
                cardsCount = theDeck.data('deck-info').cardcount;

            cards.css('width', function() {
                if (cardsCount > 5)
                {
                    return '20%';
                } else {
                    return (100 / cardsCount) + '%';
                }
            });
            if (!isOldie)
            {
                var ziCounter = cardsCount * 2;
                cards.each(function()
                {
                    var theCard = $(this);
                    theCard.children().first().css('z-index', ziCounter);
                    ziCounter -= 1;
                    theCard.children().first().next().css('z-index', ziCounter);
                    ziCounter -= 1;
                    theCard.addClass('cardAnimated');
                });
            }
        }
        $('.cardifyCard.cardAnimated').hover(function() {

            $(this).toggleClass('cardActive');

        });

        app.srapp.pageRepository.cardifies = decks;
    };

})(window.app.srapp = window.app.srapp || {}, jQuery);*/


(function (srapp, $) {

//    "use strict";
//
//    var cached = {};
//
//    // Private functions
//
//    /**
//     * mod-stretchwide function
//     * @private
//     * @function
//     * @description Stretches element classed with .mod-stretchwide the full width of the viewport.
//     */
//    function stretcher () {
//        var modInnerWidth = 920,
//            modStretchOffset = ( cached.modWindowWidth - modInnerWidth ) / ( -2 );
//
//        if( modStretchOffset > 0 ) {
//            modStretchOffset = 0;
//        }
//
//        cached.modStretchTarget.width(cached.modWindowWidth).css('margin-left',(modStretchOffset + "px" ));
//    }
//
//
//    /**
//     * @public object
//     * @type {{init: app.srapp.modStretchWide.init}}
//     * @description: Stretches element classed with .mod-stretchwide the full width of the viewport.
//     */
//
//    app.srapp.modStretchWide = {
//
//        init: function () {
//
//            /**
//             *
//             * @type {{modWindowWidth: *, modStretchTarget: (*|HTMLElement)}}
//             */
//            cached = {
//                modWindowWidth: $('body').innerWidth(),
//                modStretchTarget: $('.mod-stretchwide')
//            };
//
//            stretcher();
//
//            // Re-run on window resize
//            $(window).resize(function(){
//                stretcher();
//            });
//
//        }
//    };

})(window.app.srapp = window.app.srapp || {}, jQuery);



/**
 * Utilities Module
 */
(function (srapp, $) {
    "use strict";

    var cached = {};
    srapp.util = {};


    function featureToTopException( value, message ) {
        this.value = value;
        this.message = message;

        return console.log('featureToTop exception thrown: "' + value + '" ' + message);

    }
    /**
     *
     * @description Moves targeted wrapper to the top of the viewport.
     * @param {string} wrapper - The wrapping element to bring to the top of the viewport
     * @param {number} notebookTopOffset - Offset from the viewport top to accommodate persistent headers in pages that use the notebook template.
     * @param {number} mobileTopOffset - Offset from the viewport top to accommodate persistent headers in pages that use the mobile template.
     */
    srapp.util.featureToTop = {

        defaults: {
            mobileOffset: 0,
            notebookOffset: 290
        },

        execute: function ( options ) {

            var settings = options,
                configs = {};



            // Create new extended object that uses either default values or the values from the data- configs object
            configs = $.extend({}, srapp.util.featureToTop.defaults, settings);


            //Customize top offset based on mobile template or not mobile. Non-mobile templates have a persistent header that needs to be accommodated.
            if ( configs.target !== undefined) {

                if ( app.hasOwnProperty('isMobileUserAgent') && app.isMobileUserAgent !== true ) {

                    $('html, body').animate({ scrollTop: configs.target.offset().top -= configs.notebookOffset}, 700, 'easeOutQuart');

                } else {
                    $('html, body').animate({ scrollTop: configs.target.offset().top -= configs.mobileOffset}, 700, 'easeOutQuart');
                }

            }
            else {
                try {
                    throw featureToTopException;
                }
                catch(e) {
                    if ( configs.target === undefined ) {
                     new featureToTopException( 'undefined', 'featureToTop has thrown the error' );

                    }
                }
            }
        }
    };

    /**
     * @name Configurator
     * @description Utility function to build and return a configuration object by extending defaults with settings
     * @type {{defaults: {}, settings: {}, configs: {}, buildConfig: Function}}
     */

    srapp.util.configurator = {

        defaults: {}, // takes object with defaults from caller
        settings: {}, // gets data- based options object through caller
        configs: {}, // object containing the result of extending defaults with settings

        /**
         * @name configurator.buildConfigs
         * @param target
         * @param dataAttrName
         * @param callerObject
         */
        buildConfigs: function (target, dataAttrName, callerObject) {

            // Get data- values for this instance and parse string to return an object
            if ( target.data.length > 0 ) {
                callerObject.settings = jQuery.parseJSON(target.data(dataAttrName));
            }


            // Create new extended object that uses either default values or the values from the data- configs object
            callerObject.configs = $.extend({}, callerObject.defaults, callerObject.settings);

            return callerObject.configs
        }

    };

    //TODO: Refactor for incorporation into util module
    document.addEventListener("DOMContentLoaded", function(event) {
        var copyrightYear = new Date().getFullYear(),
            target = document.querySelector('.copyright span');

        if ( target !== null ) {
            target.innerText = copyrightYear.toString();
        }
    });

})(window.app.srapp = window.app.srapp || {}, jQuery);


/** Effects module */
(function (srapp, $) {
    "use strict";

    var cached = {};
    srapp.effects = {};



//TODO: Refactor and incorparate into effects module
// animates targeted elememnts with liftAnimate style
    (function () {
        "use strict";

        // Set CSS class to target and class names to toggle
        var classOne = 'liftAnimate',

        // Static - do not change
            targetClass = 'button',
            targetClass2 = 'footer-social-links a',
            toggledElement = document.querySelectorAll('.' + targetClass +', .' + targetClass2);

        // Toggles between CSS classOne and CSS classTwo
        function classToggle() {

            this.classList.toggle(classOne);
            //this.classList.toggle(classTwo);
        }

        // Loop through list of matching elements and assign an Event Listener to each
        for(var i = 0; i < toggledElement.length; i++) {
            toggledElement[i].addEventListener('touchstart', classToggle, false);
            toggledElement[i].addEventListener('touchend', classToggle, false);
        }
    }());



})(window.app.srapp = window.app.srapp || {}, jQuery);

$(document).ready(function() {
    app.srapp.init();

});
