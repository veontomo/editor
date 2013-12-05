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