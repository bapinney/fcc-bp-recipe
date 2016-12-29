/* Comment these two lines out when Browserifying for Codepen ... */
var React = require('react');
var ReactDOM = require('react-dom');
//var RecipeBox = require('./script.jsx');
import RecipeBox from './script.jsx';

import {createStore} from 'redux'; //Imports the createStore function from Redux
import {Provider} from 'react-redux'; //Imports the Provider component from React Redux.  This passes our store down through all of our compoments in the app...

//This is our reducer
var reducer = function(state = {}, action) {
    switch(action) {
        default:
            return state;  
    }   
}

/* 
    Although I have seen some examples with the createStore() result
    being assigned to a const, the Redux docs show it assigned to a
    block-scoped variable via 'let'
    
    Remember, there should only be ONE store in a Redux app!
*/
let rbStore = createStore(reducer);

ReactDOM.render((
    <Provider store={rbStore}>
        <RecipeBox />
    </Provider>
), document.getElementById('app'), function() {
   console.log("RDOM Render completed"); 
});

$("body").on("keydown", function(e) { handleKeyDown(e) });

var handleKeyDown = function(e) {
    if (e.target.tagName == "BODY") {
        if (e.which == 40) {
            //console.log("Focusing on the first .recipe-title...");
            $(".recipe")[0].focus();
        }
        if (e.which == 38) {
            //console.log("Focusing on the last .recipe-title...");
            $(".recipe")[$(".recipe").length - 1].focus();
        }
    }
}