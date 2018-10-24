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
  summary;
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
}
