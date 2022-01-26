import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProviderService } from '@dot-wod/api';
import { AlertController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'dot-wod-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  credentials!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private provider: ProviderService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  async showError(title: string, msg: string) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.provider.signIn(this.credentials?.value).then(async data => {
      await loading.dismiss();
      this.router.navigateByUrl('/tabs/options', { replaceUrl: true });
    }, 
    async err => {
      await loading.dismiss();
      this.showError('Sign In failed', err.message);
    });
  }

  async signUp() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.provider.signUp(this.credentials?.value).then(async data => {
      await loading.dismiss();
      this.showError('Sign Up was Successful', 'Please confirm your email now!');
    },
    async err => {
      await loading.dismiss();
      this.showError('Registration failed', err.message);
    }
    )
  }

}
