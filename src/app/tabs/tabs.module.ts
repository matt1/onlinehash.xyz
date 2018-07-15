import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';

import { TabsComponent } from './tabs.component';

@NgModule({
  declarations: [
    TabsComponent
  ],
  exports: [TabsComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
  ],
  providers: [],
})
export class TabsModule { }
