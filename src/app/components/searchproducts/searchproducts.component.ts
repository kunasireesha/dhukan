import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MainService } from './../../services/main/main';

@Component({
  selector: 'app-searchproducts',
  templateUrl: './searchproducts.component.html',
  styleUrls: ['./searchproducts.component.css']
})
export class SearchproductsComponent implements OnInit {
  searchProd;
  products;
  noData;
  constructor(private router: Router, private route: ActivatedRoute, public mainServe: MainService) {
    this.route.queryParams.subscribe(params => {
      this.searchProd = params.prodName;
      this.searchProducts();
      // this.searchProdCat();
    })
  }

  ngOnInit() {
  }
  skId;
  skuId;
  item = {
    quantity: 1
  }
  selected;
  showInput = false;
  selectOption(skId) {
    this.skId = skId
    for (var i = 0; i < this.products.length; i++) {
      for (var j = 0; j < this.products[i].sku.length; j++) {
        if (this.products[i].sku[j].skid === parseInt(skId)) {
          this.products[i].actual_price = this.products[i].sku[j].actual_price;
          this.products[i].offer_price = this.products[i].sku[j].offer_price;
        }
      }

    }
  }

  //add to cart
  itemIncrease(title) {
    for (var i = 0; i < this.products.length; i++) {
      if (title === this.products[i].title) {
        this.products[i].quantity = this.products[i].quantity + 1;
        return;
      }
    }
  }

  itemDecrease(title) {
    for (var i = 0; i < this.products.length; i++) {
      if (title === this.products[i].title) {
        if (this.products[i].quantity === 1) {
          return;
        } else {
          this.products[i].quantity = this.products[i].quantity - 1;
          return;
        }
      }
    }
  }
  resData;
  addCat(prodData) {
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
  searchProducts() {
    var inData = this.searchProd;
    this.mainServe.searchProducts(inData).subscribe(response => {
      this.products = response.json().products;
      for (var i = 0; i < this.products.length; i++) {
        this.products[i].quantity = 1;

      }
      console.log(this.products);
      if (response.json().status == 400) {
        this.noData = response.json().message;
      }

    }, error => {

    });

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
}