'use strict';

const {ApiConsoleTemplatesProcessor} = require('../lib/templates');
const assert = require('chai').assert;
const fs = require('fs-extra');
const path = require('path');

describe('ApiConsoleTemplatesProcessor', () => {
  const logger = {
    warn: function() {},
    info: function() {},
    log: function() {}
  };
  const workingDir = 'test/playground/templates-processor-test';

  describe('copyTemplateFiles()', () => {
    var processor;
    const opts = {};
    const standaloneMainFile = path.join(workingDir, 'index.html');
    const embeddedMainFile = path.join(workingDir, 'import.html');
    const exampleFile = path.join(workingDir, 'example.html');

    function standaloneResultTest() {
      return fs.pathExists(standaloneMainFile)
      .then((exists) => {
        assert.isTrue(exists);
      })
      .then(() => {
        return fs.pathExists(exampleFile);
      })
      .then((exists) => {
        assert.isFalse(exists);
      });
    }

    function embeddedResultTest() {
      return fs.pathExists(embeddedMainFile)
      .then((exists) => {
        assert.isTrue(exists);
      })
      .then(() => {
        return fs.pathExists(exampleFile);
      })
      .then((exists) => {
        assert.isTrue(exists);
      });
    }

    beforeEach(function() {
      var options = Object.assign({}, opts);
      processor = new ApiConsoleTemplatesProcessor(workingDir, logger, options);
    });

    afterEach(function() {
      return fs.remove(workingDir);
    });

    it('Do nothing when mainFile is set', function() {
      processor.opts.mainFile = 'test';
      return processor.copyTemplateFiles()
      .then(() => fs.pathExists(standaloneMainFile))
      .then((exists) => {
        assert.isFalse(exists);
      })
      .then(() => {
        return fs.pathExists(exampleFile);
      })
      .then((exists) => {
        assert.isFalse(exists);
      });
    });

    it('Copies standalone and plain template', function() {
      return processor.copyTemplateFiles()
      .then(() => standaloneResultTest());
    });

    it('Copies standalone and JSON template', function() {
      processor.opts.useJson = true;
      return processor.copyTemplateFiles()
      .then(() => standaloneResultTest());
    });

    it('Copies standalone and JSON inline template', function() {
      processor.opts.useJson = true;
      processor.opts.inlineJson = true;
      return processor.copyTemplateFiles()
      .then(() => standaloneResultTest());
    });

    it('Copies standalone and RAML template', function() {
      processor.opts.raml = 'file';
      return processor.copyTemplateFiles()
      .then(() => standaloneResultTest());
    });

    it('Copies standalone and plain template', function() {
      processor.opts.embedded = true;
      return processor.copyTemplateFiles()
      .then(() => embeddedResultTest());
    });

    it('Copies standalone and JSON template', function() {
      processor.opts.embedded = true;
      processor.opts.useJson = true;
      return processor.copyTemplateFiles()
      .then(() => embeddedResultTest());
    });

    it('Copies standalone and JSON inline template', function() {
      processor.opts.embedded = true;
      processor.opts.useJson = true;
      processor.opts.inlineJson = true;
      return processor.copyTemplateFiles()
      .then(() => embeddedResultTest());
    });

    it('Copies standalone and RAML template', function() {
      processor.opts.embedded = true;
      processor.opts.raml = 'file';
      return processor.copyTemplateFiles()
      .then(() => embeddedResultTest());
    });
  });
});
