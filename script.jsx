class RecipeBox extends React.Component {
    render() {
        var recipies = ['chicken', 'liver', 'meow mix'];
        return (
            <div className="recipebox">
                {recipies.map(function(name, index) {
                    return (<div key={index}>{name}</div>);
                })}
            </div>
        )
    }
}

ReactDOM.render(
    <RecipeBox></RecipeBox>,
    document.getElementById('app')
);
