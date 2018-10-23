import { element } from 'protractor';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../../services/main/main';
import swal from 'sweetalert';
import { Post, GroupPosts } from '../../services/products';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.less']
})
export class ProductComponent implements OnInit {
    // @Input() data: Array<any>;

    @Input()
    data: Post[];

    groupPosts: GroupPosts[];
    // private _data: Array<any>;
    // @Input()
    // set data(data: Array<any>) {
    //     this._data = data;
    // }
    // get data() { return this._data; }

    selected: number = 0;
    selectedOption: string;
    states = [];
    datas = [];
    constructor(public router: Router, public mainServe: MainService) {

    }
    item = {
        quantity: 1
    }
    resData;



    groupByCategory(data: Post[]): GroupPosts[] {
        // our logic to group the posts by category
        if (!data) return;
    }





    ngOnInit() {
        this.groupPosts = this.groupByCategory(this.data);
        this.allFeatureProducts.push(this.data);
        console.log(this.groupPosts);
        // this.getDashboard();

    }
    itemIncrease(index) {
        this.selected = index;
        let thisObj = this;
        thisObj.item.quantity = Math.floor(thisObj.item.quantity + 1);
    }
    itemDecrease(index) {
        this.selected = index;
        let thisObj = this;
        if (thisObj.item.quantity === 0) {
            return;
        }
        thisObj.item.quantity = Math.floor(thisObj.item.quantity - 1);
    }
    ShowProductDetails() {
        this.router.navigate(['/productdetails']);
    }

    allFeatureProducts = [];
    //get products
    // getDashboard() {
    //     this.mainServe.getDashboard().subscribe(response => {
    //         this.allFeatureProducts = response.json().products;
    //         // this.selectOption(id);
    //         // for(var i = 0; i <this.allFeatureProducts[i] ; i++){
    //         //   for( var j = 0; j<this.allFeatureProducts[j].sku[j]; j++)
    //         //   {
    //         //   }
    //         // }
    //     });
    // }
    skId;
    selectOption(id) {
        // var valid = false;
        this.skId = id;
        if (this.skId == id) {
            // valid = true;
        } else {
            alert('false')
        }
    }
    addCat(prodId) {

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
            if (this.resData.status == 400) {
                swal("Already added", "", "error");
            } else {
                swal("Succeessfully added", "", "success");
            }

        }, error => {

        })
        //     } else {
        //     swal("Please select option", "", "warning");
        // }

    }
}
