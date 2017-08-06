'use strict';

const {TemplateProcessorOptions} = require('../lib/template-options');
const assert = require('chai').assert;

describe('TemplateProcessorOptions', () => {

  describe('constructor', () => {
    var options;

    it('Sets mainFile', function() {
      options = new TemplateProcessorOptions({
        mainFile: 'test'
      });
      assert.equal(options.mainFile, 'test');
    });

    it('Sets default mainFile', function() {
      options = new TemplateProcessorOptions();
      assert.isUndefined(options.mainFile);
    });

    it('Sets default mainFile when type is wrong', function() {
      options = new TemplateProcessorOptions({
        mainFile: true
      });
      assert.isUndefined(options.mainFile);
    });

    it('Sets raml', function() {
      options = new TemplateProcessorOptions({
        raml: 'test'
      });
      assert.equal(options.raml, 'test');
    });

    it('Sets default raml', function() {
      options = new TemplateProcessorOptions();
      assert.isUndefined(options.raml);
    });

    it('Sets default raml when type is wrong', function() {
      options = new TemplateProcessorOptions({
        raml: true
      });
      assert.isUndefined(options.raml);
    });

    it('Sets embedded', function() {
      options = new TemplateProcessorOptions({
        embedded: true
      });
      assert.isTrue(options.embedded);

      options = new TemplateProcessorOptions({
        embedded: false
      });
      assert.isFalse(options.embedded);
    });

    it('Sets default embedded', function() {
      options = new TemplateProcessorOptions();
      assert.isFalse(options.embedded);
    });

    it('Sets default embedded when type is wrong', function() {
      options = new TemplateProcessorOptions({
        raml: 'true'
      });
      assert.isFalse(options.embedded);
    });

    it('Sets useJson', function() {
      options = new TemplateProcessorOptions({
        useJson: true
      });
      assert.isTrue(options.useJson);

      options = new TemplateProcessorOptions({
        useJson: false
      });
      assert.isFalse(options.useJson);
    });

    it('Sets default useJson', function() {
      options = new TemplateProcessorOptions();
      assert.isFalse(options.useJson);
    });

    it('Sets default useJson when type is wrong', function() {
      options = new TemplateProcessorOptions({
        useJson: 'true'
      });
      assert.isFalse(options.useJson);
    });

    it('Sets inlineJson', function() {
      options = new TemplateProcessorOptions({
        inlineJson: true
      });
      assert.isTrue(options.inlineJson);

      options = new TemplateProcessorOptions({
        inlineJson: false
      });
      assert.isFalse(options.inlineJson);
    });

    it('Sets default inlineJson', function() {
      options = new TemplateProcessorOptions();
      assert.isFalse(options.inlineJson);
    });

    it('Sets default inlineJson when type is wrong', function() {
      options = new TemplateProcessorOptions({
        inlineJson: 'true'
      });
      assert.isFalse(options.inlineJson);
    });
  });
});
