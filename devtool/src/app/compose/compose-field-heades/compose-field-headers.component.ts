import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

@Component({
	selector: 'app-compose-field-headers',
	templateUrl: './compose-field-headers.component.html',
	styleUrls: ['./compose-field-headers.component.css'],
	encapsulation: ViewEncapsulation.ShadowDom
})
export class ComposeFieldHeadersComponent {
	@Input() fieldSet: FormArray;

	constructor() {
	}

	private addHeaders() {
		this.fieldSet.push(new FormGroup({
			name: new FormControl(''),
			value: new FormControl(''),
		}));
	}

	private removeHeaders(index: number) {
		this.fieldSet.removeAt(index);
	}
}
