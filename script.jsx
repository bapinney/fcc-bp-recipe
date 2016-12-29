/* As a reminder (since I keep forgetting) ...
    import, without braces, imports the default module being exported.
    import, with braces, imports a specific member (e.g., function, const, etc...) of a module
    import, with braces, and with commas inside separating each member, imports multiple members of the same module
    import, with "as {alias}" after each member, allows naming an object that will receive the imported property
*/
import React        from 'react';
import {connect}    from 'react-redux'; //Connects to the Redux store
import {render}     from 'react-dom';

//Requires react-addons-css-transition-group
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class RecipeBox extends React.Component {
    constructor(props) {
        super(props);  /* super() allows us to refer to the class that is being extended (in this case, React.Component.)  super.functionA([args]) lets us call functionA in the the parent Object.  super([args]) calls the parent Object's constructor.  In the case of React, it assigns the arguments to 'this.props' */ 
        
        console.log("Inside RB const...");
        
        //This is required so that 'this' is available to the method
        this.deleteRecipe  = this.deleteRecipe.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    
    componentWillMount() {
        console.log("Inside RecipeBox cWM...");
        console.log("Checking if recipes exist in local storage...");
        var recipes;
        if (localStorage.getItem("bapinney_recipes") == null) {
            console.log("No recipes in local storage... creating initial recipes...");
            recipes = 
                [{name: "Club Sandwich",
                  ingredients: ["bread", "lettuce", "turkey", "ham", "bacon"]},
                 {name: "Chicken Soft Tacos",
                  ingredients: ["chicken", "lettuce", "cheddar cheese", "secret sauce", "tortilla"]},
                 {name: "Powerpuff Girls",
                  ingredients: ["sugar", "spice", "everything nice", "chemical x"]}
                 ];
            localStorage.setItem("bapinney_recipes", JSON.stringify(recipes));
        }
        else {
            console.log("Initializing recipes with those in local storage...");
            recipes = JSON.parse(localStorage.getItem("bapinney_recipes"));
        }
        var rlOutput = [];
        console.dir(recipes);
        for (var i=0; i<recipes.length; i++) {
            console.log(`At i ${i}`);
            recipes[i].key = i;
            console.log("Here is recipes[i]...");
            console.dir(recipes[i]);
            var recipe = (<Recipe key={i.toString()} recipe={recipes[i]} deleteARecipe={this.deleteRecipe} />);
            rlOutput.push(recipe);
        }
        console.log("Here is rlOutput...");
        console.dir(rlOutput);
        this.setState({"recipesList": rlOutput});
    }
    
    focusNotify() {
        //Used for testing.  Remove when finished...
        //console.log("I focused.");
    }
    
    //Used for when a new recipe is added, so that RecipeBox can refresh and pass a delete recipe method in the props of the new recipe
    rbRerender(newRbList) {
        console.log("At rbRerender");
        var recipes = newRbList;
        var rlOutput = [];
        console.dir(recipes);
        for (var i=0; i<recipes.length; i++) {
//            debugger;
            console.log(`At i ${i}`);
            console.log("Here is recipes[i]...");
            var key = recipes[i].key;
            
            var recipe = (<Recipe key={key} recipe={recipes[i].props.recipe} deleteARecipe={this.deleteRecipe} />);
            rlOutput.push(recipe);
        }
        this.setState({"recipesList": rlOutput}); //....
        this.render();
    }
    
    render() {
        console.dir("At render...");
        console.dir(this.state.recipesList);
        var rBox = this;
        
        //Note the usage of onKeyDown instead of onKeyPress.  onKeyPress only fires on _character_ keys.  Arrow keys need to use onKeyDown or onKeyUp
        
        return (
            <div autoFocus={true} onFocus={this.focusNotify} ref={(ele) => {this.recipeBox = ele; }} onKeyDown={this.handleKeyDown}>
                <div className="recipebox">
                <button className={"button badge"} id="add_button" onClick={() => {this.newRecipe()}} title="Add new recipe">+</button>
                
                {this.state.recipesList}
                
                </div>
                <div className="modal fade" id="editModal" role="dialog" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title">Edit Recipe</h4>
                            </div>
                            <div className="modal-body">
                                <input type="text" id="recipe-edit"></input>
                                <textarea id="ingredients-edit" rows="3" cols="70"></textarea>
                                <div className="tip">Separate ingredients with a comma</div>
                            </div>
                            <div className="modal-footer">
                                <button accessKey="c" type="button" className="btn btn-default" data-dismiss="modal"><u>C</u>lose</button>
                                <button accessKey="s" type="button" id="recipe-save" className="btn btn-primary" onClick={() => {this.save()}}><u>S</u>ave changes</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="addModal" role="dialog" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title">Add New Recipe</h4>
                            </div>
                            <div className="modal-body">
                                <input type="text" id="new-recipe-title" placeholder="Recipe Name" onChange={() => this.inputUpdate()}></input>
                                <textarea id="new-recipe-ingredients" rows="3" cols="70" placeholder="Ingredient 1, ingredient 2, ingredient 3, etc..." onChange={() => this.inputUpdate()}></textarea>
                                <div className="tip">Separate ingredients with a comma</div>
                            </div>
                            <div className="modal-footer">
                                <button accessKey="a" type="button" id="recipe-add" className="btn btn-success" onClick={() => this.addRecipe()}><u>A</u>dd Recipe</button>
                                <button accessKey="c" type="button" className="btn btn-danger" id="recipe-cancel" data-dismiss="modal" onClick={() => this.inputUpdate()}><u>C</u>ancel</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
    
    handleKeyDown(e) {
        /*
        console.log("At handle keydown");
        console.dir(e);
        console.dir(this);
        */
        switch(e.which) {
            case 13: //Enter    
            case 32: //Space
                if (e.target.dataset.hasOwnProperty("role") && e.target.dataset.role == "recipe") {
                    var recipe = document.evaluate("div[@data-role='recipe-title']", e.target, null, XPathResult.ANY_TYPE, null).iterateNext();
                    if (recipe !== null) {
                        console.log("It's a recipe!");
                        recipe.click(); //Trigger its click event handler to expand it...
                    }
                }
                break;
            case 38: //Up
                if (e.target.dataset.hasOwnProperty("role")) {
                    if (e.target.dataset.role == "recipe") { //If we are at the recipe, go up to the next one
                        if (e.target.previousElementSibling !== null) {
                            if ((e.target.previousElementSibling.dataset.hasOwnProperty("role") && 
                                e.target.previousElementSibling.dataset.role == "recipe") ||
                                e.target.previousElementSibling.id == "add_button"
                               ) 
                            {
                                e.target.previousElementSibling.focus();    
                            }
                        }  
                    }
                    else if (e.target.previousElementSibling == null) {
                        document.evaluate("//ancestor::div[@data-role='recipe']/following::div", e.target, null, XPathResult.ANY_TYPE, null).iterateNext().focus();
                    }
                    else if (e.target.previousElementSibling.tagName == "LI") {
                        e.target.previousElementSibling.focus();
                    }
                }

                else if (e.target.previousElementSibling.tagName == "BUTTON") {
                    e.target.previousElementSibling.focus();
                }
                else if (e.target.previousElementSibling.tagName == "UL") {
                    if (e.target.previousElementSibling.lastElementChild !== null) {
                        e.target.previousElementSibling.lastElementChild.focus();
                    }
                }                
                break;
            case 40: //Down
                if (e.target.dataset.hasOwnProperty("role")) {
                    if (e.target.dataset.role == "recipe") { //If we are at the recipe, go down to the first ingredient...
                        var firstIngredient = document.evaluate("./descendant::li", e.target, null, XPathResult.ANY_TYPE, null).iterateNext();
                        if (firstIngredient == null) {
                            //The recipe is not expanded, so no first ingredient is showing.  Go to the next recipe instead...
                            if (e.target.nextElementSibling !== null) {
                                e.target.nextElementSibling.focus();
                            }
                        }
                        else {
                            firstIngredient.focus();
                        }
                    } 
                    else if (e.target.dataset.role == "ingredient") { //If we are at an ingredient...
                        if (e.target.nextElementSibling !== null) { //...go to the next ingredient, if there is one...
                            e.target.nextElementSibling.focus();
                        }
                        else { //Otherwise go to the next element of the parent (i.e., the Edit button)
                            e.target.parentElement.nextElementSibling.focus();
                        }
                    }
                }
                else if (e.target.tagName == "BUTTON") {
                    if (e.target.nextElementSibling !== null) {
                        e.target.nextElementSibling.focus();
                    }
                    else {
                        var nextRecipe = document.evaluate("./ancestor::div[@data-role='recipe']", e.target, null, XPathResult.ANY_TYPE, null).iterateNext().nextElementSibling;
                        if (nextRecipe !== null) {
                            nextRecipe.focus();
                        }
                    }
                }
                break;
        }
    }
    
    newRecipe() {
        setTimeout(function() { $("#add_button").blur() }, 1000);
        this.showAddModal(); 
    }
       
    deleteRecipe(recipeKey) {
        //debugger;
        console.log("At rb dr");
        console.log(recipeKey);
        console.dir(event);
        console.dir(this);
        console.dir(this.state);
        var recipesList = this.state.recipesList.slice();
        //Note: The recipekey and the index in the recipesList may not always be the same.  Therefore, we need to iterate through the recipesList to find (and confirm) the correct index for the corresponding recipekey
        //TODO: Write for statement here...
        var arrIndex = null;
        for (var i=0; i < recipesList; i++) {
            if (recipesList[i].key == recipeKey) {
                arrIndex = recipeKey;
            }
        }
        
        console.dir(recipesList);
        recipesList.splice(arrIndex, 1);
        console.dir(recipesList);
        this.setState({"recipesList": recipesList});
        this.updateStorage(recipesList);
    }
    
    showAddModal() {
        console.dir(this);
        console.log("Add called");
        $('#addModal').on('shown.bs.modal', function() {
            console.log("Add New Recipe Shown");
            $('#new-recipe-title').focus();
        });
        $('#addModal').modal({show: true});
        this.inputUpdate(); //Ensures the buttons are in their correct states
        console.dir(this.props);
    }
    
    inputUpdate() {
        if ($("#new-recipe-title")[0].value.length > 0 && 
        $("#new-recipe-ingredients")[0].value.length > 0 &&
        $("#recipe-add")[0].disabled == true) {
            $("#recipe-add")[0].disabled = false;
        }
        else if ($("#new-recipe-title")[0].value.length == 0 || 
        $("#new-recipe-ingredients")[0].value.length == 0 &&
        $("#recipe-add")[0].disabled == false){
            $("#recipe-add")[0].disabled = true;
        }
    }
    
    addRecipe() {
        console.dir(this.state);
        var recipesList = this.state.recipesList.slice();
        var newRecipeName = $("#new-recipe-title")[0].value;
        var newRecipeIngredients = $("#new-recipe-ingredients")[0].value.split(",").map(Function.prototype.call, String.prototype.trim);  //Automatically applies trim (i.e., removes extra whitespace) in all elements in the array.  This essentially removes the spaces inbetween commas
        
        //debugger;
        var key = 0;
        for (var i=0; i <= recipesList.length; i++) {
            if (recipesList.find(function(ele) { return ele.key == (i+1) }) == undefined) {
                key = (i+1);
                //debugger;
                break;
            }
        }
        
        console.log(`Recipe key is ${key}`);
        var recipe = {name: newRecipeName, key: key, ingredients: newRecipeIngredients};
        console.dir(recipe);
        var newRecipe = (<Recipe key={key} recipe={recipe} foo={123} depeteARecipe={this.deleteRecipe} />);
        console.dir(newRecipe);
        recipesList.push(newRecipe);
        console.dir(recipesList);
        this.setState({recipesList: recipesList});
        $('#addModal').modal("hide");
        this.updateStorage(recipesList);
        this.rbRerender(recipesList); 
    }
    
    save() {
        console.log("RB save called!");
        console.log("Searching for recipe key...");
        if (typeof Number($('#recipe-edit')[0].dataset.recipeKey) == "number" &&
            typeof $('#recipe-edit')[0].dataset.recipeKey == "string") {
            var recipeKey = Number($('#recipe-edit')[0].dataset.recipeKey);
            
            var recipesList = this.state.recipesList;
            recipesList[recipeKey].props.recipe.name = $("#recipe-edit")[0].value;
            
            var ingredients = $("#ingredients-edit")[0].value.split(",");
            ingredients = ingredients.map(Function.prototype.call, String.prototype.trim);
            recipesList[recipeKey].props.recipe.ingredients = ingredients;
            
            this.setState({recipesList: recipesList}, function() {
                //KEY is in dataset -- Pick up here...
                debugger;
                console.dir(this);
                console.dir(this.props);
            }); //Add a callback to refresh the drawer??
            console.dir(this.state);
            this.render(); //Was force update...
        }
        $('#editModal').modal("hide");
    }
    
    updateStorage(recipesList) {  //updates localStorage with what the provided recipesList..    
        console.log("updateStorage called...");
        console.dir(recipesList);
        var recipes = [];
        /*        [{name: "Club Sandwich",
                  ingredients: ["bread", "lettuce", "turkey", "ham", "bacon"]},
                 {name: "Chicken Soft Tacos",
                  ingredients: ["chicken", "lettuce", "cheddar cheese", "secret sauce", "tortilla"]},
                 {name: "Powerpuff Girls",
                  ingredients: ["sugar", "spice", "everything nice", "chemical x"]}
                 ]; */
        for (var i=0; i<recipesList.length; i++) {
            var recipe = {};
            recipe.name = recipesList[i].props.recipe.name;
            recipe.ingredients = recipesList[i].props.recipe.ingredients;
            recipes.push(recipe);
        }
        console.log("Here is final recipes array...");
        console.dir(recipes);
        localStorage.setItem("bapinney_recipes", JSON.stringify(recipes));
    }
    
    componentDidMount() {
        console.log("RB cDM called.");
        this.recipeBox.focus();
        console.log("Component should've focused...");
    }
}

class Recipe extends React.Component {
    constructor(props) {
        super(props);
        console.log("diring props of recipe");
        console.dir(props);
        this.showIngredients = this.showIngredients.bind(this);
        this.deleteRecipe = this.deleteRecipe.bind(this);
    }
    
    componentWillMount() {
        console.log("Inside Recipe cWM...");
        console.dir(this);
        this.setState({showIngredientsList: false});
    }
    
    render() {
        return (
            <div className="recipe" tabIndex="0" data-role="recipe" data-recipe-id={this.props.recipe.key}>
                <div className="recipe-title" onClick={this.toggleIngredients.bind(this)}  onKeyPress={this.handleKeyPress.bind(this)} data-role="recipe-title">{"Recipe for " + this.props.recipe.name}</div>
                <ReactCSSTransitionGroup 
                   transitionName = "recipe"
                   transitionEnterTimeout={250}
                   transitionLeaveTimeout={250}>
                    { this.state.showIngredientsList && <IngredientsList recipeName={this.props.recipe.name} recipeKey={this.props.recipe.key} ingredients={this.props.recipe.ingredients} deleteRecipe={this.props.deleteARecipe}/> }
                </ReactCSSTransitionGroup>
            </div>
        )
    }
    
    handleKeyPress(e) {
        if (e.charCode == 13) {
            this.toggleIngredients(e);
        }
    }
    
    deleteRecipe(key) {
        //debugger;
        console.log(`deleteRecipe called for key ${key}...`);
        console.dir(this);
    }
    
    toggleIngredients(e) {
        console.log("At toggleIngred");
        console.dir(e);
        console.dir(e.target);
        if (!this.state.showIngredientsList) {
            this.showIngredients(e);
        }
        else {
            this.hideIngredients(e);
        }
    }
    
    hideIngredients(e) {
        this.setState({showIngredientsList: false});
    }
    
    showIngredients(e) {
        this.setState({showIngredientsList: true});
    }
}

class IngredientsList extends React.Component {
    
    constructor(props) {
        super(props); //Makes the attributes in <IngredientsList> available in this.props
        console.dir(props);
        if (props.hasOwnProperty("recipeName") && props.hasOwnProperty("ingredients") && Array.isArray(props.ingredients)) {
            console.log("%cIngredientsList constructor validation OK", 'background: linear-gradient(#31D306, #145702); border: 1px solid #3E0E02; border-radius: 4px; color: white; display: block; font-size: 14px; text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.6); padding-right: 10px; line-height: 20px; text-align: center; font-weight: bold');
            this.state = {recipeName: props.recipeName, ingredients: props.ingredients, fooy: "bary"};
        }
        this.toggleCheck = this.toggleCheck.bind(this);
    }
    
    render() {
        var ingredients = [];
        for (var i=0; i < this.state.ingredients.length; i++) {
            ingredients.push(<li key={i} className="ingredients-item unchecked" onClick={(e) => { this.toggleCheck(e)}} onKeyPress={(e) => { this.checkKeyEvent(e)}} data-role="ingredient" tabIndex="0">{this.state.ingredients[i]}</li>);
        }
        
        return (
            <div className="ingredients-list">
                <ul>{ingredients}</ul>
                <button accessKey="e" className="edit-btn" onClick={() => { this.showEditModal(this.props)}}><i className="fa fa-edit"></i><u>E</u>dit Recipe</button>
                <button accessKey="d" className="delete-btn" onClick={() => { this.deleteRecipe(this.props)}}><i className="fa fa-remove"></i><u>D</u>elete Recipe</button>
            </div>
        )
    }
    
    deleteRecipe() {
        //debugger;
        console.log("Inside dRec");
        console.dir(this); //Look for this.props.deleteRecipe...
        this.props.deleteRecipe(this.props.recipeKey);
    }
    
    showEditModal() {
        console.dir(this);
        console.log("Edit called");
        $('#editModal').on('shown.bs.modal', function() {
            console.log("Detaching any modal event listeners from previous instances...");
            $("#recipe-save").off("click");
            console.log("Attaching modal event listener for this ingredient list...");
            $("#recipe-save").click(function() {
                e => this.foo(); //PICK UP HERE!!!
            });
            console.log("modal shown");
            $('#recipe-edit').focus();
        });
        $('#editModal').modal({show: true});
        console.dir(this.props);
        $('#recipe-edit')[0].value = this.props.recipeName;
        $('#recipe-edit')[0].dataset.recipeKey = this.props.recipeKey;
        $('#ingredients-edit')[0].value = this.props.ingredients.join(", ");
    }
    
    foo(e) {
        debugger;
        console.dir(this);
        console.dir(e);
        this.bar();
        var updatedIngs = $("#recipe-edit")[0].value.split(",").map(Function.prototype.call, String.prototype.trim);
        this.setState({ingredients: updatedIngs});
        
    }
    
    bar() {
        debugger;
        console.log("bar123");
    }
    
    checkKeyEvent(e) {
        if (e.key == " ") this.toggleCheck(e);
        if (e.key == "Enter") this.toggleCheck(e);
        if (e.key == "s") console.dir(this.state); //Remove when finished testing...
    }
    
    toggleCheck(e) {
        console.log("Toggle check called");
        if (e.target.classList.contains("unchecked")) {
            e.target.classList.remove("unchecked");
            e.target.classList.add("checked");
        }
        else {
            e.target.classList.remove("checked");
            e.target.classList.add("unchecked");            
        }
    }
}

function mapStateToProps(state) {
    return {state};
}

//module.exports = RecipeBox;
export default connect(mapStateToProps)(RecipeBox)