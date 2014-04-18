/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Mapping*/

describe('Mapping-related functionality', function(){
    var map;
    beforeEach(function(){
        map = new Mapping();
    });

    describe('Mapping construction', function(){
        it('prevents accidental call without "new"', function(){
            map = Mapping();
            expect(map instanceof Mapping).toBe(true);
        });
    });


});