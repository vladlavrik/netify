import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.css'],
	encapsulation: ViewEncapsulation.ShadowDom
})
export class ComposeComponent implements OnInit {

	form = new FormGroup({
			filter: new FormGroup({
				url: new FormControl(''),
				requestTypes: new FormControl([]),
				methods: new FormControl([]),
			}),
			request: new FormGroup({
				enabled: new FormControl(false),
				endpointUrl: new FormControl('', [Validators.required]),
				headers: new FormArray([
					new FormGroup({
						name: new FormControl(''),
						value: new FormControl(''),
					})
				]),
				body: new FormGroup({
					type: new FormControl(''),
					content: new FormControl(''),
				}),
			}),
			response: new FormGroup({
				enabled: new FormControl(false),
				locally: new FormControl(false),
				status: new FormControl('', [Validators.min(100), Validators.max(599)]),
				headers: new FormArray([
					new FormGroup({
						name: new FormControl(''),
						value: new FormControl(''),
					})
				]),
				body: new FormGroup({
					type: new FormControl(''),
					content: new FormControl(''),
				}),
			}),
			error:  new FormGroup({
				enabled: new FormControl(false),
				reason: new FormControl(null),
			}),
		},
		v => {
			// console.log(v);
			// if (value.length > 2) {
			return null;
			// }
			// return {'v': 'Foo'};
		},
	);

  constructor() { }

	OnInit() {}

	onSave() {
		console.log('save', this.form.valid, this.form.value);
	}

}
