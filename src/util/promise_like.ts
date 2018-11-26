export function promise_like_to_promise<T, E = never>(p: PromiseLike<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    p.then(
      (resolved: T) => resolve(resolved),
      (rejected: E) => reject(rejected),
    )
  })
}

export function promise_to_promise_like<T, E = never>(p: Promise<T>): PromiseLike<T> {
  return p.then(
    (resolved: any) => ({
      then: (onfulfilled, onrejected) => onfulfilled(resolved)
    } as PromiseLike<T>)
  ).catch(
    (rejected: any) => ({
      then: (onfulfilled, onrejected) => onrejected(rejected)
    } as PromiseLike<T>)
  )
}

export function promise_to_promise_like_boolean<T, E = never>(p: Promise<T>): PromiseLike<boolean> {
  return p.then(
    (resolved: any) => ({
      then: (onfulfilled, onrejected) => onfulfilled(true)
    } as PromiseLike<boolean>)
  ).catch(
    (err: E) => ({
      then: (onfulfilled, onrejected) => onrejected(err)
    } as PromiseLike<boolean>)
  )
}
