import { MainService } from '../../services/main/main';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../config'
import { Router } from '@angular/router';


@Component({
  selector: 'app-viewcart',
  templateUrl: './viewcart.component.html',
  styleUrls: ['./viewcart.component.css']
})
export class ViewcartComponent implements OnInit {


  viewCart = [];
  constructor(private mainServe: MainService, public router: Router) { }
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
    for (var i = 0; i < this.viewCart.length; i++) {
      if (title === this.viewCart[i].title) {
        this.viewCart[i].sku[0].mycart = this.viewCart[i].sku[0].mycart + 1;

        return;
      }
    }
  }
  itemDecrease(title, data, skuData) {
    this.prodId = data.product_id;
    this.quantiy = skuData.mycart;
    this.quantity1 = this.quantiy - 1;
    this.prodSku = data.product_sku_id;
    this.cartId = data.id;
    this.modifyCart(this.prodId, this.quantity1, this.prodSku, this.cartId);
    for (var i = 0; i < this.viewCart.length; i++) {
      if (title === this.viewCart[i].title) {
        if (this.viewCart[i].sku[0].mycart === 1) {
          return;
        } else {
          this.viewCart[i].sku[0].mycart = this.viewCart[i].sku[0].mycart - 1;
          return;
        }
      }
    }
  }
  modifyCart(prodId, quantiy, prodSku, cartId) {
    var inData = "product_id=" + prodId +
      "&quantity=" + quantiy +
      "&product_sku_id=" + prodSku +
      "&Cartid=" + cartId
    this.mainServe.modifyCart(inData).subscribe(response => {
    }, error => {

    })
  }


  getCartList() {
    this.mainServe.getCartList().subscribe(response => {
      this.viewCart = response.json().data;
      this.summary = response.json().summary;
    });
  }
  deleteCart(id) {
    var inData = id;
    swal("Do you want to delete?", "", "warning", {
      buttons: ["Cancel!", "Okay!"],
    }).then((value) => {

      if (value === true) {
        this.mainServe.deleteCart(inData).subscribe(response => {
          this.mainServe.getDashboard();
          this.getCartList();
          swal("Deleted successfully", "", "success");
        }, error => {
          console.log(error);
        })
      } else {
        return;
      }
    });

  }
  emptyCart() {
    this.mainServe.emptyCart().subscribe(response => {
      this.getCartList();
      swal("Successfully cleared", "", "success");
    }, error => {

    })

  }


  chekOut() {
    this.cartDetails = this.summary;
    this.showCart = false;

    // this.router.navigate(['/paymentoptions'])
  }
}
