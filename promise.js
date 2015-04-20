/*jslint plusplus: true, white: true */
console.log('start');
console.info('p1', 'Before declaring');
var p1 = new Promise(
    function(resolve, reject) {
        console.info('p1', 'Promise p1 is started.');
        var request = new XMLHttpRequest();
        request.onload = function(e) {
            console.log('response: ', e);
        };
        request.open('get', 'http://www.google.com', true);
        try {
            request.responseType = 'document';
        } catch (e) {
            console.log(e);
        }

        request.send();
        console.log(request);
    });
console.info('p1', 'Promise p1 is made.');


function f1(val) {
    console.info('p1', val);
}

// We define what to do when the promise is fulfilled
p1.then(f1);

console.log('end');
