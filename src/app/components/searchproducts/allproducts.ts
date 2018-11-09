import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MainService } from './../../services/main/main';

@Component({
    selector: 'app-allproducts',
    templateUrl: './allproducts.html',
    styleUrls: ['./searchproducts.component.css']
})
export class AllProductsComponent implements OnInit {
    title;
    products;
    noData;
    constructor(private router: Router, private route: ActivatedRoute, public mainServe: MainService) {
        this.route.queryParams.subscribe(params => {
            this.title = params.title;

        })
    }

    item = {
        quantity: 1
    }
    ngOnInit() {
        this.getAllProducts();
    }
    getAllProducts() {

        this.mainServe.getDashboard().subscribe(response => {
            this.products = response.json().products;
            if (response.json().status == 400) {
                this.noData = response.json().message;
            }

        }, error => {

        });

    }
    selectOption(id) {
        this.skId = id;
    }
    resData;
    skId;
    itemIncrease(data, prodId, index, title) {
        // let thisObj = this;
        // if (localStorage.name !== name) {
        //     thisObj.item.quantity = 0;
        // }
        // for (var i = 0; i < data.length; i++) {
        //     if (data[i].title === title) {
        //         thisObj.item.quantity = parseInt(data[i].sku[0].mycart);
        //     }
        // }
        // thisObj.item.quantity = Math.floor(thisObj.item.quantity + 1);
        // if (name === data.title) {
        //     thisObj.showInput = true;
        //     this.selected = index;

        //     localStorage.setItem('name', name);
        //     thisObj.addCat(thisObj.item.quantity, prodId);
        // } else {
        //     thisObj.showInput = false;
        // }
        let thisObj = this;

        thisObj.item.quantity = Math.floor(thisObj.item.quantity + 1);

    }
    selected;
    itemDecrease(index) {
        this.selected = index;
        let thisObj = this;
        if (thisObj.item.quantity === 1) {
            return;
        }
        thisObj.item.quantity = Math.floor(thisObj.item.quantity - 1);

    }
    addCat(prodId) {
        if (this.skId === undefined) {
            swal('Please select Size', '', 'error');
            return;
        }
        if (localStorage.token === undefined) {
            swal('Pleaase Login', '', 'warning');
        } else {
            var inData = "product_id=" + prodId +
                "&quantity=" + this.item.quantity +
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
}