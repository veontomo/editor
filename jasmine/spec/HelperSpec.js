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

describe('It has a class Unit', function(){
    it('creates instances of Unit class', function(){
        var u1 = new Unit(1, 'cm');
        var u2 = new Unit(29.50206, 'l');
        var u3 = new Unit(2.5);
        var u4 = new Unit(1, '');
        var u5 = new Unit(12, 'cm ');
        var u6 = new Unit(0.5, ' cm');
        var u7 = new Unit();
        var u8 = new Unit('10.1cm');
        var u9 = new Unit('10.1');
        var u10 = new Unit('');

        expect([u1.value, u1.measure]).toEqual([1, 'cm']);
        expect([u2.value, u2.measure]).toEqual([29.50206, 'l']);
        expect([u3.value, u3.measure]).toEqual([2.5, '']);
        expect([u4.value, u4.measure]).toEqual([1, '']);
        expect([u5.value, u5.measure]).toEqual([12, 'cm']);
        expect([u6.value, u6.measure]).toEqual([0.5, 'cm']);
        expect([u7.value, u7.measure]).toEqual([0, '']);
        expect([u8.value, u8.measure]).toEqual([10.1, 'cm']);
        expect([u9.value, u9.measure]).toEqual([10.1, '']);
        expect([u10.value, u10.measure]).toEqual([0, '']);
        expect(new Unit(u8)).toEqual(u8);

        expect(function(){
            new Unit('a string');
        }).toThrow('Can not convert into a Unit object!')
    });

    it('checks whether two Unit objects have the same unit of measurements', function(){
        var u1 = new Unit(1, 'cm');
        var u2 = new Unit(29.50206, 'l');
        var u3 = new Unit(2.5);
        var u4 = new Unit(1, '');
        var u5 = new Unit(12, 'cm ');
        var u6 = new Unit(0.5, ' cm');
        var u7 = new Unit();
        var u8 = new Unit('10.1cm');
        var u9 = new Unit('10.1');

        expect(u1.isLikeAs(u2)).toBe(false);
        expect(u1.isLikeAs(u3)).toBe(false);
        expect(u1.isLikeAs(u5)).toBe(true);
        expect(u1.isLikeAs(u8)).toBe(true);
        expect(u4.isLikeAs(u1)).toBe(false);
        expect(u4.isLikeAs(u7)).toBe(true);
        expect(u1.isLikeAs("10")).toBe(false);
        expect(u9.isLikeAs("10")).toBe(true);
        expect(u9.isLikeAs("a string")).toBe(false);



    })

    it('adds two instances of Unit class', function(){
        var u1 = new Unit(10.4, 'cm');
        var u2 = new Unit(2.3, 'cm');
        var u3 = new Unit(2.5);
        var u4 = new Unit(1, '');

        var s1 = u1.add(u2);
        var s2 = u3.add(u4);
        var s3 = u1.add(u2).add(u2);
        expect([s1.value, s1.measure]).toEqual([12.7, 'cm']);
        expect([s2.value, s2.measure]).toEqual([3.5, '']);
        expect([s3.value, s3.measure]).toEqual([15, 'cm']);
        expect(function(){
            return u1.add(u3);   
        }).toThrow(new Error("these Unit instances can not be summed up!"));
    });


    it('subtracts two instances of Unit class', function(){
        var u1 = new Unit(10, 'cm');
        var u2 = new Unit(2, 'cm');
        var u3 = new Unit(2);
        var u4 = new Unit(1, '');

        var s1 = u1.sub(u2);
        var s2 = u3.sub(u4);
        var s3 = u1.sub(u2).sub(u2);
        expect([s1.value, s1.measure]).toEqual([8, 'cm']);
        expect([s2.value, s2.measure]).toEqual([1, '']);
        expect([s3.value, s3.measure]).toEqual([6, 'cm']);
        expect(function(){
            return u1.sub(u3);   
        }).toThrow(new Error("these Unit instances can not be subtracted!"));
    });


});