import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../api.service';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,CommonModule,MatToolbarModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  username:any;
  constructor(private route: ActivatedRoute,public service: ApiService,private cd: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.Dashoninit();
  }
  Dashoninit(){
    this.service.getUserName().subscribe(user => {
      if (user != null) {
        let u = user as any;
        this.username= u.d.Title;
    }
      else {
        swal('','Please Contact Admin for the access','info');
        //this.router.navigate(['/error/unauthorised']);
      }
      //this.userDetails = d;
    });
  }
}
