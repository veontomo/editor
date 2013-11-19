Feature: testing basic properties of the site
	Scenario: presence of algorithm
		Given I am on the homepage
		Then I should see "Algoritmo"
		Then I should see the texteditor

		Then show last response
		