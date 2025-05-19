import { userPool } from "./cognitoConfig";

export function signOutUser() {
  const currentUser = userPool.getCurrentUser();
  if (currentUser) {
    currentUser.signOut();
  }
}
