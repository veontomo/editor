describe("drop protocol", function() {
    it("drops protocol", function() {
        expect(dropProtocol('http://www.test.com')).toEqual("www.test.com");
        expect(dropProtocol('https://www.test.com')).toEqual("www.test.com");
        expect(dropProtocol('ftp://www.test.com')).toEqual("www.test.com");
        expect(dropProtocol('www.test.com')).toEqual("www.test.com");
        expect(dropProtocol('http://www.test.com://')).toEqual("www.test.com://");
        expect(dropProtocol('http://www.cercoagenti.it/homepage_vetrina.asp?vetrina/1746000004-1.txt')).toEqual('www.cercoagenti.it/homepage_vetrina.asp?vetrina/1746000004-1.txt');
    });

});