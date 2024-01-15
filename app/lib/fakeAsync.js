// for testing skeleton display in <Suspense>
export function fakeAsync(time) {
    return new Promise((resolve) => {
        setTimeout(() => resolve('fake data..'), time)
    })
}