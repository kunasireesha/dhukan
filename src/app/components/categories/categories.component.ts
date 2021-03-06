import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, Params } from '@angular/router';
import { MainService } from '../../services/main/main';
import { HeaderService } from '../../services/header/header';
import { HeaderComponent } from '../header/header.component';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Http, Headers } from '@angular/http';
import { AppSettings } from '../../config';
import * as _ from 'underscore';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css', '../../components/header/header.component.css'],
    providers: [HeaderComponent, NgbRatingConfig]
})
export class CategoriesComponent implements OnInit {
    catId;
    constructor(private route: ActivatedRoute,
        public router: Router,
        private mainServe: MainService,
        private headerSer: HeaderService,
        public headerComp: HeaderComponent,
        public http: Http,
        config: NgbRatingConfig) {

        config.max = 5;
        config.readonly = true;
        this.route.queryParams.subscribe(params => {
            // this.catId = params.catId;
            // this.subCatId = params["sId"];

            if (params["action"] !== undefined) {
                this.action = params["action"];
                this.catId = params['sId'];
                this.getCatProducts(this.catId, '', '', '');
                this.catName = params["catName"];
            } else {
                this.subCatId = params["sId"];
                this.catName = params["catName"];

                this.getSubProducts(this.subCatId, '', '', '');
            }
        });
        this.getDashboard();
        this.getCartList();
    }

    ngOnInit() {
        // this.getCategories();
        this.mainServe.showCategories = false;
        this.getBrands();
    }

    displayCounter(data) {
        if (this.action !== undefined) {
            this.getCatProducts(this.catId, '', '', '');
        } else {
            this.getSubProducts(this.subCatId, '', '', '');
        }
    }

    page: string;
    action;
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
    showSizeData = false;
    prodId;
    showselecteddata = true;
    showselecteddifdata = true;
    skudata;
    products = {
        quantity: 1
    }
    selecte = {
        skid: ''
    }

