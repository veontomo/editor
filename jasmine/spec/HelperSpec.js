describe("file extension", function() {
    it("gives the file extension", function() {
        expect(fileExt('c:/folder/test.exe')).toEqual('exe');
        expect(fileExt('c:/folder/testexe')).toEqual('');
    });
});

describe("table2 helper functions", function() {
    it("transforms each element of the input array into a non-negative number", function() {
        expect(sanitize([1, 2, 3])).toEqual([1, 2, 3]);
        expect(sanitize([1.1, 2.4, 2])).toEqual([1.1, 2.4, 2]);
        expect(sanitize(["4", -3, 3.2, "a"])).toEqual([4, 3, 3.2, 0]);
    });

    it("calculates the trace of the array", function(){
    	expect(trace([1, 3, 5])).toEqual(9);
    	expect(trace([])).toEqual(0);
    	expect(trace([1.1, 2.3, -10])).toEqual(1.1 + 2.3 - 10);
    });

    it("normalizes the array", function(){
    	expect(normalize([1, 2, 2])).toEqual([0.2, 0.4, 0.4]);
    	expect(normalize([0, 0, 0, 0])).toEqual([0.25, 0.25, 0.25, 0.25]); 	// all zeroes in the array
    	expect(normalize([2, -2])).toEqual([2, -2]); 						// zero trace 

    });

    it("splits the number in terms with specified weights", function(){
    	expect(splitWeighted(10, [1, 2, 2])).toEqual([2, 4, 4]);
    	expect(splitWeighted(30, [4, 2, 3, 1])).toEqual([12, 6, 9, 3]);
    	expect(splitWeighted(30, [4, 2, 0])).toEqual([20, 10, 0]);
    });

    it("rounds each elements of the array", function(){
    	expect(roundUp([1, 2, 5, 0, 4])).toEqual([1, 2, 5, 0, 4]);
    	expect(roundUp([2.2, 5.6, 0, 4.5])).toEqual([2, 6, 0, 5]);
    	expect(roundUp([-2.8, 3.4, 4.993])).toEqual([-3, 3, 5]);
    });
 
});

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

describe('Validation the calculated width', function(){
    it('makes the width to be valid', function(){
        expect(validateWidth('10px')).toEqual('10px');
        expect(validateWidth('20.92px ')).toEqual('20px');
        expect(validateWidth('340 px')).toEqual('340px');
        expect(validateWidth('320.7 px')).toEqual('320px');
        expect(validateWidth('10pt')).toEqual('10pt');
        expect(validateWidth('20.32pt')).toEqual('20pt');
        expect(validateWidth('340 pt')).toEqual('340pt');

        expect(validateWidth('320.1 em')).toEqual('320.1em');
        expect(validateWidth('10em')).toEqual('10em');
        expect(validateWidth('20.92em ')).toEqual('20.92em');
        expect(validateWidth('340 %')).toEqual('340%');
        expect(validateWidth('320.1 %')).toEqual('320.1%');
        expect(validateWidth('320.6%')).toEqual('320.6%');
        expect(validateWidth('10% ')).toEqual('10%');


        expect(validateWidth('320.1 em1')).toBe(false);
        expect(validateWidth('pt320.1')).toBe(false);
    });
});

describe('Splitting quantity in value and measure', function(){
    it('splits', function(){
        expect(toUnit('10px')).toEqual({value: 10, measure: 'px'});
        expect(toUnit('20')).toEqual({value: 20, measure: ''});
        expect(toUnit('20 em')).toEqual({value: 20, measure: 'em'});
        expect(toUnit('0.3221s')).toEqual({value: 0.3221, measure: 's'});
        expect(toUnit(0.3221)).toEqual({value: 0.3221, measure: ''});
        expect(toUnit('s')).toBe(false);
    });
});