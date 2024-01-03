/* tslint:disable:only-arrow-functions typedef */
import {DataTable, Given, Then, When} from '@badeball/cypress-cucumber-preprocessor';
import LoginPage from "../pages/login-page";
import DashboardPage from "../pages/dashboard-page";

const loginPage = new LoginPage();
const dashboardPage = new DashboardPage();

Given('I am on Login page', () => {
    loginPage.open();
});

When('I login with below data', (dataTable: DataTable) => {
    loginPage.login(dataTable.hashes()[0]);
});

Then('I am redirected to Dashboard page', () => {
    dashboardPage.displays();
});
