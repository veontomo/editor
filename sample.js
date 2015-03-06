var x = require('casper').selectXPath;
// var casper = require('casper').create({
//   pageSettings: {
//     loadImages: true,
//     loadPlugins: true,
//     userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1588.0 Safari/537.36'
//   }
// });
casper.options.waitTimeout = 5000;
casper.options.verbose=true;
casper.options.loadPlugins = true;
casper.options.viewportSize = {width: 1980, height: 1080};
// casper.options.clientScripts = ['ckeditor/ckeditor.js'];

casper.test.begin('Page contains the editor window', 1, function suite(test) {
    var url = 'https://mail.tiscali.it/';
    // var url = 'http://localhost/debug/editor/casper.html';
    var screenshotDir = 'screenshots/';

    casper.start(url, function() {
        this.capture(screenshotDir + 'screeshotStart.png');
        test.assertTextExists('Tiscali', "main page contains word \"Tiscali\"");
    });

    // casper.waitForSelector('#editor', function() {
    //     this.capture(screenshotDir + 'screenshotEndSuccess.png');
    // }, function(){
    //     console.log('Still nothing...');
    //     this.capture(screenshotDir + 'screeshotEndFail.png');
    // }, 5000);

    casper.then(function(){
        this.fillSelectors('form', {
                'input[name="_user"]':    'rossidaemon',
                'input[name="_pass"]':    'KLFa3GfM',
            }, false);
    });

    // casper.then(function(){
    //     this.fillSelectors('form', {
    //             'input[name="_user"]':    '...',
    //             'input[name="_pass"]':    '...',
    //         }, true);
    // });

    // casper.then(function(){
    //     this.mouseEvent('click', '#editor');
        // this.fill('editor', 'AAAAAAAAAAA');
    // });



    // casper.then(function(){
    //     test.assertExists('#cke_25');
    //     this.click('#cke_25');
    // });

    // casper.wait(1000, function() {
    //     this.echo("I've waited for a second.");
    // });


    casper.then(function() {
       this.capture(screenshotDir + 'screenshotLast.png');
    });


    // casper.then(function() {
        // this.assertExists('#ckeditor');
        // test.assertTitle("casperjs - Recherche Google", "google title is ok");
        // test.assertUrlMatch(/q=casperjs/, "search term has been submitted");
        // test.assertEval(function() {
        //     return __utils__.findAll("h3.r").length >= 10;
        // }, "google search for \"casperjs\" retrieves 10 or more results");
    // });

    casper.run(function() {
        test.done();
    });
});