import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ProfileService } from '../../services/profile/profiledata';
import { AddressServices } from '../../services/deliveraddressdata/addressService';


@Component({
  selector: 'app-main',
  templateUrl: './delivery.address.html',
  styleUrls: ['./delivery.address.css']
})
export class DeliveryComponent implements OnInit {

  showDeliveryOptions = false;
  showPaymentOptions = true;
  showDeliveryAddress = false;
  showAddAddress = false;
  constructor(private addressSer: AddressServices) { }
  address;
  ngOnInit() {
    window.scrollTo(0, 0);
    this.address = this.addressSer.data;
  }

  openAddAddress() {
    this.showAddAddress = !this.showAddAddress;
  }
  openAddressOptions() {
    this.showDeliveryOptions = !this.showDeliveryOptions;
  }

  //UPDATE ADDRESS
  updateAddress() {

  }

}
