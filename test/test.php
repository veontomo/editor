<?php
/**
 * Class MarkTaskDoneTest
 *
 * @group SeleniumTest
 */

class WebTest extends PHPUnit_Extensions_Selenium2TestCase
{
    private $_url = 'http://localhost/projects/editor/';

    protected function setUp(){
        $this->setBrowser('firefox');
        $this->setBrowserUrl($this->_url);
    }

    public function setUpPage(){
        $this->url($this->_url);
    }

    public function testTitle(){
        $this->assertEquals('Creatore di newsletter', $this->title());
    }

    public function testPresenceOfEditor(){
        $elements = $this->byCssSelector('.editor');
        $this->assertEquals(count($elements), 1);
        echo $elements->text();
        // echo $this->source();
        // $this->assertEquals($elements[0], 1);

    }

    /**
     * Testing whether the typed text appears in the editor
     * @group current
     */
    public function testTypeText(){
        sleep(5);
        $this->timeouts()->implicitWait(10000);
        $editor = $this->byCssSelector('.editor');
        $editor->value('il testo da inserire');
        sleep(5);
        $this->timeouts()->implicitWait(10000);
        $this->assertEquals('il testo da inserire', $editor->value());
    }
 
}
?>  