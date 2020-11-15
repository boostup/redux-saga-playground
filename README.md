# redux-saga-beginner-tutorial

Companion Repo for [Redux/Redux-saga beginner tutorial](https://github.com/redux-saga/redux-saga/blob/master/docs/introduction/BeginnerTutorial.md)

# Note taken while doing tutorial

## Introduction

https://redux-saga.js.org/docs/introduction/BeginnerTutorial.html

### Sagas

- **Sagas** are implemented as generator functions that yield objects to the redux-saga middleware.
- The **yielded objects** are a kind of instruction to be interpreted by the middleware
- When a promise is yielded, the middleware will suspend the Saga untile the Promise completes
- Once the Promise is resolved, the middleware resumes the Saga, executing code untile the next yield

### Effects

- `put` (as in `put({type: "INCREMENT"})`) is an Effect in the saga jargon
- **Effects** are plain JS objects which contain instructions to be fulfilled by the middleware
- When a middleware retrieves an Effect yielded by a Saga, the Saga is paused until the Effect is fulfilled

### Listeners

`takeEvery`, `takeLatest` etc, are helper functions provided by `redux-saga` to listen for dispatched actions, ie:

```
//listens for dispatched `INCREMENT_ASYNC` actions and run `incrementAsync` each time
export function* watchIncrementAsync() {
  yield takeEvery("INCREMENT_ASYNC", incrementAsync);
}

```

```
// export a single entry point to start all Sagas at once.  this is an array with the results of calling the sagas. this means the each (2 in this case, because there are 2 sagas) of the resulting Generators will be started in parallel
export default function* rootSaga() {
  yield all([
    //
    helloSaga(),
    watchIncrementAsync(),
  ]);
}
```

### Iterator objects

`incrementAsync` is a generator function. When run, it returns an iterator object, and the iterator's `next` method returns an object with the following shape:

```
gen.next() // => {done: boolean, value: any}
```

- The `value` field contains the yielded expression, meaning the result of the expression after the yield.
- The `done` field indicates if the generator has terminated or if there are still more 'yield' expressions.

In the case of `incrementAsync`, the generator yields 2 values consecutively :

1. `yield delay(1000)`
2. `yield put({type: "INCREMENT"})`

So, invoking the `next` method 3 times provides the following results:

```
gen.next() // => {done: false, value: <result of calling `delay(1000)`>}

gen.next() // => {done: false, value: <result of calling `put({type: "INCREMENT"})`>}

gen.next() // => {done: true, value: undefined}

```

### Testing the saga

The problen is that `yield delay(1000)` does not yield a normal value, meaning, we can't do a simple equality test on Promises, which is what delay returns.

#### `call` to the rescue

`redux-saga` provides a way to make this possible. Instead of calling `delay(1000)` directly inside `incrementAsync`, we'll call it _indirectly_ and export it to make a subsequent deep comparison possible by changing this `yield delay(1000)` to `yield call(delay, 1000)`.

So the new `incrementAsync` function is:

```
export function* incrementAsync() {
  // use the call Effect
  yield call(delay, 1000)
  yield put({ type: 'INCREMENT' })
}
```

- So when the caller (the middleware or the test runner) iterates over this generator function, it no longer gets a _Promise_, but and _Effect_.

- This Effect is an instructions for the caller to call a given function with the given arguments.

- Effect like `put` and `call` do NOT perform any dispatch or async cal themselves; instead, they return plain JS objects :

```
put({type: "INCREMENT"}) // => {PUT: {type: "INCREMENT"}}

call(delay, 1000) // => {CALL: {fn: delay, args: [1000]}}
```

The called examines the type of each yielded Effect to decide how to fulfill each one of them :

- if the Effect type is a `PUT` => it dispatches an action to the redux Store.
- if the Effect type is a `CALL` => it calls the given function

**The separation between _Effect creation_ and _Effect execution_ makes it possible to test our Generator in a surprisingly easy way ** (see the `sagas.spec.js` file) :

- Since `put` and `call` return plain objects, we can reuse the same functions in our test code. And to test the logic of `incrementAsync`, we iterate over the generator and do `deepEqual` tests on its values.

- `npm test` to run the tests

## Basic concepts

https://redux-saga.js.org/docs/basics/UsingSagaHelpers.html

Take an example of pressing a button which dispatches a "FETCH_REQUESTED" action to fetch some async data.

```
import { call, put } from 'redux-saga/effects'

export function* fetchData(action) {
   try {
      const data = yield call(Api.fetchUser, action.payload.url)
      yield put({type: "FETCH_SUCCEEDED", data})
   } catch (error) {
      yield put({type: "FETCH_FAILED", error})
   }
}
```

Using Effects below, tasks are launched using the `fetchData` generator function.

```
import { takeEvery } from 'redux-saga/effects'

function* watchFetchData() {
  yield takeEvery('FETCH_REQUESTED', fetchData)
}
```

**`takeEvery` Effect**

- allows multiple instances to be started concurrently
- at any given moment, we can start a new task while there are still one or more previous task which have NOT yet terminated

**`takeLatest` Effect**

- allows only the one task to run at any moment, the latest one
- any previous tasks still running when a new task emerges is automatically cancelled

### Declarative Effects

- Sagas are implemented using Generator functions.
- To express the Saga logic. we yield plain JS objects from the Generator.
- We call those objects **Effects**
- An Effect is an object that contains information to be interpreted by the middleware.
- Effects are like instructions for the middleware to perform some operation like invoke some async function or dispatch an action to the store, etc
- To create Effects, functions are provided by the package `redux-saga/effects`

**`call` Effect**
Useful so that instead of getting a Promise back from an API call for example, we get a plain JS object representing the instruction, in this example, an object describing the function call to be performed by the middleware. [see the `Testing the saga` section above for details on this]

```
import { call } from 'redux-saga/effects'
import Api from '...'

const iterator = fetchProducts()

// expects a call instruction
assert.deepEqual(
  iterator.next().value,
  call(Api.fetch, '/products'),
  "fetchProducts should yield an Effect call(Api.fetch, './products')"
)
```

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
