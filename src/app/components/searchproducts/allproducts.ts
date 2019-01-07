import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MainService } from './../../services/main/main';
import { ProfileService } from '../../services/profile/profiledata';
import { HeaderComponent } from '../header/header.component';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-allproducts',
    templateUrl: './allproducts.html',
    styleUrls: ['./searchproducts.component.css', '../../components/header/header.component.css'],
    providers: [HeaderComponent, NgbRatingConfig]
})
export class AllProductsComponent implements OnInit {
    title;
    products;
    noData;
    page;
    showSizeData = false;
    prodId;
    showselecteddifdata = true;
    skudata;
    selecte = {
        skid: ''
    }
    wishData;
    wishListData = [];
    constructor(private router: Router,
        private route: ActivatedRoute,
        public mainSer: MainService,
        public profileSer: ProfileService,
        public headerComp: HeaderComponent,
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
            this.getWishList();
            // this.myprofileData = true;
            // this.childPage = 'My Profile';
            // this.getProfileDetails();
        } else if (this.page === 'viewAll') {
            // this.getAllProducts();
            this.showAll = true;
            this.showWish = false;
            if (this.title === 'BEST DEALS OF THE DAY') {
                this.getDashboard('', '', '');
            } else {
                this.noData = true;
            }
            this.getCartList();
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
                // swal(response.json().message, "", "success");
                if (this.page !== 'mywishlist') {
                    this.getDashboard(index, quantity, prodData);
                }
                this.mainSer.getCartList();
                // this.skId = undefined;
                // this.data.quantity = quantity;
                this.notInCart = false;
                this.selected = index;
            } else {
                swal(response.json().message, "", "error");
                this.skId = undefined;
            }
        }, error => {
            swal(error.json().message, "", "error");
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

    getWishList() {

        this.profileSer.getWishList().subscribe(response => {
            this.allProducts = [];
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
            console.log(this.allProducts);
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
        this.getDashboard('', '', '');
        this.mainSer.getCartList();
    }


    searchProducts() {
        this.mainSer.searchProducts(this.searchParam)
    }


    itemHeaderDecrease(title, data, skuData) {
        this.mainSer.itemHeaderDecrease(title, data, skuData);
        if (this.page !== 'mywishlist') {
            this.getDashboard('', '', data);
        } else {
            this.mainSer.getCartList();
            this.getWishList();
        }
    }


    itemHeaderIncrease(title, item, data) {
        this.mainSer.itemHeaderIncrease(title, item, data);
        if (this.page !== 'mywishlist') {
            this.getDashboard('', '', data);
        } else {
            this.mainSer.getCartList();
            this.getWishList();
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
        swal("Do you want to delete?", "", "warning", {
            buttons: ["Cancel!", "Okay!"],
        }).then((value) => {

            if (value === true) {
                this.mainSer.deleteCart(inData).subscribe(response => {
                    this.mainSer.getCartList();
                    this.getDashboard('', '', '');
                    this.selected = undefined;
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
                            // this.allProducts[i].quantity = this.allProducts[i].sku[j].mycart;

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
                        // if (this.allProducts[i].sku[j].mycart === 0 || undefined) {
                        //     this.allProducts[i].quantity = 1;
                        //     this.notInCart = true;
                        // }
                        this.allProducts[i].quantity = 1;
                        // this.selecte.skid = this.allProducts[i].sku[0].size;
                    }
                    this.allProducts[i].product_image = this.allProducts[i].sku[0].skuImages[0];
                }
            }
            if (prodData.product_id !== undefined) {
                this.notInCart = true;
            }
            // for (var i = 0; i < this.allProducts.length; i++) {
            //     if (this.allProducts[i].sku.length === 0) {
            //         this.allProducts[i].quantity = 1;
            //     }
            //     for (var j = 0; j < this.allProducts[i].sku.length; j++) {
            //         this.allProducts[i].quantity = this.allProducts[i].sku[j].mycart;
            //         this.allProducts[i].product_image = this.allProducts[i].pic[0].product_image;

            //         if (this.allProducts[i].sku[j].mycart === 0 || this.allProducts[i].sku.length === []) {
            //             this.allProducts[i].quantity = 1;
            //         }

            //         this.allProducts[i].quantity = 1;
            //     }
            // }
            if (response.json().status == 400) {
                this.noData = response.json().message;
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
                if (this.allProducts[i].sku[j].skid === parseInt(skId)) {
                    this.skId = skId;
                    this.prodId = skus.product_id;
                    this.selecte.skid = this.allProducts[i].sku[j].size;
                    this.allProducts[i].skuActualPrice = this.allProducts[i].sku[j].actual_price;
                    this.allProducts[i].rating = this.allProducts[i].sku[j].ratings;
                    this.allProducts[i].sellingPrice = this.allProducts[i].sku[j].selling_price;
                    this.allProducts[i].product_image = this.allProducts[i].sku[j].skuImages[0];
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
            swal("Successfully Cleared", "", "success");
            this.getWishList();
        }, error => {

        })
    }


}