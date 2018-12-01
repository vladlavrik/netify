import BaseUIElement from './devtool-ui/helpers/BaseUIElement.js'

type state = {
	user: {
		name: {
			firstName: string|null,
			lastName: string|null,
		},
		age: number,
	},
	shown: boolean,
}

class TestComponent extends BaseUIElement<state> {
	static template = BaseUIElement.htmlToTemplate(`
		<div $if="shown">
			<p>{user.name.firstName} {user.name.lastName}</p>
			<p>{user.age}</p>
		</div>
	`);

	get defaultState() {
		return {
			user: {
				name: {
					firstName: 'vlad',
					lastName: null,
				},
				age: 21,
			},
			shown: true,
		};
	}

	constructor(){
		super();
		this.render();
		setTimeout(() => {
			this.state.user.name.firstName = 'vasya';
		}, 500);
		setTimeout(() => {
			this.state.user.name = {firstName: 'petya', lastName: null};
		}, 1500);
		setTimeout(() => {
			this.state.user = {age: 22, name: {firstName: 'petya', lastName: null}};
		}, 2500);
	}
}

customElements.define('test-component', TestComponent);
