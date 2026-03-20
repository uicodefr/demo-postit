import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

export const SHARED_MATERIAL = [MatButtonModule, MatIconModule];

export const SHARED_FORM = [FormsModule];

export const SHARED_COMMON = [CommonModule];

export const SHARED_ROUTER = [RouterLink, RouterLinkActive];
