@login
Feature: Login
  As an OrangeHRM user
  I want to log in and out of the application
  So that I can securely access HR functionality

  Background:
    Given I am on the OrangeHRM login page

  @smoke @regression
  Scenario: Successful login with valid credentials
    When I login with valid admin credentials
    Then I should be redirected to the dashboard

  @regression
  Scenario Outline: Login fails with invalid credentials
    When I login with username "<username>" and password "<password>"
    Then I should see the login error "Invalid credentials"

    Examples:
      | username  | password    |
      | Admin     | wrongpass   |
      | wronguser | admin123    |
      | wronguser | wrongpass   |

  @regression
  Scenario: Required field validation when both fields are empty
    When I login with username "" and password ""
    Then I should see "Required" validation on both fields

  @smoke @regression
  Scenario: User can log out
    When I login with valid admin credentials
    And I logout from the application
    Then I should be back on the login page
