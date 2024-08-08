import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userProfile: any;

  constructor(private authService: AuthService) { }
  ngOnInit() {
    // const loggedInUser = sessionStorage.getItem("loggedInUser");

    
    // if (loggedInUser) {
    //   this.userProfile = JSON.parse(loggedInUser);
    //   console.log(this.userProfile);
    //   this.authService.loggedIn = true;
      
    // } else {
    //   // Handle the case where loggedInUser doesn't exist
    //   console.log("loggedInUser does not exist in session storage");
    //   // Optionally, you can assign a default value or perform other actions here
    // }
    // console.log("loggedIn: ", this.authService.loggedIn);
  }
  

}
