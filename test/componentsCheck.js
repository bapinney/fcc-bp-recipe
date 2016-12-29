var assert = chai.assert,
    expect = chai.expect;

describe('Verify components exist', function() {
    it('should have an #app', function() {
        expect(document.getElementById("app")).to.exist;
    });
    
    it('should have the add button be a descendant of a DIV with a class of .recipebox', function() {
        var addBtn = document.getElementById("add_button");
        expect(addBtn).to.exist;
        expect(addBtn.parentElement.tagName).to.equal("DIV");
        expect(addBtn.parentElement.classList.contains("recipebox")).to.be.true;
    });
    
    it('should have the DOM for the edit modal', function() {
        var editModal = document.getElementById("editModal");
        expect(editModal).to.exist;
        expect(editModal.classList.contains("modal")).to.be.true;
        expect(editModal.classList.contains("fade")).to.be.true;
    });
    
    it('should have the DOM for the add modal', function() {
        var editModal = document.getElementById("addModal");
        expect(addModal).to.exist;
        expect(editModal.classList.contains("modal")).to.be.true;
        expect(editModal.classList.contains("fade")).to.be.true;
    });
    
});