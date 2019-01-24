import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MainService } from './../../services/main/main';
import { ProfileService } from '../../services/profile/profiledata';
import { HeaderComponent } from '../header/header.component';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Http, Headers } from '@angular/http';
import { AppSettings } from '../../config';
import * as _ from 'underscore';
@Component({
    selector: 'app-allproducts',
    templateUrl: './allproducts.html',
    styleUrls: ['./searchproducts.component.css', '../../components/header/header.component.css'],
    providers: [HeaderComponent, NgbRatingConfig]
})
export class AllProductsComponent implements OnInit {
    title;
    products;
    noData = false;
    page;
    showSizeData = false;
    prodId;
    showselecteddifdata = true;
    skudata;
    offersData = false;
    showBasketData = false;
    selecte = {
        skid: ''
    }
    wishData;
    wishListData = [];
    orderId;
    ordersData: any[];
    constructor(private router: Router,
        private route: ActivatedRoute,
        public mainSer: MainService,
        public profileSer: ProfileService,
        public headerComp: HeaderComponent,
        public http: Http,
        config: NgbRatingConfig) {
        config.max = 5;
        config.readonly = true;
        this.route.queryParams.subscribe(params => {
            this.title = params.title;

        })
        this.page = this.route.snapshot.data[0]['page'];
        if (this.page === 'mywishlist') {
            this.showAll = false;
            this.showWish = true;
            this.showBasketData = false;
            this.getWishList();
            // this.myprofileData = true;
            // this.childPage = 'My Profile';
            // this.getProfileDetails();
        } else if (this.page === 'viewAll') {
            // this.getAllProducts();
            this.showAll = true;
            this.showWish = false;
            this.showBasketData = false;
            if (this.title === 'BEST DEALS OF THE DAY') {
                this.getDealsOftheDay('', '', '');
            } else if (this.title === 'BEST DEALS') {
                this.getDeals('', '', '');
            } else if (this.title === 'BEST DEALS ON APPLIANCES') {
                this.getDealsOnAppliances('', '', '');
            } else if (this.title === 'ALL OFFERS') {
                this.getAllOffers('', '', '');
            } else if (this.title === 'NEW ARRIVALS') {
                this.getNewArrivals('', '', '');
            } else {
                this.noData = true;
            }
            // this.getCartList();
        } else if (this.page === 'smartBasket') {
            this.showAll = false;
            this.showWish = false;
            this.showBasketData = true;
            this.getOrders();
            // this.getSmartBasket('', '', '', '');

        }


    }

    item = {
        quantity: 1
    }
    allProducts = [];
    showAll = false;
    showWish = false;

    notInCart = true;
    ngOnInit() {
        // this.getAllProducts();
        // this.getWishList();
        // this.getDashboard('', '', '');
    }

