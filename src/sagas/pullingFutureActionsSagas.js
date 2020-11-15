import { put, take } from "redux-saga/effects";

//Trying this out: https://redux-saga.js.org/docs/advanced/FutureActions.html
export function* watchFirstThreeIncrements() {
  for (let i = 0; i < 3; i++) {
    const action = yield take("INCREMENT");
    console.log(action);
  }
  yield put({ type: "SHOW_CONGRATS" });
}
