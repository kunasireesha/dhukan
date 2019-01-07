import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material';
import { HeaderComponent } from '../header/header.component';
import { MainService } from '../../services/main/main';
import { HeaderService } from '../../services/header/header';
import { AppSettings } from '../../config';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { Post } from '../../services/products';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as _ from 'underscore';
import { Http, Headers } from '@angular/http';
import { ProfileService } from '../../services/profile/profiledata';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

export interface prod {
    name: string;
}

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.less', '../../components/header/header.component.css'],
    providers: [HeaderComponent, NgbRatingConfig]
})



export class MainComponent implements OnInit {


    stateCtrl = new FormControl();
    filteredStates: Observable<prod[]>;


    constructor(public mainServe: MainService,
        public router: Router, private headerSer: HeaderService, public headerComp: HeaderComponent, public http: Http,
        private profileSer: ProfileService, config: NgbRatingConfig) {
        config.max = 5;
        config.readonly = true;
        this.getDashboard('', '', '');
        this.getCartList();

    }
    posts: Post[];
    bannerImageOne = true;


    bannerImageTwo = false;
    bannerImageThree = false;

    showCategories = false;
    results: any;
    banners = [];
    randomkey;
    dashboardData = [];
    url = AppSettings.imageUrl;
    image;
    resData = [];
    allProducts = [];
    allProductsData: prod[];
    productsData = [];
    ordersData = [];
    pro;
    cartCount;
    deliveryCharge;
    subTotal;
    Total;
    selectedCity: any;
    notInCart = true;
    selecte = {
        skid: ''
    }

    currentRate;
    showSizeData = false;
    prodId;
    showselecteddata = true;
    showselecteddifdata = true;
    skudata;
    selectedCat;

    ngOnInit() {
        window.scrollTo(0, 0);
        this.getAllCategoriesWithSubCat();
        this.getDashboard('', '', '');
        this.mainServe.getCartList();
    }


    bigImage;
    bannerImageOneOffer(image, index) {
        this.bigImage = image;
        this.bannerImageOne = index;
        this.bannerImageTwo = false;
        this.bannerImageThree = false;
    }
    bannerImageTwoOffer() {
        this.bannerImageOne = false;
        this.bannerImageTwo = true;
        this.bannerImageThree = false;
    }
    bannerImageThreeOffer() {
        this.bannerImageOne = false;
        this.bannerImageTwo = false;
        this.bannerImageThree = true;
    }


    item = {
        quantity: 1
    }
    selected;
    showInput = false;
    //add to cart
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
                    this.allProducts[i].quantity = this.allProducts[i].quantity - 1;
                    // this.mainServe.modifyCart(id,this.allProducts[i].quantity,this.skId,)
                    this.deleteCart(this.skId);

