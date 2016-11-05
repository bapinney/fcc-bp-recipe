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
            rlOutput.push((<Recipe key={i.toString()} recipe={recipes[i]} tabIndex="0">{recipes[i]["name"]}</Recipe>));
        }
        this.setState({"recipesList": rlOutput});
    }
    
    render() {
        console.dir("At render");
        console.dir(this.state);
        return (
            <div className="recipebox">
                {this.state.recipesList}
            </div>
        )
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
                    { this.state.showIngredientsList && <IngredientsList recipeName={this.props.recipe.name} ingredients={this.props.recipe.ingredients} /> }
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
    
    componentWillMount() {
        console.log("inside iL CWM...");
        console.dir(this);
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
    
    showEditModal() {
        console.dir(this);
        console.log("Edit called");
        $('#editModal').modal({show: true});
        console.dir(this.props);
        $('#recipe-edit')[0].value = this.props.recipeName;
        $('#ingredients-edit')[0].value = this.props.ingredients.join(", ");
    }
}

ReactDOM.render(
    <RecipeBox></RecipeBox>,
    document.getElementById('app')
);
