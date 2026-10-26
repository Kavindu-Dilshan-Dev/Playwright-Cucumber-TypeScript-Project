@dashboard
Feature: Dashboard and navigation
  As a logged-in admin
  I want to see the dashboard and navigate between modules
  So that I can reach the HR features I need

  Background:
    Given I am logged in as an admin user

  @smoke @regression
  Scenario Outline: Dashboard widgets are displayed
    Then I should see the dashboard widget "<widget>"

    Examples:
      | widget           |
      | Time at Work     |
      | My Actions       |
      | Quick Launch     |
      | Employee Distribution by Sub Unit |

  @regression
  Scenario Outline: Navigate to modules from the side menu
    When I open the "<menu>" menu
    Then the page header should show "<header>"

    Examples:
      | menu        | header      |
      | Admin       | Admin       |
      | PIM         | PIM         |
      | Leave       | Leave       |
      | Directory   | Directory   |