    selectOption(skId, index) {
        this.selected = index;
        this.skId = skId
        for (var i = 0; i < this.allProducts.length; i++) {
            for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                if (this.allProducts[i].sku[j].skid === parseInt(skId)) {
                    this.allProducts[i].skuActualPrice = this.allProducts[i].sku[j].actual_price;
                    this.allProducts[i].sellingPrice = this.allProducts[i].sku[j].selling_price;
                    this.allProducts[i].quantity = this.allProducts[i].sku[j].mycart;
                    this.allProducts[i].rating = this.allProducts[i].sku[j].ratings;
                    this.allProducts[i].product_image = this.allProducts[i].sku[j].skuImages[0];
                    if (this.allProducts[i].sku[j].mycart === 0 || this.allProducts[i].sku[j].length === 0) {
                        this.allProducts[i].quantity = 1;
                        this.notInCart = true;
                    } else {
                        this.notInCart = false;
                    }
                }
            }

        }
    }

    resData;
    skId;
    itemIncrease(data, id, index) {
        for (var i = 0; i < this.allProducts.length; i++) {
            if (id === this.allProducts[i].id) {
                this.allProducts[i].quantity = this.allProducts[i].quantity + 1;
                this.addCat(data, index, this.allProducts[i].quantity);
            }
        }
    }
    data = {
        quantity: 1
    }
    selected;
    itemDecrease(id, products, index) {

        for (var i = 0; i < this.allProducts.length; i++) {
            if (id === this.allProducts[i].id) {
                if (this.allProducts[i].quantity === 1) {
                    this.deleteCart(this.skId);
                    this.mainSer.getCartList();
                    this.skId = undefined;
                    this.data.quantity = 1
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
    addCat(prodData, index, quantity) {
        if (this.skId === undefined || this.skId === '' || this.prodId !== prodData.id) {
            for (var i = 0; i < this.allProducts.length; i++) {
                if (prodData.id === this.allProducts[i].id) {
                    this.skId = this.allProducts[i].sku[0].skid;
                    this.skudata = this.allProducts[i].sku[0]
                    this.selecte.skid = this.allProducts[i].sku[0].size;
                }
            }
        } else {
            for (var i = 0; i < this.allProducts.length; i++) {
                for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                    if (prodData.id === this.allProducts[i].id) {
                        this.skId = this.allProducts[i].sku[j].skid;
                        this.skudata = this.allProducts[i].sku[0]
                        this.selecte.skid = this.allProducts[i].sku[j].size;
                    }
                }
            }
        }

        var inData = "product_id=" + prodData.id +
            "&quantity=" + prodData.quantity +
            "&product_sku_id=" + this.skId


        this.mainSer.addCat(inData).subscribe(response => {
            this.resData = response.json();
            if (response.json().status === 200) {
                // swal(response.json().message, "", "");
                if (this.page === 'mywishlist') {
                    this.mainSer.getCartList();
                    this.getWishList();
                } else if (this.page === 'smartBasket') {
                    this.getSmartBasket(this.orderId, index, quantity, prodData);
                    this.getOrders();
                } else if (this.title === 'BEST DEALS OF THE DAY') {
                    this.getDealsOftheDay(index, quantity, prodData);
                } else if (this.title === 'BEST DEALS') {
                    this.getDeals(index, quantity, prodData);
                } else if (this.title === 'BEST DEALS ON APPLIANCES') {
                    this.getDealsOnAppliances(index, quantity, prodData);
                } else if (this.title === 'ALL OFFERS') {
                    this.getAllOffers(index, quantity, prodData);
                } else if (this.title === 'NEW ARRIVALS') {
                    this.getNewArrivals(index, quantity, prodData);
                } else {
                    this.getDashboard(index, quantity, prodData);
                }

                this.mainSer.getCartList();
                // this.skId = undefined;
                // this.data.quantity = quantity;
                this.notInCart = false;
                this.selected = index;
            } else {
                swal(response.json().message, "", "");
                this.skId = undefined;
            }
        }, error => {
            swal(error.json().message, "", "");
            this.skId = undefined;
        })



    }
    addWish(prodData) {
        if (this.skId === undefined || this.skId === '' || this.prodId !== prodData.id) {
            for (var i = 0; i < this.allProducts.length; i++) {
                if (prodData.id === this.allProducts[i].id) {
                    this.skId = this.allProducts[i].sku[0].skid;
                    this.skudata = this.allProducts[i].sku[0]
                    // this.selecte.skid = this.allProducts[i].sku[0].size;
                }
            }
        }
        if (localStorage.token === undefined) {
            swal('Please Login', '', 'warning');
        } else {
            var inData =
                "user_id=" + localStorage.userId +
                "&product_id=" + prodData.id +
                "&quantity=" + prodData.quantity +
                "&session_id=" + localStorage.session +
                "&product_sku_id=" + this.skId

            this.mainSer.addWish(inData).subscribe(response => {
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
    }

    getWishList() {

        this.profileSer.getWishList().subscribe(response => {
            this.allProducts = [];
            if (response.json().err_field === "No records found") {
                this.noData = true;
            } else {
                this.noData = false;
                this.wishListData = response.json().result;

                for (var i = 0; i < this.wishListData.length; i++) {
                    this.allProducts.push(this.wishListData[i].products[0]);
                }

                for (var i = 0; i < this.allProducts.length; i++) {
                    this.allProducts[i].skuActualPrice = this.allProducts[i].sku[0].actual_price;
                    this.allProducts[i].sellingPrice = this.allProducts[i].sku[0].selling_price;
                    this.allProducts[i].rating = this.allProducts[i].sku[0].ratings;
                    this.allProducts[i].quantity = 1;
                    // this.selecte.skid = this.allProducts[i].sku[0].size;                
                    this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                }
                // this.allProducts
                this.showAll = false;

            }
        }, error => {

        })

    }
    ShowProductDetails(Id) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                prodId: Id
            }
        }
        this.router.navigate(['/productdetails'], navigationExtras);
    }

    //header
    searchParam;
    viewCart;

    getCartList() {
        // if (this.page === 'mywishlist') {
        //     this.mainSer.getCartList();
        //     this.getWishList();
        // } 
        // else if (this.title === 'BEST DEALS OF THE DAY') {
        //     this.getDealsOftheDay('', '', '');
        // } else if (this.title === 'BEST DEALS') {
        //     this.getDeals('', '', '');
        // } else if (this.title === 'BEST DEALS ON APPLIANCES') {
        //     this.getDealsOnAppliances('', '', '');
        // } else {
        //     this.getDashboard('', '', '');
        // }

        this.mainSer.getCartList();
    }


    searchProducts() {
        this.mainSer.searchProducts(this.searchParam)
    }


    itemHeaderDecrease(title, data, skuData) {
        this.mainSer.itemHeaderDecrease(title, data, skuData);
        if (this.page === 'mywishlist') {
            this.mainSer.getCartList();
            this.getWishList();
        } else if (this.page === 'smartBasket') {
            this.getSmartBasket(this.orderId, '', '', data);
            this.getOrders();
        } else if (this.title === 'BEST DEALS OF THE DAY') {
            this.getDealsOftheDay('', '', data);
        } else if (this.title === 'BEST DEALS') {
            this.getDeals('', '', data);
        } else if (this.title === 'BEST DEALS ON APPLIANCES') {
            this.getDealsOnAppliances('', '', data);
        } else if (this.title === 'ALL OFFERS') {
            this.getAllOffers('', '', data);
        } else if (this.title === 'NEW ARRIVALS') {
            this.getNewArrivals('', '', data);
        } else {
            this.getDashboard('', '', data);
        }
    }


    itemHeaderIncrease(title, item, data) {
        this.mainSer.itemHeaderIncrease(title, item, data);
        if (this.page === 'mywishlist') {
            this.mainSer.getCartList();
            this.getWishList();
        } else if (this.page === 'smartBasket') {
            this.getSmartBasket(this.orderId, '', '', data);
            this.getOrders();
        } else if (this.title === 'BEST DEALS OF THE DAY') {
            this.getDealsOftheDay('', '', data);
        } else if (this.title === 'BEST DEALS') {
            this.getDeals('', '', data);
        } else if (this.title === 'BEST DEALS ON APPLIANCES') {
            this.getDealsOnAppliances('', '', data);
        } else if (this.title === 'ALL OFFERS') {
            this.getAllOffers('', '', data);
        } else if (this.title === 'NEW ARRIVALS') {
            this.getNewArrivals('', '', data);
        } else {
            this.getDashboard('', '', data);
        }
    }

    showCat() {
        this.mainSer.showCat();
    }
    selectedCat;
    showSubCat(id, i) {
        this.selectedCat = i;
        this.mainSer.showSubCat(id, i);
    }


    showSubCatProd(subId, index, name) {
        this.mainSer.showCategories = false;
        this.mainSer.showSubCats = false;
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
                this.mainSer.deleteCart(inData).subscribe(response => {
                    this.mainSer.getCartList();
                    if (this.page === 'mywishlist') {
                        this.mainSer.getCartList();
                        this.getWishList();
                    } else if (this.page === 'smartBasket') {
                        this.getSmartBasket(this.orderId, '', '', '');
                        this.getOrders();
                    } else if (this.title === 'BEST DEALS OF THE DAY') {
                        this.getDealsOftheDay('', '', '');
                    } else if (this.title === 'BEST DEALS') {
                        this.getDeals('', '', '');
                    } else if (this.title === 'BEST DEALS ON APPLIANCES') {
                        this.getDealsOnAppliances('', '', '');
                    } else if (this.title === 'ALL OFFERS') {
                        this.getAllOffers('', '', '');
                    } else if (this.title === 'NEW ARRIVALS') {
                        this.getNewArrivals('', '', '');
                    } else {
                        this.getDashboard('', '', '');
                    }
                    this.selected = undefined;
                    swal("Deleted successfully", "", "");
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
    getDashboard(index, quantity, prodData) {
        this.mainSer.getDashboard().subscribe(response => {

            this.cartCount = response.json().cart.cart_count;
            this.deliveryCharge = response.json().cart.delivery_charge.toFixed(2);
            this.subTotal = response.json().cart.selling_price.toFixed(2);
            this.Total = response.json().cart.grand_total.toFixed(2);
            this.allProducts = response.json().products;
            // this.showAll = true;

            if (index !== '') {
                // this.selecte.skid = this.skId;
                for (var i = 0; i < prodData.sku.length; i++) {
                    if (this.selecte.skid === prodData.sku[i].size) {
                        this.selecte.skid = prodData.sku[i].size;
                        this.selected = index;
                    }
                }
                // this.skId = this.skId;
                for (var i = 0; i < this.allProducts.length; i++) {
                    for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                        if (prodData.id === this.allProducts[i].id) {
                            this.allProducts[i].quantity = quantity;
                            this.allProducts[i].skuActualPrice = this.skudata.actual_price;
                            this.allProducts[i].sellingPrice = this.skudata.selling_price;
                            this.allProducts[i].product_image = this.skudata.skuImages[0];
                            this.allProducts[i].rating = this.skudata.ratings;
                            // this.selecte.skid = this.allProducts[i].sku[j].size;
                            this.notInCart = false;
                            this.selected = index;
                        } else {
                            this.allProducts[i].quantity = 1;
                            this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                            // this.notInCart = true;
                        }

                    }
                }
            } else {
                for (var i = 0; i < this.allProducts.length; i++) {
                    for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                        this.allProducts[i].quantity = this.allProducts[i].sku[j].mycart;
                        this.allProducts[i].skuActualPrice = this.allProducts[i].sku[0].actual_price;
                        this.allProducts[i].rating = this.allProducts[i].sku[0].ratings;
                        this.allProducts[i].sellingPrice = this.allProducts[i].sku[0].selling_price;

                        this.allProducts[i].quantity = 1;
                    }
                    this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                }
            }
            if (prodData.product_id !== undefined) {
                this.notInCart = true;
            }

            if (response.json().status == 400) {
                this.noData = response.json().message;
            }

        })
    }

    delasData = [];

    //get deals of the day
    getDealsOftheDay(index, quantity, prodData) {
        this.offersData = false;
        this.allProducts = [];
        this.mainSer.getBestDealsOftheDay().subscribe(response => {
            if (response.json().err_field === "No records found") {
                this.noData = true;
            } else {
                this.noData = false;
                this.cartCount = response.json().summary.cart_count;
                this.deliveryCharge = response.json().summary.delivery_charge.toFixed(2);
                this.subTotal = response.json().summary.selling_price.toFixed(2);
                this.Total = response.json().summary.grand_total.toFixed(2);
                this.delasData = response.json().result;

                for (var l = 0; l < this.delasData.length; l++) {
                    this.allProducts.push(this.delasData[l].products[0]);
                }
                // this.allProducts = response.json().products;
                // this.showAll = true;

                if (index !== '') {
                    // this.selecte.skid = this.skId;
                    for (var i = 0; i < prodData.sku.length; i++) {
                        if (this.selecte.skid === prodData.sku[i].size) {
                            this.selecte.skid = prodData.sku[i].size;
                            this.selected = index;
                        }
                    }
                    // this.skId = this.skId;
                    for (var i = 0; i < this.allProducts.length; i++) {
                        for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                            if (prodData.id === this.allProducts[i].id) {
                                this.allProducts[i].quantity = quantity;
                                this.allProducts[i].skuActualPrice = this.skudata.actual_price;
                                this.allProducts[i].sellingPrice = this.skudata.selling_price;
                                this.allProducts[i].product_image = this.skudata.skuImages[0];
                                this.allProducts[i].rating = this.skudata.ratings;
                                // this.selecte.skid = this.allProducts[i].sku[j].size;
                                this.notInCart = false;
                                this.selected = index;
                            } else {
                                this.allProducts[i].quantity = 1;
                                this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                                // this.notInCart = true;
                            }

                        }
                    }
                } else {
                    for (var i = 0; i < this.allProducts.length; i++) {
                        for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                            this.allProducts[i].quantity = this.allProducts[i].sku[j].mycart;
                            this.allProducts[i].skuActualPrice = this.allProducts[i].sku[0].actual_price;
                            this.allProducts[i].rating = this.allProducts[i].sku[0].ratings;
                            this.allProducts[i].sellingPrice = this.allProducts[i].sku[0].selling_price;

                            this.allProducts[i].quantity = 1;
                        }
                        this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                    }
                }
                if (prodData.product_id !== undefined) {
                    this.notInCart = true;
                }


            }

        })
    }


    //get deals 
    getDeals(index, quantity, prodData) {
        this.offersData = false;
        this.allProducts = [];
        this.mainSer.getBestDeals().subscribe(response => {
            if (response.json().err_field === "No records found") {
                this.noData = true;
            } else {
                this.noData = false;
                this.cartCount = response.json().summary.cart_count;
                this.deliveryCharge = response.json().summary.delivery_charge.toFixed(2);
                this.subTotal = response.json().summary.selling_price.toFixed(2);
                this.Total = response.json().summary.grand_total.toFixed(2);
                this.delasData = response.json().result;

                for (var l = 0; l < this.delasData.length; l++) {
                    this.allProducts.push(this.delasData[l].products[0]);
                }
                // this.allProducts = response.json().products;
                // this.showAll = true;

                if (index !== '') {
                    // this.selecte.skid = this.skId;
                    for (var i = 0; i < prodData.sku.length; i++) {
                        if (this.selecte.skid === prodData.sku[i].size) {
                            this.selecte.skid = prodData.sku[i].size;
                            this.selected = index;
                        }
                    }
                    // this.skId = this.skId;
                    for (var i = 0; i < this.allProducts.length; i++) {
                        for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                            if (prodData.id === this.allProducts[i].id) {
                                this.allProducts[i].quantity = quantity;
                                this.allProducts[i].skuActualPrice = this.skudata.actual_price;
                                this.allProducts[i].sellingPrice = this.skudata.selling_price;
                                this.allProducts[i].product_image = this.skudata.skuImages[0];
                                this.allProducts[i].rating = this.skudata.ratings;
                                // this.selecte.skid = this.allProducts[i].sku[j].size;
                                this.notInCart = false;
                                this.selected = index;
                            } else {
                                this.allProducts[i].quantity = 1;
                                this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                                // this.notInCart = true;
                            }

                        }
                    }
                } else {
                    for (var i = 0; i < this.allProducts.length; i++) {
                        for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                            this.allProducts[i].quantity = this.allProducts[i].sku[j].mycart;
                            this.allProducts[i].skuActualPrice = this.allProducts[i].sku[0].actual_price;
                            this.allProducts[i].rating = this.allProducts[i].sku[0].ratings;
                            this.allProducts[i].sellingPrice = this.allProducts[i].sku[0].selling_price;

                            this.allProducts[i].quantity = 1;
                        }
                        this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                    }
                }
                if (prodData.product_id !== undefined) {
                    this.notInCart = true;
                }


            }
        })
    }


    //get deals on appliances
    getDealsOnAppliances(index, quantity, prodData) {
        this.offersData = false;
        this.allProducts = [];
        this.mainSer.getBestDealsOnppliances().subscribe(response => {

            if (response.json().err_field === "No records found") {
                this.noData = true;
            } else {
                this.noData = false;
                this.cartCount = response.json().summary.cart_count;
                this.deliveryCharge = response.json().summary.delivery_charge.toFixed(2);
                this.subTotal = response.json().summary.selling_price.toFixed(2);
                this.Total = response.json().summary.grand_total.toFixed(2);
                this.delasData = response.json().result;
                for (var l = 0; l < this.delasData.length; l++) {
                    this.allProducts.push(this.delasData[l].products[0]);
                }
                // this.allProducts = response.json().products;
                // this.showAll = true;

                if (index !== '') {
                    // this.selecte.skid = this.skId;
                    for (var i = 0; i < prodData.sku.length; i++) {
                        if (this.selecte.skid === prodData.sku[i].size) {
                            this.selecte.skid = prodData.sku[i].size;
                            this.selected = index;
                        }
                    }
                    // this.skId = this.skId;
                    for (var i = 0; i < this.allProducts.length; i++) {
                        for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                            if (prodData.id === this.allProducts[i].id) {
                                this.allProducts[i].quantity = quantity;
                                this.allProducts[i].skuActualPrice = this.skudata.actual_price;
                                this.allProducts[i].sellingPrice = this.skudata.selling_price;
                                this.allProducts[i].product_image = this.skudata.skuImages[0];
                                this.allProducts[i].rating = this.skudata.ratings;
                                // this.selecte.skid = this.allProducts[i].sku[j].size;
                                this.notInCart = false;
                                this.selected = index;
                            } else {
                                this.allProducts[i].quantity = 1;
                                this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                                // this.notInCart = true;
                            }

                        }
                    }
                } else {
                    for (var i = 0; i < this.allProducts.length; i++) {
                        for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                            this.allProducts[i].quantity = this.allProducts[i].sku[j].mycart;
                            this.allProducts[i].skuActualPrice = this.allProducts[i].sku[0].actual_price;
                            this.allProducts[i].rating = this.allProducts[i].sku[0].ratings;
                            this.allProducts[i].sellingPrice = this.allProducts[i].sku[0].selling_price;

                            this.allProducts[i].quantity = 1;
                        }
                        this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                    }
                }
                if (prodData.product_id !== undefined) {
                    this.notInCart = true;
                }


            }


        })
    }


    showselecteddata = true;
    showSizes(index) {
        this.selecte.skid = '';
        this.selected = index;
        this.showSizeData = true;
        this.showselecteddifdata = true;
        this.notInCart = true;
        this.showselecteddata = true;

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
                if (this.allProducts[i].sku[j].skid === skId) {
                    this.skId = skId;
                    this.prodId = skus.product_id;
                    this.selecte.skid = this.allProducts[i].sku[j].size;
                    this.allProducts[i].skuActualPrice = this.allProducts[i].sku[j].actual_price;
                    this.allProducts[i].rating = this.allProducts[i].sku[j].ratings;
                    this.allProducts[i].sellingPrice = this.allProducts[i].sku[j].selling_price;
                    if (this.title === 'SMART BASKET' || this.page === 'smartBasket') {
                        this.allProducts[i].product_image = this.allProducts[i].sku[j].sku_images[0].sku_image;
                    } else {
                        this.allProducts[i].product_image = this.allProducts[i].sku[j].skuImages[0];
                    }
                    if (this.allProducts[i].sku[j].mycart === 0 || undefined) {
                        this.allProducts[i].quantity = 1;
                        this.notInCart = true;
                    } else {
                        this.notInCart = false;
                        this.allProducts[i].quantity = this.allProducts[i].sku[j].mycart;
                        this.selected = index;
                    }
                }

            }
        }
    }

    removeWish(id) {
        var params = {
            product_id: id
        }
        this.profileSer.emptyWish(params).subscribe(response => {
            swal("Successfully Cleared", "", "");
            this.getWishList();
        }, error => {

        })
    }
    offerBannerData = [];
    offerBanner = [];

    //all offers
    getAllOffers(index, quantity, prodData) {
        this.allProducts = [];
        this.offersData = true;
        this.mainSer.getAllOffers().subscribe(response => {
            if (response.json().err_field === "No records found") {
                this.noData = true;
            } else {
                this.noData = false;
                this.cartCount = response.json().summary.cart_count;
                this.deliveryCharge = response.json().summary.delivery_charge.toFixed(2);
                this.subTotal = response.json().summary.selling_price.toFixed(2);
                this.Total = response.json().summary.grand_total.toFixed(2);
                this.delasData = response.json().result;

                this.offerBanner = _.filter(response.json().bannerInfo, function (obj) {
                    return obj.banner_position === "Best Offers";
                });

                this.offerBannerData = this.offerBanner[0].banner;


                for (var l = 0; l < this.delasData.length; l++) {
                    this.allProducts.push(this.delasData[l].products[0]);
                }
                // this.allProducts = response.json().products;
                // this.showAll = true;

                if (index !== '') {
                    // this.selecte.skid = this.skId;
                    for (var i = 0; i < prodData.sku.length; i++) {
                        if (this.selecte.skid === prodData.sku[i].size) {
                            this.selecte.skid = prodData.sku[i].size;
                            this.selected = index;
                        }
                    }
                    // this.skId = this.skId;
                    for (var i = 0; i < this.allProducts.length; i++) {
                        for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                            if (prodData.id === this.allProducts[i].id) {
                                this.allProducts[i].quantity = quantity;
                                this.allProducts[i].skuActualPrice = this.skudata.actual_price;
                                this.allProducts[i].sellingPrice = this.skudata.selling_price;
                                this.allProducts[i].product_image = this.skudata.skuImages[0];
                                this.allProducts[i].rating = this.skudata.ratings;
                                // this.selecte.skid = this.allProducts[i].sku[j].size;
                                this.notInCart = false;
                                this.selected = index;
                            } else {
                                this.allProducts[i].quantity = 1;
                                this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                                // this.notInCart = true;
                            }

                        }
                    }
                } else {
                    for (var i = 0; i < this.allProducts.length; i++) {
                        for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                            this.allProducts[i].quantity = this.allProducts[i].sku[j].mycart;
                            this.allProducts[i].skuActualPrice = this.allProducts[i].sku[0].actual_price;
                            this.allProducts[i].rating = this.allProducts[i].sku[0].ratings;
                            this.allProducts[i].sellingPrice = this.allProducts[i].sku[0].selling_price;

                            this.allProducts[i].quantity = 1;
                        }
                        this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                    }
                }
                if (prodData.product_id !== undefined) {
                    this.notInCart = true;
                }


            }


        })
    }


    //my orders
    getOrders() {
        this.mainSer.getOrdersData().subscribe(response => {

            this.ordersData = response.json().data;
            for (var i = 0; i < this.ordersData.length; i++) {
                this.ordersData[i].formated_date = new Date(this.ordersData[i].order_date);
                this.ordersData[i].time = (this.ordersData[i].formated_date.getHours() > 12) ? this.ordersData[i].formated_date.getHours() - 12 : this.ordersData[i].formated_date.getHours()
                this.ordersData[i].converted_date = this.ordersData[i].formated_date.getDate() + '-' + (this.ordersData[i].formated_date.getMonth() + 1) + '-' + this.ordersData[i].formated_date.getFullYear() + '/' + this.ordersData[i].time + ':' + this.ordersData[i].formated_date.getMinutes()
            }

        });
    }
    //samrt basket
    getSmartBasket(id, index, quantity, prodData) {
        this.allProducts = [];
        this.offersData = false;
        this.getCartListData();
        this.orderId = id;
        this.mainSer.getSmartBasket(id).subscribe(response => {
            // this.cartCount = response.json().summary.cart_count;
            // this.deliveryCharge = response.json().summary.delivery_charge.toFixed(2);
            // this.subTotal = response.json().summary.selling_price.toFixed(2);
            // this.Total = response.json().summary.grand_total.toFixed(2);
            // this.delasData = response.json().result;

            // for (var l = 0; l < this.delasData.length; l++) {
            //     this.allProducts.push(this.delasData[l].products[0]);
            // }
            if (response.json().err_field === "No records found") {
                this.noData = true;
            } else {
                this.noData = false;
                this.allProducts = response.json().result;
                // this.showAll = true;

                if (index !== '') {
                    // this.selecte.skid = this.skId;
                    for (var i = 0; i < prodData.sku.length; i++) {
                        if (this.selecte.skid === prodData.sku[i].size) {
                            this.selecte.skid = prodData.sku[i].size;
                            this.selected = index;
                        }
                    }
                    // this.skId = this.skId;
                    for (var i = 0; i < this.allProducts.length; i++) {
                        for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                            if (prodData.id === this.allProducts[i].id) {
                                this.allProducts[i].quantity = quantity;
                                this.allProducts[i].skuActualPrice = this.skudata.actual_price;
                                this.allProducts[i].sellingPrice = this.skudata.selling_price;
                                this.allProducts[i].product_image = this.skudata.sku_images[0].sku_image;
                                this.allProducts[i].rating = this.skudata.ratings;
                                // this.selecte.skid = this.allProducts[i].sku[j].size;
                                this.notInCart = false;
                                this.selected = index;
                            } else {
                                this.allProducts[i].quantity = 1;
                                this.allProducts[i].product_image = this.allProducts[i].sku[0].sku_images[0].sku_image;
                                // this.notInCart = true;
                            }

                        }
                    }
                } else {
                    for (var i = 0; i < this.allProducts.length; i++) {
                        for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                            this.allProducts[i].quantity = this.allProducts[i].sku[j].mycart;
                            this.allProducts[i].skuActualPrice = this.allProducts[i].sku[0].actual_price;
                            this.allProducts[i].rating = this.allProducts[i].sku[0].ratings;
                            this.allProducts[i].sellingPrice = this.allProducts[i].sku[0].selling_price;
                            this.allProducts[i].quantity = 1;
                        }
                        this.allProducts[i].product_image = this.allProducts[i].sku[0].sku_images[0].sku_image;
                    }
                }
                if (prodData.product_id !== undefined) {
                    this.notInCart = true;
                }
            }


        })
    }


    //new arrivals
    getNewArrivals(index, quantity, prodData) {
        this.allProducts = [];
        this.offersData = false;
        this.getCartListData();
        this.mainSer.getNewArrivals().subscribe(response => {
            // this.cartCount = response.json().summary.cart_count;
            // this.deliveryCharge = response.json().summary.delivery_charge.toFixed(2);
            // this.subTotal = response.json().summary.selling_price.toFixed(2);
            // this.Total = response.json().summary.grand_total.toFixed(2);
            // this.delasData = response.json().result;

            if (response.json().err_field === "No records found") {
                this.noData = true;
            } else {
                this.noData = false;
                this.allProducts = response.json().result;
                if (index !== '') {
                    // this.selecte.skid = this.skId;
                    for (var i = 0; i < prodData.sku.length; i++) {
                        if (this.selecte.skid === prodData.sku[i].size) {
                            this.selecte.skid = prodData.sku[i].size;
                            this.selected = index;
                        }
                    }
                    // this.skId = this.skId;
                    for (var i = 0; i < this.allProducts.length; i++) {
                        for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                            if (prodData.id === this.allProducts[i].id) {
                                this.allProducts[i].quantity = quantity;
                                this.allProducts[i].skuActualPrice = this.skudata.actual_price;
                                this.allProducts[i].sellingPrice = this.skudata.selling_price;
                                this.allProducts[i].product_image = this.skudata.skuImages[0];
                                this.allProducts[i].rating = this.skudata.ratings;
                                // this.selecte.skid = this.allProducts[i].sku[j].size;
                                this.notInCart = false;
                                this.selected = index;
                            } else {
                                this.allProducts[i].quantity = 1;
                                this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                                // this.notInCart = true;
                            }

                        }
                    }
                } else {
                    for (var i = 0; i < this.allProducts.length; i++) {
                        for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                            this.allProducts[i].quantity = this.allProducts[i].sku[j].mycart;
                            this.allProducts[i].skuActualPrice = this.allProducts[i].sku[0].actual_price;
                            this.allProducts[i].rating = this.allProducts[i].sku[0].ratings;
                            this.allProducts[i].sellingPrice = this.allProducts[i].sku[0].selling_price;

                            this.allProducts[i].quantity = 1;
                        }
                        this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                    }
                }
                if (prodData.product_id !== undefined) {
                    this.notInCart = true;
                }


            }


        })
    }

    viewAll(action) {

        if (action === 'BEST DEALS OF THE DAY') {
            this.title = 'BEST DEALS OF THE DAY';
            this.getDealsOftheDay('', '', '');
            this.showBasketData = false;
        } else if (action === 'BEST DEALS') {
            this.title = 'BEST DEALS';
            this.getDeals('', '', '');
            this.showBasketData = false;
        } else if (action === 'BEST DEALS ON APPLIANCES') {
            this.title = 'BEST DEALS OF THE DAY';
            this.getDealsOnAppliances('', '', '');
            this.showBasketData = false;
        } else if (action === 'ALL OFFERS') {
            this.title = 'ALL OFFERS';
            this.getAllOffers('', '', '');
            this.showBasketData = false;
        } else if (action === 'SMART BASKET') {
            if (localStorage.token === undefined) {
                swal('Please Login', '', 'warning');
                return;
            }
            this.title = 'SMART BASKET';
            this.showAll = false;
            this.showBasketData = true;
            this.getSmartBasket(this.orderId, '', '', '');
            this.getOrders();

        } else if (action === 'NEW ARRIVALS') {
            this.title = 'NEW ARRIVALS';
            this.getNewArrivals('', '', '');
            this.showBasketData = false;
        } else {
            this.noData = true;
            this.showBasketData = false;
        }
    }


    displayCounter(data) {
        if (this.title === 'BEST DEALS OF THE DAY') {
            this.getDealsOftheDay('', '', '');
            this.title = 'BEST DEALS OF THE DAY';
        } else if (this.title === 'BEST DEALS') {
            this.getDeals('', '', '');
            this.title = 'BEST DEALS';
        } else if (this.title === 'BEST DEALS ON APPLIANCES') {
            this.getDealsOnAppliances('', '', '');
            this.title = 'BEST DEALS ON APPLIANCES';
        } else if (this.title === 'ALL OFFERS') {
            this.getAllOffers('', '', '');
            this.title = 'ALL OFFERS';
        } else if (this.title === 'SMART BASKET') {
            this.getSmartBasket(this.orderId, '', '', '');
            this.getOrders();
            this.title = 'SMART BASKET';
        } else if (this.title === 'NEW ARRIVALS') {
            this.getNewArrivals('', '', '');
            this.title = 'NEW ARRIVALS';
        } else {
            this.noData = true;
        }
    }


    getCartListData() {
        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
            'token': (localStorage.token === undefined) ? '' : JSON.parse(localStorage.token),
            'Session_id': localStorage.session
        });
        this.http.get(AppSettings.baseUrl + 'cart/cart-list', { headers: headers }).subscribe(response => {
            if (response.json().status === 200) {
                if (response.json().summary !== undefined) {
                    this.cartCount = response.json().summary.cart_count;
                    this.deliveryCharge = response.json().summary.delivery_charge.toFixed(2);
                    this.subTotal = response.json().summary.selling_price.toFixed(2);
                    this.Total = response.json().summary.grand_total.toFixed(2);
                }

            }

        })
    }


}