    //get products
    catName;
    getSubProducts(sId, index, prodData, quantity) {
        if (sId === '') {
            this.subId = this.subCatId;
        } else {
            this.subId = sId;
        }

        this.mainServe.getSubProducts(this.subId).subscribe(response => {
            this.allProducts = response.json().products;
            if (index !== '') {
                // this.selecte.skid = this.skId;
                // for (var i = 0; i < prodData.sku.length; i++) {
                //     if (this.selecte.skid === prodData.sku[i].size) {
                //         this.selecte.skid = prodData.sku[i].size;
                //         this.selected = index;
                //     }
                // }
                // this.skId = this.skId;
                for (var i = 0; i < this.allProducts.length; i++) {
                    for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                        if (prodData.id === this.allProducts[i].id) {
                            this.allProducts[i].quantity = quantity;
                            this.allProducts[i].skuActualPrice = this.skudata.actual_price;
                            this.allProducts[i].sellingPrice = this.skudata.selling_price;
                            this.allProducts[i].rating = this.skudata.ratings;
                            this.allProducts[i].product_image = this.skudata.skuImages[0];
                            // this.selecte.skid = this.allProducts[i].sku[j].size;
                            this.notInCart = false;
                            this.selected = index;
                        } else {
                            this.allProducts[i].quantity = 1;
                            this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                            this.allProducts[i].skuActualPrice = this.allProducts[i].sku[0].actual_price;
                            this.allProducts[i].sellingPrice = this.allProducts[i].sku[0].selling_price;
                            this.allProducts[i].rating = this.allProducts[i].sku[0].ratings;
                            // this.notInCart = true;
                        }

                    }
                }
            } else {
                for (var i = 0; i < this.allProducts.length; i++) {
                    for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                        this.allProducts[i].skuActualPrice = this.allProducts[i].sku[0].actual_price;
                        this.allProducts[i].rating = this.allProducts[i].sku[0].ratings;
                        this.allProducts[i].sellingPrice = this.allProducts[i].sku[0].selling_price;
                    }
                    this.allProducts[i].quantity = 1;
                    this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                }
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
    getCatProducts(catId, index, prodData, quantity) {
        var inData = catId;
        this.mainServe.getCatProducts(inData).subscribe(response => {
            this.allProducts = response.json().products;
            this.showveg = true;
            if (response.json().status == 400) {
                this.showveg = false;
                this.noData = true;
                this.noData = response.json().message;
            } else {
                this.noData = false;
            }

            if (index !== '') {
                // this.selecte.skid = this.skId;
                // for (var i = 0; i < prodData.sku.length; i++) {
                //     if (this.selecte.skid === prodData.sku[i].size) {
                //         this.selecte.skid = prodData.sku[i].size;
                //         this.selected = index;
                //     }
                // }
                // this.skId = this.skId;
                if (this.allProducts !== undefined) {
                    for (var i = 0; i < this.allProducts.length; i++) {
                        for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                            if (prodData.id === this.allProducts[i].id) {
                                this.allProducts[i].quantity = quantity;
                                this.allProducts[i].skuActualPrice = this.skudata.actual_price;
                                this.allProducts[i].rating = this.skudata.ratings;
                                this.allProducts[i].sellingPrice = this.skudata.selling_price;
                                this.allProducts[i].product_image = this.skudata.skuImages[0];
                                // this.selecte.skid = this.allProducts[i].sku[j].size;
                                this.notInCart = false;
                                this.selected = index;

                            } else {
                                this.allProducts[i].quantity = 1;
                                this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                                this.allProducts[i].skuActualPrice = this.allProducts[i].sku[0].actual_price;
                                this.allProducts[i].rating = this.allProducts[i].sku[0].ratings;
                                this.allProducts[i].sellingPrice = this.allProducts[i].sku[0].selling_price;
                                // this.notInCart = true;
                            }

                        }
                    }
                }
            } else {
                if (this.allProducts !== undefined) {
                    for (var i = 0; i < this.allProducts.length; i++) {
                        for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                            this.allProducts[i].skuActualPrice = this.allProducts[i].sku[0].actual_price;
                            this.allProducts[i].rating = this.allProducts[i].sku[0].ratings;
                            this.allProducts[i].sellingPrice = this.allProducts[i].sku[0].selling_price;
                        }
                        this.allProducts[i].quantity = 1;
                        this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                    }
                }
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
    catProducts(cId, name) {
        // this.allProducts = [];
        this.getCatProducts(cId, '', '', '');
        this.catName = name;
        this.catId = cId;
    }

    skId;
    selected;
    notInCart;
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
    itemIncrease(products, id, index) {
        for (var i = 0; i < this.allProducts.length; i++) {
            if (id === this.allProducts[i].id) {
                this.allProducts[i].quantity = this.allProducts[i].quantity + 1;
                this.addCat(products, index, this.allProducts[i].quantity);
                return;
            }
        }
    }

    itemDecrease(id, products, index) {
        for (var i = 0; i < this.allProducts.length; i++) {
            if (id === this.allProducts[i].id) {
                if (this.allProducts[i].quantity === 1) {
                    this.deleteCart(this.skId);
                    this.mainServe.getCartList();
                    this.skId = undefined;
                    this.products.quantity = 1
                    this.notInCart = false;
                    this.selected = undefined;
                } else {
                    this.allProducts[i].quantity = this.allProducts[i].quantity - 1;
                    this.addCat(products, index, this.allProducts[i].quantity);
                    return;
                }
            }
        }
    }

    resData;
    addCat(products, index, quantity) {
        if (this.skId === undefined || this.skId === '' || this.prodId !== products.id) {
            for (var i = 0; i < this.allProducts.length; i++) {
                if (products.id === this.allProducts[i].id) {
                    this.skId = this.allProducts[i].sku[0].skid;
                    this.skudata = this.allProducts[i].sku[0]
                    this.selecte.skid = this.allProducts[i].sku[0].size;

                    var inData = "product_id=" + products.id +
                        "&quantity=" + products.quantity +
                        "&product_sku_id=" + this.skId


                    this.mainServe.addCat(inData).subscribe(response => {
                        this.resData = response.json();
                        if (response.json().status === 200) {
                            // swal(response.json().message, "", "");
                            this.resData = response.json();
                            this.mainServe.getCartList();

                            // this.getDashboard();
                            // this.skId = undefined;
                            this.products.quantity = 1
                            this.notInCart = false;
                            this.selected = index;
                            if (this.selectedBrnd !== undefined) {
                                this.selectBrand(index, products, quantity, this.selectedBrnd);
                            } else
                                if (this.catId !== undefined) {
                                    this.getCatProducts(this.catId, index, products, quantity);
                                    this.mainServe.getAllCategoriesWithSubCat();
                                } else {
                                    this.getSubProducts(this.subCatId, index, products, quantity);
                                    this.mainServe.getAllCategoriesWithSubCat();
                                }
                        } else {
                            swal(response.json().message, "", "");
                            this.skId = undefined;
                        }
                    }, error => {
                        swal(error.json().message, "", "");
                        this.skId = undefined;
                    })
                    // }
                    return;
                }
            }
        } else {
            for (var i = 0; i < this.allProducts.length; i++) {
                for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                    if (products.id === this.allProducts[i].id) {
                        // this.skId = this.allProducts[i].sku[j].skid;
                        this.skudata = this.allProducts[i].sku[0]
                        // this.selecte.skid = this.allProducts[i].sku[j].size;

                        var inData = "product_id=" + products.id +
                            "&quantity=" + products.quantity +
                            "&product_sku_id=" + this.skId


                        this.mainServe.addCat(inData).subscribe(response => {
                            this.resData = response.json();
                            if (response.json().status === 200) {
                                // swal(response.json().message, "", "");
                                this.resData = response.json();
                                this.mainServe.getCartList();
                                this.mainServe.getAllCategoriesWithSubCat();
                                // this.getDashboard();
                                // this.skId = undefined;
                                this.products.quantity = 1
                                this.notInCart = false;
                                this.selected = index;
                                // if (this.catId !== undefined) {
                                //     this.getCatProducts(this.catId, index, products, quantity);
                                // } else {
                                //     this.getSubProducts(this.subCatId, index, products, quantity);
                                // }
                            } else {
                                swal(response.json().message, "", "");
                                this.skId = undefined;
                            }
                        }, error => {
                            swal(error.json().message, "", "");
                            this.skId = undefined;
                        })
                        // }
                        return;
                    }
                }
            }
        }
        // if (localStorage.token === undefined) {
        //     swal('Pleaase Login', '', 'warning');
        // } else {



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
                swal(response.json().message, "", "");
                this.skId = undefined;
            } else {
                swal(response.json().message, "", "");
                this.skId = undefined;
            }
        }, error => {
            swal(error.json().message, "", "");
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
    selectedCat;
    showSubCat(id, i) {
        this.selectedCat = i;
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
        swal("Do you want to delete?", "", "", {
            buttons: ["Cancel!", "Okay!"],
        }).then((value) => {

            if (value === true) {
                this.mainServe.deleteCart(inData).subscribe(response => {
                    this.mainServe.getCartList();
                    this.getDashboard();
                    swal("Deleted fully", "", "");
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

    showSizes(index) {
        this.selecte.skid = '';
        this.selected = index;
        this.showSizeData = true;
        this.showselecteddifdata = true;
        this.notInCart = true;
        this.showselecteddata = true;
        for (var i = 0; i < this.allProducts.length; i++) {
            this.allProducts[i].quantity = 1;
        }
    }
    showselected(skId, size, index, skus) {
        // this.selected = index;
        this.showselecteddifdata = false;
        this.selecte.skid = size;
        this.showselecteddata = true;
        this.showSizeData = false;
        this.skudata = skus;
        // this.notInCart = false;
        // this.getDashboard(index, '', '');
        for (var i = 0; i < this.allProducts.length; i++) {
            for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                if (this.allProducts[i].sku[j].skid === parseInt(skId)) {
                    this.skId = skId;
                    this.prodId = skus.product_id;
                    this.selecte.skid = this.allProducts[i].sku[j].size;
                    this.allProducts[i].skuActualPrice = this.allProducts[i].sku[j].actual_price;
                    this.allProducts[i].rating = this.allProducts[i].sku[j].ratings;
                    this.allProducts[i].sellingPrice = this.allProducts[i].sku[j].selling_price;
                    this.allProducts[i].product_image = this.allProducts[i].sku[j].skuImages[0];
                    // if (this.allProducts[i].sku[j].mycart === 0 || undefined) {
                    //     this.allProducts[i].quantity = 1;
                    //     this.notInCart = true;
                    // } else {
                    //     this.notInCart = false;
                    //     this.allProducts[i].quantity = this.allProducts[i].sku[j].mycart;
                    //     this.selected = index;
                    // }
                    if (skus.mycart === 0 || undefined) {
                        this.allProducts[i].quantity = 1;
                        this.notInCart = true;
                    } else {
                        this.notInCart = false;
                        this.selected = index;
                        this.allProducts[i].quantity = skus.mycart;
                    }
                }

            }
        }


    }

    ShowProductDetails(Id) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                prodId: Id
            }
        }
        this.router.navigate(['/productdetails'], navigationExtras);
    }

    showCatProd(catId, i, name) {
        this.mainServe.showCategories = false;
        this.mainServe.showSubCats = false;
        // this.headerComp.showCatProd(catId, i, name);
        let navigationExtras: NavigationExtras = {
            queryParams: {
                'sId': catId,
                'catName': name,
                'action': 'category'
            }
        };
        this.router.navigate(["/categoriesProducts"], navigationExtras)
    }
    brands = [];
    selectedBrnd;
    viewAll(action) {
        if (action === 'SMART BASKET') {
            if (localStorage.token === undefined) {
                swal('Please Login', '', 'warning');
                return;
            }
            let navigationExtras: NavigationExtras = {
                queryParams: {
                    title: action
                }
            }
            this.router.navigate(['/smartBasket'], navigationExtras);
            return;
        } else {
            let navigationExtras: NavigationExtras = {
                queryParams: {
                    title: action
                }
            }
            this.router.navigate(['/viewAll'], navigationExtras);
        }
    }
    getBrands() {
        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
            'token': (localStorage.token === undefined) ? '' : JSON.parse(localStorage.token),
            'Session_id': localStorage.session
        });
        this.http.get(AppSettings.baseUrl + 'products/getbrandes', { headers: headers }).subscribe(response => {
            this.brands = response.json().result;
        })
    }
    dealResult = [];
    brandsProducts = [];
    first = [];
    selectBrand(action, index, prodData, quantity) {
        this.selectedBrnd = action;

        var params = {
            brandname: action,
            city: localStorage.city,
            area: localStorage.area
        }
        this.mainServe.getBrandsProducts(params).subscribe(response => {
            if (response.json().message === "No records found") {
                this.noData = response.json().message;
                this.allProducts = [];
            } else {
                this.dealResult = response.json().products;
                for (var l = 0; l < this.dealResult.length; l++) {
                    this.brandsProducts.push(this.dealResult[l].products[0]);
                }

                //first brands products array
                for (var i = 0; i < this.brandsProducts.length; i++) {
                    this.first.push(this.brandsProducts[i]);
                }

                this.allProducts = _.uniq(this.first, function (obj) {
                    return obj.id;
                })

                this.showveg = true;
                if (response.json().status == 400) {
                    this.showveg = false;
                    this.noData = true;
                    this.noData = response.json().message;
                } else {
                    this.noData = false;
                }

                if (index !== '') {
                    // this.selecte.skid = this.skId;
                    // for (var i = 0; i < prodData.sku.length; i++) {
                    //     if (this.selecte.skid === prodData.sku[i].size) {
                    //         this.selecte.skid = prodData.sku[i].size;
                    //         this.selected = index;
                    //     }
                    // }
                    // this.skId = this.skId;
                    if (this.allProducts !== undefined) {
                        for (var i = 0; i < this.allProducts.length; i++) {
                            for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                                if (prodData.id === this.allProducts[i].id) {
                                    this.allProducts[i].quantity = quantity;
                                    this.allProducts[i].skuActualPrice = this.skudata.actual_price;
                                    this.allProducts[i].rating = this.skudata.ratings;
                                    this.allProducts[i].sellingPrice = this.skudata.selling_price;
                                    this.allProducts[i].product_image = this.skudata.skuImages[0];
                                    // this.selecte.skid = this.allProducts[i].sku[j].size;
                                    this.notInCart = false;
                                    this.selected = index;

                                } else {
                                    this.allProducts[i].quantity = 1;
                                    this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                                    this.allProducts[i].skuActualPrice = this.allProducts[i].sku[0].actual_price;
                                    this.allProducts[i].rating = this.allProducts[i].sku[0].ratings;
                                    this.allProducts[i].sellingPrice = this.allProducts[i].sku[0].selling_price;
                                    // this.notInCart = true;
                                }

                            }
                        }
                    }
                } else {
                    if (this.allProducts !== undefined) {
                        for (var i = 0; i < this.allProducts.length; i++) {
                            for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                                this.allProducts[i].skuActualPrice = this.allProducts[i].sku[0].actual_price;
                                this.allProducts[i].rating = this.allProducts[i].sku[0].ratings;
                                this.allProducts[i].sellingPrice = this.allProducts[i].sku[0].selling_price;
                            }
                            this.allProducts[i].quantity = 1;
                            this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                        }
                    }
                }
            }
        }, error => {
            if (error.json().status == 400) {
                this.showveg = false;
                this.noData = true;
                this.noData = error.json().message;
            }

        })
    }



}

