'use strict';

const {ApiConsoleTemplatesProcessor} = require('../lib/templates');
const assert = require('chai').assert;

describe('ApiConsoleTemplatesProcessor', () => {
  const logger = {
    warn: function() {},
    info: function() {},
    log: function() {}
  };
  const workingDir = 'test/playground/templates-processor-test';

  describe('setTemplates()', () => {
    var processor;
    const opts = {};

    beforeEach(function() {
      var options = Object.assign({}, opts);
      processor = new ApiConsoleTemplatesProcessor(workingDir, logger, options);
    });

    it('The templateUsed variable is undefined', function() {
      assert.isUndefined(processor.templateUsed);
    });

    it('Sets templateUsed to false', function() {
      processor.opts.mainFile = 'test-file';
      processor.setTemplates();
      assert.isFalse(processor.templateUsed);
    });

    it('Sets templateUsed to true', function() {
      processor.setTemplates();
      assert.isTrue(processor.templateUsed);
    });

    it('Uses standalone and plain template', function() {
      processor.setTemplates();
      assert.equal(processor.templateFile, 'standalone-plain.tpl');
    });

    it('Uses standalone and json template', function() {
      processor.opts.useJson = true;
      processor.setTemplates();
      assert.equal(processor.templateFile, 'standalone-json.tpl');
    });

    it('Uses standalone, json and inline template', function() {
      processor.opts.useJson = true;
      processor.opts.inlineJson = true;
      processor.setTemplates();
      assert.equal(processor.templateFile, 'standalone-json-inline.tpl');
    });

    it('Uses standalone and RAML template', function() {
      processor.opts.raml = 'file';
      processor.setTemplates();
      assert.equal(processor.templateFile, 'standalone-raml.tpl');
    });

    it('Do not sets example template', function() {
      processor.opts.raml = 'file';
      processor.setTemplates();
      assert.isUndefined(processor.exampleFile);
    });

    it('Uses embedded and plain template', function() {
      processor.opts.embedded = true;
      processor.setTemplates();
      assert.equal(processor.templateFile, 'embedded-plain.tpl');
    });

    it('Sets the example template for plain', function() {
      processor.opts.embedded = true;
      processor.setTemplates();
      assert.equal(processor.exampleFile, 'embedded-plain-example.tpl');
    });

    it('Uses embedded and json template', function() {
      processor.opts.embedded = true;
      processor.opts.useJson = true;
      processor.setTemplates();
      assert.equal(processor.templateFile, 'embedded-json.tpl');
    });

    it('Sets the example template for JSON', function() {
      processor.opts.embedded = true;
      processor.opts.useJson = true;
      processor.setTemplates();
      assert.equal(processor.exampleFile, 'embedded-json-example.tpl');
    });

    it('Uses embedded, json and inline template', function() {
      processor.opts.embedded = true;
      processor.opts.useJson = true;
      processor.opts.inlineJson = true;
      processor.setTemplates();
      assert.equal(processor.templateFile, 'embedded-json-inline.tpl');
    });

    it('Sets the example template for inline JSON', function() {
      processor.opts.embedded = true;
      processor.opts.useJson = true;
      processor.opts.inlineJson = true;
      processor.setTemplates();
      assert.equal(processor.exampleFile, 'embedded-json-inline-example.tpl');
    });

    it('Uses embedded and json template', function() {
      processor.opts.embedded = true;
      processor.opts.raml = 'file';
      processor.setTemplates();
      assert.equal(processor.templateFile, 'embedded-raml.tpl');
    });

    it('Sets the example template for raml', function() {
      processor.opts.embedded = true;
      processor.opts.raml = 'file';
      processor.setTemplates();
      assert.equal(processor.exampleFile, 'embedded-raml-example.tpl');
    });
  });
});
