//Storege Controller
const StorageController = (function() {

})();



//Product Controller
const ProductController = (function() {

    //private
    //Product constructor
    const Product = function(id,name,price) {
        this.id    = id;
        this.name  = name;
        this.price = price;
    }

    const data = {
        products : [],
        selectedProduct: null,
        totalPrice: 0
    };

    //public
    return {
        getProducts : function(){
            return data.products;
        },
        getData : function() {
            return data;
        },
        addProduct : function(name,price) {
            let id;

            if(data.products.length > 0) {
                id = data.products.length;
            }else {
                id = 0;
            }

            const newProduct = new Product(id,name,parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        }
    }

})();




//UI Controller
const UIController = (function() {

    const Selectors = {
        productsList : "item-list",
        addButton    : "addBtn",
        productName  : "productName",
        productPrice : "productPrice",
        productCard  : "productCard"
    }


    return {
        createProductList : function(products) {
            let html = "";

            products.forEach(prd => {
                html += `
                <tr class="text-center">
                    <td class="text-start">${prd.id}</td>
                    <td>${prd.name}</td>
                    <td>${prd.price}</td>
                    <td class="text-end">
                        <button type="submit" class="btn btn-warning btn-sm">
                            <i class="far fa-edit"></i>
                        </button>
                    </td>
                </tr>`;
            });

            document.getElementById(Selectors.productsList).innerHTML = html;

        },
        getSelectors : function() {
            return Selectors;
        },
        addProduct : function(prd) {

            document.getElementById(Selectors.productCard).style.display = "block";

            var item = `
            <tr class="text-center">
                <td class="text-start">${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price}</td>
                <td class="text-end">
                    <button type="submit" class="btn btn-warning btn-sm">
                        <i class="far fa-edit"></i>
                    </button>
                </td>
            </tr>`;
            
            document.getElementById(Selectors.productsList).insertAdjacentHTML("beforeend",item);   
        },
        clearInputs : function() {
            document.getElementById(Selectors.productName).value = "";
            document.getElementById(Selectors.productPrice).value = "";
        },
        hideCard : function() {
            document.getElementById(Selectors.productCard).style.display = "none";
        }
    }

})();





//App Controller
const App = (function(ProductCtrl,UICtrl) {

    const UISelectors = UIController.getSelectors();

    // Load Event Listeners
    const loadEventListeners = function() {
        //add product event
        document.getElementById(UISelectors.addButton).addEventListener("click", productAddSubmit);

    }

    const productAddSubmit  = function(e) {
        e.preventDefault();

        const productName = document.getElementById(UISelectors.productName).value;
        const productPrice = document.getElementById(UISelectors.productPrice).value;

        if(productName !== "" && productPrice !== "") {
            //add product
           const newProduct = ProductCtrl.addProduct(productName,productPrice);
            
           //add item to list
           UICtrl.addProduct(newProduct);

           //clear inputs
           UICtrl.clearInputs();

        }

    }




    //uygulama çalıştıktan hemen sonra bu modül devreye girmesi gerekiyor.
    return {
        init : function() {
            const products = ProductCtrl.getProducts();

            if(products.length == 0) {
                UICtrl.hideCard();
            }else {
                UICtrl.createProductList(products);
            }

            //load event listeners
            loadEventListeners();
        }
    }

})(ProductController,UIController);
App.init();