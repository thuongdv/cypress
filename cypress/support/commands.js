// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { waitUntil } from "./custom-commands/wait-until";
import StringHelper from "./helpers/string-helper";

Cypress.Commands.add('waitUntil', { prevSubject: 'optional' }, waitUntil)

Cypress.Commands.add('cget', (selector, options = {}) => {
  if (StringHelper.isXpath(selector)) return cy.xpath(selector, options);
  else return cy.get(selector, options);
});

Cypress.Commands.add('forceVisit', url => {
  cy.window().then(win => {
    return win.open(url, '_self');
  });
});

function getAccessToken(email, password) {
  cy.forceVisit(Cypress.env('_ACCESS_TOKEN'));
  cy.get('#email').type(email, { force: true });
  cy.get('#password').type(password, { force: true });
  cy.get('#next').click({ force: true });
  cy.get('#encodedToken').invoke('text').then((token) => {
    cy.task("createAccessToken", {token: token, email: email}).then(() => {
      return null;
    });
  });
}

function generateAccessToken(creds) {
  cy.task('isAccessTokenValid', creds).then((isValid) => {
    cy.log('Is token valid: ' + isValid);
    if (isValid) return;

    if (creds) {
      getAccessToken(creds.email, creds.password);
    } else {
      cy.task('get-test-data').then((testData) => {
        getAccessToken(testData.emailSignedUp.email, testData.emailSignedUp.password);
      });
    }
  })
}

Cypress.Commands.add('crequest', (options) => {
  generateAccessToken(options.creds);

  cy.task('getAccessToken').then((token) => {
    options.auth = {
      'bearer': token
    };
    options.timeout = Cypress.env('apiResponseTimeOut');
    cy.request(options);
  });
});

Cypress.Commands.add('cqueue', () => {
  return null;
});

// Reference: https://glebbahmutov.com/blog/cypress-using-child-window/
// Handle for error: BrowserAuthError: redirect_in_iframe: Code flow is not supported inside an iframe.
// Please ensure you are using MSAL.js in a top frame of the window if using the redirect APIs, or use the popup APIs. (window.parent !== window) => true
Cypress.Commands.add('openWindow', (url, features) => {
  const w = Cypress.config('viewportWidth')
  const h = Cypress.config('viewportHeight')
  if (!features) {
    features = `width=${w}, height=${h}`
  }
  console.log('openWindow %s "%s"', url, features)

  return new Promise(resolve => {
    if (window.top.aut) {
      console.log('window exists already')
      window.top.aut.close()
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/open
    window.top.aut = window.top.open(url, 'aut', features)

    // letting page enough time to load and set "document.domain = localhost"
    // so we can access it
    setTimeout(() => {
      cy.state('document', window.top.aut.document)
      cy.state('window', window.top.aut)
      resolve()
    }, 500)
  })
})

Cypress.Commands.add("printLog", (message) => {
  // Log to node console
  cy.task("printLog", message);

  // Log to report
  cy.log(message);
})
