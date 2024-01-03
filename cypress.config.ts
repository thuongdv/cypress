import {defineConfig} from 'cypress';
import jp from "jsonpath";
import {addCucumberPreprocessorPlugin} from "@badeball/cypress-cucumber-preprocessor";
// @ts-ignore
import browserify from "@badeball/cypress-cucumber-preprocessor/browserify";
import AccessTokenFromCache from "./cypress/support/access-token/AccessTokenFromCache";
import FileHelper from "./cypress/support/helpers/file-helper";
import axios from "axios";
import _ from "lodash/fp";

const allureWriter = require('@shelex/cypress-allure-plugin/writer');
const fsExtra = require('fs-extra');
const path = require('path');
const gmailTester = require('gmail-tester');
const Stopwatch = require('statman-stopwatch');

export default defineConfig({
  env: {
    allure: true,
    allureAttachRequests: true,
    allureReuseAfterSpec: true,
    allureResultsPath: 'reports/allure-results',
    excelTestDataToJSON: false,
    loadingTimeout: 200000,
    waitForControlTimeOut: 30000,
    apiResponseTimeOut: 120000,
    dashboardRefreshTime: 300000
  },
  screenshotsFolder: 'reports/screenshots',
  video: false,
  videoUploadOnPasses: false,
  videosFolder: 'reports/videos',
  defaultCommandTimeout: 20000,
  responseTimeout: 60000,
  pageLoadTimeout: 120000,
  watchForFileChanges: false,
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
  experimentalModifyObstructiveThirdPartyCode: false,
  viewportWidth: 1440,
  viewportHeight: 900,
  e2e: {
    async setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions
    ): Promise<Cypress.PluginConfigOptions> {
      // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
      await addCucumberPreprocessorPlugin(on, config);

      function getConfigurationByFile(file): any {
        const pathToConfigFile = path.resolve('./cypress/config', `${file}.json`);
        return fsExtra.readJson(pathToConfigFile);
      }

      function getTestDataFile(file): any {
        const pathToTestData = path.resolve('./cypress/fixtures', `test-data.${file}.json`);
        return fsExtra.readJSON(pathToTestData);
      }

      const credentialsPath = path.resolve(__dirname, "./cypress/support/gmail-tokens/credentials.json");
      const tokenPath = path.resolve(__dirname, "./cypress/support/gmail-tokens/token.json");

      on(
        "file:preprocessor",
        browserify(config, {
          typescript: require.resolve("typescript"),
        })
      );
      allureWriter(on, config);

      // accept a configFile value or use development by default
      // https://docs.cypress.io/api/plugins/configuration-api#Switch-between-multiple-configuration-files
      const testEnv = config.env.configFile || 'qat';
      const envConfig = await getConfigurationByFile(testEnv);

      on("task", {
        "gmail:get-messages": async args => {
          const tryIn = 180 * 1000;
          const stopWatch = new Stopwatch();
          stopWatch.start();
          let messages;
          do {
            messages = await gmailTester.get_messages(
              credentialsPath,
              tokenPath,
              args.options
            );
          } while (stopWatch.read() < tryIn && messages.length === 0);
          stopWatch.stop();

          return messages;
        },
        "get-test-data": () => {
          return getTestDataFile(testEnv);
        },
        "isAccessTokenValid": (creds) => {
          if (!AccessTokenFromCache.tokenExist()) {
            return false;
          }

          return creds == null ? AccessTokenFromCache.isValid() : AccessTokenFromCache.isValid(creds.email);
        },
        "createAccessToken": ({token, email}) => {
          AccessTokenFromCache.create(token, email);
          return null;
        },
        "getAccessToken": () => {
          return AccessTokenFromCache.getAccessToken();
        },
        "isFileExist": (filePath) => {
          return FileHelper.isFileExist(filePath);
        },
        "jsonQuery": (obj) => {
          return jp.query(obj.json, obj.path);
        },
        "genAccessTokenForUpload": () => {
          // VPN only
          return axios.post(envConfig.env.accessTokenInfo.url, envConfig.env.accessTokenInfo.dataForUpload, {
            auth: envConfig.env.accessTokenInfo.auth,
            headers: {
              apiKey: envConfig.env.accessTokenInfo.apiKey,
              "Content-Type": "application/json",
            }
          }).then((response) => {
            return response.data['access_Token'];
          });
        },
        "printLog": (message) => {
          console.log(message);
          return null;
        }
      });

      // https://github.com/cypress-io/cypress/issues/8525: Reduce Memory Usage
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
          // exposes window.gc() function that will manually force garbage collection
          launchOptions.args.push('--js-flags=--expose-gc');
          launchOptions.args.push('--window-size=1920,1080');
          // This is workaround for Chrome 117
          // https://github.com/cypress-io/cypress-documentation/issues/5479#issuecomment-1719336938
          // read ECONNRESET
          // Error: read ECONNRESET
          //     at TCP.onStreamRead (node:internal/stream_base_commons:217:20)
          if (browser.isHeadless) {
            launchOptions.args = launchOptions.args.map((arg) => {
              if (arg === '--headless') {
                return '--headless=new';
              }

              return arg;
            });
          }
        }

        return launchOptions;
      });

      return _.merge(config, envConfig);
    },
    specPattern: 'cypress/e2e/**/*.feature',
    excludeSpecPattern: ['**/_helpers/**', '**/premium-check/**'],
    baseUrl: 'https://qat-shop.88direct.com/',
  }
});
