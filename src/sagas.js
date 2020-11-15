import { put, take, takeEvery, all, call } from "redux-saga/effects";

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export function* helloSaga() {
  yield console.log("Hello Saga");
}

//Trying this out: https://redux-saga.js.org/docs/advanced/FutureActions.html
export function* watchFirstThreeIncrements() {
  for (let i = 0; i < 3; i++) {
    const action = yield take("INCREMENT");
    console.log(action);
  }
  yield put({ type: "SHOW_CONGRATS" });
}

//Our worker Saga : will perform the async increment task
export function* incrementAsync() {
  // use the call Effect
  yield call(delay, 1000);
  yield put({ type: "INCREMENT" });
}

//Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export function* watchIncrementAsync() {
  yield takeEvery("INCREMENT_ASYNC", incrementAsync);
}

// export a single entry point to start all Sagas at once.
export default function* rootSaga() {
  yield all([
    //
    helloSaga(),
    watchIncrementAsync(),
    watchFirstThreeIncrements(),
  ]);
}
