import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, Params } from '@angular/router';
import { MainService } from '../../services/main/main';
import { HeaderService } from '../../services/header/header';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css', '../../components/header/header.component.css'],
    providers: [HeaderComponent]
})
export class CategoriesComponent implements OnInit {
    catId;
    constructor(private route: ActivatedRoute, public router: Router, private mainServe: MainService, private headerSer: HeaderService, public headerComp: HeaderComponent) {

        this.route.queryParams.subscribe(params => {
            this.catId = params.catId;
            this.subCatId = params["sId"];

            if (params["sId"] == undefined) {
                this.catId = params.catId;
                this.getCatProducts(this.catId);
                this.catName = params["catName"];
            } else {
                this.subCatId = params["sId"];
                this.catName = params["catName"];

                this.getSubProducts(this.subCatId);
            }
        });
        this.getDashboard();
        this.getCartList();
    }

    ngOnInit() {
        // this.getCategories();
    }
    page: string;
    showveg: boolean;
    grocery: boolean;
    nonveg: boolean;
    showOutOfStock = false;
    subCatId;
    categoriesWithSubCat = [];
    allProducts = [];
    subcats = [];
    prices: any;
    results: any;
    subId;
    showProductPrice = true;
    subcatName;
    item = {
        quantity: 1
    }

