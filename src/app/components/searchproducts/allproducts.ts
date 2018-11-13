import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MainService } from './../../services/main/main';
import { ProfileService } from '../../services/profile/profiledata';

@Component({
    selector: 'app-allproducts',
    templateUrl: './allproducts.html',
    styleUrls: ['./searchproducts.component.css']
})
export class AllProductsComponent implements OnInit {
    title;
    products;
    noData;
    page;
    constructor(private router: Router, private route: ActivatedRoute, public mainServe: MainService, public profileSer: ProfileService) {
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
            this.getAllProducts();
            this.showAll = true;
            this.showWish = false;
        }
    }

    item = {
        quantity: 1
    }
    allProducts = [];
    showAll = false;
    showWish = false;
    ngOnInit() {
        // this.getAllProducts();
        // this.getWishList();
    }
    getAllProducts() {

        this.mainServe.getDashboard().subscribe(response => {
            this.allProducts = response.json().products;
            this.showAll = true;
            for (var i = 0; i < this.allProducts.length; i++) {
                this.allProducts[i].quantity = 1;

            }
            if (response.json().status == 400) {
                this.noData = response.json().message;
            }

        }, error => {

        });

    }
    selectOption(skId) {
        this.skId = skId
        for (var i = 0; i < this.allProducts.length; i++) {
            for (var j = 0; j < this.allProducts[i].sku.length; j++) {
                if (this.allProducts[i].sku[j].skid === parseInt(skId)) {
                    this.allProducts[i].actual_price = this.allProducts[i].sku[j].actual_price;
                    this.allProducts[i].offer_price = this.allProducts[i].sku[j].offer_price;
                }
            }

        }
    }

    resData;
    skId;
    itemIncrease(title) {
        for (var i = 0; i < this.allProducts.length; i++) {
            if (title === this.allProducts[i].title) {
                this.allProducts[i].quantity = this.allProducts[i].quantity + 1;
                return;
            }
        }
    }
    selected;
    itemDecrease(title) {
        for (var i = 0; i < this.allProducts.length; i++) {
            if (title === this.allProducts[i].title) {
                if (this.allProducts[i].quantity === 1) {
                    return;
                } else {
                    this.allProducts[i].quantity = this.allProducts[i].quantity - 1;
                    return;
                }
            }
        }
    }
    addCat(prodData) {
        console.log(prodData)
        if (this.skId === undefined) {
            swal('Please select Size', '', 'error');
            return;
        }
        if (localStorage.token === undefined) {
            swal('Pleaase Login', '', 'warning');
        } else {
            var inData = "product_id=" + prodData.id +
                "&quantity=" + prodData.quantity +
                "&product_sku_id=" + this.skId


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
    wishData;
    getWishList() {
        this.profileSer.getWishList().subscribe(response => {
            this.allProducts = response.json().data.data_message;
            this.showAll = false;
        }, error => {

        })
    }
}