import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { EspaceagentService } from "../../services/espaceagent.service";
import { NavbarComponent } from "@shared/components/navbar/navbar.component";
import { FooterComponent } from "@shared/components/footer/footer.component";
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'enrolement-form',
  standalone: true,
  templateUrl: './enrolement.component.html',
  styleUrls: ['./enrolement.component.css'],
  imports: [
    NavbarComponent,
    FooterComponent,
    CommonModule,
    ReactiveFormsModule
  ],
})
export class EnrolementComponent implements OnInit {
  enrolForm!: FormGroup;
  submitted = false;
  step = 1;

  constructor(
      private fb: FormBuilder,
      private agentservice: EspaceagentService
  ) {}

  ngOnInit(): void {
    this.enrolForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      genre: ['', Validators.required],
      numTel: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      nationalite: ['', Validators.required],
      adresse: ['', Validators.required],
      cin: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      //typeCompte: ['', Validators.required],
      //devise: ['', Validators.required],
      //plafond: ['', [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
      twoFactorEnabled: [false],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  get f() {
    return this.enrolForm.controls;
  }

  nextStep() {
    // Validate step 1 controls only before proceeding to step 2
    if (this.step === 1) {
      // Validate step 1 field manually
      const step1Controls = ['nom', 'prenom', 'dateNaissance', 'genre', 'numTel', 'nationalite', 'adresse', 'cin'];
      let step1Valid = true;
      step1Controls.forEach(control => {
        this.f[control].markAsTouched();
        if (this.f[control].invalid) step1Valid = false;
      });

      if (!step1Valid) return;

      this.step++;
    }
  }

  previousStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  submitForm() {
    this.submitted = true;

    if (this.enrolForm.invalid) {
      console.log(this.enrolForm.errors); // pour debug
      return;
    }



    const { email, password, confirmPassword, twoFactorEnabled, ...clientData } = this.enrolForm.value;

    const formData = {
      ...clientData,
      user: {
        email,
        motDePasse: password,
        twoFactorEnabled: twoFactorEnabled
      }
    };

    console.log("Données envoyées :", JSON.stringify(formData, null, 2));


    this.agentservice.createClient(formData).subscribe({
      next: (res) => console.log('Client ajouté avec succès:', res),
      error: (err) => {
        console.error('Détails de l’erreur :', err);
        let msg = "Une erreur est survenue.";
        if (err.status === 400) {
          msg = "Veuillez vérifier les champs du formulaire.";
        } else if (err.status === 409) {
          msg = "Un client avec cet email ou CIN existe déjà.";
        } else if (err.status === 500) {
          msg = "Erreur serveur. Réessayez plus tard.";
        }
        alert(msg);
      }
    });
  }

}
