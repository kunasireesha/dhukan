import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profiledata';
import { INgxMyDpOptions, IMyDateModel, IMyInputFieldChanged } from 'ngx-mydatepicker';
import { Address } from '../../services/deliveraddressdata/address';
import { AddressServices } from '../../services/deliveraddressdata/addressService';


@Component({
  selector: 'app-myprofile-list',
  templateUrl: './myprofile-list.component.html',
  styleUrls: ['./myprofile-list.component.css']
})
export class MyprofileListComponent implements OnInit {

  constructor(private route: ActivatedRoute, private profileSer: ProfileService, private addressSer: AddressServices, private router: Router) {
    this.page = this.route.snapshot.data[0]['page'];
    if (this.page === 'my-profile') {
      this.showProfile = true;
      this.childPage = 'My Profile';
      this.getProfileDetails();
    } else if (this.page === 'myorders') {
      this.profileSer.myOrders().subscribe(response => {
        console.log(response)
      }, error => {

      })
      this.showOrders = true;
      this.showProfile = false;
      this.childPage = 'My Orders';
    } else if (this.page === 'mywallet') {
      this.showProfile = false;
      this.showWallet = true;
      this.childPage = 'My Wallet';
    } else if (this.page === 'changepassword') {
      this.ShowChangePassword = true;
      this.showProfile = false;
      this.childPage = 'Change Password';
    } else if (this.page === 'deliveryaddress') {
      this.showDeliveryAddress = true;
      this.showProfile = false;
      this.childPage = 'Delivery Address';
      this.getAddress();
    } else if (this.page === 'referfriends') {
      this.showReferFriends = true;
      this.showProfile = false;
      this.childPage = 'Refer Friends';
    } else if (this.page === 'loyalitypoints') {
      this.showProfile = false;
      this.showLoyalityPoints = true;
      this.childPage = 'My Loyalty Points';
    } else if (this.page === 'notifications') {
      this.showProfile = false;
      this.showNotifications = true;
      this.childPage = 'Notification';
    }

  }
  childPage: string;
  page: string;
  ShowChangePassword = false;
  showWallet = false;
  showOrders = false;
  showProfile = true;
  showEditProfile = false;
  showDeliveryAddress = false;
  showChangeAddress = false;
  showReferFriends = false;
  showLoyalityPoints = false;
  showNotifications = false;
  showPaymentOptions = false;
  profileDetails;
  date;
  addressData = [];
  changePassword = {
    oldPw: '',
    newPw: '',
    conPw: ''
  }

