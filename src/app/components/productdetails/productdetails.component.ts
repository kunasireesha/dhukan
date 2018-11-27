import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, Params } from '@angular/router';
import { MainService } from './../../services/main/main';
import { AppSettings } from '../../config';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css', '../../components/header/header.component.css'],
  providers: [HeaderComponent]
})
export class ProductdetailsComponent implements OnInit {
  prodId;
  constructor(private route: ActivatedRoute, public router: Router, public mainSer: MainService, public headerComp: HeaderComponent) {
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
  showProductDetails() {
    var inData = this.prodId;
    this.mainSer.showProductDetails(inData).subscribe(response => {
      this.prodData = response.json().products[0];
      this.smallImageSrc = response.json().products[0].pic[0].product_image;
      this.skuData = response.json().products[0].sku;
      this.selecte.skId = response.json().products[0].sku[0].skid;
      // for (var i = 0; i < this.prodData.length; i++) {
      this.actual_price = response.json().products[0].sku[0].actual_price;
      this.selling_price = response.json().products[0].sku[0].selling_price;
      this.percentage = Math.round(100 - (this.selling_price / this.actual_price * 100));
      this.proId = response.json().products[0].id;
      for (var i = 0; i < response.json().products[0].pic.length; i++) {
        this.images.push(response.json().products[0].pic[i].product_image);
      }
      if (response.json().products[0].sku[0].mycart !== 0) {
        this.notInCart = true;
      } else {
        this.notInCart = false;
      }

      console.log(this.prodData);
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
            this.images = prodData.sku[i].skuImages;
            console.log(this.images);
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
        // swal(response.json().message, "", "success");
        this.item.quantity = 1;
        this.showProductDetails();
        this.getDashboard();
        this.mainSer.getCartList();
        this.notInCart = true;

      } else {
        swal(response.json().message, "", "error");
        this.selecte.skId = '';
      }
    }, error => {
      swal(error.json().message, "", "error");
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

  showSubCat(id, i) {
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
    swal("Do you want to delete?", "", "warning", {
      buttons: ["Cancel!", "Okay!"],
    }).then((value) => {

      if (value === true) {
        this.mainSer.deleteCart(inData).subscribe(response => {
          this.mainSer.getCartList();
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
    this.mainSer.getDashboard().subscribe(response => {
      this.cartCount = response.json().cart.cart_count;
      this.deliveryCharge = response.json().cart.delivery_charge.toFixed(2);
      this.subTotal = response.json().cart.selling_price.toFixed(2);
      this.Total = response.json().cart.grand_total.toFixed(2);

    })
  }


}