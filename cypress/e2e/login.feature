Feature: Login test

  Background:
    Given I am on Login page

  Scenario: Login with valid account
    When I login with below data
      | Username | Password |
      | Admin    | admin123 |
    Then I am redirected to Dashboard page
