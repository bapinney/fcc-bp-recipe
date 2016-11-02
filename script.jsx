class RecipeBox extends React.Component {
    constructor(props) {
        super(props);
        console.log("inside const");
    }
    
    componentWillMount() {
        console.log("Inside RecipeBox cWM...");
        console.log("Checking if recipies exist in local storage...");
        var recipies;
        if (localStorage.getItem("recipies") == null) {
            console.log("No recipies in local storage... creating initial recipies...");
            recipies = 
                [{name: "Club Sandwich",
                  ingredients: ["bread", "lettuce", "turkey", "ham", "bacon"]},
                 {name: "Chicken Soft Tacos",
                  ingredients: ["chicken", "lettuce", "cheddar cheese", "secret sauce", "tortilla"]},
                 {name: "Powerpuff Girls",
                  ingredients: ["sugar", "spice", "everything nice", "chemical x"]}
                 ];
            console.log("before");
            console.dir(recipies);
            localStorage.setItem("recipies", JSON.stringify(recipies));
            console.log("after");
            var foo = JSON.parse(localStorage.getItem("recipies"));
            console.dir(foo);
        }
        else {
            console.log("Initializing recipies with those in local storage...");
            recipies = JSON.parse(localStorage.getItem("recipies"));
        }
        var rlOutput = [];
        console.log("Here is recipies");
        console.dir(recipies);
        for (var i=0; i<recipies.length; i++) {
            console.log(`At i ${i}`);
            rlOutput.push((<Recipe key={i.toString()} recipie={recipies[i]} tabIndex="0">{recipies[i]["name"]}</Recipe>));
        }
        this.setState({"recipiesList": rlOutput});
    }
    
    render() {
        console.dir("At render");
        console.dir(this.state);
        return (
            <div className="recipebox">
                {this.state.recipiesList}
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
        this.setState({ingredientsList: null});
        console.dir(this);
    }
    
    render() {
        return (<div onClick={this.toggleIngredients.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} tabIndex="0">{"Recipie for " + this.props.recipie.name}
        {this.state.ingredientsList}
        </div>)
    }
    
    handleKeyPress(e) {
        if (e.charCode == 13) {
            this.toggleIngredients(e);
        }
    }
    
    toggleIngredients(e) {
        if (this.state.ingredientsList == null) {
            this.showIngredients(e);
        }
        else {
            this.hideIngredients(e);
        }
    }
    
    hideIngredients(e) {
        console.log("hide!");
        this.setState({ingredientsList: null});
    }
    
    showIngredients(e) {
        console.log("show Ings called");
        console.dir(e.target);
        console.dir(this);    
        console.dir(this.refs);
        var rNode = ReactDOM.findDOMNode(this);
        console.dir(rNode);
        var ingredients = <IngredientsList ingredients={this.props.recipie.ingredients}></IngredientsList>;
        this.setState({ingredientsList: ingredients});
    }
}

class IngredientsList extends React.Component {
    render() {
        return (<div>ingredients list!!!</div>)
    }
}

ReactDOM.render(
    <RecipeBox></RecipeBox>,
    document.getElementById('app')
);
