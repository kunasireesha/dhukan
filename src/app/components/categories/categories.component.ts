import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { MainService } from '../../services/main/main';
import { HeaderService } from '../../services/header/header';


@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
    catId;
    constructor(private route: ActivatedRoute, private mainServe: MainService, private headerSer: HeaderService) {

        this.route.queryParams.subscribe(params => {
            this.catId = params.catId;
            this.subCatId = params["sId"];
            if (params["sId"] == undefined) {
                this.catId = params.catId;
                this.getCatProducts(this.catId);
            } else {
                this.subCatId = params["sId"];
                this.getSubProducts(this.subCatId);
            }


        });

    }

    ngOnInit() {
        // this.getCategories();
    }
    page: string;
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
    item = {
        quantity: 1
    }

    //get products
    catName;
    getSubProducts(sId) {
        if (sId === '') {
            this.subId = this.subCatId;
        } else {
            this.subId = sId;
        }
        var data = "" + + "&sortType=" +
            this.mainServe.getSubProducts(this.subId).subscribe(response => {
                this.allProducts = response.json().products;
                for (var i = 0; i < this.allProducts.length; i++) {
                    this.catName = this.allProducts[0].category_name;
                    console.log(this.catName);
                }
                this.showveg = true;
            }, error => {
                if (error.json().status == 400) {
                    this.noData = true;
                    this.noData = error.json().message;
                }
            });
    }

    // getCategories() {
    //   if (localStorage.token === undefined) {
    //     var inData = "Session_id =" + localStorage.session;
    //   } else {
    //     var inData = "token =" + JSON.parse(localStorage.token);
    //   }

    //   // this.headerSer.getAllCatAndSubCat(inData).subscribe(response => {
    //   //   this.results = response.json().result;
    //   //   this.categoriesWithSubCat = this.results.category;
    //   //   for (var i = 0; i < this.categoriesWithSubCat.length; i++) {
    //   //     if (this.catName === this.categoriesWithSubCat[i].name) {
    //   //       this.subcats = this.categoriesWithSubCat[i].subcategory;
    //   //     }
    //   //   }

    //   // });
    // }
    noData;
    getCatProducts(catId) {
        var inData = catId;
        this.mainServe.getCatProducts(inData).subscribe(response => {
            this.allProducts = response.json().products;
            this.showveg = true;
            // if (this.allProducts! == undefined) {
            //   for (var i = 0; i < this.allProducts.length; i++) {
            //     this.catName = this.allProducts[0].category1;
            //     console.log(this.catName);
            //   }
            // }

            if (response.json().status == 400) {
                this.showveg = false;
                this.noData = true;
                this.noData = response.json().message;
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
    showCatProducts(sId) {
        this.getSubProducts(sId);
    }
    skId
    selectOption(id) {
        this.skId = id;
    }
    itemIncrease() {
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
    resData;
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
