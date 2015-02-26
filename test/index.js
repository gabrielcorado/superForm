// superForm Tests

// Global mithril
global.m = require('mithril');

// Global merge!
global.merge = require('merge');

// Define variables
var jsdom = require('jsdom').jsdom;
var window = jsdom('<html><head></head><body></body></html>');
var document = window.document;
var assert = require('assert');
var superForm = require('../index.js');
var testForm = null;

// Some test fields
var testFields = [
  { name: 'Boleto', fieldType: 'input', type: 'radio' },
  { name: 'PagSeguro', fieldType: 'input', type: 'radio' },
  { name: 'Cartão', fieldType: 'input', type: 'radio', subForms: [
    new superForm('flags',[
      { name: 'Visa', fieldType: 'input', type: 'radio', subForms: [
        new superForm('installments', [
          { name: '1x R$100,00', fieldType: 'input', type: 'radio'},
          { name: '2x R$50,00', fieldType: 'input', type: 'radio'},
          { name: '3x R$25,00', fieldType: 'input', type: 'radio'}
        ]),
      ]},
      { name: 'Master Card', fieldType: 'input', type: 'radio', subForms: [
        new superForm('installments', [
          { name: '1x R$100,00', fieldType: 'input', type: 'radio'},
          { name: '2x R$50,00', fieldType: 'input', type: 'radio'},
          { name: '3x R$25,00', fieldType: 'input', type: 'radio'}
        ]),
      ]}
    ])
  ]}
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

  it('should create a form', function() {
    // testForm it!
    testForm = new superForm('paymentForm', testFields);

    // Assert
    assert.notEqual(testForm, null);
    assert.equal(testForm.fields, testFields);
  });

  it('should generate a field', function() {
    // Set state to result
    result = undefined;

    // Generate first field
    assert.doesNotThrow(function() {
      result = testForm.generateField(testFields[0]);
    });

    // Assert!
    assert.notEqual(result, undefined);
  });
});
