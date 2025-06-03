import { Component, OnInit } from '@angular/core';
import {NavbarComponent} from "@shared/components/navbar/navbar.component";
import {FooterComponent} from "@shared/components/footer/footer.component";
import {NgFor} from "@angular/common";

@Component({
  selector: 'app-enrolement',
  templateUrl: './enrolement.component.html',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
  ],
  styleUrls: ['./enrolement.component.css']
})
export class EnrolementComponent implements OnInit {
  ngOnInit(): void {
    const accountSection = document.getElementById('accountDetailsValidation')!;
    const personalSection = document.getElementById('personalInfoValidation')!;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary mt-4';
    nextBtn.textContent = 'Next';
    accountSection.appendChild(nextBtn);

    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn-secondary mt-4 me-2';
    prevBtn.textContent = 'Previous';

    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn-success mt-4';
    submitBtn.textContent = 'Submit';

    personalSection.style.display = 'none';

    nextBtn.addEventListener('click', () => {
      accountSection.style.display = 'none';
      personalSection.style.display = 'block';

      if (!personalSection.contains(prevBtn)) {
        personalSection.appendChild(prevBtn);
        personalSection.appendChild(submitBtn);
      }

      document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.step')[1].classList.add('active');
    });

    prevBtn.addEventListener('click', () => {
      personalSection.style.display = 'none';
      accountSection.style.display = 'block';

      document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.step')[0].classList.add('active');
    });

    submitBtn.addEventListener('click', () => {
      alert('Form submitted!');
    });
  }
}
