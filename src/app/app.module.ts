import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';


import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from './editor/editor.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: 'editor',component: EditorComponent },
      { path: '',   redirectTo: '/editor', pathMatch: 'full' }
 
   ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


