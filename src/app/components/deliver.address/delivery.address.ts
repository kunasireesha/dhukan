import { Component, OnInit, Input } from '@angular/core';
import { MainService } from '../../services/main/main';
import { ProfileService } from '../../services/profile/profiledata';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.address.html',
  styleUrls: ['./delivery.address.css']
})
export class DeliveryComponent implements OnInit {
  @Input() cartData;
  showDeliveryOptions = false;
  showPaymentOptions = true;
  showDeliveryAddress = false;
  showAddAddress = false;
  vocher;
  amount;
  summaryCart;
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

  ngOnInit() {
    window.scrollTo(0, 0);
    this.address;
    this.summaryCart = this.cartData;
    this.getAddress();
  }

  //my address
  getAddress() {
    this.profileSer.getAddress().subscribe(response => {
      for (var i = 0; i < response.json().data.length; i++) {
        if (response.json().data[i].is_default === 1) {
          this.address = response.json().data[i];
        }
      }

    })
  }


  openAddAddress() {
    this.showAddAddress = !this.showAddAddress;
  }
  openAddressOptions() {
    this.showDeliveryOptions = !this.showDeliveryOptions;
  }

  //UPDATE ADDRESS
  updateAddress() {
    var inData = "ua_id=" + this.address.ua_id + "&ua_first_name=" + this.address.ua_first_name + "&ua_last_name=" + this.address.ua_last_name + "&ua_mobile_number=" + this.address.ua_mobile_number
      + "&ua_city=" + this.address.ua_city + "&ua_house_no=" + this.address.ua_house_no + "&ua_area_details=" + this.address.ua_area_details + "&ua_pincode=" + this.address.ua_pincode;

    this.mainServ.updateAddress(inData).subscribe(response => {
      if (response.json().status === 200) {
        swal(response.json().message, '', 'success');
      } else {
        swal(response.json().message, '', 'error');
      }
    });
  }

  //apply vocher
  applyVocher() {
    this.mainServ.applyVocher(this.vocher, this.summaryCart.grand_total);
  }

}
