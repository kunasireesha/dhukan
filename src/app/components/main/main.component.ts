import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { HeaderComponent } from '../header/header.component';
import { MainService } from '../../services/main/main';
import { HeaderService } from '../../services/header/header';
import { AppSettings } from '../../config';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { Post } from '../../services/products';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.less', '../../components/header/header.component.css'],
    providers: [HeaderComponent]
})

export class MainComponent implements OnInit {

    constructor(public mainServe: MainService, public router: Router, private headerSer: HeaderService, public headerComp: HeaderComponent) {
        this.getDashboard('');
        this.getCartList();
    }
    posts: Post[];
    bannerImageOne = true;

    bannerImageTwo = false;
    bannerImageThree = false;
    results: any;
    banners = [];
    randomkey;
    dashboardData = [];
    url = AppSettings.imageUrl;
    image;
    resData = [];
    allProducts = [];
    productsData = [];
    pro;
    cartCount;
    deliveryCharge;
    subTotal;
    Total;
    select = {
        skId: ''
    }
    ngOnInit() {
        window.scrollTo(0, 0);
        this.getAllCategoriesWithSubCat();
        this.getDashboard('');
        this.mainServe.getCartList();

    }



    bannerImageOneOffer() {
        this.bannerImageOne = true;
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
    itemIncrease(products, title, index) {
        for (var i = 0; i < this.allProducts.length; i++) {
            if (title === this.allProducts[i].title) {
                this.allProducts[i].quantity = this.allProducts[i].quantity + 1;
                this.addCat(products, index);
                return;
            }
        }
    }

    itemDecrease(title, products, index) {
        for (var i = 0; i < this.allProducts.length; i++) {
            if (title === this.allProducts[i].title) {
                if (this.allProducts[i].quantity === 1) {
                    this.allProducts[i].quantity = this.allProducts[i].quantity - 1;
                    // this.mainServe.modifyCart(id,this.allProducts[i].quantity,this.skId,)
                    this.deleteCart(this.skId);
                    this.mainServe.getCartList();
                    this.skId = undefined;
                    this.products.quantity = 1
                    this.notInCart = false;
                    this.selected = undefined;
                    // if (this.mainServe.viewCart === undefined) {
                    //     this.mainServe.cartCount = 0;
                    // }

                } else {
                    this.allProducts[i].quantity = this.allProducts[i].quantity - 1;
                    this.addCat(products, index);
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
            //   console.log(this.results);
            //   this.banners = this.results.banner.TOP1;
            //   console.log(this.banners);
        });
    }
    skId = '';
    skuId;
    notInCart = true;
    selectOption(skId, index) {
        this.selected = index;
        for (var i = 0; i < this.allProducts.length; i++) {
            for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                if (this.allProducts[i].sku[j].skid === parseInt(skId)) {
                    this.skId = skId
                    this.allProducts[i].actual_price = this.allProducts[i].sku[j].actual_price;
                    this.allProducts[i].selling_price = this.allProducts[i].sku[j].selling_price;
                    this.allProducts[i].quantity = this.allProducts[i].sku[j].mycart;
                    this.allProducts[i].product_image = this.allProducts[i].sku[j].image;

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
    products = {
        quantity: 1
    }
    addCat(prodData, index) {
        if (this.skId === undefined) {
            swal('Please select Size', '', 'error');
            return;
        }
        // if (localStorage.token === undefined) {
        //     swal('Please Login', '', 'warning');
        // } else {
        var inData = "product_id=" + prodData.id +
            "&quantity=" + prodData.quantity +
            "&product_sku_id=" + this.skId


        this.mainServe.addCat(inData).subscribe(response => {
            if (response.json().status === 200) {
                this.resData = response.json();
                this.cartCount = response.json().summary.cart_count;
                swal(response.json().message, "", "success");
                this.getDashboard(index);
                this.mainServe.getCartList();
                // this.skId = undefined;
                // this.products.quantity = 1;
            } else {
                swal(response.json().message, "", "error");
                // this.skId = undefined;
            }
        }, error => {
            swal(error.json().message, "", "success");
            // this.skId = undefined;
        })
        // }


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
        this.getDashboard('');
        this.mainServe.getCartList();
    }


    searchProducts() {
        this.mainServe.searchProducts(this.searchParam)
    }


    itemHeaderDecrease(title, data, skuData) {
        this.mainServe.itemHeaderDecrease(title, data, skuData);
        this.mainServe.getCartList();
        this.getDashboard('');
    }

    itemHeaderIncrease(title, item, data) {
        this.mainServe.itemHeaderIncrease(title, item, data);
        this.getDashboard('');
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
                    if (response.json().status === 200) {
                        this.cartCount = response.json().summary.cart_count;
                        this.getDashboard('');
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


    getDashboard(index) {

        this.mainServe.getDashboard().subscribe(response => {
            this.dashboardData = response.json();
            this.allProducts = response.json().products;
            this.posts = this.allProducts;
            this.cartCount = response.json().cart.cart_count || 0;
            this.deliveryCharge = response.json().cart.delivery_charge.toFixed(2);
            this.subTotal = response.json().cart.selling_price.toFixed(2);
            this.Total = response.json().cart.grand_total.toFixed(2);
            if (index !== '') {
                this.notInCart = false;
                this.selected = index;
                this.skId = this.skId;
            }
            for (var i = 0; i < this.allProducts.length; i++) {
                for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                    this.allProducts[i].quantity = this.allProducts[i].sku[j].mycart;
                    // if (this.allProducts[i].sku[j].mycart === 0 || undefined) {
                    //     this.allProducts[i].quantity = 1;
                    //     this.notInCart = true;
                    // }
                    this.allProducts[i].quantity = 1;
                }
                this.allProducts[i].product_image = this.allProducts[i].pic[0].product_image;

            }
            console.log(this.allProducts);
            this.image = response.json().offer.TOP1[0].pic;
        })
    }



}

