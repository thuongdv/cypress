// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// import cypress-allure-adapter first to have all custom
// commands being collapsed in report as parent command
import '@mmisty/cypress-allure-adapter/support';
// Import commands.js using ES2015 syntax:
import "./commands";
// For logging command's duration
import { commandTimings } from "cypress-timings";
import chaiJsonSchema from "chai-json-schema";

commandTimings();

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Reference: https://docs.cypress.io/api/events/catalog-of-events#Uncaught-Exceptions
Cypress.on("uncaught:exception", (err) => {
  if (
    err.message.includes("The user aborted a request") ||
    err.message.includes("Cannot set properties of undefined") ||
    err.message.includes("Cannot read properties of undefined") ||
    err.message.includes("Unexpected token '<'") ||
    err.message.includes("Invalid or unexpected token") ||
    err.message.includes("The following error originated from your application code")
  ) {
    return false;
  }
});

require("cypress-xpath");
require("@cypress/skip-test/support");
// require('cypress-failed-log');

// Hide fetch/XHR requests
// const app = window.top;
//
// if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
//   const style = app.document.createElement('style');
//   style.innerHTML =
//     '.command-name-request, .command-name-xhr { display: none }';
//   style.setAttribute('data-hide-command-log-request', '');
//
//   app.document.head.appendChild(style);
// }

const chai = require("chai");
const chaiSubset = require("chai-subset");
chai.use(chaiSubset);
chai.use(chaiJsonSchema);

// https://github.com/cypress-io/cypress/issues/8525: Reduce Memory Usage
afterEach(() => {
  cy.window().then((win) => {
    // window.gc is enabled with --js-flags=--expose-gc chrome flag
    if (typeof win.gc === "function") {
      // run gc multiple times in an attempt to force a major GC between tests
      win.gc();
      win.gc();
      win.gc();
      win.gc();
      win.gc();
    }
  });
});
