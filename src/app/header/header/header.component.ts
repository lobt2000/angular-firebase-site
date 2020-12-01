import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { type } from 'os';
import { element } from 'protractor';
import { ICategory } from 'src/app/interfacecs/category.interface';
import { IProduct } from 'src/app/interfacecs/product.interface';
import { AuthService } from 'src/app/service/auth.service';
import { CategoriesService } from 'src/app/service/categories.service';
import { OrderService } from 'src/app/service/order.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  basket: Array<IProduct> = [];
  category: Array<ICategory> = [];
  totalPrice = 0;
  out: boolean;
  localUser;
  up = false;
  modalRef: BsModalRef;
  inputEmail: string;
  inputPassword: string;
  inputStreet: string;
  userSName: string;
  userFName: string;
  inputCity: string;
  inputState: string;
  inputZip: string;
  userEmail: string;
  userPassword: string;
  admin = false;
  constructor(private orderService: OrderService,
    private catService: CategoriesService,
    private modalService: BsModalService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.checkMyBasket();
    this.getLocalProd();
    this.getCategories();
    this.checkLocalUser();
    this.checkUserLogin();
  }

  private checkUserLogin(): void {
    this.authService.checkSign.subscribe((data) => {
      if (typeof data === 'string') {
        if (data == 'user') {
          this.out = true;
          this.up = true;
          console.log(data);
          this.toastr.success('Hello user!', 'Success');

        }
        else if (data == 'admin') {
          this.admin = true
          this.out = true;
          console.log(data);
          this.up = false
          this.toastr.success('Hello admin!', 'Success');

        }
      }
      else {
        this.out = data
        this.up = data
        this.admin = data
        console.log(data);
        this.toastr.error('You write invalid data!', 'Denied');

      }
      this.checkLocalUser();
    })
  }
  private checkLocalUser(): void {

    if (localStorage.getItem('user')) {
      console.log();
      if (JSON.parse(localStorage.getItem('user')).role == 'user') {
        this.out = true;
        this.up = true;
        // this.toastr.success('Hello user!', 'Success');

      }
      else {
        this.admin = true
        this.out = true;
        this.up = true;
        // this.toastr.success('Hello admin!', 'Success');

      }

    }
    else {
      this.out = false
      this.up = false
      this.admin = false
      // this.toastr.error('You write invalid data!', 'Denied');
    }
  }


  private getCategories(): void {
    this.catService.getJsonCategory().subscribe(data => {
      this.category = data


    })
  }
  private checkMyBasket(): void {
    this.orderService.basket.subscribe(
      data => {
        this.basket = data;
        this.totalPrice = this.getTotal(this.basket)
      }
    )
  }
  private getLocalProd(): void {
    if (localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket'));
      this.totalPrice = this.getTotal(this.basket)
    }
  }
  private getTotal(prod: Array<IProduct>): number {
    return prod.reduce((total, prod) => total + (prod.price * prod.count), 0);
  }
  signModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg modal-dialog-centered' })
    );
  }
  signInModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-sm' })
    );
  }

  signUP(): void {


    if (this.inputEmail && this.inputPassword && this.inputStreet && this.userSName && this.userFName && this.inputCity && this.inputState && this.inputZip) {
      this.authService.signUp(this.inputEmail, this.inputPassword, this.inputStreet, this.userFName, this.userSName, this.inputCity, this.inputState, this.inputZip)
      this.authService.checkSign.subscribe((data) => {

        if (data == 'user') {
          this.out = true;
          this.up = true;
          console.log(data);
          this.toastr.success('You log success!', 'Success');

        }
        else {
          this.out = data
          this.up = data
          this.admin = data
          console.log(data);
          this.toastr.error('You write invalid data!', 'Denied');

        }
      })
      this.resetForm();
    }
    else {
      this.up = false;
      this.resetForm();
      this.toastr.error('You write invalid data!', 'Denied');
    }
  }
  signIN(): void {
    if (this.userEmail && this.userPassword) {
      this.authService.signIn(this.userEmail, this.userPassword)
      if (localStorage.getItem('user')) {
        console.log(this.localUser);

        if (JSON.parse(localStorage.getItem('user')) == 'admin') {
          this.admin = true
          this.out = true;
          this.resetForm()
          this.toastr.success('You log as admin!', 'Hello admin');
        }
        else {
          this.up = true;
          this.out = true;
          this.resetForm();
          this.toastr.success('You log as user!', 'Hello user');
        }
      }
      else {
        this.admin = false;
        this.out = false;
        this.up = false;
        this.resetForm();
        // this.toastr.error('You write invalid data!', 'Denied');

      }

    }
    else {
      this.toastr.error('You write invalid data!', 'Denied');
      this.resetForm();
    }
  }
  signOUT(): void {
    this.authService.signOut();
    this.out = false;
    this.up = false;
    this.admin = false;
    this.resetForm();
    this.toastr.success('You sign out!', 'GoodBye');

  }
  resetForm(): void {
    this.inputEmail = '';
    this.inputPassword = '';
    this.inputStreet = '';
    this.userFName = '';
    this.userSName = '';
    this.inputCity = '';
    this.inputState = '';
    this.inputZip = '';
    this.userEmail = '';
    this.userPassword = '';
  }

  openDel(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-sm modal-dialog-centered ' }));
  }


}
