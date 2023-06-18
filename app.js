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
        },
        updateProduct : function(productName,productPrice) {
            let product = null;
            data.products.forEach(function(prd){
                if(prd.id == data.selectedProduct.id) {
                    prd.name  = productName;
                    prd.price = parseFloat(productPrice);
                    product = prd;
                }
            });
            return product;
        },
        deleteProduct: function(product) {
            data.products.forEach(function(prd,index){
                if(prd.id == product.id) {
                    data.products.splice(index,1);
                }
            });
        }
    }
})();




//UI Controller
const UIController = (function() {

    const Selectors = {
        productsList: "item-list",
        productListItems: "#item-list tr",
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
                    <td class="text-end" style="cursor: pointer;">
                        <i class="far fa-edit"></i> 
                    </td>
                </tr>`;
            });

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
                <td class="text-end" style="cursor: pointer;">
                    <i class="far fa-edit"></i>
                </td>
            </tr>`;

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
            UIController.clearWarnings();
            UIController.clearInputs();
            document.getElementById(Selectors.addButton).style.display = "inline";
            document.getElementById(Selectors.updateBtn).style.display = "none";
            document.getElementById(Selectors.deleteBtn).style.display = "none";
            document.getElementById(Selectors.cancelBtn).style.display = "none";
        },
        editState: function(tr) {
            tr.classList.add("bg-warning");

            document.getElementById(Selectors.addButton).style.display = "none";
            document.getElementById(Selectors.updateBtn).style.display = "inline";
            document.getElementById(Selectors.deleteBtn).style.display = "inline";
            document.getElementById(Selectors.cancelBtn).style.display = "inline";
        },
        updateProduct: function(currentProduct) {
            let updatedItem = null;

            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function(item) {
                if(item.classList.contains("bg-warning")) {
                    item.children[1].textContent = currentProduct.name;
                    item.children[2].textContent = currentProduct.price;
                    updatedItem = item;
                }
            });

            return updatedItem;
        },
        clearWarnings: function() {
            const items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function(item) {
                if(item.classList.contains("bg-warning")) {
                    item.classList.remove("bg-warning");
                }
            });
        },
        deleteProduct: function() {
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function(item) {
                if(item.classList.contains("bg-warning")) {
                    item.remove();
                }
            });
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

        //edit product click
        document.getElementById(UISelectors.productsList).addEventListener("click", productEditClick);

        //edit product submit
        document.getElementById(UISelectors.updateBtn).addEventListener("click", editProductSubmit);

        //cancel button click
        document.getElementById(UISelectors.cancelBtn).addEventListener("click", cancelUpdate);

        //delete product submit
        document.getElementById(UISelectors.deleteBtn).addEventListener("click", deleteProductSubmit);
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


    const productEditClick = function(e) {
        e.preventDefault();

        if(e.target.classList.contains("fa-edit")) {
            const id = e.target.parentElement.parentElement.children[0].textContent;

            //get selected product
            const product = ProductCtrl.getProductById(id);

            //set current product
            ProductCtrl.setCurrentProduct(product);

            UICtrl.clearWarnings();

            //add product to UI
            UICtrl.addProductToForm();

            const tr = e.target.parentElement.parentElement;
            UICtrl.editState(tr);
        }
    }


    const editProductSubmit = function(e) {
        e.preventDefault();

        const productName = document.getElementById(UISelectors.productName).value;
        const productPrice = document.getElementById(UISelectors.productPrice).value;

        if(productName !== "" && productPrice !== "") {
            //update product
            const updateProduct = ProductCtrl.updateProduct(productName,productPrice);

            //update ui
            const item = UICtrl.updateProduct(updateProduct);

            //get total
            const total = ProductCtrl.getTotal();

            //show total
            UICtrl.showTotal(total);

            UICtrl.addingState();  
        }
    }


    const cancelUpdate = function(e) {
        e.preventDefault();

        UICtrl.addingState();
        UICtrl.clearWarnings();
    }


    const deleteProductSubmit = function(e) {
        e.preventDefault();

        //get selected product
        const selectedProduct = ProductCtrl.getCurrentProduct();

        //delete product
        ProductCtrl.deleteProduct(selectedProduct);

        //delete ui
        UICtrl.deleteProduct();

        //get total
        const total = ProductCtrl.getTotal();

        //show total
        UICtrl.showTotal(total);

        UICtrl.addingState();  

        if(total == 0) {
            UICtrl.hideCard();
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