describe('General aspects of the Newsletter page', function () {
  var browser;

  before(function () {
     browser = new Zombie({debug: false, runScripts: true});
     browser.site = "http://localhost";
     browser.loadCSS = true;
  });
  before(function (done) {
    browser.visit("/projects/editor", function () {
      done();
    });
  });
  
  after(function () {
     browser.close();
  });

  describe('Presence of the main elements', function () {  
    it('should contain the editor window', function () {
      browser.query('.editor').should.be.ok;
    });
  });
  describe('Text should appear in the editor window', function(){
    
  });
});