    products = {
        quantity: 1
    }
    //get products
    catName;
    getSubProducts(sId) {
        if (sId === '') {
            this.subId = this.subCatId;
        } else {
            this.subId = sId;
        }
        var data = "" + + "&sortType=" +
            this.mainServe.getSubProducts(this.subId).subscribe(response => {
                this.allProducts = response.json().products;
                for (var i = 0; i < this.allProducts.length; i++) {
                    for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                        this.allProducts[i].quantity = this.allProducts[i].sku[j].mycart;
                        this.allProducts[i].quantity = 1;
                    }
                    this.catName = this.allProducts[0].category_name;
                    this.allProducts[i].quantity = 1;
                    this.allProducts[i].product_image = this.allProducts[i].pic[0].product_image;
                }
                this.showveg = true;
            }, error => {
                if (error.json().status == 400) {
                    this.noData = true;
                    this.noData = error.json().message;
                }
            });
    }

    noData;
    getCatProducts(catId) {
        var inData = catId;
        this.mainServe.getCatProducts(inData).subscribe(response => {
            this.allProducts = response.json().products;
            this.showveg = true;
            for (var i = 0; i < this.allProducts.length; i++) {
                this.allProducts[i].quantity = 1;

            }

            if (response.json().status == 400) {
                this.showveg = false;
                this.noData = true;
                this.noData = response.json().message;
            }
        }, error => {
            if (error.json().status == 400) {
                this.showveg = false;
                this.noData = true;
                this.noData = error.json().message;
            }

        })
    }

    //change size
    changeSize(id, title) {
        this.showProductPrice = false;
        for (var i = 0; i < this.allProducts.length; i++) {
            for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                if (this.allProducts[i].sku[j].skid === parseInt(id)) {
                    if (title === this.allProducts[i].title) {
                        this.prices = this.allProducts[i].sku[j];
                    }
                }
            }
        }
    }
    //show products
    showCatProducts(sId) {
        this.getSubProducts(sId);
    }
    skId;
    selected;
    notInCart = true;
    selectOption(skId, index) {
        this.selected = index;
        this.skId = skId;
        for (var i = 0; i < this.allProducts.length; i++) {
            for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                if (this.allProducts[i].sku[j].skid === parseInt(skId)) {
                    this.allProducts[i].actual_price = this.allProducts[i].sku[j].actual_price;
                    this.allProducts[i].offer_price = this.allProducts[i].sku[j].offer_price;
                    this.allProducts[i].quantity = this.allProducts[i].sku[j].mycart;
                    this.allProducts[i].product_image = this.allProducts[i].sku[j].skuImage[0];

                    if (this.allProducts[i].sku[j].mycart === 0 || undefined) {
                        this.allProducts[i].quantity = 1;
                        this.notInCart = true;
                    } else {
                        this.notInCart = false;
                    }
                }
            }

        }
    }
    itemIncrease(title, products) {
        for (var i = 0; i < this.allProducts.length; i++) {
            if (title === this.allProducts[i].title) {
                this.allProducts[i].quantity = this.allProducts[i].quantity + 1;
                this.addCat(products);
                return;
            }
        }
    }

    itemDecrease(products, title) {
        for (var i = 0; i < this.allProducts.length; i++) {
            if (title === this.allProducts[i].title) {
                if (this.allProducts[i].quantity === 1) {
                    this.deleteCart(this.skId);
                    this.mainServe.getCartList();
                    this.skId = undefined;
                    this.products.quantity = 1
                    this.notInCart = false;
                    this.selected = undefined;
                } else {
                    this.allProducts[i].quantity = this.allProducts[i].quantity - 1;
                    this.addCat(products);
                    return;
                }
            }
        }
    }

    resData;
    addCat(products) {
        if (this.skId === undefined) {
            swal('Please select Size', '', 'error');
            return;
        }
        if (localStorage.token === undefined) {
            swal('Pleaase Login', '', 'warning');
        } else {
            var inData = "product_id=" + products.id +
                "&quantity=" + products.quantity +
                "&product_sku_id=" + this.skId


            this.mainServe.addCat(inData).subscribe(response => {
                this.resData = response.json();
                if (response.json().status === 200) {
                    swal(response.json().message, "", "success");
                    this.resData = response.json();
                    swal(response.json().message, "", "success");
                    this.mainServe.getCartList();
                    this.getDashboard();
                    this.skId = undefined;
                    this.products.quantity = 1
                    this.notInCart = false;
                    this.selected = undefined
                } else {
                    swal(response.json().message, "", "error");
                    this.skId = undefined;
                }
            }, error => {
                swal(error.json().message, "", "success");
                this.skId = undefined;
            })
        }


    }
    addWish(prodData) {
        if (this.skId === undefined) {
            swal('Please select Size', '', 'error');
            return;
        }
        // if (localStorage.token === undefined) {
        //     swal('Please Login', '', 'warning');
        // } else {
        var inData =
            "user_id=" + localStorage.userId +
            "&product_id=" + prodData.id +
            "&quantity=" + prodData.quantity +
            "&session_id=" + localStorage.session +
            "&product_sku_id=" + this.skId


        this.mainServe.addWish(inData).subscribe(response => {
            this.resData = response.json();
            if (response.json().status === 200) {
                swal(response.json().message, "", "success");
                this.skId = undefined;
            } else {
                swal(response.json().message, "", "error");
                this.skId = undefined;
            }
        }, error => {
            swal(error.json().message, "", "success");
            this.skId = undefined;
        })
    }
    //header
    searchParam;
    viewCart;

    getCartList() {
        this.getDashboard();
        this.mainServe.getCartList();
    }


    searchProducts() {
        this.mainServe.searchProducts(this.searchParam)
    }


    itemHeaderDecrease(title, data, skuData) {
        this.mainServe.itemHeaderDecrease(title, data, skuData);
    }

    itemHeaderIncrease(title, item, data) {
        this.mainServe.itemHeaderIncrease(title, item, data);
    }

    showCat() {
        this.mainServe.showCat();
    }

    showSubCat(id, i) {
        this.mainServe.showSubCat(id, i);
    }


    showSubCatProd(subId, index, name) {
        this.mainServe.showCategories = false;
        this.mainServe.showSubCats = false;
        let navigationExtras: NavigationExtras = {
            queryParams: {
                'sId': subId,
                'catName': name
            }
        };
        this.router.navigate(["/categoriesProducts"], navigationExtras)
    }


    deleteCart(id) {
        var inData = id;
        swal("Do you want to delete?", "", "warning", {
            buttons: ["Cancel!", "Okay!"],
        }).then((value) => {

            if (value === true) {
                this.mainServe.deleteCart(inData).subscribe(response => {
                    this.mainServe.getCartList();
                    this.getDashboard();
                    swal("Deleted successfully", "", "success");
                }, error => {
                    console.log(error);
                })
            } else {
                return;
            }
        });

    }

    cartCount;
    deliveryCharge;
    subTotal;
    Total;
    getDashboard() {
        this.mainServe.getDashboard().subscribe(response => {
            this.cartCount = response.json().cart.cart_count;
            this.deliveryCharge = response.json().cart.delivery_charge.toFixed(2);
            this.subTotal = response.json().cart.selling_price.toFixed(2);
            this.Total = response.json().cart.grand_total.toFixed(2);

        })
    }
}
