import { MainService } from '../../services/main/main';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../config';
import { HeaderComponent } from '../header/header.component';

import { } from '../../services/header/header';

import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewcart',
  templateUrl: './viewcart.component.html',
  styleUrls: ['./viewcart.component.css', '../../components/header/header.component.css'],
  providers: [HeaderComponent]
})
export class ViewcartComponent implements OnInit {


  viewCart = [];
  constructor(private mainServe: MainService, public router: Router, public headerComp: HeaderComponent) {
    this.getDashboard();
    this.getCartList();
  }
  item = {
    quantity: 1
  }
  data = {
    mycart: 0
  }
  url;
  summary = {
    cart_count: '',
    delivery_charge: '',
    grand_total: '',
    mrp: '',
    realization: '',
    selling_price: ''
  };
  showCart = true;
  cartDetails;
  ngOnInit() {
    this.url = AppSettings.imageUrl;
    this.getCartList();
    this.getDashboard();
  }
  prodId;
  quantiy;
  prodSku;
  cartId;
  quantity1;
  itemIncrease(title, data, skuData) {
    this.prodId = data.product_id;
    this.quantiy = skuData.mycart;
    this.quantity1 = this.quantiy + 1;
    this.prodSku = data.product_sku_id;
    this.cartId = data.id;
    this.modifyCart(this.prodId, this.quantity1, this.prodSku, this.cartId);
    for (var i = 0; i < this.mainServe.viewCart.length; i++) {
      for (var j = 0; j < this.mainServe.viewCart[i].sku.length; j++) {
        if (skuData.skid === this.mainServe.viewCart[i].sku[j].skid) {
          this.mainServe.viewCart[i].sku[0].mycart = this.mainServe.viewCart[i].sku[0].mycart + 1;
          return;
        }
      }

    }
  }
  itemDecrease(title, data, skuData) {
    this.prodId = data.product_id;
    this.quantiy = skuData.mycart;
    this.quantity1 = this.quantiy - 1;
    this.prodSku = data.product_sku_id;
    this.cartId = data.id;
    for (var i = 0; i < this.mainServe.viewCart.length; i++) {
      for (var j = 0; j < this.mainServe.viewCart[i].sku.length; j++) {
        if (skuData.skid === this.mainServe.viewCart[i].sku[j].skid) {
          if (this.mainServe.viewCart[i].sku[0].mycart === 1) {
            this.mainServe.viewCart[i].sku[0].mycart = this.mainServe.viewCart[i].sku[0].mycart - 1;
            // this.modifyCart(this.prodId, this.mainServe.viewCart[i].sku[0].mycart, this.prodSku, this.cartId);
            this.deleteCart(data.product_sku_id);
            this.mainServe.getDashboard();
            this.mainServe.getCartList();
          } else {
            this.modifyCart(this.prodId, this.quantity1, this.prodSku, this.cartId);
            this.mainServe.viewCart[i].sku[0].mycart = this.mainServe.viewCart[i].sku[0].mycart - 1;
            return;
          }
        }
      }
    }
  }


  //   addCat(prodData) {
  //     console.log(prodData)


  //     var inData = "product_id=" + prodData.id +
  //         "&quantity=" + prodData.quantity +
  //         "&product_sku_id=" + this.skId


  //     this.mainServe.addCat(inData).subscribe(response => {
  //         this.resData = response.json();
  //         if (response.json().status === 200) {
  //             swal(response.json().message, "", "success");
  //             this.mainServe.getCartList();
  //             this.getDashboard();
  //             this.skId = undefined;
  //             this.products.quantity = 1
  //             this.notInCart = false;
  //             this.selected = undefined
  //         } else {
  //             swal(response.json().message, "", "error");
  //             this.skId = undefined;
  //         }
  //     }, error => {
  //         swal(error.json().message, "", "success");
  //         this.skId = undefined;
  //     })



  // }
  modifyCart(prodId, quantiy, prodSku, cartId) {
    this.mainServe.modifyCart(prodId, quantiy, prodSku, cartId);
    this.getDashboard();
    this.getCartList();
  }



  emptyCart() {
    this.mainServe.emptyCart().subscribe(response => {
      if (response.json().status === 200) {
        this.getCartList();
        this.getDashboard();
        swal(response.json().message, "", "success");
      } else {
        swal(response.json().message, "", "error");
      }

    }, error => {

    })

  }


  chekOut() {
    if (localStorage.token === undefined) {
      swal('Please Login', '', 'warning');
      return;
    }
    this.cartDetails = this.summary;
    this.showCart = false;

    // this.router.navigate(['/paymentoptions'])
  }


  searchParam;


  getCartList() {
    this.getDashboard();
    this.mainServe.getCartList();
  }


  searchProducts() {
    this.mainServe.searchProducts(this.searchParam)
  }


  itemHeaderDecrease(title, data, skuData) {
    this.mainServe.itemHeaderDecrease(title, data, skuData);
    this.getDashboard();

  }

  itemHeaderIncrease(title, item, data) {
    this.mainServe.itemHeaderIncrease(title, item, data);
    this.getDashboard();
  }

  showCat() {
    this.mainServe.showCat();
  }
  selectedCat;
  showSubCat(id, i) {
    this.selectedCat = i;
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
            this.mainServe.getCartList();
            this.getDashboard();
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

  cartCount;
  deliveryCharge;
  subTotal;
  Total;
  saving;
  getDashboard() {
    this.mainServe.getDashboard().subscribe(response => {
      this.cartCount = response.json().cart.cart_count;
      this.deliveryCharge = response.json().cart.delivery_charge.toFixed(2);
      this.subTotal = response.json().cart.selling_price.toFixed(2);
      this.Total = response.json().cart.grand_total.toFixed(2);
      this.saving = response.json().cart.mrp - this.Total;
    })
  }


}
