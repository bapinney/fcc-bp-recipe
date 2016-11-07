var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

class RecipeBox extends React.Component {
    constructor(props) {
        super(props);
        console.log("inside const");
    }
    
    componentWillMount() {
        console.log("Inside RecipeBox cWM...");
        console.log("Checking if recipes exist in local storage...");
        var recipes;
        if (localStorage.getItem("recipes") == null) {
            console.log("No recipes in local storage... creating initial recipes...");
            recipes = 
                [{name: "Club Sandwich",
                  ingredients: ["bread", "lettuce", "turkey", "ham", "bacon"]},
                 {name: "Chicken Soft Tacos",
                  ingredients: ["chicken", "lettuce", "cheddar cheese", "secret sauce", "tortilla"]},
                 {name: "Powerpuff Girls",
                  ingredients: ["sugar", "spice", "everything nice", "chemical x"]}
                 ];
            console.log("before");
            console.dir(recipes);
            localStorage.setItem("recipes", JSON.stringify(recipes));
            console.log("after");
            var foo = JSON.parse(localStorage.getItem("recipes"));
            console.dir(foo);
        }
        else {
            console.log("Initializing recipes with those in local storage...");
            recipes = JSON.parse(localStorage.getItem("recipes"));
        }
        var rlOutput = [];
        console.log("Here is recipes");
        console.dir(recipes);
        for (var i=0; i<recipes.length; i++) {
            console.log(`At i ${i}`);
            recipes[i].key = i;
            rlOutput.push((<Recipe key={i.toString()} recipe={recipes[i]} tabIndex="0">{recipes[i]["name"]}</Recipe>));
        }
        this.recipes = recipes;
        this.setState({"recipesList": rlOutput});
    }
    
    render() {
        console.dir("At render");
        console.dir(this.state);
        console.dir(this.recipes);
        var recipes = this.recipes; //'this' is not available in return
        return (
            <div ref="recipeBox">
                <div className="recipebox">
                    {recipes.map(function(name, index) {
                        return (<Recipe key={index} ref={"recipe-" + index} recipe={recipes[index]} tabIndex="0">{recipes[index]["name"]}</Recipe>);
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
            </div>
        )
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
    
    componentDidUpdate() {
        console.log("Update state called!");
        console.dir(this.state);
    }
}

class Recipe extends React.Component {
    constructor(props) {
        super(props);
        console.log("diring props of recipe");
        console.dir(props);
        this.showIngredients = this.showIngredients.bind(this);
    }
    
    componentWillMount() {
        console.log("Inside Recipe cWM...");
        console.dir(this);
        this.setState({showIngredientsList: false});
    }
    
    render() {
        return (
            <div className="recipe">
                <div className="recipe-title" onClick={this.toggleIngredients.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} tabIndex="0">{"Recipe for " + this.props.recipe.name}</div>
                <ReactCSSTransitionGroup 
                   transitionName = "recipe"
                   transitionEnterTimeout={250}
                   transitionLeaveTimeout={250}>
                    { this.state.showIngredientsList && <IngredientsList recipeName={this.props.recipe.name} recipeKey={this.props.recipe.key} ingredients={this.props.recipe.ingredients} /> }
                </ReactCSSTransitionGroup>
            </div>
        )
    }
    
    handleKeyPress(e) {
        if (e.charCode == 13) {
            this.toggleIngredients(e);
        }
    }
    
    toggleIngredients(e) {
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
    }
    
    render() {        
        var ingredients = this.props.ingredients.map(function(item, i, arr) {
            return (
                <li key={i} className="ingredients-item">{item}</li>
            )
        })
        return (
            <div className="ingredients-list">
                <ul>{ingredients}</ul>
                <button accessKey="e" onClick={() => { this.showEditModal(this.props)}}><i className="fa fa-edit"></i><u>E</u>dit</button>
            </div>
        )
    }
    
    recipeSave() {
        console.log("rsave called!");
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
}

ReactDOM.render(
    <RecipeBox></RecipeBox>,
    document.getElementById('app')
);
