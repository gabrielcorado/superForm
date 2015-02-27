//
//

// Checks mithril
if( m === undefined ) {
  throw "mithril is not defined";
}

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
  var utils = {  };

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
    if( sameType === undefined ) {
      sameType = true;
    } else {
      sameType = !!sameType;
    }

    // Check content and type
    if( value === undefined || ( sameType && this.toString(value) !== this.toString(defaultValue) ) ) {
      return defaultValue;
    } else {
      return value;
    }
  };

  // Field value
  var fieldValue = function(value) {
    // Set first value
    this.set(value);

    // Return this
    return this;
  };

  // Set new value
  fieldValue.prototype.set = function(value) {
    // Store value
    this.store = value;

    // Define value type
    if( utils.isA(this.store, 'array') )
      this.type = 'collection';
    else
      this.type = 'simple';

    // Default return
    return true;
  };

  // Get value
  fieldValue.prototype.get = function() {
    return this.store;
  };

  fieldValue.prototype.valueIn = function(value) {
    // Checks it is an collection
    if( this.type != 'collection' )
      return false;

    // Each values
    for( var i; i < this.store.length; i++ )
      if( this.store[i] === value )
        return true;

    // Default return
    return false;
  };

  // splice
  fieldValue.prototype.addValue = function(value) {
    // Checks it is an collection
    if( this.type != 'collection' )
      return false;

    // Each values
    for( var i; i < this.store.length; i++ ) {
      if( this.store[i] === value )
        return true;
    }

    // Add it
    this.store.push(value);

    // Default return
    return true;
  };

  //
  fieldValue.prototype.removeValue = function(value) {
    // Checks it is an collection
    if( this.type != 'collection' )
      return false;

    // Each values
    for( var i; i < this.store.length; i++ ) {
      // Checks value
      if( this.store[i] === value ) {
        // Remote it
        this.store.splice(i, 1);

        // Return
        return true;
      }
    }

    // Default return
    return false;
  };

  //
  fieldValue.prototype.toJSON = function() {
    // Return the value and type
    return { type: this.type, value: this.store };
  };

  // Define superForm
  // @param [String] name - Form name
  // @param [Array] fields - Form fields
  // @param [Object] options - Form options
  superForm = function(name, fields, options) {
    // Define default value for options
    options = utils.defineValue(options, {  });

    // Check arguements
    if( name === undefined || ( fields === undefined || ! utils.isA(fields, 'object') ) || ! utils.isA(options, 'object') ) {
      throw new ArgumentError('name and fields are required.');
    }

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
    for(i = 0; i < this.fields.length; i++) {
      this.generateField(this.fields[i].name);
    }
  };

  // Generates field value
  // @param [Object] field - Form field
  superForm.prototype.generateFieldId = function(field) {
    return this.name + '_' + field.name;
  };

  // Generate field
  // @param [String] name - Field name
  // Required object keys are: name and fieldType
  superForm.prototype.generateField = function(name, options) {
    // Get field
    var field = this.fields[name];

    // Checks field exists
    if( field === undefined )
      throw new ArgumentError('field name invalid');

    // Checks required keys
    if( field.fieldType === undefined )
      throw new ArgumentError('when you generate a field, type are required');

    // Define options
    options = utils.defineValue(options, {  });

    // Set field id
    var fieldId = this.generateFieldId(field);

    // Set default field values
    field.id = utils.defineValue(field.id, fieldId);
    field.type = utils.defineValue(field.type, '');
    field.classes = utils.defineValue(field.classes, '');
    field.template = utils.defineValue(field.template, 'default');
    field.collection = utils.defineValue(field.collection, false);
    field.options = utils.defineValue(field.options, {  });
    field.multiSelect = utils.defineValue(field.multiSelect, false);

    // Set name
    field.name = name;

    // Default value
    if( field.multiSelect )
      field.defaultValue = utils.defineValue(field.defaultValue, [ ]);
    else
      field.defaultValue = utils.defineValue(field.defaultValue, '');

    // Field value
    field.value = utils.defineValue(field.value, new fieldValue(field.defaultValue), false);

    // subForms
    field.subForms = utils.defineValue(field.subForms, [  ]);
    var _subForms = [  ];

    // Checks if field is a collection
    if( ! field.collection ) {
      // Each subForms
      for( var i = 0; i < field.subForms.length; i++ ) {
        // Get form
        var form = field.subForms[i];

        // Generate it and put it in other array
        _subForms.push(form.generate());
      }
    }

    var fieldTag = merge(true, superForm.fieldsTypes[field.fieldType]);

    // Set attributes
    fieldTag.attrs.class = field.classes;
    fieldTag.attrs.value = field.value;
    fieldTag.attrs.type = field.type;
    fieldTag.attrs.onchange = (function(field) {
      // Return
      return function(e) {
        m.withAttr('value', field.value.set)(e);
      };
    })(field);

    // Define the content
    var content = [  ];

    // Add field to content
    content.push(fieldTag);

    // Add subForms to it
    for( var contentI = 0; contentI < _subForms.length; contentI++ ) {
      content.push(_subForms[contentI]);
    }

    // Return the template
    return superForm.templates[field.template](field, content);
  };

  // Get a field value
  superForm.prototype.get = function(name, options) {
    // Get field
    var field = this.fields[name];

    // Checks field exists
    if( field === undefined )
      throw new ArgumentError('field name invalid');

    // Define default options
    options = utils.defineValue(options, {  });

    // Return!
    return field.value.get();
  };

  // Set a field value
  superForm.prototype.set = function(name, value, options) {
    // Get field
    var field = this.fields[name];

    // Checks field exists
    if( field === undefined )
      throw new ArgumentError('field name invalid');

    // Set new value
    field.value.set(value);

    // Return
    return true;
  };

  // Return
  return superForm;
});
