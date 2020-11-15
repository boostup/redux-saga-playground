import { all } from "redux-saga/effects";

import { helloSaga, watchIncrementAsync } from "./todoSagas";
import {
  watchAndLogWithProvidedAction,
  watchFirstThreeIncrements,
} from "./loggerSagas";

// export a single entry point to start all Sagas at once.
export default function* rootSaga() {
  yield all([
    //
    helloSaga(),
    watchAndLogWithProvidedAction(),
    watchIncrementAsync(),
    watchFirstThreeIncrements(),
  ]);
}
