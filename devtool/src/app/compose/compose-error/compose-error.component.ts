import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormGroup} from '@angular/forms';

import errorReasons from '../../../constants/ErrorReasons';

@Component({
  selector: 'app-compose-error',
  templateUrl: './compose-error.component.html',
  styleUrls: ['./compose-error.component.css'],
	encapsulation: ViewEncapsulation.ShadowDom
})
export class ComposeErrorComponent implements OnInit {

	@Input() fieldSet: FormGroup;

	errorReasons = errorReasons;

	constructor() { }

  ngOnInit() {
  }

}