  formData = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    dob: { jsdate: '' },
    landline: ''
  }

  address = {
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    houseNum: '',
    residentialComplex: '',
    area: '',
    pincode: '',
    street: '',
    landmark: ''

  }


  ngOnInit() {
    window.scrollTo(0, 0)
  }


  //get Profile details
  getProfileDetails() {
    this.profileSer.getProfileDetails().subscribe(response => {
      this.formData = response.json().data[0];

    })
  }

  openEditProfile() {
    this.showProfile = false;
    this.showEditProfile = true;
  }
  openChangeAddress() {
    this.showDeliveryAddress = false;
    this.showChangeAddress = true;
  }
  openPaymantOptions() {
    this.showPaymentOptions = true;
  }




  //update Profile
  updateProfile() {

    let validData = true;
    if (this.formData.first_name === '' || this.formData.first_name === undefined || this.formData.first_name === null) {
      validData = false;
    }
    if (this.formData.last_name === '' || this.formData.last_name === undefined || this.formData.last_name === null) {
      validData = false;
    }

    if (this.formData.email === '' || this.formData.email === undefined || this.formData.email === null) {
      validData = false;
    }

    if (this.formData.phone === '' || this.formData.phone === undefined || this.formData.phone === null) {
      validData = false;
    }

    if (validData) {
      // console.log( JSON.stringify(this.formData.dob.formatted))
      // if (parseInt(this.formData.dob.month) < 10) {
      //   this.formData.dob.month = "" + 0 + this.formData.dob.month;
      // }
      // if (parseInt(this.formData.dob.day) < 10) {
      //   this.formData.dob.day = "" + 0 + this.formData.dob.day;
      // }
      // this.date = " " + this.formData.dob.year + '.' + this.formData.dob.month + '.' + this.formData.dob.day
      var inData = "first_name=" + this.formData.first_name + "&last_name=" + this.formData.last_name + "&email=" + this.formData.email +
        "&phone=" + this.formData.phone + "&dob=" + (this.formData.dob) + "&landline_number=" + this.formData.landline;
      this.profileSer.updateProfile(inData).subscribe(response => {
        if (response.status === 200) {
          swal('Profile Updated Successfully', '', 'success');
        }
      })
    } else {
      swal('Required Fields are Missing', '', 'error');
    }
  }

  cancelEdit() {
    this.showProfile = true;
    this.showEditProfile = false;
  }


  //my address
  getAddress() {
    this.profileSer.getAddress().subscribe(response => {
      this.address = response.json().data;
      console.log(this.address);

    })
  }

  //add address
  addAddress() {
    let validData = true;

    if (this.address.firstName === '' || this.address.firstName === undefined || this.address.firstName === null || this.address.lastName === '' || this.address.lastName === undefined || this.address.lastName === null ||
      this.address.phone === '' || this.address.phone === undefined || this.address.phone === null || this.address.city === '' || this.address.city === undefined || this.address.city === null
      || this.address.houseNum === '' || this.address.houseNum === undefined || this.address.houseNum === null
      || this.address.area === '' || this.address.area === undefined || this.address.area === null ||
      this.address.pincode === '' || this.address.pincode === undefined || this.address.pincode === null) {

      validData = false;
    }


    if (validData) {
      var inData = "ua_first_name=" + this.address.firstName +
        "&ua_last_name=" + this.address.lastName +
        "&ua_mobile_number=" + this.address.phone +
        "&ua_city=" + this.address.city +
        "&ua_house_no=" + this.address.houseNum +
        "&ua_area_details=" + this.address.area +
        "&ua_pincode=" + this.address.pincode +
        "&ua_apartment_name=" + this.address.residentialComplex +
        "&ua_street_details=" + this.address.street +
        "&ua_land_mark=" + this.address.landmark

      this.profileSer.addAddress(inData).subscribe(response => {
        if (response.status === 200) {
          swal("Address added successfully", " ", "Success");
        }
      })
    } else {
      swal('Required Fields are Missing', '', 'error');
    }
  }

  //cancel add address
  canceladdAddress() {
    this.showDeliveryAddress = true;
    this.showChangeAddress = false;
  }

  //showPayment
  showPaymentOptionsScreen(addressData) {
    let addressDetails: Address = {
      firstName: addressData.ua_first_name,
      lastName: addressData.ua_last_name,
      contact: addressData.ua_mobile_number,
      houseNum: addressData.ua_house_no,
      apartmentName: addressData.ua_apartment_name,
      street: addressData.ua_street_details,
      landmark: addressData.ua_land_mark,
      city: addressData.ua_city,
      area: addressData.ua_area_details,
      pincode: addressData.ua_pincode
    };

    this.addressSer.data = addressDetails;
    this.router.navigate(['/paymentoptions']);
  }
  changePw() {
    var inData = "phone=" + localStorage.userMobile +
      "&password=" + this.changePassword.oldPw +
      "&newpassword=" + this.changePassword.newPw
    if ((this.changePassword.oldPw || this.changePassword.newPw) === '') {
      swal("Required fields are missing", "", "warning");
    }
    else if ((this.changePassword.newPw) === this.changePassword.conPw) {
      this.profileSer.changePw(inData).subscribe(response => {
        swal("password change sucessfully", "", "success");
        this.changePassword = {
          oldPw: '',
          newPw: '',
          conPw: ''
        }
      }, error => {

      });
    } else {
      swal("Passwords missmatched", "", "error");
    }

  }

}
