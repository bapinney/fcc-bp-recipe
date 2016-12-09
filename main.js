var React = require('react');
var ReactDOM = require('react-dom');

//Used for debugging.  Remove when finished...
window.React = React;
window.ReactDOM = ReactDOM;
//

var RecipeBox = require('./script.jsx');
//import RecipeBox from './script.jsx';


console.log("here is RecipeBox");
console.dir(RecipeBox);

ReactDOM.render(<RecipeBox />, document.getElementById('app'), function() {
    document.getElementById('app').focus();
});

$("body").on("keydown", function(e) { handleKeyDown(e) });

var handleKeyDown = function(e) {
    console.log("At hKD");
    console.dir(e);
    if (e.target.tagName == "BODY") {
        console.log("Arrow key pressed in BODY");
        if (e.which == 40) {
            console.log("Focusing on the first .recipe-title...");
            $(".recipe")[0].focus();
        }
        if (e.which == 38) {
            console.log("Focusing on the last .recipe-title...");
            $(".recipe")[$(".recipe").length - 1].focus();
        }
    }
}