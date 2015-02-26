//
//

// Checks mithril
if( m === undefined )
  throw "mithril is not defined";

// Initializer
;(function(root, factory){
  // AMD
  if(typeof define === 'function' && define.amd) {
    // Define module
    define(['superForm'], function(superForm) {
      return (root.superForm = factory(superForm));
    });
  } else if( typeof exports === 'object' ) {
    // NodeJS
    module.exports = factory(require('../superForm'));
  } else {
    // Browser
    root.superForm = factory(root.superForm);
  }
})(this, function(superForm) {
  // Errors
  var ArgumentError = function(message) {
    this.name = 'ArgumentError';
    this.message = message;
  };

  // Utils
  utils = {  };

  // Define object types
  utils.types = {
    object: "[object Object]",
    array: "[object Array]",
    string: "[object String]",
    function: "[object Function]"
  };

  // Transform an object into string
  utils.toString = function(value) {
    return Object.prototype.toString.call(value);
  };

  // is a?
  utils.isA = function(value, type) {
    return this.toString(value) === this.types[type];
  };

  // Checks the value is valid if it's not use the defaultValue
  utils.defineValue = function(value, defaultValue, sameType) {
    // Set sameType default value
    if( sameType === undefined )
      sameType = true;
    else
      sameType = !!sameType;

    // Check content and type
    if( value === undefined || ( sameType && this.toString(value) !== this.toString(defaultValue) ) )
      return defaultValue;
    else
      return value;
  };

  // Define superForm
  // @param [String] name - Form name
  // @param [Array] fields - Form fields
  // @param [Object] options - Form options
  superForm = function(name, fields, options) {
    // Define default value for options
    options = utils.defineValue(options, {  });

    // Check arguements
    if( name === undefined || ( fields === undefined || ! utils.isA(fields, 'array') ) || ! utils.isA(options, 'object') )
      throw new ArgumentError('name and fields are required.');

    // Flags generate
    this.generated = false;

    // Define name
    this.name = name;

    // Define fields
    this.fields = fields;

    // Define options
    this.options = options;

    // Return instance
    return this;
  };

  // Fields types
  superForm.fieldsTypes = {
    input: { tag: 'input', attrs: {  }, children: [  ] }
  };

  // Templates
  // This is where the field will stay
  // the templates are functions with field and content arguments
  // field is the object Field and content is the field mithril element
  superForm.templates = {
    default: function(field, content) {
      // Always return an mithril element and the remender that content is an array
      return {
        tag: 'p',
        attrs: {
          id: field.id + '_container',
          classes: 'field ' + field.type
        },
        children: content
      };
    }
  };

  // generate each field and render
  superForm.prototype.generate = function(options) {
    // ...
  };

  // Generates field value
  // @param [Object] field - Form field
  superForm.prototype.generateFieldId = function(field) {
    return this.name + '_' + field.name;
  };

  // Generate field
  // @param [Object] field - Field that'll be generated
  // Required object keys are: name and fieldType
  superForm.prototype.generateField = function(field, options) {
    // Checks required keys
    if( field.name === undefined || field.fieldType === undefined )
      throw new ArgumentError('when you generate a field, name and type are required');

    // Define options
    options = utils.defineValue(options, {  });

    // Set field id
    var fieldId = this.generateFieldId(field);

    // Set default field values
    field.id = utils.defineValue(field.id, fieldId);
    field.type = utils.defineValue(field.type, '');
    field.defaultValue = utils.defineValue(field.defaultValue, '', false);
    field.classes = utils.defineValue(field.classes, '');
    field.template = utils.defineValue(field.template, 'default');
    field.collection = utils.defineValue(field.collection, false);

    // Field value
    field.value = m.prop(field.defaultValue);

    // subForms
    field.subForms = utils.defineValue(field.subForms, [  ]);
    var _subForms = [  ];

    // Each subForms
    for( var i = 0; i < field.subForms.length; i++ ) {
      // Get form
      var form = field.subForms[i];

      // Generate it and put it in other array
      _subForms.push(form.generate());
    }

    var fieldTag = merge(true, superForm.fieldsTypes[field.fieldType]);

    // Set attributes
    fieldTag.attrs.class = field.classes;
    fieldTag.attrs.value = field.value;
    fieldTag.attrs.type = field.type;

    // Define the content
    var content = [  ];

    // Add field to content
    content.push(fieldTag);

    // Add subForms to it
    for( var contentI = 0; contentI < _subForms.length; contentI++ )
      content.push(_subForms[contentI]);

    // Return the template
    return superForm.templates[field.template](field, content);
  };

  superForm.prototype.findFieldBy = function(key, value) {
    // Checks key and value
    if( ( key === undefined || !utils.isA(key, 'string') ) || ( value === undefined || !utils.isA(value, 'string') ) )
      throw new ArgumentError('to find a field you need to specify key and value');

    // Result
    result = [ ];

    // Each fields
    for( var i = 0; i < this.fields.length; i++ ) {
      // Field
      var field = this.fields[i];

      // Checks field with value
      if( field[key] === value )
        result.push(field);
    }

    // Return
    return result;
  };

  // Get a field value
  superForm.prototype.get = function(key, options) {
    // Check forms has been generated and if field exists
    if( ! this.generated )
      return undefined;

    // Define default options
    options = utils.defineValue(options, {  });

    // Find field
    var field = this.findFieldBy('name', key),
        result = [ ];

    // Return!
    if( field[0] === undefined ) {
      return undefined;
    } else {
      return field[0].value();
    }
  };

  // Return
  return superForm;
});
