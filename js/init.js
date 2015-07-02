/**
 * Created by marklabenski on 03.06.15.
 */
requirejs.config({
    baseUrl: 'bower_components',
    // ... config ...
    paths: {
        skrollr: 'skrollr/dist/',
        
        "jquery": 'jquery/dist/',
        js: '../js/'
    }
    // ... config ...
});
requirejs(["move.js/move.min", "skrollr/skrollr.min", 'js/trolltype'], function(move, skrollr, trolltype) {
    move('.trexit-logo.logo-left')
        .set('left', 200)
        .end();


    skrollr.init({
        
        easing: 'swing',
        smoothScrollingDuration: 0,
        render: function (data) {
            //Log the current scroll position.
            //console.log(data.curTop);

            if (data.curTop >= 200) {
                /* var elems = document.querySelectorAll('.trexit-logo');
                 for(elemKey in elems) {
                 elem  = elems[elemKey];
                 if(!elem.classList.contains('animated'))
                 elem.classList.add('animated');
                 }*/
            }
        }
    });
});
    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".







// create a scene
