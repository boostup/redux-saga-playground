import { put, takeEvery, call } from "redux-saga/effects";

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export function* helloSaga() {
  yield console.log("Hello Saga");
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
