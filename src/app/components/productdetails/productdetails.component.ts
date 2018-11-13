import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, Params } from '@angular/router';
import { MainService } from './../../services/main/main';
import { AppSettings } from '../../config';
@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css']
})
export class ProductdetailsComponent implements OnInit {
  prodId;
  constructor(private route: ActivatedRoute, public router: Router, public mainSer: MainService) {
    this.route.queryParams.subscribe(params => {
      this.prodId = params.prodId;
    });
  }
  item = {
    quantity: 1
  }
  zoomedImageSrc;
  smallImageSrc;
  thumbImgSrc;
  thumbImgSrc1;
  thumbImgSrc2;
  prodData = [];
  url;
  ngOnInit() {
    window.scrollTo(0, 0);
    this.zoomedImageSrc = 'assets/images/product.png';
    this.smallImageSrc = 'assets/images/product.png';
    this.thumbImgSrc = 'assets/images/product.png';
    this.thumbImgSrc1 = 'assets/images/capsicums.png';
    this.thumbImgSrc2 = 'assets/images/corn.png';
    this.showProductDetails();
    this.url = AppSettings.imageUrl
  }
  itemIncrease() {
    let thisObj = this;

    thisObj.item.quantity = Math.floor(thisObj.item.quantity + 1);

  }
  itemDecrease() {
    let thisObj = this;
    if (thisObj.item.quantity === 1) {
      return;
    }
    thisObj.item.quantity = Math.floor(thisObj.item.quantity - 1);

  }

  showImage() {
    this.zoomedImageSrc = this.thumbImgSrc;
    this.smallImageSrc = this.thumbImgSrc;
  }
  showImage1() {
    this.zoomedImageSrc = this.thumbImgSrc1;
    this.smallImageSrc = this.thumbImgSrc1;
  }
  showImage2() {
    this.zoomedImageSrc = this.thumbImgSrc2;
    this.smallImageSrc = this.thumbImgSrc2;
  }
  showImageDynamic(image) {
    this.zoomedImageSrc = image;
    this.smallImageSrc = image;
  }
  skuData;
  proId;
  showProductDetails() {
    var inData = this.prodId;
    this.mainSer.showProductDetails(inData).subscribe(response => {
      this.prodData = response.json().products[0];
      this.skuData = response.json().products[0].sku;
      console.log(this.skuData);
      // for (var i = 0; i < this.prodData.length; i++) {
      this.actual_price = response.json().products[0].actual_price;
      this.offer_price = response.json().products[0].offer_price;
      this.proId = response.json().products[0].id;
      // }

    }, error => {

    })
  }
  skId;
  actual_price;
  offer_price;
  selectOption(skId) {
    this.skId = skId;
    for (var i = 0; i < this.skuData.length; i++) {
      if (this.skuData[i].skid === parseInt(skId)) {
        this.actual_price = this.skuData[i].actual_price;
        this.offer_price = this.skuData[i].offer_price;
      }
    }
  }
  resData;
  addCat(prodData) {
    if (this.skId === undefined) {
      swal('Please select Size', '', 'error');
      return;
    }
    // if (localStorage.token === undefined) {
    //     swal('Please Login', '', 'warning');
    // } else {
    var inData = "product_id=" + this.proId +
      "&quantity=" + this.item.quantity +
      "&product_sku_id=" + this.skId


    this.mainSer.addCat(inData).subscribe(response => {
      this.resData = response.json();
      this.mainSer.getCartList();
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
    // }


  }

}