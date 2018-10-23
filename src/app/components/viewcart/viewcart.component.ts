import { MainService } from '../../services/main/main';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../config'


@Component({
  selector: 'app-viewcart',
  templateUrl: './viewcart.component.html',
  styleUrls: ['./viewcart.component.css']
})
export class ViewcartComponent implements OnInit {


  viewCart = [];
  constructor(private mainServe: MainService) { }
  item = {
    quantity: 1
  }
  url;
  suummary;
  ngOnInit() {
    this.url = AppSettings.imageUrl;
    this.getCartList();
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
  getCartList() {
    this.mainServe.getCartList().subscribe(response => {
      this.viewCart = response.json().data;
      console.log(this.viewCart);
      this.suummary = response.json().summary;
    });
  }
  deleteCart(id) {
    var inData = id

    this.mainServe.deleteCart(inData).subscribe(response => {
      this.getCartList();
    }, error => {

    })
  }
  emptyCart() {
    this.mainServe.emptyCart().subscribe(response => {
      console.log(response);
      this.getCartList();
    }, error => {

    })

  }
}
