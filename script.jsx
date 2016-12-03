import React from 'react';
import {render} from 'react-dom';

//Requires react-addons-css-transition-group
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class RecipeBox extends React.Component {
    constructor(props) {
        super(props);
        console.log("inside const");
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
        console.log("Here is recipes variable");
        console.dir(recipes);
        for (var i=0; i<recipes.length; i++) {
            console.log(`At i ${i}`);
            recipes[i].key = i;
            var recipe = (<Recipe key={i.toString()} recipe={recipes[i]}>{recipes[i]["name"]}</Recipe>);
            rlOutput.push(recipe);
        }
        this.recipes = recipes;
        this.setState({"recipesList": rlOutput});
    }
    
    render() {
        console.dir("At render...");
        console.dir(this.state);
        console.dir(this.recipes);
        var recipes = this.recipes; //'this' is not available in return
        var rBox = this;
        
        //Note the usage of onKeyDown instead of onKeyPress.  onKeyPress only fires on _character_ keys.  Arrow keys need to use onKeyDown or onKeyUp
        
        return (
            <div onKeyDown={this.handleKeyDown}>
                <div className="recipebox">
                <button className={"button badge"} id="add_button" onClick={() => {this.newRecipe()}} title="Add new recipe">+</button>
                    {recipes.map(function(name, index) {
                        return (<Recipe key={index} recipe={recipes[index]} deleteRecipe={(e) => {rBox.deleteRecipe(e)}} tabIndex="0">{recipes[index]["name"]}</Recipe>);
                    })}
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
        console.log("At handle keydown");
        switch(e.which) {
            case 38: //Up
                //If there is another recipe to move up to...
                if (e.target.parentNode.previousSibling !== null &&
                    e.target.parentNode.previousSibling.dataset.hasOwnProperty("role") &&
                    e.target.parentNode.previousSibling.dataset.role == "recipe"
                   ) {
                    $(e.target.parentNode.previousSibling.childNodes[0].focus());
                }
                break;
            case 40: //Down
                //If there is another recipe to move down to...
                if (e.target.parentNode.nextSibling !== null &&
                    e.target.parentNode.nextSibling.dataset.hasOwnProperty("role") &&
                    e.target.parentNode.nextSibling.dataset.role == "recipe"
                   ) {
                    $(e.target.parentNode.nextSibling.childNodes[0].focus());
                }
                
                break;
        }
        //e.target.parentNode.previousSibling.focus();
    }
    
    newRecipe() {
        setTimeout(function() { $("#add_button").blur() }, 1000);
        this.showAddModal(); 
    }
    
    deleteRecipe(recipeKey) {
        console.log("At rb dr");
        console.dir(event);
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
        console.log("At input update");
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
        console.log("At addRecipe...");
        console.dir(RBInstance);
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
            
            this.setState({recipesList: recipesList});
            console.dir(this.state);
            
        }
        $('#editModal').modal("hide");
    }
    
    componentDidMount() {
        console.log("RB cDM called.");
        console.dir(this);
        console.log(typeof this.focus);
        //this.refs.recipeBox.focus();
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
            <div className="recipe" data-role="recipe">
                <div className="recipe-title" onClick={this.toggleIngredients.bind(this)}  onKeyPress={this.handleKeyPress.bind(this)} tabIndex="0" data-role="recipe-title">{"Recipe for " + this.props.recipe.name}</div>
                <ReactCSSTransitionGroup 
                   transitionName = "recipe"
                   transitionEnterTimeout={250}
                   transitionLeaveTimeout={250}>
                    { this.state.showIngredientsList && <IngredientsList recipeName={this.props.recipe.name} recipeKey={this.props.recipe.key} ingredients={this.props.recipe.ingredients} deleteRecipe={this.deleteRecipe}/> }
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
        console.log("At R dR()");
        this.props.deleteRecipe(key);
    }
    
    toggleIngredients(e) {
        console.log("At toggleIngred 222");
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
        super(props);
        
        this.toggleCheck = this.toggleCheck.bind(this);
    }
    
    render() {
        var ingredients = [];
        for (var i=0; i < this.props.ingredients.length; i++) {
            ingredients.push(<li key={i} className="ingredients-item unchecked" onClick={(e) => { this.toggleCheck(e)}} onKeyPress={(e) => { this.checkKeyEvent(e)}} tabIndex="0">{this.props.ingredients[i]}</li>);
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
        console.log("Inside dRec");
        this.props.deleteRecipe(this.props.recipeKey);
    }
    
    showEditModal() {
        console.dir(this);
        console.log("Edit called");
        $('#editModal').on('shown.bs.modal', function() {
            console.log("modal shown");
            $('#recipe-edit').focus();
        });
        $('#editModal').modal({show: true});
        console.dir(this.props);
        $('#recipe-edit')[0].value = this.props.recipeName;
        $('#recipe-edit')[0].dataset.recipeKey = this.props.recipeKey;
        $('#ingredients-edit')[0].value = this.props.ingredients.join(", ");
    }
    
    checkKeyEvent(e) {
        if (e.key == " ") this.toggleCheck(e);
        if (e.key == "Enter") this.toggleCheck(e);
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

module.exports = RecipeBox;