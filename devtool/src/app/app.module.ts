import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ComposeComponent } from './compose/compose/compose.component';
import { ComposeFieldHeaders } from './compose/compose-field-heades/compose-field-headers.component';
import { ComposeFieldBody } from './compose/compose-field-body/compose-field-body.component';
import { ComposeFilterComponent } from './compose/compose-filter/compose-filter.component';
import { ComposeRequestComponent } from './compose/compose-request/compose-request.component';
import { ComposeResponseComponent } from './compose/compose-response/compose-response.component';
import { ComposeErrorComponent } from './compose/compose-error/compose-error.component';

@NgModule({
  declarations: [
    AppComponent,
    ComposeComponent,
		ComposeFieldHeaders,
		ComposeFieldBody,
    ComposeFilterComponent,
		ComposeRequestComponent,
    ComposeResponseComponent,
		ComposeErrorComponent
  ],
  imports: [
    BrowserModule,
		FormsModule,
		ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
