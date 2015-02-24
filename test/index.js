// superForm Tests

// Global mithril
global.m = require('mithril');

// Global merge!
global.merge = require('merge');

// Define variables
var jsdom = require('jsdom').jsdom,
    window = jsdom('<html><head></head><body></body></html>'),
    document = window.document,
    assert = require('assert'),
    superForm = require('../index.js'),
    testForm = null;

// Some test fields
fields = [
  { name: 'firstname', fieldType: 'input', type: 'text' },
  { name: 'lastname', fieldType: 'input', type: 'text' }
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
    // Set state to result
    result = undefined;

    // Generate first field
    assert.doesNotThrow(function() {
      result = testForm.generateField(fields[0]);
    });

    // Assert!
    assert.notEqual(result, undefined);
  });

  //
  // it('', function() {
  //
  // });
});
