import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, Params } from '@angular/router';
import { MainService } from './../../services/main/main';
import { AppSettings } from '../../config';
import { HeaderComponent } from '../header/header.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
    selector: 'app-productdetails',
    templateUrl: './productdetails.component.html',
    styleUrls: ['./productdetails.component.css', '../../components/header/header.component.css'],
    providers: [HeaderComponent]
})
export class ProductdetailsComponent implements OnInit {
    prodId;
    constructor(private route: ActivatedRoute, public router: Router, public mainSer: MainService, public headerComp: HeaderComponent, private spinnerService: Ng4LoadingSpinnerService) {
        this.route.queryParams.subscribe(params => {
            this.prodId = params.prodId;
        });
        this.getDashboard();
        this.getCartList();
    }
    item = {
        quantity: 1
    }
    zoomedImageSrc;
    smallImageSrc;
    thumbImgSrc;
    thumbImgSrc1;
    thumbImgSrc2;
    notInCart;
    prodData: any[];
    url;
    selecte = { skId: '' };
    ngOnInit() {
        window.scrollTo(0, 0);
        // this.zoomedImageSrc = 'assets/images/product.png';
        // this.smallImageSrc = 'assets/images/product.png';
        // this.thumbImgSrc = 'assets/images/product.png';
        // this.thumbImgSrc1 = 'assets/images/capsicums.png';
        // this.thumbImgSrc2 = 'assets/images/corn.png';
        this.showProductDetails();
        this.url = AppSettings.imageUrl;
        this.mainSer.getCartList();
    }

    displayCounter(data) {
        this.showProductDetails();
        this.mainSer.getCartList();
    }

    itemIncrease() {
        let thisObj = this;

        thisObj.item.quantity = Math.floor(thisObj.item.quantity + 1);
        this.addCat();

    }
    itemDecrease() {
        let thisObj = this;
        if (thisObj.item.quantity === 1) {
            thisObj.item.quantity = Math.floor(thisObj.item.quantity - 1);
            this.deleteCart(this.selecte.skId);
            this.notInCart = false;
            return;
        }
        thisObj.item.quantity = Math.floor(thisObj.item.quantity - 1);
        this.addCat();
    }

    showImage(image) {
        this.zoomedImageSrc = image;
        this.smallImageSrc = image;

    }

    showImageDynamic(image) {
        this.zoomedImageSrc = image;
        this.smallImageSrc = image;
    }
    skuData;
    proId;
    images = [];
    selling_price;
    description;
    terms_and_conditions;
    specification;
    quantityImage;
    question;
    answer;
    showProductDetails() {
        this.spinnerService.show();
        var inData = this.prodId;
        this.mainSer.showProductDetails(inData).subscribe(response => {
            this.spinnerService.hide();
            this.prodData = response.json().products[0];
            this.smallImageSrc = response.json().products[0].sku[0].skuImages[0];

            this.skuData = response.json().products[0].sku;
            this.selecte.skId = response.json().products[0].sku[0].skid;
            this.quantityImage = response.json().products[0].sku[0].quality_image;
            // quality_image
            // for (var i = 0; i < this.prodData.length; i++) {
            this.actual_price = response.json().products[0].sku[0].actual_price;
            this.description = response.json().products[0].sku[0].description;
            this.specification = response.json().products[0].sku[0].specification;
            this.terms_and_conditions = response.json().products[0].sku[0].terms;
            this.question = response.json().products[0].sku[0].faq.question;
            this.answer = response.json().products[0].sku[0].faq.answer;
            // terms_and_conditions
            this.selling_price = response.json().products[0].sku[0].selling_price;
            this.percentage = Math.round(100 - (this.selling_price / this.actual_price * 100));
            this.proId = response.json().products[0].id;
            // for (var i = 0; i < response.json().products[0].sku.length; i++) {
            this.images = response.json().products[0].sku[0].skuImages;
            // }
            if (response.json().products[0].sku[0].mycart !== 0) {
                this.notInCart = true;
            } else {
                this.notInCart = false;
            }

            // }
        }, error => {

        })
    }

    actual_price;
    percentage;
    size;
    selectOption(skId, prodData) {
        this.images = [];
        this.selecte.skId = skId;
        for (var i = 0; i < this.skuData.length; i++) {
            if (this.skuData[i].skid === parseInt(skId)) {
                this.actual_price = this.skuData[i].actual_price;
                this.selling_price = this.skuData[i].selling_price;
                this.size = this.skuData[i].size;
                this.selecte.skId = this.skuData[i].skid;
                this.percentage = Math.round(100 - (this.selling_price / this.actual_price * 100));

                this.item.quantity = this.skuData[i].mycart;
                if (this.skuData[i].mycart === 0 || undefined) {
                    this.item.quantity = 1;
                    this.notInCart = false;
                } else {
                    this.item.quantity = this.skuData[i].mycart;
                    this.notInCart = true;

                }

                for (var i = 0; i < prodData.sku.length; i++) {
                    if (prodData.sku[i].skid === parseInt(skId)) {
                        this.quantityImage = prodData.sku[i].quality_image;
                        this.images = prodData.sku[i].skuImages;
                        this.description = prodData.sku[i].description;
                        this.specification = prodData.sku[i].specification;
                        this.terms_and_conditions = prodData.sku[i].terms;
                        this.question = prodData.sku[i].faq.question;
                        this.answer = prodData.sku[i].faq.answer;
                        return;
                    }
                }
            }
        }
    }
    resData;
    addCat() {
        if (this.selecte.skId === undefined) {
            swal('Please select Size', '', 'error');
            return;
        }
        // if (localStorage.token === undefined) {
        //     swal('Please Login', '', 'warning');
        // } else {
        var inData = "product_id=" + this.proId +
            "&quantity=" + this.item.quantity +
            "&product_sku_id=" + this.selecte.skId


        this.mainSer.addCat(inData).subscribe(response => {
            this.resData = response.json();
            if (response.json().status === 200) {
                // swal(response.json().message, "", "");
                this.item.quantity = 1;
                this.showProductDetails();
                this.getDashboard();
                this.mainSer.getCartList();
                this.notInCart = true;

            } else {
                swal(response.json().message, "", "");
                this.selecte.skId = '';
            }
        }, error => {
            swal(error.json().message, "", "");
            this.selecte.skId = '';
        })
        // }


    }



    //header
    searchParam;
    viewCart;

    getCartList() {
        this.getDashboard();
        this.mainSer.getCartList();
    }


    searchProducts() {
        this.mainSer.searchProducts(this.searchParam)
    }


    itemHeaderDecrease(title, data, skuData) {
        this.mainSer.itemHeaderDecrease(title, data, skuData);
        this.mainSer.getCartList();
        this.getDashboard();
    }

    itemHeaderIncrease(title, item, data) {
        this.mainSer.itemHeaderIncrease(title, item, data);
        this.mainSer.getCartList();
        this.getDashboard();
    }

    showCat() {
        this.mainSer.showCat();
    }
    selectedCat;
    showSubCat(id, i) {
        this.selectedCat = i; this.selectedCat = i;
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
                    this.getDashboard();
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
    getDashboard() {
        this.mainSer.getDashboard().subscribe(response => {
            this.cartCount = response.json().cart.cart_count;
            this.deliveryCharge = response.json().cart.delivery_charge.toFixed(2);
            this.subTotal = response.json().cart.selling_price.toFixed(2);
            this.Total = response.json().cart.grand_total.toFixed(2);

        })
    }

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
}