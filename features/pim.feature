@pim
Feature: PIM - Employee management
  As an HR admin
  I want to add, find and delete employees
  So that employee records stay accurate

  Background:
    Given I am logged in as an admin user

  @smoke @regression
  Scenario: Add a new employee
    When I add a new employee with unique details
    Then the employee should be saved successfully

  @regression
  Scenario: Search for a newly added employee
    Given I have added a new employee
    When I search the employee list by the new employee id
    Then the employee should appear in the search results

  @regression
  Scenario: Delete an employee
    Given I have added a new employee
    When I search the employee list by the new employee id
    And I delete the employee from the results
    Then searching for the employee id should return no records
