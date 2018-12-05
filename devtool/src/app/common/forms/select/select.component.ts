import {
	Component,
	ElementRef,
	forwardRef,
	Input,
	OnChanges,
	SimpleChanges,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';


type optionValue = string | number;

interface OptionItem {
	name: string;
	value: optionValue;
}

@Component({
	selector: 'app-form-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.css'],
	encapsulation: ViewEncapsulation.ShadowDom,
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => SelectComponent),
		multi: true,
	}],
})
export class SelectComponent implements ControlValueAccessor, OnChanges {
	@Input() options: OptionItem[];
	@Input() multiple: boolean;
	@Input() placeholder = 'Select';
	@ViewChild('optionsRef') optionsRef: ElementRef;

	expanded = false;
	selectedNames = '';

	constructor() {
	}

	private selectedSet = new WeakSet<OptionItem>();
	private highlightedIndex = -1;

	private onChange: any = () => {
	};
	private onTouched: any = () => {
	};

	ngOnChanges(changes: SimpleChanges) {
		if (changes.options && !changes.options.firstChange) {
			this.updateLabel();
			// TODO update value
		}
	}

	registerOnChange(fn: any) {
		this.onChange = fn;
	}

	registerOnTouched(fn: any) {
		this.onTouched = fn;
	}

	toggleExpand() {
		if (this.expanded) {
			this.collapse();
		} else {
			this.expand();
		}
	}

	expand() {
		this.expanded = true;
		// TODO select expand direction
	}

	collapse() {
		this.expanded = false;
	}

	selectOption(val: optionValue, requireMultiSelect) {
		if (this.multiple && requireMultiSelect) {
			const values = this.options
				.filter(option => {
					if (option.value === val) {
						return !this.selectedSet.has(option);
					}
					return this.selectedSet.has(option);
				})
				.map(option => option.value);
			this.writeValue(values);
		} else if (this.multiple) {
			this.writeValue([val]);
			this.collapse();
		} else {
			this.writeValue(val);
			this.collapse();
		}

		this.onTouched();
	}

	writeValue(val: optionValue | optionValue[]) {
		const options = this.multiple
			? this.options.filter(option => (val as optionValue[]).includes(option.value))
			: [this.options.find(option => option.value === val as optionValue)];

		this.selectedSet = new WeakSet<OptionItem>(options);

		this.onChange(val);
		this.updateLabel();
	}

	updateLabel() {
		const values = this.options
			.filter(option => this.selectedSet.has(option))
			.map(option => option.value);

		this.selectedNames = values.length ? values.join(', ') : null;
	}

	handleNavigation(event: KeyboardEvent) {
		console.log(event.code);
		switch (event.code) {
			case 'Escape':
				// Collapse
				this.collapse();
				break;

			case 'Space':
				// Select single or multi highlighted options if expanded or expand if not yet
				event.preventDefault();
				if (this.expanded) {
					this.selectHighlighted(true);
					if (!this.multiple) {
						this.collapse();
					}
				} else {
					this.expand();
				}
				break;

			case 'Enter':
				// Select single highlighted and collapse if expanded or expand otherwise
				event.preventDefault();
				if (this.expanded) {
					this.selectHighlighted(false);
					this.collapse();
				} else {
					this.expand();
				}
				break;

			case 'ArrowUp':
				event.preventDefault();
				if (this.expanded) {
					this.moveHighlight(-1);
				} else {
					this.expand();
				}
				break;

			case 'ArrowDown':
				event.preventDefault();
				if (this.expanded) {
					this.moveHighlight(+1);
				} else {
					this.expand();
				}
				break;
		}
	}

	private moveHighlight(delta: number) {
		const maxIndex = this.options.length - 1;
		let newIndex = this.highlightedIndex + delta;

		if (newIndex < 0) {
			newIndex = maxIndex;
		} else if (newIndex > maxIndex) {
			newIndex = 0;
		}

		this.highlightedIndex = newIndex;
		console.log(this.highlightedIndex);
	}

	private selectHighlighted(requireMultiSelect: boolean) {
		const option = this.options[this.highlightedIndex];
		if (option) {
			this.selectOption(option.value, requireMultiSelect);
		}
	}
}
