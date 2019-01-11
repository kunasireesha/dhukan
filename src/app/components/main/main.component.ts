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
        skid: '',
        bdskid: '',
        dskid: '',
        baskid: ''
    }

    selectedsku;

    currentRate;
    showSizeData = false;
    prodId;
    showselecteddata = true;
    showselecteddifdata = true;
    skudata;
    selectedCat;
    sku = {
        skid: '',

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
    first = [];
    second = [];
    dealsBannerDataImage;
    secondArray = [];
    firstArray = [];
    thirdArray = [];
    third = [];
    dealsProducts = [];
    firstAppliances = [];
    secondAppliances = [];
    thirdAppliances = [];
    firstAppliancesArray = [];
    secondAppliancesArray = [];
    thirdAppliancesArray = [];
    appliaceData = [];
    firstDeals = [];
    secondDeals = [];
    thirdDeals = [];
    firstDealsArray = [];
    secondDealsArray = [];
    thirdDealsArray = [];
    dealsData = [];
    dealsOftheDayProducts = [];
    dealsOnAppliancesProducts = [];
    dealResult = [];
    nobestDealsdData = false;
    nobestDeals = false;
    noappliances = false;
    noData = false;
    ngOnInit() {
        window.scrollTo(0, 0);
        this.getAllCategoriesWithSubCat();
        this.getDashboard('', '', '');
        this.mainServe.getCartList();
        this.getBestDealsOftheDay('', '', '');
        this.getBestDeals('', '', '');
        this.getBestDealsOnAppliance('', '', '');
    }

    displayCounter(data) {
        console.log(data);
        this.getDashboard('', '', '');
        this.mainServe.getCartList();
        this.getBestDealsOftheDay('', '', '');
        this.getBestDeals('', '', '');
        this.getBestDealsOnAppliance('', '', '');
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
    itemIncrease(products, id, index, action) {

        if (action === 'main products') {
            for (var i = 0; i < this.allProducts.length; i++) {
                if (id === this.allProducts[i].id) {
                    this.allProducts[i].quantity = this.allProducts[i].quantity + 1;
                    this.addCat(products, index, this.allProducts[i].quantity, action);
                    return;
                }
            }
        } else if (action === 'best deals of the day') {
            for (var i = 0; i < this.firstArray.length; i++) {
                if (id === this.firstArray[i].id) {
                    this.firstArray[i].quantity = this.firstArray[i].quantity + 1;
                    this.addCat(products, index, this.firstArray[i].quantity, action);
                    return;
                }
            }
        } else if (action === 'best deals') {
            for (var i = 0; i < this.firstDealsArray.length; i++) {
                if (id === this.firstDealsArray[i].id) {
                    this.firstDealsArray[i].quantity = this.firstDealsArray[i].quantity + 1;
                    this.addCat(products, index, this.firstDealsArray[i].quantity, action);
                    return;
                }
            }
        } else if (action === 'best applicance') {
            for (var i = 0; i < this.firstAppliancesArray.length; i++) {
                if (id === this.firstAppliancesArray[i].id) {
                    this.firstAppliancesArray[i].quantity = this.firstAppliancesArray[i].quantity + 1;
                    this.addCat(products, index, this.firstAppliancesArray[i].quantity, action);
                    return;
                }
            }
        }
    }

    itemDecrease(id, products, index, action) {
        if (action === 'main products') {
            for (var i = 0; i < this.allProducts.length; i++) {
                if (id === this.allProducts[i].id) {
                    if (this.allProducts[i].quantity === 1) {
                        this.allProducts[i].quantity = this.allProducts[i].quantity - 1;
                        // this.mainServe.modifyCart(id,this.allProducts[i].quantity,this.skId,)
                        if (this.skId === undefined || this.skId === '') {
                            this.skId = this.allProducts[i].sku[0].skid;
                        }
                        this.deleteCart(this.skId, action);

                        this.skId = undefined;
                        this.products.quantity = 1
                        this.notInCart = false;
                        this.selected = undefined;
                        this.selectedsku = undefined;
                        // if (this.mainServe.viewCart === undefined) {
                        //     this.mainServe.cartCount = 0;
                        // }


                    } else {
                        this.allProducts[i].quantity = this.allProducts[i].quantity - 1;
                        this.addCat(products, index, this.allProducts[i].quantity, action);
                        return;
                    }
                }
            }
        } else if (action === 'best deals of the day') {
            for (var i = 0; i < this.firstArray.length; i++) {
                if (id === this.firstArray[i].id) {
                    if (this.firstArray[i].quantity === 1) {
                        this.firstArray[i].quantity = this.firstArray[i].quantity - 1;
                        // this.mainServe.modifyCart(id,this.allProducts[i].quantity,this.skId,)
                        if (this.skId === undefined || this.skId === '') {
                            this.skId = this.firstArray[i].sku[0].skid;
                        }
                        this.deleteCart(this.skId, action);

                        this.skId = undefined;
                        this.products.quantity = 1
                        this.notInCart = false;
                        this.selected = undefined;
                        this.selectedsku = undefined;
                        // if (this.mainServe.viewCart === undefined) {
                        //     this.mainServe.cartCount = 0;
                        // }


                    } else {
                        this.firstArray[i].quantity = this.firstArray[i].quantity - 1;
                        this.addCat(products, index, this.firstArray[i].quantity, action);
                        return;
                    }
                }
            }
        } else if (action === 'best deals') {
            for (var i = 0; i < this.firstDealsArray.length; i++) {
                if (id === this.firstDealsArray[i].id) {
                    if (this.firstDealsArray[i].quantity === 1) {
                        this.firstDealsArray[i].quantity = this.firstDealsArray[i].quantity - 1;
                        // this.mainServe.modifyCart(id,this.allProducts[i].quantity,this.skId,)
                        if (this.skId === undefined || this.skId === '') {
                            this.skId = this.firstDealsArray[i].sku[0].skid;
                        }
                        this.deleteCart(this.skId, action);

                        this.skId = undefined;
                        this.products.quantity = 1

                        // if (this.mainServe.viewCart === undefined) {
                        //     this.mainServe.cartCount = 0;
                        // }


                    } else {
                        this.firstDealsArray[i].quantity = this.firstDealsArray[i].quantity - 1;
                        this.addCat(products, index, this.firstDealsArray[i].quantity, action);
                        return;
                    }
                }
            }
        } else if (action === 'best applicance') {
            for (var i = 0; i < this.firstAppliancesArray.length; i++) {
                if (id === this.firstAppliancesArray[i].id) {
                    if (this.firstAppliancesArray[i].quantity === 1) {
                        this.firstAppliancesArray[i].quantity = this.firstAppliancesArray[i].quantity - 1;
                        // this.mainServe.modifyCart(id,this.allProducts[i].quantity,this.skId,)
                        if (this.skId === undefined || this.skId === '') {
                            this.skId = this.firstAppliancesArray[i].sku[0].skid;
                        }
                        this.deleteCart(this.skId, action);

                        this.skId = undefined;
                        this.products.quantity = 1
                        this.notInCart = false;
                        this.selected = undefined;
                        this.selectedsku = undefined;
                        // if (this.mainServe.viewCart === undefined) {
                        //     this.mainServe.cartCount = 0;
                        // }


                    } else {
                        this.firstAppliancesArray[i].quantity = this.firstAppliancesArray[i].quantity - 1;
                        this.addCat(products, index, this.firstAppliancesArray[i].quantity, action);
                        return;
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
    addCat(prodData, index, quantity, action) {
        if (this.skId === undefined || this.skId === '' || this.prodId !== prodData.id) {
            if (action === 'main products') {
                for (var i = 0; i < this.allProducts.length; i++) {
                    if (prodData.id === this.allProducts[i].id) {
                        this.skId = this.allProducts[i].sku[0].skid;
                        this.skudata = this.allProducts[i].sku[0];
                        this.selecte.skid = this.allProducts[i].sku[0].size;
                        this.mainAddacrt(prodData, index, quantity, this.skId, action);
                        // }
                        return;
                    }
                }
            } else if (action === 'best deals of the day') {
                for (var i = 0; i < this.firstArray.length; i++) {
                    if (prodData.id === this.firstArray[i].id) {
                        this.skId = this.firstArray[i].sku[0].skid;
                        this.skudata = this.firstArray[i].sku[0];
                        this.selecte.skid = this.firstArray[i].sku[0].size;
                        this.mainAddacrt(prodData, index, quantity, this.skId, action);
                        // }
                        return;
                    }
                }
            } else if (action === 'best deals') {
                for (var i = 0; i < this.firstDealsArray.length; i++) {
                    if (prodData.id === this.firstDealsArray[i].id) {
                        this.skId = this.firstDealsArray[i].sku[0].skid;
                        this.skudata = this.firstDealsArray[i].sku[0];
                        this.selecte.skid = this.firstDealsArray[i].sku[0].size;
                        this.mainAddacrt(prodData, index, quantity, this.skId, action);
                        // }
                        return;
                    }
                }
            } else if (action === 'best applicance') {
                for (var i = 0; i < this.firstAppliancesArray.length; i++) {
                    if (prodData.id === this.firstAppliancesArray[i].id) {
                        this.skId = this.firstAppliancesArray[i].sku[0].skid;
                        this.skudata = this.firstAppliancesArray[i].sku[0];
                        this.selecte.skid = this.firstAppliancesArray[i].sku[0].size;
                        this.mainAddacrt(prodData, index, quantity, this.skId, action);
                        // }
                        return;
                    }
                }
            }

        } else {



            if (action === 'main products') {
                for (var i = 0; i < this.allProducts.length; i++) {
                    for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                        if (prodData.id === this.allProducts[i].id) {
                            this.skudata = this.allProducts[i].sku[0];
                            this.mainaddCart1(prodData, index, quantity);
                            // }
                            return;
                        }


                    }
                }
            } else if (action === 'best deals of the day') {
                for (var i = 0; i < this.firstArray.length; i++) {
                    if (prodData.id === this.firstArray[i].id) {
                        this.skudata = this.firstArray[i].sku[0];
                        this.mainaddCart1(prodData, index, quantity);
                        // }
                        return;
                    }
                }
            } else if (action === 'best deals') {
                for (var i = 0; i < this.firstDealsArray.length; i++) {
                    if (prodData.id === this.firstDealsArray[i].id) {
                        this.skudata = this.firstDealsArray[i].sku[0];
                        this.mainaddCart1(prodData, index, quantity);
                        // }
                        return;
                    }
                }
            } else if (action === 'best applicance') {
                for (var i = 0; i < this.firstAppliancesArray.length; i++) {
                    if (prodData.id === this.firstAppliancesArray[i].id) {
                        this.skudata = this.firstAppliancesArray[i].sku[0];
                        this.mainaddCart1(prodData, index, quantity);
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

    mainAddacrt(prodData, index, quantity, skId, action) {

        var inData = "product_id=" + prodData.id +
            "&quantity=" + prodData.quantity +
            "&product_sku_id=" + skId

        this.mainServe.addCat(inData).subscribe(response => {
            if (response.json().status === 200) {
                this.resData = response.json();
                this.cartCount = response.json().summary.cart_count;
                this.mainServe.getCartList();
                if (action === 'main products') {
                    this.getDashboard(index, quantity, prodData);
                } else if (action === 'best deals of the day') {
                    this.getBestDealsOftheDay(index, quantity, prodData);
                } else if (action === 'best deals') {
                    this.getBestDeals(index, quantity, prodData);
                } else if (action === 'best applicance') {
                    this.getBestDealsOnAppliance(index, quantity, prodData);
                }




                this.notInCart = false;
                this.selected = index;
                this.selectedsku = index;

            } else {
                swal(response.json().message, "", "error");
            }
        }, error => {
            swal(error.json().message, "", "error");
        })
    }


    mainaddCart1(prodData, index, quantity) {
        var inData = "product_id=" + prodData.id +
            "&quantity=" + prodData.quantity +
            "&product_sku_id=" + this.skId
        this.mainServe.addCat(inData).subscribe(response => {
            if (response.json().status === 200) {
                this.resData = response.json();
                this.cartCount = response.json().summary.cart_count;
                // swal(response.json().message, "", "success");
                this.mainServe.getCartList();
                this.getDashboard(index, quantity, prodData);
                this.notInCart = false;
                this.selected = index;
                this.selectedsku = index;
            } else {
                swal(response.json().message, "", "error");
            }
        }, error => {
            swal(error.json().message, "", "error");
        })
    }

    viewAll(action) {
        if (action === 'SMART BASKET') {
            if (localStorage.token === undefined) {
                swal('Please Login', '', 'warning');
                return;
            }
        }
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
        this.getBestDealsOftheDay('', '', '');
        this.getBestDeals('', '', '');
        this.getBestDealsOnAppliance('', '', '');
    }

    itemHeaderIncrease(title, item, data) {
        this.mainServe.itemHeaderIncrease(title, item, data);
        this.getDashboard('', '', data);
        this.getBestDealsOftheDay('', '', data);
        this.getBestDeals('', '', data);
        this.getBestDealsOnAppliance('', '', data);
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


    deleteCart(id, action) {
        var inData = id;

        swal("Do you want to delete?", "", "warning", {
            buttons: ["Cancel!", "Okay!"],
        }).then((value) => {

            if (value === true) {
                this.mainServe.deleteCart(inData).subscribe(response => {
                    if (response.json().status === 200) {
                        this.cartCount = response.json().summary.cart_count;
                        if (action === 'main products') {
                            this.getDashboard('', '', '');
                        } else if (action === 'best deals of the day') {
                            this.getBestDealsOftheDay('', '', '');
                        } else if (action === 'best deals') {
                            this.getBestDeals('', '', '');
                        } else if (action === 'best applicance') {
                            this.getBestDealsOnAppliance('', '', '');
                        }
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

    getDashboard(index, quantity, prodData) {

        this.mainServe.getDashboard().subscribe(response => {


            this.dashboardData = response.json();
            this.allProducts = response.json().products;



            // console.log(this.second);


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
                            this.selectedsku = index;
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






    name;
    findIndexToUpdate(newItem) {
        return newItem.id === this;
    }

    showSizes(index) {
        this.selecte.skid = '';
        this.selected = index;
        this.selectedsku = index;
        this.showSizeData = true;
        this.showselecteddifdata = true;
        this.notInCart = true;
        this.showselecteddata = true;
        for (var i = 0; i < this.allProducts.length; i++) {
            this.allProducts[i].quantity = 1;
        }
    }
    showselected(skId, size, index, skus, action) {
        this.name = action;
        // this.selected = index;
        this.showselecteddifdata = false;
        // this.selecte.skid = size;
        this.showselecteddata = true;
        this.showSizeData = false;
        this.skudata = skus;
        // this.notInCart = false;
        // this.getDashboard(index, '', '');
        if (action === 'main products') {
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

                        if (skus.mycart === 0 || undefined) {
                            this.allProducts[i].quantity = 1;
                            this.notInCart = true;
                        } else {
                            this.notInCart = false;
                            this.selected = index;
                            this.allProducts[i].quantity = skus.mycart;
                        }
                        this.selecte.bdskid = this.firstArray[0].sku[0].size;
                        this.selecte.dskid = this.firstDealsArray[0].sku[0].size;
                        this.selecte.baskid = this.firstAppliancesArray[0].sku[0].size;
                        return;
                    }
                }
            }
        } else if (action === 'best deals of the day') {
            for (var i = 0; i < this.firstArray.length; i++) {
                for (var j = 0; j < this.firstArray[i].sku.length; j++) {
                    if (this.firstArray[i].sku[j].skid === parseInt(skId)) {
                        this.skId = skId;
                        this.prodId = skus.product_id;
                        this.selecte.bdskid = this.firstArray[i].sku[j].size;
                        this.firstArray[i].skuActualPrice = this.firstArray[i].sku[j].actual_price;
                        this.firstArray[i].sellingPrice = this.firstArray[i].sku[j].selling_price;
                        this.firstArray[i].product_image = this.firstArray[i].sku[j].skuImages[0];
                        this.firstArray[i].rating = this.firstArray[i].sku[j].ratings;
                        if (skus.mycart === 0 || undefined) {
                            this.firstArray[i].quantity = 1;
                            this.notInCart = true;
                        } else {
                            this.notInCart = false;
                            this.selected = index;
                            this.firstArray[i].quantity = skus.mycart;
                        }
                        this.selecte.skid = this.allProducts[0].sku[0].size;
                        this.selecte.dskid = this.firstDealsArray[0].sku[0].size;
                        this.selecte.baskid = this.firstAppliancesArray[i].sku[0].size;
                        return;
                    }
                }
            }

        } else if (action === 'best deals') {
            for (var i = 0; i < this.firstDealsArray.length; i++) {
                for (var j = 0; j < this.firstDealsArray[i].sku.length; j++) {
                    if (this.firstDealsArray[i].sku[j].skid === parseInt(skId)) {
                        this.skId = skId;
                        this.prodId = skus.product_id;
                        this.selecte.dskid = this.firstDealsArray[i].sku[j].size;
                        this.firstDealsArray[i].skuActualPrice = this.firstDealsArray[i].sku[j].actual_price;
                        this.firstDealsArray[i].sellingPrice = this.firstDealsArray[i].sku[j].selling_price;
                        this.firstDealsArray[i].product_image = this.firstDealsArray[i].sku[j].skuImages[0];
                        this.firstDealsArray[i].rating = this.firstDealsArray[i].sku[j].ratings;

                        if (skus.mycart === 0 || undefined) {
                            this.firstDealsArray[i].quantity = 1;
                            this.notInCart = true;
                        } else {
                            this.notInCart = false;
                            this.selected = index;
                            this.firstDealsArray[i].quantity = skus.mycart;
                        }
                        this.selecte.skid = this.allProducts[0].sku[0].size;
                        this.selecte.bdskid = this.firstArray[0].sku[0].size;
                        this.selecte.baskid = this.firstAppliancesArray[i].sku[0].size;
                        return;
                    }
                }
            }


        } else if (action === 'best applicance') {
            for (var i = 0; i < this.firstAppliancesArray.length; i++) {
                for (var j = 0; j < this.firstAppliancesArray[i].sku.length; j++) {
                    if (this.firstAppliancesArray[i].sku[j].skid === parseInt(skId)) {
                        this.skId = skId;
                        this.prodId = skus.product_id;
                        this.selecte.baskid = this.firstAppliancesArray[i].sku[j].size;
                        this.firstAppliancesArray[i].skuActualPrice = this.firstAppliancesArray[i].sku[j].actual_price;
                        this.firstAppliancesArray[i].sellingPrice = this.firstAppliancesArray[i].sku[j].selling_price;
                        this.firstAppliancesArray[i].product_image = this.firstAppliancesArray[i].sku[j].skuImages[0];
                        this.firstAppliancesArray[i].rating = this.firstAppliancesArray[i].sku[j].ratings;

                        if (skus.mycart === 0 || undefined) {
                            this.firstAppliancesArray[i].quantity = 1;
                            this.notInCart = true;
                        } else {
                            this.notInCart = false;
                            this.selected = index;
                            this.firstAppliancesArray[i].quantity = skus.mycart;
                        }
                        this.selecte.skid = this.allProducts[0].sku[0].size;
                        this.selecte.bdskid = this.firstArray[0].sku[0].size;
                        this.selecte.dskid = this.firstDealsArray[i].sku[0].size;
                        return;
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


    getBestDealsOftheDay(index, quantity, prodData) {
        this.first = [];
        this.second = [];
        this.third = [];
        this.dealsOftheDayProducts = [];
        var fA = 3;
        var sA = 7;
        var tA = 11
        this.mainServe.getBestDealsOftheDay().subscribe(res => {
            this.dealResult = res.json().result;
            if (res.json().message === "No records found") {
                this.nobestDealsdData = true;
            } else {
                this.nobestDealsdData = false;
                for (var l = 0; l < this.dealResult.length; l++) {
                    this.dealsOftheDayProducts.push(this.dealResult[l].products[0]);
                }

                //first best deals array
                for (var i = 0; i < this.dealsOftheDayProducts.length; i++) {
                    if (i <= fA) {
                        this.first.push(this.dealsOftheDayProducts[i]);
                    }
                }

                this.firstArray = _.uniq(this.first, function (obj) {
                    return obj.id;
                })

                if (index !== '') {

                    for (var i = 0; i < this.firstArray.length; i++) {
                        for (var j = 0; j < this.firstArray[i].sku.length; j++) {
                            if (prodData.id === this.firstArray[i].id) {
                                this.firstArray[i].quantity = quantity;
                                this.firstArray[i].skuActualPrice = this.skudata.actual_price;
                                this.firstArray[i].sellingPrice = this.skudata.selling_price;
                                this.firstArray[i].product_image = this.skudata.skuImages[0];
                                this.firstArray[i].rating = this.skudata.ratings;
                                this.notInCart = false;
                                this.selected = index;
                                this.selectedsku = index;
                            } else {
                                this.firstArray[i].quantity = 1;
                                this.firstArray[i].product_image = this.firstArray[i].sku[j].skuImages[0];
                                this.firstArray[i].skuActualPrice = this.firstArray[i].sku[j].actual_price;
                                this.firstArray[i].sellingPrice = this.firstArray[i].sku[j].selling_price;
                                this.firstArray[i].rating = this.firstArray[i].sku[j].ratings;
                                // this.notInCart = true;
                            }

                        }
                    }
                } else {
                    for (var i = 0; i < this.firstArray.length; i++) {
                        for (var j = 0; j < this.firstArray[i].sku.length; j++) {
                            this.firstArray[i].product_image = this.firstArray[i].sku[j].skuImages[0];
                            this.firstArray[i].skuActualPrice = this.firstArray[i].sku[j].actual_price;
                            this.firstArray[i].sellingPrice = this.firstArray[i].sku[j].selling_price;
                            this.firstArray[i].rating = this.firstArray[i].sku[j].ratings;
                            this.firstArray[i].quantity = this.firstArray[i].sku[j].mycart;
                            if (this.firstArray[i].sku[j].mycart === 0 || undefined) {
                                this.firstArray[i].quantity = 1;
                                this.notInCart = true;
                            } else {
                                this.notInCart = false;
                                this.selected = index;
                                this.firstArray[i].quantity = this.firstArray[i].sku[0].mycart;
                            }
                        }
                    }
                }
            }
            // this.dealsOftheDayProducts = res.json().data;



        })
    }


    getBestDeals(index, quantity, prodData) {
        this.firstDeals = [];
        this.secondDeals = [];
        this.thirdDeals = [];
        this.dealsProducts = [];
        var fA = 3;
        var sA = 7;
        var tA = 11
        this.mainServe.getBestDeals().subscribe(res => {
            this.dealsData = res.json().result;

            if (res.json().message === "No records found") {
                this.nobestDeals = true;
            } else {
                this.nobestDeals = false;
                for (var l = 0; l < this.dealsData.length; l++) {
                    this.dealsProducts.push(this.dealsData[l].products[0]);
                }
                //first best deals array
                for (var i = 0; i < this.dealsProducts.length; i++) {
                    if (i <= fA) {
                        this.firstDeals.push(this.dealsProducts[i]);
                    }
                }

                this.firstDealsArray = _.uniq(this.firstDeals, function (obj) {
                    return obj.id;
                })
                if (index !== '') {

                    for (var i = 0; i < this.firstDealsArray.length; i++) {
                        for (var j = 0; j < this.firstDealsArray[i].sku.length; j++) {
                            if (prodData.id === this.firstDealsArray[i].id) {
                                this.firstDealsArray[i].quantity = quantity;
                                this.firstDealsArray[i].skuActualPrice = this.skudata.actual_price;
                                this.firstDealsArray[i].sellingPrice = this.skudata.selling_price;
                                this.firstDealsArray[i].product_image = this.skudata.skuImages[0];
                                this.firstDealsArray[i].rating = this.skudata.ratings;
                                this.notInCart = false;
                                this.selected = index;
                                this.selectedsku = index;
                            } else {
                                this.firstDealsArray[i].quantity = 1;
                                this.firstDealsArray[i].product_image = this.firstDealsArray[i].sku[j].skuImages[0];
                                this.firstDealsArray[i].skuActualPrice = this.firstDealsArray[i].sku[j].actual_price;
                                this.firstDealsArray[i].sellingPrice = this.firstDealsArray[i].sku[j].selling_price;
                                this.firstDealsArray[i].rating = this.firstDealsArray[i].sku[j].ratings;
                                // this.notInCart = true;
                            }

                        }
                    }
                } else {
                    for (var i = 0; i < this.firstDealsArray.length; i++) {
                        for (var j = 0; j < this.firstDealsArray[i].sku.length; j++) {
                            this.firstDealsArray[i].product_image = this.firstDealsArray[i].sku[j].skuImages[0];
                            this.firstDealsArray[i].skuActualPrice = this.firstDealsArray[i].sku[j].actual_price;
                            this.firstDealsArray[i].sellingPrice = this.firstDealsArray[i].sku[j].selling_price;
                            this.firstDealsArray[i].rating = this.firstDealsArray[i].sku[j].ratings;
                            this.firstDealsArray[i].quantity = this.firstDealsArray[i].sku[j].mycart;
                            if (this.firstDealsArray[i].sku[j].mycart === 0 || undefined) {
                                this.firstDealsArray[i].quantity = 1;
                                this.notInCart = true;
                            } else {
                                this.notInCart = false;
                                this.selected = index;
                                this.firstDealsArray[i].quantity = this.firstDealsArray[i].sku[0].mycart;
                            }
                        }
                    }
                }
            }


        })
    }


    getBestDealsOnAppliance(index, quantity, prodData) {
        this.firstAppliances = [];
        this.secondAppliances = [];
        this.thirdAppliances = [];
        this.dealsOnAppliancesProducts = [];
        var fA = 3;
        var sA = 7;
        var tA = 11
        this.mainServe.getBestDealsOnppliances().subscribe(res => {
            this.appliaceData = res.json().result;
            if (res.json().message === "No records found") {
                this.noappliances = true;
            } else {
                this.noappliances = false;
                for (var l = 0; l < this.appliaceData.length; l++) {
                    this.dealsOnAppliancesProducts.push(this.appliaceData[l].products[0]);
                }
                //first best deals array
                for (var i = 0; i < this.dealsOnAppliancesProducts.length; i++) {
                    if (i <= fA) {
                        this.firstAppliances.push(this.dealsOnAppliancesProducts[i]);
                    }
                }

                this.firstAppliancesArray = _.uniq(this.firstAppliances, function (obj) {
                    return obj.id;
                })
                if (index !== '') {

                    for (var i = 0; i < this.firstAppliancesArray.length; i++) {
                        for (var j = 0; j < this.firstAppliancesArray[i].sku.length; j++) {
                            if (prodData.id === this.firstAppliancesArray[i].id) {
                                this.firstAppliancesArray[i].quantity = quantity;
                                this.firstAppliancesArray[i].skuActualPrice = this.skudata.actual_price;
                                this.firstAppliancesArray[i].sellingPrice = this.skudata.selling_price;
                                this.firstAppliancesArray[i].product_image = this.skudata.skuImages[0];
                                this.firstAppliancesArray[i].rating = this.skudata.ratings;
                                this.notInCart = false;
                                this.selected = index;
                                this.selectedsku = index;
                            } else {
                                this.firstAppliancesArray[i].quantity = 1;
                                this.firstAppliancesArray[i].product_image = this.firstAppliancesArray[i].sku[j].skuImages[0];
                                this.firstAppliancesArray[i].skuActualPrice = this.firstAppliancesArray[i].sku[j].actual_price;
                                this.firstAppliancesArray[i].sellingPrice = this.firstAppliancesArray[i].sku[j].selling_price;
                                this.firstAppliancesArray[i].rating = this.firstAppliancesArray[i].sku[j].ratings;
                                // this.notInCart = true;
                            }

                        }
                    }
                } else {
                    for (var i = 0; i < this.firstAppliancesArray.length; i++) {
                        for (var j = 0; j < this.firstAppliancesArray[i].sku.length; j++) {
                            this.firstAppliancesArray[i].product_image = this.firstAppliancesArray[i].sku[j].skuImages[0];
                            this.firstAppliancesArray[i].product_image = this.firstAppliancesArray[i].sku[j].skuImages[0];
                            this.firstAppliancesArray[i].skuActualPrice = this.firstAppliancesArray[i].sku[j].actual_price;
                            this.firstAppliancesArray[i].sellingPrice = this.firstAppliancesArray[i].sku[j].selling_price;
                            this.firstAppliancesArray[i].rating = this.firstAppliancesArray[i].sku[j].ratings;
                            this.firstAppliancesArray[i].quantity = this.firstAppliancesArray[i].sku[j].mycart;
                            if (this.firstAppliancesArray[i].sku[j].mycart === 0 || undefined) {
                                this.firstAppliancesArray[i].quantity = 1;
                                this.notInCart = true;
                            } else {
                                this.notInCart = false;
                                this.selected = index;
                                this.firstAppliancesArray[i].quantity = this.firstAppliancesArray[i].sku[0].mycart;
                            }
                        }
                    }
                }
            }



        })
    }


}

