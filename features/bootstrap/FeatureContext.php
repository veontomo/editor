<?php

use Behat\Behat\Context\ClosuredContextInterface,
    Behat\Behat\Context\TranslatedContextInterface,
    Behat\Behat\Context\BehatContext,
    Behat\Behat\Exception\PendingException,
    Behat\Behat\Event\SuiteEvent,
    Behat\Behat\Event\ScenarioEvent;
use Behat\Gherkin\Node\PyStringNode,
    Behat\Gherkin\Node\TableNode,
    Behat\Mink\Element\NodeElement;
use Behat\MinkExtension\Context\MinkDictionary;

use Behat\Behat\Context\Step\Then,
    Behat\Behat\Context\Step\When,
    Behat\Behat\Context\Step\Given;


//
// Require 3rd-party libraries here:
//
//   require_once 'PHPUnit/Autoload.php';
//   require_once 'PHPUnit/Framework/Assert/Functions.php';
//

/**
 * Features context.
 */
class FeatureContext extends BehatContext
{
    use MinkDictionary;
    /**
     * Initializes context.
     * Every scenario gets it's own context object.
     *
     * @param array $parameters context parameters (set them up through behat.yml)
     */
    public function __construct(array $parameters)
    {
        // Initialize your context here
    }


    /**
    * @Then /^I should see the texteditor$/
    */
    public function iShouldSeeTheTexteditor()
    {
        $session = $this->getSession();
        $element = $session->getPage()->find(
             'xpath',
             $session->getSelectorsHandler()->selectorToXpath('xpath', '*//*[@name="editor"]')
         );
        if (null === $element) {
            throw new \InvalidArgumentException('Cannot find editor');
        }else{
            return true;
        }
    }

}
