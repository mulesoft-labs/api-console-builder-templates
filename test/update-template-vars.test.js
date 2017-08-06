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

  describe('updateTemplateVars()', () => {
    var processor;
    const opts = {};
    const standaloneMainFile = path.join(workingDir, 'index.html');
    const exampleFile = path.join(workingDir, 'example.html');
    const RAML = {
      title: 'Test based API'
    };

    beforeEach(function() {
      var options = Object.assign({}, opts);
      processor = new ApiConsoleTemplatesProcessor(workingDir, logger, options);
    });

    afterEach(function() {
      return fs.remove(workingDir);
    });

    it('Quietly resolves when not calling setTemplates()', function() {
      return processor.updateTemplateVars();
    });

    it('Quietly resolves when not setting RAML', function() {
      processor.setTemplates();
      return processor.updateTemplateVars();
    });

    it('Updates variables for standalone raml', function() {
      processor.opts.raml = 'file';
      return processor.copyTemplateFiles()
      .then(() => processor.updateTemplateVars(RAML))
      .then(() => fs.readFile(standaloneMainFile, 'utf8'))
      .then((content) => {
        assert.equal(content.indexOf('[[API-FILE-URL]]'), -1, 'File URL is updated');
        assert.equal(content.indexOf('[[API-TITLE]]'), -1, 'API title is updated');
      });
    });

    it('Updates variables for standalone JSON', function() {
      processor.opts.useJson = true;
      return processor.copyTemplateFiles()
      .then(() => processor.updateTemplateVars(RAML))
      .then(() => fs.readFile(standaloneMainFile, 'utf8'))
      .then((content) => {
        assert.equal(content.indexOf('[[API-TITLE]]'), -1, 'API title is updated');
      });
    });

    it('Updates variables for standalone inline JSON', function() {
      processor.opts.useJson = true;
      processor.opts.inlineJson = true;
      return processor.copyTemplateFiles()
      .then(() => processor.updateTemplateVars(RAML))
      .then(() => fs.readFile(standaloneMainFile, 'utf8'))
      .then((content) => {
        assert.equal(content.indexOf('[[API-TITLE]]'), -1, 'API title is updated');
        assert.equal(content.indexOf('[[API-DATA]]'), -1, 'Api data is updated');
      });
    });

    it('Updates variables for embedded raml', function() {
      processor.opts.raml = 'file';
      processor.opts.embedded = true;
      return processor.copyTemplateFiles()
      .then(() => processor.updateTemplateVars(RAML))
      .then(() => fs.readFile(exampleFile, 'utf8'))
      .then((content) => {
        assert.equal(content.indexOf('[[API-FILE-URL]]'), -1, 'File URL is updated');
        assert.equal(content.indexOf('[[API-TITLE]]'), -1, 'API title is updated');
      });
    });

    it('Updates variables for embedded JSON', function() {
      processor.opts.useJson = true;
      processor.opts.embedded = true;
      return processor.copyTemplateFiles()
      .then(() => processor.updateTemplateVars(RAML))
      .then(() => fs.readFile(exampleFile, 'utf8'))
      .then((content) => {
        assert.equal(content.indexOf('[[API-TITLE]]'), -1, 'API title is updated');
      });
    });

    it('Updates variables for embedded inline JSON', function() {
      processor.opts.useJson = true;
      processor.opts.inlineJson = true;
      processor.opts.embedded = true;
      return processor.copyTemplateFiles()
      .then(() => processor.updateTemplateVars(RAML))
      .then(() => fs.readFile(exampleFile, 'utf8'))
      .then((content) => {
        assert.equal(content.indexOf('[[API-TITLE]]'), -1, 'API title is updated');
        assert.equal(content.indexOf('[[API-DATA]]'), -1, 'Api data is updated');
      });
    });
  });
});
