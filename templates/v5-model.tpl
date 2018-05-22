<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1, user-scalable=yes">
  <title>[[API-TITLE]]</title>
  <script src="bower_components/webcomponentsjs/webcomponents-loader.js"></script>
  <link rel="import" href="bower_components/shadycss/apply-shim.html">
  <link rel="import" href="bower_components/polymer/lib/elements/custom-style.html">
  <link rel="import" href="bower_components/app-route/app-location.html">
  <link rel="import" href="bower_components/api-console/api-console.html">
  <link rel="import" href="bower_components/api-console/api-console-styles.html">
  <custom-style>
    <style is="custom-style">
    html,
    body {
      height: 100%;
      background-color: #fff;
    }

    api-console {
      background-color: #fff;
    }

    [hidden] {
      display: none !important;
    }
    </style>
  </custom-style>
</head>
<body unresolved>
  <app-location use-hash-as-path></app-location>
  <api-console aware="api-model"></api-console>
  <script>
  /**
   * The following script will handle API console routing when using the c
   * onsole as a standalone application.
   *
   * It uses native JavaScript APIs so it can be used outside Polymer scope.
   *
   * @author Pawel Psztyc <pawel.psztyc@mulesoft.com>
   */
  (function() {
    'use strict';
    // API Console namespace.
    const apiconsole = {};
    // Namespace for standalone application.
    apiconsole.app = {};
    /**
     * Initialize event listeners for console's path and page properties
     * and observers router data change.
     */
    apiconsole.app.init = function() {
      apiconsole.app.setInitialRouteData();
      apiconsole.app.observeRouteEvents();
      apiconsole.app.loadApi('[[AMF-API-FILE]]');
    };
    /**
     * Reads inital route data from the `app-location` component.
     * If the route has any data the it is stored as a apiconsole.app.__initial*
     * propertues which are eventually restored after AMF model is set.
     *
     * Note that setting amfModel automatically resets navigation to
     * `/summary`
     */
    apiconsole.app.setInitialRouteData = function() {
      // sets the initial path for routing from external source.
      // The API console sets default path to `summary` after AMF data change.
      const location = document.querySelector('app-location');
      let locationPath = location.path;
      if (!locationPath) {
        return;
      }
      if (locationPath[0] === '/') {
        locationPath = locationPath.substr(1);
      }
      let _route = locationPath.split('/');
      let page = _route[0];
      let type = _route[1];
      let selected = _route[2];
      if (page) {
        apiconsole.app.__initialPage = page;
      }
      if (type) {
        apiconsole.app.__initialType = type;
      }
      if (selected) {
        apiconsole.app.__initialSelected = decodeURIComponent(selected);
      }
    };
    /**
     * Loads AMF json/ld from a file and reinitialize routes.
     * @param {String} url Location of the file with AMF model
     */
    apiconsole.app.loadApi = function(url) {
      if (!url) {
        return;
      }
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('error', function() {
        apiconsole.app.notifyInitError('Unable to load file');
      });
      xhr.addEventListener('loadend', function() {
        apiconsole.app._apiLoadEndHandler(xhr);
      });
      xhr.open('GET', url, true);
      try {
        xhr.send();
      } catch (e) {
        apiconsole.app.notifyInitError(e.message);
      }
    };
    apiconsole.app._apiLoadEndHandler = function(xhr) {
      var data;
      try {
        data = JSON.parse(xhr.response);
      } catch (e) {
        apiconsole.app.notifyInitError(e.message);
        return;
      }
      const apic = document.querySelector('api-console');
      apic.amfModel = data;
      apic.resetLayout();
      if (apiconsole.app.__initialType && apiconsole.app.__initialSelected) {
        apiconsole.app.selectionChanged(
          apiconsole.app.__initialSelected,
          apiconsole.app.__initialType,
          apiconsole.app.__initialPage
        );
      }
      apiconsole.app.__initialPage = undefined;
      apiconsole.app.__initialSelected = undefined;
      apiconsole.app.__initialType = undefined;
    };
    /**
     * Adds event listeres to elements that are related to the routing:
     * app-location, app-route and api-console.
     */
    apiconsole.app.observeRouteEvents = function() {
      let apic = document.querySelector('api-console');
      let location = document.querySelector('app-location');

      apic.addEventListener('api-navigation-selection-changed', apiconsole.app._selectionChanged);
      apic.addEventListener('page-changed', apiconsole.app._pageChanged);
      location.addEventListener('route-changed', apiconsole.app._routeChanged);
    };
    // Event handler for the selection change.
    apiconsole.app._selectionChanged = function(e) {
      if (e.detail.passive === true) {
        return;
      }
      apiconsole.app.selectionChanged(e.detail.selected, e.detail.type, e.target.page);
    };
    // Called when path changed from the api-console.
    apiconsole.app.selectionChanged = function(selected, type, page) {
      if (!selected || !type) {
        return;
      }
      page = page || 'docs';
      let location = document.querySelector('app-location');
      let newPath = [page, type, encodeURIComponent(selected)].join('/');
      if (newPath !== location.path) {
        location.set('path', newPath);
      }
    };
    // Event handler for the page change.
    apiconsole.app._pageChanged = function(e) {
      apiconsole.app.selectionChanged(e.target.selectedShape, e.target.selectedShapeType, e.detail.value);
      apiconsole.app.pageChanged(e.detail.value);
    };
    // Called when page change.
    apiconsole.app.pageChanged = function(page) {
      let apiConsole = document.querySelector('api-console');
      if (apiConsole.page !== page) {
        apiConsole.page = page;
      }
    };
    // Event handler for the route change.
    apiconsole.app._routeChanged = function(e) {
      apiconsole.app.routeChanged(e.detail.value);
    };
    // Updates api console path if different than curent URL
    apiconsole.app.routeChanged = function(route) {
      let locationPath = route.path;
      if (!locationPath || locationPath === '/') {
        document.querySelector('app-location').set('path', '/docs');
        return;
      }
      if (locationPath[0] === '/') {
        locationPath = locationPath.substr(1);
      }
      let _route = locationPath.split('/');
      let page = _route[0];
      let type = _route[1];
      let selected = _route[2];
      if (selected) {
        selected = decodeURIComponent(selected);
      }
      let apic = document.querySelector('api-console');
      if (apic.page !== page) {
        apic.page = page;
      }
      if (apic.selectedShapeType !== type) {
        apic.selectedShapeType = type;
      }
      if (apic.selectedShape !== selected) {
        apic.selectedShape = selected;
      }
    };
    /**
     * Reads page name and the path from location path.
     *
     * @param {String} locationPath Current path read from path change event or
     * read fomr the `app-location` element.
     * @return {Object}
     */
    apiconsole.app._readPagePath = function(locationPath) {
      let parsedPath = locationPath.replace(/\-/g, '.');
      if (parsedPath[0] === '/') {
        parsedPath = parsedPath.substr(1);
      }
      let _route = parsedPath.split('/');
      let page = _route[0];
      let path = _route[1];
      return {
        page: page,
        path: path
      };
    };
    // Notifys user when something went wrong...
    apiconsole.app.notifyInitError = function(message) {
      window.alert('Cannot initialize API console. ' + message);
    };
    if (window.WebComponents && window.WebComponents.ready) {
      apiconsole.app.init();
    } else {
      window.addEventListener('WebComponentsReady', apiconsole.app.init);
    }
  })();
  </script>
</body>
</html>
