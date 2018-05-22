'use strict';
/**
 * Copyright (C) Mulesoft.
 * Shared under Apache 2.0 license
 *
 * @author Pawel Psztyc
 */
const fs = require('fs-extra');
const path = require('path');
const parse5 = require('parse5');
const {TemplateProcessorOptions} = require('./template-options');
/**
 * A class that handles module's templates, copy them to working directory
 * and processes variables in the templates.
 */
class ApiConsoleTemplatesProcessor {
  /**
   * Constructs the processor.
   *
   * @param {String} workingDir Path to the working directory with API console
   * build.
   * @param {Object} logger Logger to use to log debug output. Can be any object
   * with the interface compatible platform's console object.
   * @param {TemplateProcessorOptions} opts Options passed to the module
   */
  constructor(workingDir, logger, opts) {
    if (!workingDir) {
      throw new Error('Required workingDir argument is not set.');
    }
    if (!(opts instanceof TemplateProcessorOptions)) {
      opts = new TemplateProcessorOptions(opts);
    }
    /**
     * @type {TemplateProcessorOptions}
     */
    this.opts = opts;
    /**
     * Logger object. Any object with interface compatible with platform's
     * console object
     * @type {Object}
     */
    this.logger = logger;
    /**
     * A directory where all operations will be performed
     *
     * @type {String}
     */
    this.workingDir = workingDir;
    /**
     * A flag determining if templates were used with this build.
     * It is be set when the `setTemplates()` function is called.
     *
     * @type {Boolean}
     */
    this.templateUsed = undefined;
    /**
     * Template filename used with this build.
     * It can be `undefined` if the templates are not used with this build.
     * @type {String|undefined}
     */
    this.templateFile = undefined;
    /**
     * Example file name used with embedded version of the console.
     * @type {String|undefined}
     */
    this.exampleFile = undefined;
  }
  /**
   * Sets a name of the template to be used with current build of the
   * API console.
   *
   * If the `mainFile` option is set then templates are not used.
   * Otherwise it sets the `mainFile` option to the template that should be
   * used. Also, sets `templateUsed` flag to determine if template files should
   * be copied to the workingDir location.
   */
  setTemplates() {
    if (this.opts.mainFile) {
      this.logger.info('Will not use a template.');
      this.templateUsed = false;
      return;
    }

    this.templateUsed = true;
    let filename = this.opts.embedded ? 'embedded-' : 'standalone-';
    if (this.opts.useJson) {
      filename += 'json';
      if (this.opts.inlineJson) {
        filename += '-inline';
      }
    } else if (this.opts.raml) {
      filename += 'raml';
    } else {
      filename += 'plain';
    }

    const exampleFile = this.opts.embedded ? filename + '-example.tpl' :
      undefined;
    filename += '.tpl';
    this.logger.info('Template to use: ', filename);

    this.templateFile = filename;
    this.exampleFile = exampleFile;
  }
  /**
   * Copies template files from module's templates directory.
   *
   * @return {Promise} Resolved promise when the templates are copied. Resolve
   * function passes a new `mainFile` option with the template's main file name.
   */
  copyTemplateFiles() {
    if (this.templateUsed === undefined) {
      this.setTemplates();
    }
    if (!this.templateUsed) {
      return Promise.resolve(this.opts.mainFile);
    }
    return this._copyMainTemplate()
    .then(() => this._copyExampleTemplate())
    .then(() => this.opts.mainFile);
  }
  /**
   * Copies main template file to the working directory.
   * @return {Promise}
   */
  _copyMainTemplate() {
    this.logger.info('Copying template file to the working directory...');

    this.opts.mainFile = this.opts.embedded ? 'import.html' : 'index.html';
    const src = path.join(__dirname, '..', 'templates', this.templateFile);
    const dest = path.join(this.workingDir, this.opts.mainFile);
    return fs.copy(src, dest);
  }
  /**
   * Copies example template file to the working directory.
   * @return {Promise}
   */
  _copyExampleTemplate() {
    if (!this.exampleFile) {
      return Promise.resolve();
    }
    this.logger.info('Copying the example file to the working directory...');
    const src = path.join(__dirname, '..', 'templates', this.exampleFile);
    const dest = path.join(this.workingDir, 'example.html');
    return fs.copy(src, dest);
  }
  /**
   * Updates variables in the template file.
   * It only perform the task if a template was used with this build.
   *
   * @param {Object} raml Parsed and enhanced RAML.
   * @return {Promise} Resolved promise after the template variables
   * were updated.
   */
  updateTemplateVars(raml) {
    if (!this.templateUsed || !raml) {
      return Promise.resolve();
    }
    return this._setMainVars(raml)
    .then(() => this._setExampleVars(raml));
  }
  /**
   * It processes variables in the main file.
   *
   * @param {Object} raml Downloaded raml definition.
   * @return {Promise} Promise resolved when the content has been saved to the
   * file.
   */
  _setMainVars(raml) {
    this.logger.info('Updating main file template variables...');
    return this._processFileTemplates(this.opts.mainFile, raml);
  }
  /**
   * If current build is not `embedded` then it processes variables in the
   * `example.html` file.
   *
   * @param {Object} raml Downloaded raml definition.
   * @return {Promise} Promise resolved when the content has been saved to the
   * file.
   */
  _setExampleVars(raml) {
    if (!this.opts.embedded) {
      return;
    }
    this.logger.info('Updating example file template variables...');
    return this._processFileTemplates('example.html', raml);
  }
  /**
   * Reads files contents and calls a function to update variables.
   *
   * @param {String} file Name of the file to readFile
   * @param {Object} raml Downloaded raml definition.
   * @return {Promise} Promise resolved when the content has been saved to the
   * file.
   */
  _processFileTemplates(file, raml) {
    const filePath = path.join(this.workingDir, file);
    return fs.readFile(filePath, 'utf8')
    .then((data) => {
      data = this._processVars(data, raml);
      return data;
    })
    .then((data) => fs.writeFile(filePath, data, 'utf8'));
  }
  /**
   * Updates variables in the `content` with RAML data.
   *
   * @param {String} content File content to update
   * @param {Object} raml Parsed and enhanced JSON from the RAML file.
   * @return {String} Updated file content.
   */
  _processVars(content, raml) {
    content = content.replace('[[API-TITLE]]', raml.title);

    if (this.opts.useJson && this.opts.inlineJson) {
      let jsonData = JSON.stringify(raml);
      content = content.replace('[[API-DATA]]', jsonData);
    }

    if (!this.opts.useJson && this.opts.raml) {
      content = content.replace('[[API-FILE-URL]]', this.opts.raml);
    }

    return content;
  }
  /**
   * Rewrites path to import the API console sources in the main file.
   * This should be used when the console's sources are in the
   * `bower_components` directory and not in the build's root path.
   *
   * @param {?String} consolePath Path where the API console main file exists.
   * Without file name. For example `bower_components/api-console/` which is
   * also the default value. It must be relative path from project's root
   * folder.
   * @return {Promise} Resolved promise when paths were updated.
   */
  rewriteBowerPaths(consolePath) {
    if (!consolePath) {
      consolePath = 'bower_components/api-console/';
    }
    if (consolePath[consolePath.length - 1] !== '/') {
      consolePath += '/';
    }
    consolePath += 'api-console.html';
    const file = path.join(this.workingDir, this.opts.mainFile);
    return this._applyBowerPaths(file, consolePath);
  }
  /**
   * Rewrites bower paths in a file.
   * @param {String} file Path to a file.
   * @param {String} consolePath Path to API console
   * @return {Promise}
   */
  _applyBowerPaths(file, consolePath) {
    let doc;
    return fs.readFile(file, 'utf8')
    .then((content) => {
      doc = parse5.parse(content);
      return this._findImportLink(doc, []);
    })
    .then((links) => {
      if (!links || !links.length) {
        return false;
      }
      return this._updateBowerLinks(links, consolePath);
    })
    .then((result) => {
      if (!result) {
        return;
      }
      const html = parse5.serialize(doc);
      return fs.writeFile(file, html, 'utf8');
    });
  }
  /**
   * Updates links to `bower_components` directory.
   *
   * @param {Array} links AST for links
   * @param {String} consolePath Path to API console
   * @return {Boolean}
   */
  _updateBowerLinks(links, consolePath) {
    for (let i = 0, len = links.length; i < len; i++) {
      let link = links[i];
      let attrs = link.attrs;
      for (let j = 0, aLen = attrs.length; j < aLen; j++) {
        if (attrs[j].name === 'href' && attrs[j].value === 'api-console.html') {
          links[i].attrs[j].value = consolePath;
          return true;
        }
      }
    }
    return false;
  }
  /**
   * Finds `[rel="import"]` in links AST.
   * @param {Object} node Link node AST
   * @param {Object} container
   * @return {Object}
   */
  _findImportLink(node, container) {
    if (node.nodeName === 'link') {
      let attr = node.attrs.find((item) => item.name === 'rel' &&
        item.value === 'import');
      if (attr) {
        container.push(node);
      }
      return container;
    }
    if (node.childNodes && node.childNodes.length) {
      for (let i = 0, len = node.childNodes.length; i < len; i++) {
        let res = this._findImportLink(node.childNodes[i], []);
        if (res && res.length) {
          container = container.concat(res);
        }
      }
    }
    return container;
  }
  /**
   * Copies version 5 templates to working directory.
   *
   * @return {Promise}
   */
  copyV5() {
    const standalone = !this.opts.embedded;
    if (!standalone) {
      return Promise.resolve();
    }
    let tpl = 'v5-' + this.opts.buildType + '.tpl';
    const src = path.join(__dirname, '..', 'templates', tpl);
    const dest = path.join(this.workingDir, 'index.html');
    return fs.copy(src, dest);
  }
  /**
   * @param {Object} vars A list of variables to update the template file:
   * - apiFile {String} - location of the RAML, OAS or json/ld file.
   * - apiTitle {String} - a title of the API
   * @return {Promise}
   */
  processV5Template(vars) {
    const standalone = !this.opts.embedded;
    if (!standalone) {
      return Promise.resolve();
    }
    const filePath = path.join(this.workingDir, 'index.html');
    return fs.readFile(filePath, 'utf8')
    .then((data) => {
      const title = vars.apiTitle || 'API console';
      data = data.replace('[[API-TITLE]]', title);
      if (vars.apiFile) {
        data = data.replace('[[AMF-API-FILE]]', vars.apiFile);
      }
      return data;
    })
    .then((data) => fs.writeFile(filePath, data, 'utf8'));
  }
}
exports.ApiConsoleTemplatesProcessor = ApiConsoleTemplatesProcessor;
