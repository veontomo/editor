describe('General aspects', function () {
  var browser;

  before(function () {
     browser = new Zombie({debug: false, runScripts: true});
     browser.site = "http://localhost";
     browser.loadCSS = true;
  });

  after(function () {
     browser.close();
  });
  
  
  describe('start page', function () {  
	  before(function (done) {
	    browser.visit("/projects/editor", function () {
      		done();
    	});
	  });
	  
    it('should contain the editor', function () {
      browser.query('form').should.be.ok;
      // browser.lastError;
    });

  });

});