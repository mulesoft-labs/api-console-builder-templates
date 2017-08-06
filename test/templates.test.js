'use strict';

const {ApiConsoleTemplatesProcessor} = require('../lib/templates');
const {TemplateProcessorOptions} = require('../lib/template-options');
const assert = require('chai').assert;

describe('ApiConsoleTemplatesProcessor', () => {
  const logger = {
    warn: function() {},
    info: function() {},
    log: function() {}
  };
  const workingDir = 'test/playground/templates-processor-test';

  describe('constructor', () => {
    var processor;

    it('Setting options as TemplateProcessorOptions', function() {
      const options = {};
      processor = new ApiConsoleTemplatesProcessor(workingDir, logger, options);
      assert.isTrue(processor.opts instanceof TemplateProcessorOptions);
    });

    it('Sets workingDir', function() {
      const options = {};
      processor = new ApiConsoleTemplatesProcessor(workingDir, logger, options);
      assert.equal(processor.workingDir, workingDir);
    });

    it('Sets templateUsed', function() {
      const options = {};
      processor = new ApiConsoleTemplatesProcessor(workingDir, logger, options);
      assert.isUndefined(processor.templateUsed);
    });

    it('Sets templateFile', function() {
      const options = {};
      processor = new ApiConsoleTemplatesProcessor(workingDir, logger, options);
      assert.isUndefined(processor.templateFile);
    });

    it('Sets exampleFile', function() {
      const options = {};
      processor = new ApiConsoleTemplatesProcessor(workingDir, logger, options);
      assert.isUndefined(processor.exampleFile);
    });
  });
});
