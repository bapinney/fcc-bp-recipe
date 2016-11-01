class RecipeBox extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentWillMount() {
        console.log("Inside RecipeBox cWM...");
        console.log("Checking if recipies exist in local storage...");
        var recipies;
        if (sessionStorage.getItem("recipies") == null) {
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
            sessionStorage.setItem("recipies", recipies);
            console.log("after");
            var foo = sessionStorage.getItem("recipies");
            console.dir(foo);
        }
        else {
            console.log("Initializing recipies with those in local storage...");
            recipies = sessionStorage.getItem("recipies");
        }
        var rlOutput = [];
        console.log("Here is recipies");
        console.dir(recipies);
        for (var i=0; i<recipies.length; i++) {
            console.log(`At i ${i}`);
            rlOutput.push((<Recipe key={i.toString()} name={recipies[i]["name"]} tabIndex="0">{recipies[i]["name"]}</Recipe>));
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
    }
    
    componentWillMount() {
        console.log("Inside Recipe cWM...");
    }
    
    render() {
        return (<div tabIndex="0">{"Recipie for " + this.props.name}</div>)
    }
}

ReactDOM.render(
    <RecipeBox></RecipeBox>,
    document.getElementById('app')
);
