import { MainService } from './../../services/main/main';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { DataService } from '../../services/login/login';
import { HeaderService } from '../../services/header/header';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';


// import {
//   AuthService,
// } from 'angular-6-social-login';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cart: any;
  errorMessage: any;
  cartCount: any;
  deliveryCharge: any;
  subTotal: any;
  Total: any;
  status: any;
  viewCart = [];
  summary = []
  constructor(
    public loginService: DataService,
    private translate: TranslateService,
    public mainServe: MainService,
    public dialog: MatDialog,
    public router: Router,
    // private socialAuthService: AuthService,
    private headerSer: HeaderService
  ) {
    this.getDashboard();
  }
  data = {
    mycart: 0
  }

  ngOnInit() {
    this.phone = localStorage.userMobile;
    this.getDashboard();
    this.getCategories();
    this.getAllCategoriesWithSubCat();
    if (localStorage.userData !== undefined) {
      this.showProfile = true;
      this.showLoginButton = false;
    }
    if (localStorage.location !== undefined) {
      this.location = localStorage.location;
      this.LocationPincode = localStorage.pincode;
    }
  }

  showProfile: boolean;
  showLoginButton = true;
  showModal = false;
  showOpacity = false;
  showLocations = false;
  showSubLocations = false;
  item = {
    quantity: 1
  }

  showLogin = false;
  hideLocations = false;
  showLoginandRegistration = true;
  showRegistration = false;
  showOtp = false;
  showForgotPassword = false;
  showCategories = false;
  showSubCats = false;
  otpData;
  location: string;
  LocationPincode: any;
  msg;
  locationName;
  pincodeOfLocation;
  subLocationName;
  locationData = [];
  subLocationData = [];
  categories = [];
  categoriesWithSubCat = [];
  subCatList = [];
  selectedCat;
  offersList = [];
  banners = [];
  results: any;
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    referalCode: '',
    otp: '',
    lId: '',
    pincode: '',
    searchParam: ''
  }
  forData = {
    forEmail: ''
  }
  phone;


  //in popup login button

  showLoginScreen() {
    this.showLogin = true;
    this.showRegistration = false;

  }
  //in popup registratin button
  showRegistrationScreen() {
    this.showRegistration = true;
    this.showLogin = false;
  }


  //login link
  openLogin() {
    this.showModal = true;
    this.showLoginandRegistration = true;
    this.showLogin = true;
    this.showRegistration = false;
    this.showOpacity = true;
    this.showForgotPassword = false;
    this.showOtp = false;
    this.formData.phone = '';

    this.formData.password = '';

  }

  //registration link
  openRegistration() {
    this.showModal = true;
    this.showLogin = false;
    this.showLoginandRegistration = true;
    this.showRegistration = true;
    this.showOpacity = true;
    this.showForgotPassword = false;
    this.showOtp = false;
    this.formData.firstName = '';
    this.formData.lastName = '';
    this.formData.email = '';
    this.formData.phone = '';
    this.formData.password = '';
    this.formData.referalCode = '';
    this.formData.otp = '';

  }

  //forgot password
  openForgotpassword() {
    this.showForgotPassword = true;
    this.showOpacity = true;
    this.showLoginandRegistration = false;
    this.showOtp = false;
    this.formData.email = '';

  }

  forgotPassword() {
    var inData = "email=" + this.forData.forEmail;

    if (this.forData.forEmail === '' || this.forData.forEmail === undefined || this.forData.forEmail === null) {
      swal('Missing Mandatory field', '', 'error');
    }
    else {
      this.headerSer.forgotPassword(inData).subscribe(response => {
        if (response.json().status === 400) {
          swal(response.json().message, "", "error");
        } else {
          swal("mail sent succesfully", "", "success");
          this.forData.forEmail = '';
          this.onCloseCancel();
        }
      }, error => {
        console.log(error);
      })
    }
  }

  logout() {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    this.router.navigate(["/"]);
    this.showProfile = false;
    this.showLoginButton = true;
  }

  //close popup
  onCloseCancel() {
    this.showModal = false;
    if (this.showModal === false) {
      this.showOpacity = false;
    }
  }
  //login
  login() {

    var validdata = false;

    if (this.formData.phone === '' || this.formData.phone === undefined || this.formData.phone === null ||
      this.formData.password === '' || this.formData.password === undefined || this.formData.password === null) {
      swal('Missing Mandatory field', '', 'error');
      validdata = false;
    } else {
      validdata = true;
    }

    if (validdata) {
      var inData = "phone=" + this.formData.phone +
        "&password=" + this.formData.password +
        "&device_id=" + "abcd12_123" +
        "&device_token=" + "abcd12_123" +
        "&device_type=" + "Desktop"

      this.loginService.login(inData).subscribe(response => {
        if (response.json().status === 400) {
          swal(response.json().message, " ", "error")
        } else {
          swal("Login Successfully", " ", "success");
          localStorage.setItem('userData', JSON.stringify(response.json().data));
          localStorage.setItem('token', JSON.stringify(response.json().token));
          localStorage.setItem('userId', JSON.stringify(response.json().data.u_id));
          localStorage.setItem('userMobile', (response.json().data.phone));
          this.onCloseCancel();
          this.showProfile = true;
          this.phone = localStorage.userMobile;
          this.showLoginButton = false;
          this.router.navigate(["/"]);
        }
      });
    }

  }

  //otp verification
  openOtpScreen() {
    var validData = false;

    //validations
    if (this.formData.firstName === '' || this.formData.firstName === undefined || this.formData.firstName === null ||
      this.formData.lastName === '' || this.formData.lastName === undefined || this.formData.lastName === null ||
      this.formData.email === '' || this.formData.email === undefined || this.formData.email === null ||
      this.formData.phone === '' || this.formData.phone === undefined || this.formData.phone === null ||
      this.formData.password === '' || this.formData.password === undefined || this.formData.password === null) {
      validData = false;
      swal('Missing Mandatory fields', '', 'error');
    } else {
      validData = true;
    }

    if (validData) {
      var inData = "phone=" + this.formData.phone;
      this.loginService.requestOtp(inData).subscribe(response => {
        this.otpData = response.json();
        if (response.json().status === 200) {
          swal("Otp Sent to your mobile number", " ", "success");
          this.showForgotPassword = false;
          this.showLoginandRegistration = false;
          this.showModal = true;
          this.showOpacity = true;
          this.showOtp = true;
        } else {
          swal(response.json().message, " ", "error");
        }

      }, err => {
        if (err.json().status === 400) {
          this.msg = this.translate.instant("common.loginErrMsg");
          swal(err.json().message, " ", "error").then((value) => {

          });
        };
      });
    }
  }

  //registration
  registration() {
    // var inData = "phone=" + this.formData.phone;
    var validOtp = false;
    if (this.formData.otp === '' || this.formData.otp === undefined || this.formData.otp === null || parseInt(this.formData.otp) !== this.otpData.otp) {
      swal('Missing Mandatory fields', '', 'error');
      validOtp = false;
    } else {
      validOtp = true;
    }

    if (validOtp) {
      var inData = "first_name=" + this.formData.firstName +
        "&last_name=" + this.formData.lastName +
        "&email=" + this.formData.email +
        "&phone=" + this.formData.phone +
        "&password=" + this.formData.password +
        "&device_id=" + "abcd12_123" +
        "&device_token=" + "abcd12_123" +
        "&device_type=" + "Desktop"
      // "&referral_code=" + this.formData.referalCode

      this.loginService.registration(inData).subscribe(response => {
        this.otpData = response.json();
        if (response.json().status === 200) {
          swal("Thank you for registering with us Welcome to DHUKHAN", " ", "success");
          this.onCloseCancel();
          this.router.navigate(["/"]);
          this.showModal = false;
          this.showOpacity = false;
        } else {
          swal(response.json().message, " ", "error");
        }

      }, err => {
        if (err.json().status === 400) {
          this.msg = this.translate.instant("common.loginErrMsg");
          swal(err.json().message, " ", "error").then((value) => {
          });
        };
      });
    }
  }

  // facebooklogi
  socialSignIn(socialPlatform: string) {
    // let socialPlatformProvider;
    // if (socialPlatform == "facebook") {
    //   socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    // } else if (socialPlatform == "google") {
    //   socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    // }

    // this.socialAuthService.signIn(socialPlatformProvider).then(
    //   (userData) => {
    //     console.log(socialPlatform + " sign in data : ", userData);
    //     // Now sign-in with userData
    //     // ...

    //   }
    // );
  }

  prodId;
  quantiy;
  prodSku;
  cartId;
  quantity1;
  // cart items
  itemIncrease(title, data, skuData) {
    this.prodId = data.product_id;
    this.quantiy = skuData.mycart;
    this.quantity1 = this.quantiy + 1;
    this.prodSku = data.product_sku_id;
    this.cartId = data.id;
    this.modifyCart(this.prodId, this.quantity1, this.prodSku, this.cartId);
    for (var i = 0; i < this.viewCart.length; i++) {
      if (title === this.viewCart[i].title) {
        this.viewCart[i].sku[0].mycart = this.viewCart[i].sku[0].mycart + 1;

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
    for (var i = 0; i < this.viewCart.length; i++) {
      if (title === this.viewCart[i].title) {
        if (this.viewCart[i].sku[0].mycart === 1) {
          this.viewCart[i].sku[0].mycart = this.viewCart[i].sku[0].mycart - 1;
          this.deleteCart(data.product_sku_id);
          this.getDashboard();
          this.getCartList();
        } else {
          this.viewCart[i].sku[0].mycart = this.viewCart[i].sku[0].mycart - 1;
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

  //change country
  changeCountry(value) {
    if (value === "IND") {
      this.headerSer.getINDLocations().subscribe(response => {
        this.showLocations = true;
        this.showSubLocations = false;
        this.locationData = response.json().locations;
      });
    } else if (value === 'UAE') {
      this.headerSer.getUAELocations().subscribe(response => {
        this.showLocations = true;
        this.showSubLocations = false;
        this.locationData = response.json().locations;
      });
    }
  }

  //change location
  changeLocation(locationID) {
    this.headerSer.getSubLocations(locationID).subscribe(response => {
      this.showSubLocations = true;
      this.subLocationData = response.json().locations;
    });
  }

  //change sublocation
  changeSubLocation() {
    for (var i = 0; i < this.subLocationData.length; i++) {
      if (this.formData.pincode === this.subLocationData[i].pincode) {
        this.subLocationName = this.subLocationData[i].address;
        this.pincodeOfLocation = this.subLocationData[i].pincode;
      }
    }
  }

  showLocation() {
    this.hideLocations = !this.hideLocations;
  }

  //submit location
  submitLocation(location, pin) {
    localStorage.setItem('location', location);
    localStorage.setItem('pincode', pin);
    this.location = localStorage.location;
    this.LocationPincode = localStorage.pincode;
    this.hideLocations = false;
  }

  //get categories
  getCategories() {
    this.headerSer.getCategories().subscribe(response => {
      this.categories = response.json().result;
    });
  }



  //search products
  searchProducts(param) {
    var prodName = param;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        prodName: prodName
      }
    }
    if (prodName === '') {
      swal("Required field is missing", "", "warning");
    } else {
      this.router.navigate(["/search"], navigationExtras);
    }

  }

  //get categories and subcategories
  getAllCategoriesWithSubCat() {

    this.headerSer.getAllCatAndSubCat().subscribe(response => {
      this.results = response.json().result;
      this.categoriesWithSubCat = this.results.category;
      this.banners = this.results.banner;
    });
  }

  //show categories
  showCat() {
    this.showCategories = !this.showCategories;
    if (this.showCategories === false) {
      this.showSubCats = false;
    }
  }

  goHome() {
    this.showCategories = false;
    this.router.navigate(['/']);
  }
  //show Sub categories
  showSubCat(cId, index) {
    this.showSubCats = true;
    this.selectedCat = index;
    for (var i = 0; i < this.categoriesWithSubCat.length; i++) {
      if (cId === this.categoriesWithSubCat[i].id) {
        this.subCatList = this.categoriesWithSubCat[i].subcategory;
      }
    }
    if (localStorage.token === undefined) {
      var inData = "Session_id =" + localStorage.session
    } else {
      var inData = "token =" + JSON.parse(localStorage.token);
    }
    this.headerSer.showSubCat(inData).subscribe(response => {

    }, error => {

    })
  }


  showSubCatProd(subId, index, name) {
    this.showCategories = false;
    this.showSubCats = false;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        'sId': subId,
        'catName': name
      }
    };
    this.router.navigate(["/categoriesProducts"], navigationExtras)
  }

  getDashboard() {
    this.mainServe.getDashboard().subscribe(response => {
      this.cart = response.json();
      // if(response.json().cart.status === 200 ){
      this.cartCount = response.json().cart.cart_count;
      this.deliveryCharge = response.json().cart.delivery_charge.toFixed(2);
      this.subTotal = response.json().cart.selling_price.toFixed(2);
      this.Total = response.json().cart.grand_total.toFixed(2);
      // }
      // else{

      // }
      // console.log(this.cart);
      // this.errorMessage = response.json().cart.message;
    });
  }
  getCartList() {
    this.mainServe.getCartList();
    // .subscribe(response => {
    //   this.viewCart = response.json().data;
    //   this.summary = response.json().summary;
    //   this.getDashboard();
    //   for (var i = 0; i < this.viewCart.length; i++) {
    //     // if (title === this.viewCart[i].title) {
    //     this.viewCart[i].quantity = this.viewCart[i].sku[0].mycart;
    //     return;
    //     // }
    //   }
    // });
  }
  deleteCart(id) {
    var inData = id;
    swal("Do you want to delete?", "", "warning", {
      buttons: ["Cancel!", "Okay!"],
    }).then((value) => {

      if (value === true) {
        this.mainServe.deleteCart(inData).subscribe(response => {
          this.getCartList();
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
  showCatProd(catId, i, name) {
    this.showCategories = false;
    this.showSubCats = false;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        'catId': catId,
        'catName': name
      }
    };
    this.router.navigate(["/categoriesProducts"], navigationExtras)
  }
}

