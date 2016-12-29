var assert = chai.assert,
    expect = chai.expect;

describe('Add, edit, and delete recipes', function() {
    it('should check the add modal exists and is initially hidden', function() {
        var addModal = document.getElementById("addModal");
        expect(addModal).to.exist;
        expect(addModal.style.display).to.be.oneOf(['', 'none']);
    });
    
    it('should click the Add button and see the add modal', function(done) {
        this.timeout(6000);
        var addBtn = document.getElementById("add_button");
        var addModal = document.getElementById("addModal");
        expect(addBtn).to.exist;
        addBtn.click();
        setTimeout(function() {
            expect(addModal.style.display).to.equal("block");
            done();            
        }, 2000); //Ensures the add modal has had time to appear
    });
    
    var recipeName = "Dish " + Math.floor(Math.random()*(999999-100000+1)+100000);
    var rlLen, newRecpEle;
    
    
    it('should add a recipe and verify it appears in the list', function(done) {
        this.timeout(15000);
        
        var i = 1;
        var intervalBuffer = 4000; //ms
        var prevNRecipes = document.querySelectorAll("[data-role='recipe']").length;
        var addRecipeBtn = document.getElementById("recipe-add");
        
        setTimeout(function() {
            expect(addRecipeBtn).to.exist;
            expect(document.getElementById("recipe-add").disabled).to.be.true;

            var cancelRecipeBtn = document.getElementById("recipe-cancel");
            expect(cancelRecipeBtn).to.exist;

            var rnInput = document.getElementById("new-recipe-title");
            expect(rnInput).to.exist;
            rnInput.value = recipeName;
            var ingsInput = document.getElementById("new-recipe-ingredients");
            ingsInput.value = "Ingredient 1, Ingredient 2, Ingredient 3, Ingredient 4";
            document.getElementById("new-recipe-ingredients").dispatchEvent(new Event('input', { bubbles: true })) //Trigger the onChange since programmatically setting the input value alone does not trigger it.

        }, i*intervalBuffer); //This extra delay helps to ensure the Bootstrap modal has fully appeared and rendered...
        
        i++;
        
        setTimeout(function() {
            addRecipeBtn.click();
        }, i*intervalBuffer); //This gives time to see what is in the inputs before the button is clicked...
        
        i++;
        
        setTimeout(function() {
            var curNRecipes = document.querySelectorAll("[data-role='recipe']").length;
            assert.equal(curNRecipes, (prevNRecipes + 1), "curNRecipes is 1 greater than prevNRecipes");
            done();
        }, i*intervalBuffer);
        
    });
    
    it('should click on that newly-added recipe and see 4 ingredients', function(done) {
        this.timeout(5000);
        
        rlLen = document.querySelectorAll("[data-role='recipe']").length;
        newRecpEle = document.querySelectorAll("[data-role='recipe']")[rlLen - 1];
        expect(newRecpEle.children[0].innerText).to.equal("Recipe for " + recipeName);
        newRecpEle.children[0].click();
        
        setTimeout(function() {
            done();
        }, 2000);
    });
    
    
    it('should click on the second ingredient in that recipe to toggle checkmark', function() {
        
        //Box should initially be unchecked...
        console.dir(newRecpEle);
        assert(newRecpEle.children[1].children[0].children[0].children[1].classList.contains("unchecked"), true, "Second ingredient in newly-added recipe is initially unchecked.");
        
        //Click that ingredient and ensure it is checked...
        newRecpEle.children[1].children[0].children[0].children[1].click();
        assert(newRecpEle.children[1].children[0].children[0].children[1].classList.contains("checked"), true, "Second ingredient in newly-added recipe is now checked.");
        
    });
    
    it('should check, then uncheck, the 3rd ingredient to verify checkmarks can be removed', function(done) {
        
        //Box should initially be unchecked...
        console.dir(newRecpEle);
        assert(newRecpEle.children[1].children[0].children[0].children[2].classList.contains("unchecked"), true, "Second ingredient in newly-added recipe is initially unchecked.");
        
        //Click that ingredient and ensure it is checked...
        newRecpEle.children[1].children[0].children[0].children[2].click();
        assert(newRecpEle.children[1].children[0].children[0].children[2].classList.contains("checked"), true, "Second ingredient in newly-added recipe is now checked.");
        
        newRecpEle.children[1].children[0].children[0].children[2].click();
        assert(newRecpEle.children[1].children[0].children[0].children[2].classList.contains("unchecked"), true, "Second ingredient in newly-added recipe is now unchecked.");
        
        done();
    });
    
    
    it('should check the edit modal exists and initially is hidden', function(done) {
        var editModal = document.getElementById("editModal");
        expect(editModal).to.exist;
        expect(editModal.style.display).to.be.oneOf(['', 'none']);
        done();
    });
    
    it('should check the edit button for the recipe is the first button and says "Edit Recipe"', function(done) {
        var editBtn = newRecpEle.querySelectorAll("button")[0];
        assert(editBtn.classList.contains("edit-btn"), true, "The first button has a class of edit-btn");
        assert(editBtn.innerText, "Edit Recipe", "The first button says edit recipe");
        assert(editBtn.accessKey, "e", "Accesskey for the edit button is 'e'");
        done();
    });
    
    it('should click the edit button and see the edit modal', function(done) {
        this.timeout(6000);
        var editBtn = newRecpEle.querySelectorAll("button")[0];
        editBtn.click();
        setTimeout(function() {
            expect(editModal.style.display).to.equal("block");
            done();            
        }, 2000); //Ensures the edit modal has had time to appear
    });
    
    it('should check the edit modal recipe name matches the previously entered recipe name', function() {
        expect(document.querySelector("#recipe-edit").value).to.equal(recipeName, "Recipe name matches what was previously entered.");
    });
    
    it('should have 4 ingredients in the ingredients input', function() {
        var ingredients = document.querySelector("#ingredients-edit").value.split(", ");
        assert(ingredients.length, 4, "There are 4 ingredients");
    });
    
    it('should modify the 3rd ingredient and see it update in the recipe box', function(done) {
        this.timeout(9000);
        var ingredients = document.querySelector("#ingredients-edit").value.split(", ");
        ingredients[2] = "Modified ingredient";
        document.querySelector("#ingredients-edit").value = ingredients.join(", ");
        setTimeout(function() {
            document.querySelector("#recipe-save").click();
        }, 3000);
        setTimeout(function() {
            expect(newRecpEle.querySelector(".ingredients-item:nth-child(3)")).to.equal("Modified ingredient");
            done();
        }, 6000);        
    });

    
});