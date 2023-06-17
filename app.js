//Storage Controller
const StorageController = (function() {

})();



//Product Controller
const ProductController = (function() {

    //private
    //Product constructor
    const Product = function(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        products: [],
        selectedProduct: null,
        totalPrice: 0
    };

    //public
    return {
        getProducts: function() {
            return data.products;
        },
        getData: function() {
            return data;
        },
        addProduct: function(name, price) {
            let id;

            if (data.products.length > 0) {
                id = data.products.length;
            } else {
                id = 0;
            }

            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        },
        getTotal: function() {
            let total = 0;
            data.products.forEach(element => {
                total += element.price;
            });

            data.totalPrice = total;
            return data.totalPrice;
        },
        getProductById: function(id) {
            let product = null;

           data.products.forEach(function(prd){
                if(prd.id == id) {
                    product = prd;
                }
           });
           return product;
        },
        setCurrentProduct: function(prd) {
            data.selectedProduct = prd;
        },
        getCurrentProduct: function() {
            return data.selectedProduct;
        }
    }
})();




//UI Controller
const UIController = (function() {

    const Selectors = {
        productsList: "item-list",
        addButton: "addBtn",
        productName: "productName",
        productPrice: "productPrice",
        productCard: "productCard",
        totalTL: "total-tl",
        totalUSD: "total-usd",
        updateBtn: "updateBtn",
        deleteBtn: "deleteBtn",
        cancelBtn: "cancelBtn"
    }


    return {
        createProductList: function(products) {
            let html = "";

            products.forEach(prd => {
                html += `
                <tr class="text-center">
                    <td class="text-start">${prd.id}</td>
                    <td>${prd.name}</td>
                    <td>${prd.price}</td>
                    <td class="text-end ">
                        <i class="far fa-edit"></i> 
                    </td>
                </tr>`;
            });

            console.log("first")
            document.getElementById(Selectors.productsList).innerHTML = html;

        },
        getSelectors: function() {
            return Selectors;
        },
        addProduct: function(prd) {

            document.getElementById(Selectors.productCard).style.display = "block";

            var item = `
            <tr class="text-center">
                <td class="text-start">${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price}</td>
                <td class="text-end ">
                    <i class="far fa-edit"></i>
                </td>
            </tr>`;

            console.log("bir")
            document.getElementById(Selectors.productsList).insertAdjacentHTML("beforeend", item);
        },
        clearInputs: function() {
            document.getElementById(Selectors.productName).value = "";
            document.getElementById(Selectors.productPrice).value = "";
        },
        hideCard: function() {
            document.getElementById(Selectors.productCard).style.display = "none";
        },

        showTotal: function(total) {
            document.getElementById(Selectors.totalTL).innerHTML = total;
            document.getElementById(Selectors.totalUSD).innerHTML = parseInt(total / 23);
        },
        addProductToForm: function() {
            const selectedProduct = ProductController.getCurrentProduct();
            document.getElementById(Selectors.productName).value = selectedProduct.name;
            document.getElementById(Selectors.productPrice).value = selectedProduct.price;
        },
        addingState : function() {
            UIController.clearInputs();
            document.getElementById(Selectors.addButton).style.display = "inline";
            document.getElementById(Selectors.updateBtn).style.display = "none";
            document.getElementById(Selectors.deleteBtn).style.display = "none";
            document.getElementById(Selectors.cancelBtn).style.display = "none";
        },
        editState: function(tr) {

            const parent = tr.parentElement;
            //tüm bg-warning siler sonra bg-warning ekler
            for(let i = 0; i <parent.children.length; i++) {
                parent.children[i].classList.remove("bg-warning");
            }


            tr.classList.add("bg-warning");

            document.getElementById(Selectors.addButton).style.display = "none";
            document.getElementById(Selectors.updateBtn).style.display = "inline";
            document.getElementById(Selectors.deleteBtn).style.display = "inline";
            document.getElementById(Selectors.cancelBtn).style.display = "inline";
        }
    }

})();





//App Controller
const App = (function(ProductCtrl, UICtrl) {

    const UISelectors = UICtrl.getSelectors();

    // Load Event Listeners
    const loadEventListeners = function() {
        //add product event
        document.getElementById(UISelectors.addButton).addEventListener("click", productAddSubmit);

        //edit product
        document.getElementById(UISelectors.productsList).addEventListener("click", productEditSubmit);
    }

    const productAddSubmit = function(e) {
        e.preventDefault();

        const productName = document.getElementById(UISelectors.productName).value;
        const productPrice = document.getElementById(UISelectors.productPrice).value;

        if (productName !== "" && productPrice !== "") {
            //add product
            const newProduct = ProductCtrl.addProduct(productName, productPrice);

            //add item to list
            UICtrl.addProduct(newProduct);

            //get total
            const total = ProductCtrl.getTotal();


            //show total
            UICtrl.showTotal(total);


            //clear inputs
            UICtrl.clearInputs();


        }
    }


    const productEditSubmit = function(e) {
        e.preventDefault();

        if(e.target.classList.contains("fa-edit")) {
            const id = e.target.parentElement.parentElement.children[0].textContent;

            //get selected product
            const product = ProductCtrl.getProductById(id);

            //set current product
            ProductCtrl.setCurrentProduct(product);

            //add product to UI
            UICtrl.addProductToForm();

            const tr = e.target.parentElement.parentElement;
            UICtrl.editState(tr);

        }
    }

    //uygulama çalıştıktan hemen sonra bu modül devreye girmesi gerekiyor.
    return {
        init: function() {
            UICtrl.addingState();
           
            const products = ProductCtrl.getProducts();

            if (products.length == 0) {
                UICtrl.hideCard();
            } else {
                //var olan product arrayine direkt ekrana yazdırır
                UICtrl.createProductList(products);
            }

            //load event listeners
            loadEventListeners();
        }
    }

})(ProductController, UIController);
App.init();