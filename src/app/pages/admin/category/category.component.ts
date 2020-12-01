import { Component, OnInit, TemplateRef } from '@angular/core';
import { ICategory } from 'src/app/interfacecs/category.interface';
import { CategoriesService } from 'src/app/service/categories.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Category } from 'src/app/classes/category.model';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  category: Array<ICategory> = [];
  categoryID: number | string;
  categoryName: string = '';
  editStatus = false;
  modalRef: BsModalRef;
  check = true;
  searchName: string;
  constructor(private catService: CategoriesService,
              private storage: AngularFireStorage,
              private modalService: BsModalService,
              private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.getCategory()
  }
  getCategory(): void {
    // this.catService.getJsonCategory().subscribe(data => {
    //   this.category = data;
    // },
    //   err => {
    //     console.log(err);

    //   })
    this.catService.getAllCat().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.category = data;
    });
  }
  addCategory(): void {
    console.log(this.categoryName);

    if (this.categoryName.length > 0) {

      const newC = new Category(1, this.categoryName)
      delete newC.id
      // this.catService.postJsonCategory(newC).subscribe(() => {    
      //   this.getCategory()
      // },
      //   err => {
          console.log(newC);

      //   })
      this.catService.create(newC)
      .then(() => {
        this.toastr.success('Category add', 'Successed');
    this.getCategory()

        })
        .catch(err => {
          this.toastr.error('Something go wrong', 'Denied');
        });
      this.resetForm();
    }
    else {

      this.resetForm()
    }
  }
  deleteCategory(category: ICategory): void {
    // this.catService.deleteJsonCategory(category).subscribe(() => {
    //   this.getCategory()
    // },
    //   err => {
    //     console.log(err);

    //   })
  
    this.catService.delete(category.id.toString())
      .then(() => {
      this.toastr.success('Category delete', 'Successed');
    this.getCategory()

      })
      .catch(err => {
        this.toastr.error('Something go wrong', 'Denied');
      });
  }
  editCategory(cat: ICategory): void {
    this.categoryID = cat.id;
    this.categoryName = cat.name;
    this.editStatus = true;

  }
  saveCategory(): void {
    const saveC = new Category(this.categoryID, this.categoryName)
    saveC.id = this.categoryID;
    // this.catService.updateJsonCategory(saveC).subscribe(() => {
    //   this.getCategory();

    // },
    //   err => {
    //     console.log(err);

    //   })
    this.catService.update(saveC.id.toString(), saveC)
    .then(() => {
    this.toastr.success('Category update', 'Successed');
    this.getCategory()
    })
    .catch(err => {
      console.log(err);
      
      this.toastr.error('Something go wrong', 'Denied');
    });
    this.resetForm();
    this.editStatus = false
  }
  resetForm() {
    this.categoryName = '';
  }
  openAdd(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-dialog-centered ' }));
  }
  openDel(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-sm modal-dialog-centered ' }));
  }
  change(): void {
    if (this.categoryName.length > 0) {
      this.check = false
    }
    else {
      this.check = true
    }

  }
}
