//Trying this out: https://redux-saga.js.org/docs/advanced/FutureActions.html
import { put, select, take, takeEvery } from "redux-saga/effects";

//This saga is provided the action
export function* watchAndLogWithProvidedAction() {
  yield takeEvery("*", function* logger(action) {
    const state = yield select();
    console.log("action", action);
    console.log("state after", state);
  });
}

//Whereas this saga is pulling it. This inversion of control allows us to implement control flows that are non-trivial to do with the traditional push approach.
export function* watchAndLogWithPulledAction() {
  while (true) {
    const action = yield take("*");
    const state = yield select();

    console.log("action", action);
    console.log("state after", state);
  }
}

// As a basic example, suppose that in our Todo application, we want to watch user actions and show a congratulation message after the user has created their first three todos.
export function* watchFirstThreeIncrements() {
  for (let i = 0; i < 3; i++) {
    const action = yield take("INCREMENT");
    console.log("Saga: watchFirstThreeIncrements", action);
  }
  yield put({ type: "SHOW_CONGRATS" });
}

// Another benefit of the pull approach is that we can describe our control flow using a familiar synchronous style. For example, suppose we want to implement a login flow with two actions: LOGIN and LOGOUT. Using takeEvery (or redux-thunk), we'll have to write two separate tasks (or thunks): one for LOGIN and the other for LOGOUT.

// The result is that our logic is now spread in two places. In order for someone reading our code to understand it, they would have to read the source of the two handlers and make the link between the logic in both in their head. In other words, it means they would have to rebuild the model of the flow in their head by rearranging mentally the logic placed in various places of the code in the correct order.

// Using the pull model, we can write our flow in the same place instead of handling the same action repeatedly.

// Let's now go into `loginFlowSagas.js` to implement the `loginFlow` sagas
