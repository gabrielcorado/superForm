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

// superForm it!
testForm = new superForm('testForm', testFields);

// Is empty function
function isEmpty(obj) {

  // null and undefined are "empty"
  if (obj === null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0)    return false;
  if (obj.length === 0)  return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (var key in obj)
    if (Object.prototype.hasOwnProperty.call(obj, key)) return false;

  return true;
}

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
      assert.equal(testForm.set('sex', 'male'), true);

      // Get value
      assert.notEqual(testForm.get('sex'), undefined);
      assert.equal(testForm.get('sex'), 'male');
    });
  });

  it('should get all the fields values', function() {
    // Generate fields
    testForm.generateField('firstname');
    testForm.generateField('sex');

    // Set values
    testForm.set('firstname', 'superForm');
    testForm.set('sex', 'male');

    // Get values
    values = testForm.getAll();

    //
    assert.equal(isEmpty(values), false);
  });

  it('should generate the forms', function() {
    // Generate first field
    assert.doesNotThrow(function() {
      var result = testForm.generate();
    });

    assert.notEqual(result, undefined);
  });

  it('should submit form', function(done) {
    // Generate form
    testForm.generate();

    // Set values
    testForm.set('firstname', 'superForm');
    testForm.set('sex', 'male');

    testForm.submit(function(values) {
      // assert
      assert.equal(isEmpty(values), false);

      // Done!
      done();
    });
  });
});
