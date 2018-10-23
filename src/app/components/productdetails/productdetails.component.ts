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
    if (thisObj.item.quantity === 0) {
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
  showProductDetails() {
    var inData = this.prodId;
    this.mainSer.showProductDetails(inData).subscribe(response => {
      this.prodData = response.json().products[0];
      console.log(this.prodData);
    }, error => {

    })
  }

}