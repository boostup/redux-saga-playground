// https://redux-saga.js.org/docs/advanced/NonBlockingCalls.html

import { put, select, take, takeEvery } from "redux-saga/effects";
// In the previous section (`loggerSagas.js` file), we saw how the take Effect allows us to better describe a non-trivial flow in a central place.

// Let's complete the example and implement the actual login/logout logic. Suppose we have an API which permits us to authorize the user on a remote server. If the authorization is successful, the server will return an authorization token which will be stored by our application using DOM storage (assume our API provides another service for DOM storage).

// When the user logs out, we'll delete the authorization token stored previously.

// eslint-disable-next-line
function* loginFlow() {
  while (true) {
    yield take("LOGIN");
    // ... perform the login logic
    yield take("LOGOUT");
    // ... perform the logout logic
  }
}
