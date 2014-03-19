describe('General aspects of the Newsletter page', function () {
  var zombie;

  before(function () {
     zombie = new Zombie({debug: false, runScripts: false});
     zombie.site = "http://localhost";
     zombie.loadCSS = true;
  });
  before(function (done) {
    zombie.visit("/projects/editor", function () {
      done();
    });
  });
  
  after(function () {
     zombie.close();
  });

  describe('Presence of the main elements', function () {  
    it('should contain the editor window', function () {
      zombie.query('.editor').should.be.ok;
    });
  });
  
  describe('Text should appear in the editor window', function(){
    it('types characters in the editor window', function(){
      zombie.fill("textarea", "test text");
      zombie.text("textarea").should.be.equal("test text");
    });
  });
  
  describe('Inserts link', function(){
    it('creates link if no text is selected', function(){
      zombie.fill("textarea", "abc");
      zombie.wait(function(arg){
        return arg.document.querySelector('span');
      }(zombie), function(arg){
        console.log('ok');
        console.log(arg.document.innerHTML);
      }(zombie));
      // console.log(zombie.document);
      // console.log(zombie.link('a[title="Collegamento"]').innerHTML);
      
    });
  });

});