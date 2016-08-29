var assert = chai.assert;

window.real = window;
(function(){


var window = {document: {something: "hi!"}};
var document = window.document;

describe('game setup', function() {
  it('return true', function() {
    var res = game.setup();

    assert.equal(res, true, 'huh');
  });
});




})()