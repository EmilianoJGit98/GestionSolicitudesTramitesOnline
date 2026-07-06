import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hub-pages',
  standalone: true,
  imports: [RouterModule, HeaderComponent],
  templateUrl: './hub-pages.component.html',
  styleUrl: './hub-pages.component.css',
})
export class HubPagesComponent { }
