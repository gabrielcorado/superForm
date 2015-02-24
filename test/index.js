// superForm Tests

// Global mithril
global.m = require('mithril');

// Define variables
var jsdom = require('jsdom').jsdom,
    window = jsdom('<html><head></head><body></body></html>'),
    document = window.document,
    assert = require('assert'),
    superForm = require('../index.js'),
    testForm = null;

// Some test fields
fields = [
  { name: 'firstname', type: 'text' },
  { name: 'lastname', type: 'text' }
];

// Tests
describe('superForm', function(){
  //
  it('should raise an ArgumentError when try to create an invalid form', function(done){
    try {
      // Try super form
      superForm();
    } catch(err) {
      // Assert
      assert.equal(err.name, 'ArgumentError');

      // Done!
      done();
    }
  });

  it('should create a form', function(){
    // superForm it!
    testForm = new superForm('testForm', fields);

    // Assert
    assert.notEqual(testForm, null);
    assert.equal(testForm.fields, fields);
  });

  //
  it('should generate a field', function() {

  });

  //
  // it('', function() {
  //
  // });
});
