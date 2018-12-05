import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {ComposeComponent} from './compose/compose/compose.component';
import {ComposeFieldHeadersComponent} from './compose/compose-field-heades/compose-field-headers.component';
import {ComposeFieldBodyComponent} from './compose/compose-field-body/compose-field-body.component';
import {ComposeFilterComponent} from './compose/compose-filter/compose-filter.component';
import {ComposeRequestComponent} from './compose/compose-request/compose-request.component';
import {ComposeResponseComponent} from './compose/compose-response/compose-response.component';
import {ComposeErrorComponent} from './compose/compose-error/compose-error.component';
import {RadioComponent} from './common/forms/radio/radio.component';
import {SelectComponent} from './common/forms/select/select.component';

@NgModule({
	declarations: [
		AppComponent,
		ComposeComponent,
		ComposeFieldHeadersComponent,
		ComposeFieldBodyComponent,
		ComposeFilterComponent,
		ComposeRequestComponent,
		ComposeResponseComponent,
		ComposeErrorComponent,
		RadioComponent,
		SelectComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