                    this.skId = undefined;
                    this.products.quantity = 1
                    this.notInCart = false;
                    this.selected = undefined;
                    // if (this.mainServe.viewCart === undefined) {
                    //     this.mainServe.cartCount = 0;
                    // }


                } else {
                    this.allProducts[i].quantity = this.allProducts[i].quantity - 1;
                    this.addCat(products, index, this.allProducts[i].quantity);
                    return;
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




    //get categories and subcategories

    getAllCategoriesWithSubCat() {
        this.headerSer.getAllCatAndSubCat().subscribe(response => {
            this.results = response.json().result.banner.TOP1;
            // console.log('http://versatilemobitech.co.in/DHUKAN/' + this.results[0].website_banner[0])
            //   console.log(this.results);
            //   this.banners = this.results.banner.TOP1;
            //   console.log(this.banners);
        });
    }
    skId;
    skuId;
    selectOption(skId, index) {
        // this.getDashboard(index, '', '');
        for (var i = 0; i < this.allProducts.length; i++) {
            for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                if (this.allProducts[i].sku[j].skid === parseInt(skId)) {
                    this.skId = skId;
                    this.selecte.skid = skId;
                    this.allProducts[i].skuActualPrice = this.allProducts[i].sku[j].actual_price;
                    this.allProducts[i].sellingPrice = this.allProducts[i].sku[j].selling_price;
                    this.allProducts[i].rating = this.allProducts[i].sku[j].ratings;
                    this.allProducts[i].quantity = this.allProducts[i].sku[j].mycart;
                    this.allProducts[i].product_image = this.allProducts[i].sku[j].skuImages[0];
                    if (this.allProducts[i].sku[j].mycart === 0 || undefined) {
                        this.allProducts[i].quantity = 1;
                        this.notInCart = true;
                    } else {
                        this.notInCart = false;
                        this.selected = index;
                    }

                } else {
                    this.selecte.skid = '';
                    // this.allProducts[i].quantity = 1;
                }
            }
        }

        //  else {
        //     this.notInCart = true;
        // }
    }
    products = {
        quantity: 1
    }
    // ||this.skId===prodData
    addCat(prodData, index, quantity) {
        if (this.skId === undefined || this.skId === '' || this.prodId !== prodData.id) {
            for (var i = 0; i < this.allProducts.length; i++) {
                if (prodData.id === this.allProducts[i].id) {
                    this.skId = this.allProducts[i].sku[0].skid;
                    this.skudata = this.allProducts[i].sku[0]
                    this.selecte.skid = this.allProducts[i].sku[0].size;

                    var inData = "product_id=" + prodData.id +
                        "&quantity=" + prodData.quantity +
                        "&product_sku_id=" + this.skId

                    this.mainServe.addCat(inData).subscribe(response => {
                        if (response.json().status === 200) {
                            this.resData = response.json();
                            this.cartCount = response.json().summary.cart_count;
                            this.mainServe.getCartList();
                            this.getDashboard(index, quantity, prodData);
                            this.notInCart = false;
                            this.selected = index;

                        } else {
                            swal(response.json().message, "", "error");
                        }
                    }, error => {
                        swal(error.json().message, "", "error");
                    })
                    // }
                    return;
                }
            }
        } else {
            for (var i = 0; i < this.allProducts.length; i++) {
                for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                    if (prodData.id === this.allProducts[i].id) {
                        // this.skId = this.allProducts[i].sku[j].skid;
                        this.skudata = this.allProducts[i].sku[0]
                        // this.selecte.skid = this.allProducts[i].sku[j].size;

                        var inData = "product_id=" + prodData.id +
                            "&quantity=" + prodData.quantity +
                            "&product_sku_id=" + this.skId


                        this.mainServe.addCat(inData).subscribe(response => {
                            if (response.json().status === 200) {
                                this.resData = response.json();
                                this.cartCount = response.json().summary.cart_count;
                                // swal(response.json().message, "", "success");
                                this.mainServe.getCartList();
                                // this.getDashboard(index, quantity, prodData);
                                // this.skId = undefined;
                                this.notInCart = false;
                                this.selected = index;
                                // this.products.quantity = quantity;
                                // this.selecte.skid = this.skId;
                            } else {
                                swal(response.json().message, "", "error");
                                // this.skId = undefined;
                            }
                        }, error => {
                            swal(error.json().message, "", "error");
                            // this.skId = undefined;
                        })
                        // }
                        return;
                    }


                }
            }
        }
        // if (localStorage.token === undefined) {
        //     swal('Please Login', '', 'warning');
        // } else {



    }


    viewAll(action) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                title: action
            }
        }
        this.router.navigate(['/viewAll'], navigationExtras);
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
            return;
        } else {
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
    }


    //header
    searchParam;
    viewCart;

    getCartList() {
        // this.getDashboard('', '', '');
        this.mainServe.getCartList();
    }


    searchProducts() {
        this.mainServe.searchProducts(this.searchParam)
    }


    itemHeaderDecrease(title, data, skuData) {
        this.mainServe.itemHeaderDecrease(title, data, skuData);
        this.getDashboard('', '', data);
        this.mainServe.getCartList();
    }

    itemHeaderIncrease(title, item, data) {
        this.mainServe.itemHeaderIncrease(title, item, data);
        this.getDashboard('', '', data);
        this.mainServe.getCartList();
    }
    showCat() {
        this.headerComp.showCategories = !this.headerComp.showCategories;
        this.mainServe.showCat();
    }

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
        swal("Do you want to delete?", "", "warning", {
            buttons: ["Cancel!", "Okay!"],
        }).then((value) => {

            if (value === true) {
                this.mainServe.deleteCart(inData).subscribe(response => {
                    if (response.json().status === 200) {
                        this.cartCount = response.json().summary.cart_count;
                        this.getDashboard('', '', '');
                        this.mainServe.getCartList();
                        swal(response.json().message, "", "success");
                    } else {
                        swal(response.json().message, "", "error");
                    }
                }, error => {
                    console.log(error);
                })
            } else {
                return;
            }
        });

    }
    sku = {
        skid: ''
    }
    skid;
    mainBaners = [];
    dealsBaners = [];
    discountBanner = [];
    discountApplicance = [];
    bestDiscountAppliances = [];
    mainBannerData = [];
    brandsData = [];
    dealsBannerData = [];
    discountBannerData = [];
    firstDiscountImg = [];
    secondDiscountImg = [];
    thirdDiscountImg = [];
    fourthDiscountImg = [];
    fifthDiscountImg = [];
    sixthtDiscountImg = [];
    seventhDiscountImg = [];
    eighthDiscountImg = [];
    ninthDiscountImg = [];

    firstDiscountApImg = [];
    secondDiscountApImg = [];
    thirdDiscountApImg = [];
    fourthDiscountApImg = [];
    fifthDiscountApImg = [];
    sixthtDiscountApImg = [];
    seventhDiscountApImg = [];
    eighthDiscountApImg = [];
    ninthDiscountApImg = [];
    brandsTotalData = [];
    dealsBannerDataImage;
    getDashboard(index, quantity, prodData) {
        this.mainServe.getDashboard().subscribe(response => {
            this.dashboardData = response.json();
            this.allProducts = response.json().products;

            this.allProductsData = this.allProducts;
            this.posts = this.allProducts;
            this.cartCount = response.json().cart.cart_count || 0;
            this.deliveryCharge = response.json().cart.delivery_charge.toFixed(2);
            this.subTotal = response.json().cart.selling_price.toFixed(2);
            this.Total = response.json().cart.grand_total.toFixed(2);
            this.mainBaners = _.filter(response.json().offer, function (obj) {
                return obj.banner_position === "Main banners";
            });

            this.mainBannerData = this.mainBaners[0].banner;

            this.dealsBaners = _.filter(response.json().offer, function (obj) {
                return obj.banner_position === "Best Deals";
            });
            this.dealsBannerDataImage = this.dealsBaners[0].banner[0];
            this.dealsBannerData = this.dealsBaners[0].banner;

            this.bigImage = this.dealsBaners[0].banner[0].website_bannerimage;
            this.discountBanner = _.filter(response.json().offer, function (obj) {
                return obj.banner_position === "Best Discount";
            });

            this.discountBannerData = this.discountBanner[0].banner;

            this.discountApplicance = _.filter(response.json().offer, function (obj) {
                return obj.banner_position === "Best Appliances";
            });

            this.firstDiscountImg = this.discountApplicance[0].banner;
            this.secondDiscountImg = this.discountApplicance[0].banner;
            this.thirdDiscountImg = this.discountApplicance[0].banner;
            this.fourthDiscountImg = this.discountApplicance[0].banner;
            this.fifthDiscountImg = this.discountApplicance[0].banner;
            this.sixthtDiscountImg = this.discountApplicance[0].banner;
            this.seventhDiscountImg = this.discountApplicance[0].banner;
            this.eighthDiscountImg = this.discountApplicance[0].banner;
            this.ninthDiscountImg = this.discountApplicance[0].banner;




            this.bestDiscountAppliances = _.filter(response.json().offer, function (obj) {
                return obj.banner_position === "Best Discount Appliances";
            });

            this.firstDiscountApImg = this.bestDiscountAppliances[0].banner;
            this.secondDiscountApImg = this.bestDiscountAppliances[0].banner;
            this.thirdDiscountApImg = this.bestDiscountAppliances[0].banner;
            this.fourthDiscountApImg = this.bestDiscountAppliances[0].banner;
            this.fifthDiscountApImg = this.bestDiscountAppliances[0].banner;
            this.sixthtDiscountApImg = this.bestDiscountAppliances[0].banner;
            this.seventhDiscountApImg = this.bestDiscountAppliances[0].banner;
            this.eighthDiscountApImg = this.bestDiscountAppliances[0].banner;
            this.ninthDiscountApImg = this.bestDiscountAppliances[0].banner;

            this.brandsData = _.filter(response.json().offer, function (obj) {
                return obj.banner_position === "Popular Brands";
            });

            this.brandsTotalData = this.brandsData[0].banner;

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
                            this.allProducts[i].product_image = this.skudata.skuImages[0];
                            this.allProducts[i].rating = this.skudata.ratings;
                            this.notInCart = false;
                            this.selected = index;
                        } else {
                            this.allProducts[i].quantity = 1;
                            this.allProducts[i].product_image = this.allProducts[i].sku[j].skuImages[0];
                            this.allProducts[i].skuActualPrice = this.allProducts[i].sku[j].actual_price;
                            this.allProducts[i].sellingPrice = this.allProducts[i].sku[j].selling_price;
                            this.allProducts[i].rating = this.allProducts[i].sku[j].ratings;
                            // this.notInCart = true;
                        }

                    }
                }
            } else {
                for (var i = 0; i < this.allProducts.length; i++) {
                    for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                        // this.allProducts[i].quantity = this.allProducts[i].sku[0].mycart;
                        this.allProducts[i].skuActualPrice = this.allProducts[i].sku[0].actual_price;
                        this.allProducts[i].sellingPrice = this.allProducts[i].sku[0].selling_price;
                        this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                        this.allProducts[i].rating = this.allProducts[i].sku[0].ratings;

                        this.allProducts[i].quantity = 1;
                        if (this.allProducts[i].sku[j].mycart === 0 || undefined) {
                            this.allProducts[i].quantity = 1;
                            this.notInCart = true;
                        } else {
                            this.notInCart = false;
                            this.selected = index;
                            this.allProducts[i].quantity = this.allProducts[i].sku[0].mycart;
                        }
                    }
                }

            }

            if (prodData.product_id !== undefined) {
                this.notInCart = true;
            }

        })


    }







    findIndexToUpdate(newItem) {
        return newItem.id === this;
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
                    this.allProducts[i].sellingPrice = this.allProducts[i].sku[j].selling_price;
                    this.allProducts[i].product_image = this.allProducts[i].sku[j].skuImages[0];
                    this.allProducts[i].rating = this.allProducts[i].sku[j].ratings;
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


    latlocation;
    lanLocation;
    getPin;

}

