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
  /**
   * @constructor
   * @param {Object} opts User options
   */
  constructor(opts) {
    opts = opts || {};
    /**
     * Source index file, an entry point to the application.
     * Defaults to `undefined`. Should point to a file that contains web
     * components imports.
     * @deprecated This option is only available to API console version 4 which
     * is deprecated. This option will be removed in Q4 2018
     */
    this.mainFile = typeof opts.mainFile === 'string' ?
      opts.mainFile : undefined;
    /**
     * Path to a RAML file to be used as a data source. Corresponding template
     * is updated with this value.
     * @type {String}
     * @deprecated This option is only available to API console version 4 which
     * is deprecated. This option will be removed in Q4 2018
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
     * @deprecated This option is only available to API console version 4 which
     * is deprecated. This option will be removed in Q4 2018
     */
    this.useJson = typeof opts.useJson === 'boolean' ? opts.useJson : false;
    /**
     * To be used with `useJson`. Selects template with inlined JSON.
     * @type {Boolean}
     * @deprecated This option is only available to API console version 4 which
     * is deprecated. This option will be removed in Q4 2018
     */
    this.inlineJson = typeof opts.inlineJson === 'boolean' ?
      opts.inlineJson : false;
    /**
     * API console build type.
     *
     * This is version 5 option only.
     *
     * Can be one of:
     * - model - Uses generated json/ld model
     * - api - Uses AMF parser that points to an API file
     * - plain - Uses no input data. Just builds the console.
     * @type {String}
     */
    this.buildType = typeof opts.buildType === 'string' ? opts.buildType :
      'plain';
    /**
     * If true then it uses API console v5 template.
     *
     * @type {Boolean}
     * @deprecated This option is only available to API console version 4 which
     * is deprecated. This option will be removed in Q4 2018. After that version
     * 5 is a default build.
     */
    this.isV5 = opts.isV5 || false;
  }
}
exports.TemplateProcessorOptions = TemplateProcessorOptions;
