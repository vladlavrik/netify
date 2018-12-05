import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
	selector: 'app-compose-response',
	templateUrl: './compose-response.component.html',
	styleUrls: ['./compose-response.component.css'],
	encapsulation: ViewEncapsulation.ShadowDom
})
export class ComposeResponseComponent {

	@Input() fieldSet: FormGroup;

	constructor() {
	}
}
