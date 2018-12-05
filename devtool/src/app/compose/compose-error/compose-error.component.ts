import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FormGroup} from '@angular/forms';

import errorReasons from '../../../constants/ErrorReasons';

@Component({
	selector: 'app-compose-error',
	templateUrl: './compose-error.component.html',
	styleUrls: ['./compose-error.component.css'],
	encapsulation: ViewEncapsulation.ShadowDom
})
export class ComposeErrorComponent {

	@Input() fieldSet: FormGroup;

	errorReasons = errorReasons;

	constructor() {
	}
}
