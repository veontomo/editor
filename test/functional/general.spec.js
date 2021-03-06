describe('General aspects of the Newsletter page', function () {
  var browser;

  before(function () {
     browser = new Zombie({debug: false, runScripts: true});
     browser.site = "http://localhost";
     browser.loadCSS = true;
  });
  before(function (done) {
    browser.visit("/projects/editor", function () {
      // console.log(browser.html());
      // console.log(browser.success);
      done();
    });
   // browser.visit("/projects/editor");

  });
  
  after(function () {
     browser.close();
  });

  describe('Presence of the main elements', function () {  
    it('should contain the editor window', function () {
      browser.query('.editor').should.be.ok;
      console.log(browser.link('a[title="Collegamento"]'));
    });
  });
  
  describe('Text should appear in the editor window', function(){
    it('types characters in the editor window', function(){
      browser.fill("textarea", "test text");
      browser.text("textarea").should.be.equal("test text");
    });
  });
  
  xdescribe('Inserts link', function(){
    it('creates link if no text is selected', function(){
      browser.fill("textarea", "abc");
      browser.wait(function(arg){
        return arg.document.querySelector('span');
      }(browser), function(arg){
        console.log(browser.document);
        // console.log('ok');
        // console.log(arg.document.innerHTML);
      }(browser));
      console.log(browser.document);
      // console.log(browser.link('a[title="Collegamento"]'));
      
    });
  });

});