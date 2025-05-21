import {Component, inject, OnInit} from '@angular/core';
import {NavbarComponent} from "@shared/components/navbar/navbar.component";
import {FooterComponent} from "@shared/components/footer/footer.component";
import {EspaceagentService} from "../../services/espaceagent.service";
import {NgFor} from "@angular/common";


@Component({
  selector: 'app-dashbord',
  standalone: true,
    imports: [
        NavbarComponent,
         FooterComponent,
         NgFor
    ],
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.css'
})
export class DashbordComponent implements OnInit {
  clients: any[]=[];
  clientservice = inject(EspaceagentService)
  ngOnInit(): void {
    console.log("calling ngOnInit")
    console.log(this.clientservice.getAllClients().subscribe(client => {this.clients = client}));
    console.log(this.clients);
  }
  formatDate(dateArray: number[]): string {
    if (!dateArray || dateArray.length < 3) return '';
    const [year, month, day, hour = 0, minute = 0] = dateArray;
    return `${year}-${this.pad(month)}-${this.pad(day)} ${this.pad(hour)}:${this.pad(minute)}:00`;
  }

  pad(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }

}
