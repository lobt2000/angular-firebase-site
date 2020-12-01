import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
import { Blog } from 'src/app/classes/blog.model';
import { IBlog } from 'src/app/interfacecs/blog.interface';
import { BlogService } from 'src/app/service/blog.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {
  adminBlog: Array<IBlog> = [];
  blogID: string;
  blogTitle: string = '';
  blogText: string = '';
  blogAuthor: string = '';
  blogImage = 'https://lh3.googleusercontent.com/proxy/dXC4l3Z9A-PY_SbP8oLfMZZJxWSmpGiT7Z4rLSzvG8ULRC4foVeZ-M4JLyf9XLl8lWmWa_yBZiogQ8rn1U4ailLA89R2b1-tpun0dDPrulr-rFTaEyo4Oae8YA_0';
  editStatus = false;
  uploadPercent: Observable<number>;
  success = true;
  date: string;
  constructor(private blogService: BlogService, 
              private storage: AngularFireStorage,
              private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.getJsonAdminBlog()
  }
  getJsonAdminBlog(): void {
    // this.blogService.getJsonBlogs().subscribe(data => {
    //   this.adminBlog = data;
    // },
    //   err => {
    //     console.log(err);

    //   })
    this.blogService.getAllBlog().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.adminBlog = data;
      this.adminBlog.forEach(elem =>{
        this.storage
      })
    });
  }
  addAdminBlog(): void {
    if (this.blogTitle.length > 0 && this.blogText.length > 0 && this.blogAuthor.length > 0) {
this.date = new Date().toISOString().slice(0, 10)

      const newB = new Blog('', this.blogTitle, this.blogText, this.date , this.blogAuthor, this.blogImage)
      delete newB.id
      // this.blogService.postJsonBlogs(newB).subscribe(() => {
      //   this.getJsonAdminBlog()
      // },
      //   err => {
      //     console.log(err);

        // })
        this.blogService.create(newB)
        .then(() => {
          this.toastr.success('Blog add', 'Successed');
          this.getJsonAdminBlog()
          })
          .catch(err => {
            console.log(err);
            
            this.toastr.error('Blog go wrong', 'Denied');
          });

      this.resetForm();
    }
    else {
      this.resetForm()
    }
  }
  deleteAdminBlog(blog: IBlog): void {
    // this.blogService.deleteJsonBlog(blog).subscribe(() => {
    //   this.getJsonAdminBlog()
    // },
    //   err => {
    //     console.log(err);

    //   })
    this.blogService.delete(blog.id.toString())
    .then(() => {
    this.toastr.success('Blog delete', 'Successed');
    this.getJsonAdminBlog()

    })
    .catch(err => {
      this.toastr.error('Blog go wrong', 'Denied');
    });
  }
  editAdminBlog(b: IBlog): void {
    this.blogID = b.id;
    this.blogAuthor = b.author;
    this.blogText = b.text;
    this.blogTitle = b.title;
    this.editStatus = true;
    this.blogImage = b.image;
  }
  saveAdminBlog(): void {
    this.date = new Date().toISOString().slice(0, 10)
    const saveB = new Blog(this.blogID, this.blogTitle, this.blogText,  this.date, this.blogAuthor, this.blogImage)
    saveB.id = this.blogID;
    // this.blogService.updateJsonBlog(saveB).subscribe(() => {
    //   this.getJsonAdminBlog();
    // },
    //   err => {
    //     console.log(err);

    //   })
    this.blogService.update(saveB.id.toString(), saveB)
    .then(() => {
    this.toastr.success('BLog update', 'Successed');
    this.getJsonAdminBlog()

    })
    .catch(err => {
      this.toastr.error('BLog go wrong', 'Denied');
    });
    this.resetForm();
    this.editStatus = false
  }
  resetForm() {
    this.blogTitle = '';
    this.blogText = '';
    this.blogAuthor = '';
  }
  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = `images/${file.name}`;
    console.log(file, filePath);
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    this.uploadPercent = task.percentageChanges()
    this.uploadPercent.subscribe(data => {
      if (data > 0 || data < 100) {
        this.success = false;
      }
    },
      err => {
        console.log(err);

      })
    task.then(image => {
      this.storage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.blogImage = url;
        this.success = true;
        console.log(this.blogImage);

      });
    });
  }
}
