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
    testForm = null,
    testFields = {
      firstname: { fieldType: 'input', type: 'text' },
      sex: {
        fieldType: 'input',
        type: 'radio',
        options: {
          male: {  },
          female: {  }
        }
      }
    };

// Some test fields

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

  it('should create a form', function() {
    // superForm it!
    testForm = new superForm('testForm', testFields);

    // Assert
    assert.notEqual(testFields, null);
    assert.equal(testForm.fields, testFields);
  });

  describe('simple fields', function() {
    it('should be generated', function() {
      // Set state to result
      result = undefined;

      // Generate first field
      assert.doesNotThrow(function() {
        result = testForm.generateField('firstname');
      });

      // Assert!
      assert.notEqual(result, undefined);
    });

    it('should set and get the values', function() {
      // Set a value
      assert.equal(testForm.set('firstname', 'superForm'), true);

      // Get value
      assert.notEqual(testForm.get('firstname'), undefined);
      assert.equal(testForm.get('firstname'), 'superForm');
    });
  });

  describe('collection fields', function() {
    it('should be generated', function() {
      // Set state to result
      result = undefined;

      // Generate first field
      assert.doesNotThrow(function() {
        result = testForm.generateField('sex');
      });

      // Assert!
      assert.notEqual(result, undefined);
    });

    it('should set and get the values', function() {
      // Set a value
      assert.equal(testForm.set('sex', 'superForm'), true);

      // Get value
      assert.notEqual(testForm.get('sex'), undefined);
      assert.equal(testForm.get('sex'), 'superForm');
    });
  });

  it('should generate a bunch of fields', function() {
    // Set state to result
    result = [];

    // Generate first field
    assert.doesNotThrow(function() {
      testForm.generate()
    });
  });
});
