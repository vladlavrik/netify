import {Component, forwardRef, Input, ViewEncapsulation} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
	selector: 'app-form-radio',
	templateUrl: './radio.component.html',
	styleUrls: ['./radio.component.css'],
	encapsulation: ViewEncapsulation.ShadowDom,
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => RadioComponent),
		multi: true,
	}],
})
export class RadioComponent implements ControlValueAccessor {
	@Input() private value: any;
	@Input() private formControl: FormControl;

	private checked: boolean;

	private onChange: any = () => {};

	private onTouched: any = () => {};

	registerOnChange(fn: any) {
		this.onChange = fn;
	}

	registerOnTouched(fn: any) {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean) {
	}

	onInputChange(checked: boolean) {
		if (checked) {
			this.formControl.setValue(this.value); // as workaround, instead using "this.writeValue"
			this.onTouched();
		}
	}

	writeValue(val: any) {
		const checked = val === this.value;

		if (checked !== this.checked) {
			this.onChange(val);
		}
		this.checked = checked;
	}
}
