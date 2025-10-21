// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface PageData{
			id: number;
			user:string;
		}
			interface User {
			username: string;
			token: string;
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Locals {
			user?: { id: string; name: string };
		}
	}
}

export {PageLoad};
