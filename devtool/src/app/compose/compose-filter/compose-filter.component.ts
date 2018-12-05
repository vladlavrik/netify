import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FormGroup} from '@angular/forms';
import requestMethods from '../../../constants/RequestMethods';
import requestTypes from '../../../constants/RequestTypes';


@Component({
	selector: 'app-compose-filter',
	templateUrl: './compose-filter.component.html',
	styleUrls: ['./compose-filter.component.css'],
	encapsulation: ViewEncapsulation.ShadowDom
})
export class ComposeFilterComponent {

	@Input() fieldSet: FormGroup;

	requestMethods = requestMethods.map(item => ({
		name: item,
		value: item,
	}));

	requestTypes = requestTypes.map(item => ({
		name: item,
		value: item,
	}));

	constructor() {
	}
}
