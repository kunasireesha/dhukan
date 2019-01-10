import { Component, OnInit, Input } from '@angular/core';
import { MainService } from '../../services/main/main';
import { ProfileService } from '../../services/profile/profiledata';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.address.html',
  styleUrls: ['./delivery.address.css']
})
export class DeliveryComponent implements OnInit {

  showDeliveryOptions = false;
  showPaymentOptions = true;
  showDeliveryAddress = false;
  showAddAddress = true;
  vocher;
  amount;
  summaryCart;
  showVochers = false;
  showOffersPay = false;
  showBankingopt = false;
  showOptions = true;
  constructor(public mainServ: MainService, public profileSer: ProfileService) { }
  address = {
    ua_first_name: '',
    ua_last_name: '',
    ua_mobile_number: '',
    ua_city: '',
    ua_house_no: '',
    ua_area_details: '',
    ua_pincode: '',
    ua_apartment_name: '',
    ua_street_details: '',
    ua_land_mark: '',
    ua_nick_name: '',
    ua_id: ''
  };
  express = true;
  normal = false;
  cartData = [];
  expressDeliveryData = [];

  vocherData = [];
  hideExpress = false;
  deliverySlots = [];
  normalDeliveryData = [];
  slot;
  price = [];
  nrmlprice = [];
  nrmlsingleprice = [];
  nrmlsum: number;
  exprsSum: number;
  nrmlsingleSum: number;
  paymentOptions = [];
  payOption;
  orderData;
  delType = 'express';
  payType = 'offers'
  checkOutData = [];
  oderid;
  showPayOptions = false;
  successMsg;
  ngOnInit() {
    window.scrollTo(0, 0);
    this.address;
    this.selectDeliveryOption();

    this.getAddress();
    this.mainServ.getCartList();
    this.summaryCart = this.mainServ.cartData;
    console.log(this.summaryCart);
  }



  //my address
  getAddress() {
    this.profileSer.getAddress().subscribe(response => {
      for (var i = 0; i < response.json().data.length; i++) {
        if (response.json().data[i].is_default === 1) {

        }
      }

    })
  }


  openAddAddress() {
    this.showAddAddress = !this.showAddAddress;
  }
  openAddressOptions() {
    this.showDeliveryOptions = !this.showDeliveryOptions;
    this.showPayOptions = false;
    this.showOffersPay = false;
    this.showBankingopt = false;
  }

  showPaymentOptionsScreen() {
    this.showPayOptions = true;
    this.showOffersPay = true;
    this.showDeliveryOptions = false;
  }

  //UPDATE ADDRESS
  changeDef;
  selectedVo;
  updateAddress() {
    var inData = "ua_id=" + this.address.ua_id + "&ua_first_name=" + this.address.ua_first_name + "&ua_last_name=" + this.address.ua_last_name + "&ua_mobile_number=" + this.address.ua_mobile_number
      + "&ua_city=" + this.address.ua_city + "&ua_house_no=" + this.address.ua_house_no + "&ua_area_details=" + this.address.ua_area_details + "&ua_pincode=" + this.address.ua_pincode;

    this.mainServ.updateAddress(inData).subscribe(response => {
      if (response.json().status === 200) {
        swal(response.json().message, '', 'success');
        this.changeDef = response.json();
        this.showAddAddress = false;
        this.showDeliveryOptions = true;
      } else {
        swal(response.json().message, '', 'error');
      }
    });
    this.profileSer.setDefaultAdd(this.address.ua_id);
    // this.selectDeliveryOption();

  }

  //apply vocher
  applyVocher() {
    this.mainServ.applyVocher(this.vocher, this.summaryCart.grand_total);
  }

  getVochers() {
    this.showVochers = true;
    this.mainServ.getVochers().subscribe(res => {
      this.vocherData = res.json().data;
    });
  }

  selectedVocher(data, index) {
    this.vocher = data.voucher_code;
    this.selectedVo = index;
  }

  showPaymentopt(action) {
    this.payType = action;
    if (action === 'offers') {
      this.showOffersPay = true;
      this.showBankingopt = false;
    } else {
      this.showBankingopt = true;
      this.showOffersPay = false;
    }
  }
  expected_time;
  changedelivery(action) {
    this.delType = action;
    if (action === 'express') {
      this.express = true;
      this.normal = false;
      this.selectDeliveryOption();
    } else {
      this.normal = true;
      this.express = false;
      this.selectDeliveryOption();
    }
  }
  selectDeliveryOption() {
    this.normalDeliveryData = [];
    this.expressDeliveryData = [];
    this.price = [];
    this.nrmlsingleprice = [];
    this.nrmlprice = [];
    var prams = {
      delivery_type: this.delType
    }
    this.mainServ.getOrderSummary(prams).subscribe(res => {
      this.cartData = res.json().data.data;
      this.expected_time = res.json().data.expected_time;
      this.deliverySlots = res.json().data.deliveryslot.time;
      this.address = res.json().data.user_address[0];
      this.paymentOptions = res.json().data.payment;
      this.orderData = res.json().data.order[0];
      //normal delivery
      for (var i = 0; i < this.cartData.length; i++) {
        this.nrmlsingleprice.push(this.cartData[i].sku[0].selling_price * this.cartData[i].sku[0].mycart);
      }
      this.nrmlsingleSum = this.nrmlsingleprice.reduce(add2, 0);
      function add2(a, b) {
        return a + b;
      }

      //express delivery
      for (var i = 0; i < this.cartData.length; i++) {
        if (this.cartData[i].sku[0].express_delivery === 1) {
          this.expressDeliveryData.push(this.cartData[i].sku[0]);
          this.price.push(this.cartData[i].sku[0].selling_price * this.cartData[i].sku[0].mycart);
        }
      }
      this.exprsSum = this.price.reduce(add, 0);
      function add(a, b) {
        return a + b;
      }

      //normal in express delivery
      for (var i = 0; i < this.cartData.length; i++) {
        if (this.cartData[i].sku[0].normal_delivery === 1) {
          this.normalDeliveryData.push(this.cartData[i].sku[0]);
          this.nrmlprice.push(this.cartData[i].sku[0].selling_price * this.cartData[i].sku[0].mycart);
        }
      }

      this.nrmlsum = this.nrmlprice.reduce(add1, 0);
      function add1(a, b) {
        return a + b;
      }
      console.log(this.orderData);
      //payment options
    });
  }

  changeSlot(value) {
    this.slot = value;
  }

  selectPay(payoptin) {
    this.payOption = payoptin;
  }

  checkout() {
    var params = {
      oderid: this.orderData.order_id,
      delivery_type: this.delType,
      payment_type: this.payOption,
      address: this.address.ua_id
    }

    this.mainServ.cehckout(params).subscribe(res => {

      if (res.json().err_field === '') {
        this.oderid = res.json().oderid;
        this.successMsg = res.json().result;
        swal(res.json().result, '', 'success');
        this.showOptions = false;
      } else {
        swal(res.json().result, '', 'error');
      }
    });
  }
}
