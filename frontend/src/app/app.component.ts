import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DashbordComponent} from "./Agent/dashbord/dashbord.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,DashbordComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ebanking';
}
