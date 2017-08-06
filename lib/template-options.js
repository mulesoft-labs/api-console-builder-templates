'use strict';
/**
 * Copyright (C) Mulesoft.
 * Shared under Apache 2.0 license
 *
 * @author Pawel Psztyc <pawel.psztyc@mulesoft.com>
 */
/**
 * Options object for the ApiConsoleTemplatesProcessor class.
 *
 * This options are compatible with `api-console-builder` options class.
 */
class TemplateProcessorOptions {
  constructor(opts) {
    opts = opts || {};
    /**
     * Source index file, an entry point to the application.
     * Defaults to `undefined`. Should point to a file that contains web components imports.
     */
    this.mainFile = typeof opts.mainFile === 'string' ? opts.mainFile : undefined;
    /**
     * Path to a RAML file to be used as a data source. Corresponding template
     * is updated with this value.
     * @type {String}
     */
    this.raml = typeof opts.raml === 'string' ? opts.raml : undefined;
    /**
     * If set it selects embedded HTML tag template. Standalone application
     * is selected Otherwise.
     * @type {Boolean}
     */
    this.embedded = typeof opts.embedded === 'boolean' ? opts.embedded : false;
    /**
     * If set it selects JSON data source template.
     * @type {Boolean}
     */
    this.useJson = typeof opts.useJson === 'boolean' ? opts.useJson : false;
    /**
     * To be used with `useJson`. Selects template with inlined JSON.
     * @type {Boolean}
     */
    this.inlineJson = typeof opts.inlineJson === 'boolean' ? opts.inlineJson : false;
  }
}
exports.TemplateProcessorOptions = TemplateProcessorOptions;
