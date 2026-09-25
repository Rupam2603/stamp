import { authClient } from "./lib/auth/client";
console.log(Object.keys(authClient));
console.log(Object.keys(authClient.signIn || {}));
console.log(Object.keys(authClient.signUp || {}));
