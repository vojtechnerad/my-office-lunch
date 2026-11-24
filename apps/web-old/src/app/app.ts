import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';

@Component({
  imports: [RouterModule, HlmToasterImports],
  selector: 'mol-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
