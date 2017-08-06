# api-console-builder-templates

[![Build Status](https://travis-ci.org/advanced-rest-client/api-console-builder-templates.svg?branch=master)](https://travis-ci.org/advanced-rest-client/api-console-builder-templates)

A npm module to manage Mulesoft's API console templates in the build process.

This module is mainly used in the [api-console-builder](https://github.com/mulesoft-labs/api-console-builder).

## API

The module exposes 2 classes:

-   [ApiConsoleTemplatesProcessor](lib/templates.js)
-   [TemplateProcessorOptions](lib/template-options.js)

### Examples

Copy template(s) to the working dir:

```javascript
const ApiConsoleTemplatesProcessor = require('api-console-builder-templates');
const options = {
  embedded: true,
  useJson: true
};

const processor = new ApiConsoleTemplatesProcessor('./build/', console, options);
processor.copyTemplateFiles()
.then((mainFile) => console.log('Template copied! Entry point is now: ', mainFile))
.catch(cause => console.error(cause));
```

Update template variables:

```javascript
const raml = await produceRamlAsJson();
processor.updateTemplateVars(raml)
.then(() => console.log('RAML data updated!'))
.catch(cause => console.error(cause));
```

Rewrite paths to console sources if different than default:

```javascript
processor.rewriteBowerPaths('components/api-console/')
.then(() => console.log('Paths updated!'))
.catch(cause => console.error(cause));
```

### TemplateProcessorOptions

This options are compatible with `api-console-builder` options. See [docs](https://github.com/mulesoft-labs/api-console-builder#options) for options description.

| Property | Type | Default |
| -------- | -------- | -------- |
| `mainFile` | `String` | `undefined` |
| `raml` | `String` | `undefined` |
| `embedded` | `Boolean` | `false` |
| `useJson` | `Boolean` | `false` |
| `inlineJson` | `Boolean` | `false` |

### ApiConsoleTemplatesProcessor

#### Constructor

| Argument | Type | Description |
| -------- | -------- | -------- |
| `workingDir` | `String` | Path to a working directory where the console is processed. |
| `logger` | `Object` | Any logger with the interface compatible with platform's `console` object. |
| `options` | `Object` or `TemplateProcessorOptions` | Build options passed to the module. |

#### `copyTemplateFiles()`

Copies template files from module's templates directory to the working location.
Depending on options (`embedded`) it copies main application file or build file and an example of use.

This function do nothing if `mainFile` is set because it means that the build doesn't need a template. It is used with custom builds.
The `mainFile` will be either `index.html` or `example.html` depending on the `embedded` option.

##### Return <Promise>

Resolved promise when the templates are copied. Resolved function has a new `mainFile` argument with the template's main file name.

#### `updateTemplateVars(raml)`

Updates variables in the template file. It only perform the task if a template was used with this build (after calling `copyTemplateFiles()`).

| Argument | Type | Description |
| -------- | -------- | -------- |
| `raml` | `Object` | Parsed to JavaScript object RAML data. Data should be enhanced by the [raml-json-enhance-node](https://github.com/mulesoft-labs/raml-json-enhance-node/) module. |

##### Return <Promise>
Resolved promise after the template variables were set.


#### `rewriteBowerPaths(path)`

Rewrites the path to import the API console sources in the main file.

This should be used when the console's sources are in the `bower_components` or other directory and not in the build's root path.

| Argument | Type | Description |
| -------- | -------- | -------- |
| `path` | `String` | Optional. Default to `bower_components/api-console/`. Path where the API console main file exists. |

##### Return <Promise>
Resolved promise when paths were updated.
