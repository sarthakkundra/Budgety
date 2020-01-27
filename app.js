// Budget Controller
var budgetController = (function() {

    // Function constructor for expenses
    var Expenses = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Function constructor for income
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){

        var sum = 0;

        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        })
            
        data.totals[type] = sum;
    }

    // Data Structure for storing all the values 
    var data = {
        allItems: {
        exp: [],
        inc: []
        },
    
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
        };

        return {
            // Function to add item to the data structure
            addItem: function(type, des, val) {
                
                var newItem, ID;

                if(data.allItems[type].length > 0){
                    //Calculating the ID of the input since some will be deleted also
                    ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
                } else {
                    ID = 0;
                }
               
                if(type === 'exp'){
                   newItem = new Expenses(ID, des, val);
                } else if(type === 'inc'){
                    newItem = new Income(ID,des,val);
                }

                // Pushing the input into the respective data structure
                data.allItems[type].push(newItem);

                return newItem;
            },

                calculateBudget: function() {

                    calculateTotal('exp');
                    calculateTotal('inc');

                    data.budget = data.totals.inc - data.totals.exp;

                    if(data.totals.inc > 0){
                        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
                    } else {
                        percentage = -1;
                    }
                    
                },

                getBudget: function() {
                    return {
                        budget: data.budget,
                        totalInc: data.totals.inc,
                        totalExp: data.totals.exp,
                        percentage: data.percentage
                    };
                },

                deleteItem: function(type, id) {
                    
                    ids = data.allItems[type].map(function(cur){
                        return cur.id;
                    })

                    index = ids.indexOf(id);

                    if(index !== 1){
                        data.allItems[type].splice(index, 1);
                    }
                },

                testing: function() {
                    console.log(data);
                }
        }


})();

// User Interface Controller
var UIController = (function() {

    // Object containing all the CSS class strings
    var DOMString = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'

    };
    return {
        // Function to get the input value from user
        getInput : function() {

            return {
                 type: document.querySelector(DOMString.inputType).value, // exp or inc
                 description: document.querySelector(DOMString.inputDescription).value,
                 value: parseFloat(document.querySelector(DOMString.inputValue).value)
            };
           
        },

        addListItem: function(obj, type){
                var html, newHtml, element;

                if(type === 'inc'){
                    element = DOMString.incomeContainer;
                   html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

                } else if(type === 'exp'){
                    element = DOMString.expensesContainer;
                   html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'; 
                }

                // Replacing the Place holder text
                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%description%', obj.description);
                newHtml = newHtml.replace('%value%', obj.value);

                // Inserting HTML into DOM
                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID){

            var el;
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        getDOMStrings: function() {
            return DOMString;
        },


        clearFields: function() {
            var fields, arrayFields;
            fields = document.querySelectorAll(DOMString.inputDescription + ',' + DOMString.inputValue);

            arrayFields = Array.prototype.slice.call(fields);
            arrayFields.forEach(function(current, index, array) {
                
                current.value = "";
            });

            arrayFields[0].focus();
        },

        displayBudget: function(obj) {

            document.querySelector(DOMString.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMString.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMString.expensesLabel).textContent = obj.totalExp;

            if(obj.percentage > 0){
                
                document.querySelector(DOMString.percentageLabel).textContent = obj.percentage + '%';
            } else{
                document.querySelector(DOMString.percentageLabel).textContent = "---";
            }
            
        }
    };

})();

// Global Controller
var controller = (function(budgetCtrl, UICtrl) {

    // Variable to get all the CSS class strings
    var DOM = UICtrl.getDOMStrings();

    // Function to set up all the event listeners of the app
    var setupEventListeners = function () {

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keydown', function(e) {
    
            if(e.keyCode === 13 || e.which === 13){
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    }

    var updateBudget = function() {

        // Calculate the budget

        budgetCtrl.calculateBudget();

        //Return the budget

        var budget = budgetCtrl.getBudget();

        // Display the budget in the UI

        UICtrl.displayBudget(budget);
    }
     // Function to add an Item 
     var ctrlAddItem = function() {
        
        var input, newItem;

        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){

            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            UICtrl.addListItem(newItem, input.type);

            updateBudget();
    
            UICtrl.clearFields();
        }
        
    };

    var ctrlDeleteItem = function(e){

        var itemId, splitId, type, ID;
        itemId = e.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemId){

            splitId = itemId.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);

            budgetCtrl.deleteItem(type, ID);

            UICtrl.deleteListItem(itemId);

            updateBudget();
        }
    }

    return {
        // Function to Initialize the app
        init: function(){
            console.log('Application has started!')
            UICtrl.displayBudget({

                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();