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

  describe('rewriteBowerPaths()', () => {
    var processor;
    const opts = {};
    beforeEach(function() {
      var options = Object.assign({}, opts);
      processor = new ApiConsoleTemplatesProcessor(workingDir, logger, options);
    });

    afterEach(function() {
      return fs.remove(workingDir);
    });

    function runTest(opts, mainFile) {
      processor.opts = Object.assign(processor.opts, opts);
      return processor.copyTemplateFiles()
      .then(() => processor.rewriteBowerPaths('test_bower/console/'))
      .then(() => {
        return fs.readFile(path.join(workingDir, mainFile), 'utf8');
      })
      .then(content => {
        var replaced = '<link rel="import" href="test_bower/console/api-console.html">';
        return content.indexOf(replaced);
      });
    }

    it('Rewrites paths to the console sources - plain', function() {
      return runTest({}, 'index.html')
      .then(result => assert.isAbove(result, 0));
    });

    it('Rewrites paths to the console sources - embedded plain', function() {
      return runTest({
        embedded: true
      }, 'import.html')
      .then(result => assert.isAbove(result, 0));
    });

    it('Rewrites paths to the console sources - standalone json', function() {
      return runTest({
        useJson: true
      }, 'index.html')
      .then(result => assert.isAbove(result, 0));
    });

    it('Rewrites paths to the console sources - embedded json', function() {
      return runTest({
        embedded: true,
        useJson: true
      }, 'import.html')
      .then(result => assert.isAbove(result, 0));
    });

    it('Rewrites paths to the console sources - standalone json inline', function() {
      return runTest({
        useJson: true,
        inlineJson: true
      }, 'index.html')
      .then(result => assert.isAbove(result, 0));
    });

    it('Rewrites paths to the console sources - embedded json inline', function() {
      return runTest({
        embedded: true,
        useJson: true,
        inlineJson: true
      }, 'import.html')
      .then(result => assert.isAbove(result, 0));
    });

    it('Rewrites paths to the console sources - standalone raml', function() {
      return runTest({
        raml: 'api.raml'
      }, 'index.html')
      .then(result => assert.isAbove(result, 0));
    });

    it('Rewrites paths to the console sources - embedded raml', function() {
      return runTest({
        embedded: true,
        raml: 'api.raml'
      }, 'import.html')
      .then(result => assert.isAbove(result, 0));
    });
  });
});
