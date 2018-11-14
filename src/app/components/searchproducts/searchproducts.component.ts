import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MainService } from './../../services/main/main';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-searchproducts',
  templateUrl: './searchproducts.component.html',
  styleUrls: ['./searchproducts.component.css', '../../components/header/header.component.css'],
  providers: [HeaderComponent]
})
export class SearchproductsComponent implements OnInit {
  searchProd;
  products;
  noData;
  constructor(private router: Router, private route: ActivatedRoute, public mainServe: MainService, public headerComp: HeaderComponent) {
    this.route.queryParams.subscribe(params => {
      this.searchProd = params.prodName;
      this.searchProductsData();
      // this.searchProdCat();
    })
    this.getDashboard();
    this.getCartList();
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
    if (this.products !== undefined) {
      for (var i = 0; i < this.products.length; i++) {
        for (var j = 0; j < this.products[i].sku.length; j++) {
          if (this.products[i].sku[j].skid === parseInt(skId)) {
            this.products[i].actual_price = this.products[i].sku[j].actual_price;
            this.products[i].offer_price = this.products[i].sku[j].offer_price;
          }
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
  searchProductsData() {
    var inData = this.searchProd;
    this.mainServe.getsearchProducts(inData).subscribe(response => {
      if (response.json().status === 200) {
        this.products = response.json().products;
        if (this.products !== undefined) {
          for (var i = 0; i < this.products.length; i++) {
            this.products[i].quantity = 1;
          }
        }
      } else {
        this.noData = response.json().message;
      }

    }, error => {

      this.noData = error.json().message;

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



  //header
  searchParam;
  viewCart;

  getCartList() {
    this.getDashboard();
    this.mainServe.getCartList();
  }


  searchProducts() {
    this.mainServe.searchProducts(this.searchParam)
  }


  itemHeaderDecrease(title, data, skuData) {
    this.mainServe.itemHeaderDecrease(title, data, skuData);
  }

  itemHeaderIncrease(title, item, data) {
    this.mainServe.itemHeaderIncrease(title, item, data);
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
          this.mainServe.getCartList();
          this.getDashboard();
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
  getDashboard() {
    this.mainServe.getDashboard().subscribe(response => {
      this.cartCount = response.json().cart.cart_count;
      this.deliveryCharge = response.json().cart.delivery_charge.toFixed(2);
      this.subTotal = response.json().cart.selling_price.toFixed(2);
      this.Total = response.json().cart.grand_total.toFixed(2);

    })
  }

}