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
    styleUrls: ['./main.component.less'],
})

export class MainComponent implements OnInit {

    constructor(public mainServe: MainService, public router: Router, private headerSer: HeaderService) { }
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
    pro;
    ngOnInit() {
        window.scrollTo(0, 0);

        this.getAllCategoriesWithSubCat();

        this.mainServe.getDashboard().subscribe(response => {
            this.dashboardData = response.json();
            this.allProducts = response.json().products;
            this.posts = this.allProducts;

            this.image = response.json().offer.TOP1[0].pic;
        })
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
    itemIncrease(data, name, index) {

        let thisObj = this;
        if (localStorage.name !== name) {
            thisObj.item.quantity = 0;
        }
        if (name === data.title) {
            thisObj.showInput = true;
            this.selected = index;
            thisObj.item.quantity = Math.floor(thisObj.item.quantity + 1);
            localStorage.setItem('name', name);
        } else {
            thisObj.showInput = false;
        }
    }

    itemDecrease(index) {
        this.selected = index;
        let thisObj = this;
        if (thisObj.item.quantity === 1) {
            return;
        }
        thisObj.item.quantity = Math.floor(thisObj.item.quantity - 1);

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
        // if (localStorage.token === undefined) {
        //   var inData = "Session_id=" + localStorage.session;
        // } else {
        //   var inData = "token=" + JSON.parse(localStorage.token);
        // }
        this.headerSer.getAllCatAndSubCat().subscribe(response => {
            this.results = response.json().result.banner.TOP1;
            //   console.log(this.results);
            //   this.banners = this.results.banner.TOP1;
            //   console.log(this.banners);
        });
    }
    skId;
    skuId;
    selectOption(id) {
        this.skId = id;
    }

    addCat(prodId) {
        if (this.skId === undefined) {
            swal('Please select Size', '', 'error');
            return;
        }
        if (localStorage.token === undefined) {
            var inData = "product_id=" + prodId +
                "&quantity=" + "1" +
                "&product_sku_id=" + this.skId +
                "&Session_id=" + localStorage.session

        } else {
            var inData = "product_id=" + prodId +
                "&quantity=" + "1" +
                "&product_sku_id=" + this.skId +
                "&token=" + JSON.parse(localStorage.token)
        }

        this.mainServe.addCat(inData).subscribe(response => {
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

