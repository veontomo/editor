/*jslint plusplus: true, white: true */
/*global describe, it, expect, Helper */

describe('CKHelper functions', function(){
  describe("CKHelper::isEditor()", function () {
    it("returns false if the argument is a string", function () {
      expect(CKHelper.isEditor('a string')).toBe(false);
    });
    it("returns false if the argument is a number", function () {
      expect(CKHelper.isEditor(19)).toBe(false);
      expect(CKHelper.isEditor(0.219)).toBe(false);
      expect(CKHelper.isEditor(-4.3)).toBe(false);
    });
   it("returns false if the argument is an object", function () {
      expect(CKHelper.isEditor({})).toBe(false);
      expect(CKHelper.isEditor({foo:1, 'boo': 'yes'})).toBe(false);
    });
   it("returns true if the argument is an CKEDITOR.editor", function () {
      expect(CKHelper.isEditor(new CKEDITOR.editor())).toBe(true);
    });

  });
});

