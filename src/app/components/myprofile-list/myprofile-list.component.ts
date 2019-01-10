import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ProfileService } from '../../services/profile/profiledata';
import { Address } from '../../services/deliveraddressdata/address';
import { AddressServices } from '../../services/deliveraddressdata/addressService';
import { HeaderService } from '../../services/header/header';
import { HeaderComponent } from '../header/header.component';
import { MainService } from './../../services/main/main';
import { AppSettings } from '../../config';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-myprofile-list',
  templateUrl: './myprofile-list.component.html',
  styleUrls: ['./myprofile-list.component.css', '.././viewcart/viewcart.component.css', '../../components/header/header.component.css'],
  providers: [HeaderComponent, NgbRatingConfig]
})
export class MyprofileListComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private profileSer: ProfileService,
    private addressSer: AddressServices,
    private router: Router,
    private headerSer: HeaderService,
    public headerComp: HeaderComponent,
    public mainSer: MainService,
    config: NgbRatingConfig) {
    config.max = 5;

    this.page = this.route.snapshot.data[0]['page'];
    if (this.page === 'my-profile') {
      this.showProfile = true;
      this.myprofileData = true;
      this.childPage = 'My Profile';
      this.getProfileDetails();
    } else if (this.page === 'myorders') {
      this.getOrders();
      this.showOrders = true;
      this.showProfile = false;
      this.myprofileData = true;
      this.childPage = 'My Orders';
    } else if (this.page === 'mywallet') {
      this.showProfile = false;
      this.showWallet = true;
      this.myprofileData = true;
      this.childPage = 'My Wallet';
    } else if (this.page === 'changepassword') {
      this.ShowChangePassword = true;
      this.showProfile = false;
      this.myprofileData = true;
      this.childPage = 'Change Password';
    } else if (this.page === 'deliveryaddress') {
      this.showDeliveryAddress = true;
      this.showProfile = false;
      this.myprofileData = true;
      this.childPage = 'Delivery Address';
      this.getAddress();
    } else if (this.page === 'referfriends') {
      this.showReferFriends = true;
      this.showProfile = false;
      this.myprofileData = true;
      this.childPage = 'Refer Friends';
    } else if (this.page === 'loyalitypoints') {
      this.showProfile = false;
      this.showLoyalityPoints = true;
      this.myprofileData = true;
      this.childPage = 'My Loyalty Points';
    } else if (this.page === 'notifications') {
      this.showProfile = false;
      this.showNotifications = true;
      this.myprofileData = true;
      this.childPage = 'Notification';
    } else if (this.page === 'mywishlist') {
      this.getWishList();
      this.showProfile = false;
      this.showWish = true;
      this.myprofileData = true;
      this.childPage = 'My Wishlist';
    }

    this.getCartList();
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
  showWish = false;
  myprofileData = true;
  showPaymentOptions = false;
  showOrderDetailsData = false;
  showFeedbackForm = false;
  profileDetails;
  date;
  addressData = [];
  ordersData = [];
  changePassword = {
    oldPw: '',
    newPw: '',
    conPw: ''
  }
  feedback;
  Rate;
  currentRate;
  formData = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    dob: { jsdate: '' },
    landline: ''
  }

  address = {
    ua_first_name: '',
    ua_last_name: '',
    ua_mobile_number: '',
    ua_city: '',
    ua_house_no: '',
    residentialComplex: '',
    ua_area_details: '',
    ua_pincode: '',
    ua_street_details: '',
    ua_land_mark: '',
    ua_nick_name: ''

  }


  ngOnInit() {
    window.scrollTo(0, 0);
    this.getDashboard();
  }


  //get Profile details
  getProfileDetails() {
    this.profileSer.getProfileDetails().subscribe(response => {
      this.formData = response.json().data[0];
      localStorage.setItem("userMobile", this.formData.phone);
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

  viewAll(action) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        title: action
      }
    }
    this.router.navigate(['/viewAll'], navigationExtras);
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
          this.getProfileDetails();
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
      this.addressData = response.json().data;
    })
  }

  //add address
  addAddress() {



    let validData = true;

    // if (this.address.firstName === '' || this.address.firstName === undefined || this.address.firstName === null || this.address.lastName === '' || this.address.lastName === undefined || this.address.lastName === null ||
    //   this.address.phone === '' || this.address.phone === undefined || this.address.phone === null || this.address.city === '' || this.address.city === undefined || this.address.city === null
    //   || this.address.houseNum === '' || this.address.houseNum === undefined || this.address.houseNum === null
    //   || this.address.area === '' || this.address.area === undefined || this.address.area === null ||
    //   this.address.pincode === '' || this.address.pincode === undefined || this.address.pincode === null) {
    //   validData = false;
    // }


    if (validData) {
      var inData = "ua_first_name=" + this.address.ua_first_name +
        "&ua_last_name=" + this.address.ua_last_name +
        "&ua_mobile_number=" + this.address.ua_mobile_number +
        "&ua_city=" + this.address.ua_city +
        "&ua_house_no=" + this.address.ua_house_no +
        "&ua_area_details=" + this.address.ua_area_details +
        "&ua_pincode=" + this.address.ua_pincode +
        "&ua_apartment_name=" + this.address.residentialComplex +
        "&ua_street_details=" + this.address.ua_street_details +
        "&ua_land_mark=" + this.address.ua_land_mark +
        "&ua_nick_name=" + this.address.ua_nick_name

      this.profileSer.addAddress(inData).subscribe(response => {
        if (response.status === 200) {
          swal("Address added successfully", " ", "success");
          this.getAddress();
          this.showDeliveryAddress = true;
          this.showChangeAddress = false;
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


  deliverHere(addressData) {
    this.profileSer.setDefaultAdd(addressData.ua_id);
  }
  getRefCode() {
    var inData = "email=" + "jdlogan@mit.edu";
    this.profileSer.getRefCode(inData).subscribe(response => {
      swal("Referral code sent successfully", "", "success");
      if (response.json().status == 400) {
        swal(response.json().message, "", "error");
      }

    }, error => {
      if (error.json().status == 400) {
        swal(error.json().message, "", "error");
      }
    })
  }
  wishData = [];
  getWishList() {
    this.wishData = [];
    this.profileSer.getWishList().subscribe(response => {
      for (var i = 0; i < response.json().result.length; i++) {
        this.wishData.push(response.json().result[i].products[0]);
      }

    }, error => {

    })
  }
  deleteWish(wishId) {
    var inData = "whislistId=" + wishId
    swal("Do you want to delete?", "", "warning", {
      buttons: ["Cancel!", "Okay!"],
    }).then((value) => {

      if (value === true) {
        this.profileSer.deleteWish(inData).subscribe(response => {
          this.getWishList();
          swal("Deleted successfully", "", "success");
        }, error => {
          console.log(error);
        })
      } else {
        return;
      }
    });
  }
  // emptyWish() {
  //   this.profileSer.emptyWish().subscribe(response => {
  //     swal("Successfully Cleared", "", "success");
  //     this.getWishList();
  //   }, error => {

  //   })
  // }
  prodId;
  quantiy;
  quantity1;
  prodSku;
  cartId;
  itemIncrease(title, data, skuData) {
    this.prodId = data.product_id;
    this.quantiy = skuData.mycart;
    this.quantity1 = this.quantiy + 1;
    this.prodSku = data.product_sku_id;
    this.cartId = data.id;
    this.modifyCart(this.prodId, this.quantity1, this.prodSku, this.cartId);
    for (var i = 0; i < this.wishData.length; i++) {
      if (title === this.wishData[i].title) {
        this.wishData[i].sku[0].mycart = this.wishData[i].sku[0].mycart + 1;

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
    for (var i = 0; i < this.wishData.length; i++) {
      if (title === this.wishData[i].title) {
        if (this.wishData[i].sku[0].mycart === 1) {
          return;
        } else {
          this.wishData[i].sku[0].mycart = this.wishData[i].sku[0].mycart - 1;
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
    this.headerSer.modifyCart(inData).subscribe(response => {
    }, error => {

    })
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
  }

  itemHeaderIncrease(title, item, data) {
    this.mainSer.itemHeaderIncrease(title, item, data);
  }

  showCat() {
    this.mainSer.showCat();
  }
  selectedCat;
  showSubCat(id, i) {
    this.selectedCat = i;
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
  orderDetailsData = [];
  getDashboard() {
    this.mainSer.getDashboard().subscribe(response => {
      this.cartCount = response.json().cart.cart_count;
      this.deliveryCharge = response.json().cart.delivery_charge.toFixed(2);
      this.subTotal = response.json().cart.selling_price.toFixed(2);
      this.Total = response.json().cart.grand_total.toFixed(2);
    })
  }

  getOrders() {
    this.mainSer.getOrdersData().subscribe(response => {
      this.ordersData = response.json().data;
      for (var i = 0; i < this.ordersData.length; i++) {
        this.ordersData[i].formated_date = new Date(this.ordersData[i].order_date);
        this.ordersData[i].time = (this.ordersData[i].formated_date.getHours() > 12) ? this.ordersData[i].formated_date.getHours() - 12 : this.ordersData[i].formated_date.getHours()
        this.ordersData[i].converted_date = this.ordersData[i].formated_date.getDate() + '-' + (this.ordersData[i].formated_date.getMonth() + 1) + '-' + this.ordersData[i].formated_date.getFullYear() + '/' + this.ordersData[i].time + ':' + this.ordersData[i].formated_date.getMinutes()
      }
      console.log(this.ordersData);
    });
  }

  showOrderDetails(order_id) {
    this.showOrderDetailsData = true;
    this.showOrders = false;
    this.mainSer.getOrderDetails(order_id).subscribe(response => {
      this.orderDetailsData = response.json().data;
    });
  }

  giveFeedback() {
    this.currentRate = '';
    this.feedback = '';
    this.showFeedbackForm = true;
    this.showOrderDetailsData = false;
  }

  rateChange(rate) {
    this.Rate = rate;
  }

  rateSub() {
    if (this.Rate == null || NaN) {
      swal("Please select rate", "", "warning");
      return;
    } else {
      var inData = {
        "user_id": localStorage.userId,
        "User_rating": this.Rate,
        "feedback": this.feedback,
        "product_id": '',
        "product_sku_id": ''
      }
      this.mainSer.rateChange(inData).subscribe(response => {
        if (response.json().status === 200) {
          swal("Rating submitted successfully", "", "sucess");
          this.feedback = '';
        }
      })
    }
  }

  goback() {
    this.showOrders = true;
    this.showFeedbackForm = false;
    this.showOrderDetailsData = false;
  }

}
