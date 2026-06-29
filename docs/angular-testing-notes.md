# Angular Unit Testing Foundation Notes

This guide is designed for developers who are new to testing Angular applications. It explains the core concepts, tools, and best practices that form a solid unit testing foundation.

---

## 1. Why Unit Tests Are Valuable

Unit tests focus on verifying the smallest testable parts of an application (like a single component method, a form validation rule, or a service request) in isolation.

Key benefits of unit testing:
* **Immediate Feedback**: You can run tests locally in seconds and catch syntax bugs, logic errors, or regressions immediately.
* **Refactoring Confidence**: You can rewrite or clean up internal logic without fear of breaking existing functionality, because the tests act as a safety net.
* **Living Documentation**: Well-written tests describe how code is *intended* to behave under different conditions (Arrange / Act / Assert).
* **Better Architecture**: Code that is hard to test is usually hard to maintain. Designing for testability forces you to write cleaner, modular, and loosely coupled code (e.g., separating UI logic from data-fetching services).

---

## 2. What `TestBed` Does

`TestBed` is Angular's primary utility for configuring and initializing the environment for unit testing. It behaves like a mini, virtual Angular module.

* **Dependency Injection**: It sets up a local dependency injector where we can configure mock providers (like mocking the `Router` or replacing real HTTP calls with testing utilities).
* **Component Compilation**: It handles compiling standalone components, templates, and styles so they can be rendered in the testing DOM environment.
* **Component Fixtures**: Using `TestBed.createComponent(MyComponent)`, we obtain a `ComponentFixture` object. The fixture allows us to interact with the component instance (`fixture.componentInstance`) and inspect the compiled HTML DOM (`fixture.nativeElement`).

---

## 3. How Component Testing Works

Component testing in Angular combines testing the TypeScript class logic with testing the rendered HTML DOM template.

* **Class Instantiation**: We can directly inspect the component's state, signals, variables, and forms (e.g., `expect(component.requestForm.valid).toBe(false)`).
* **Change Detection**: Unlike a running application, the testing environment does not run change detection automatically. We must call `fixture.detectChanges()` to instruct Angular to check for state updates and render changes to the template.
* **User Interactions**: We can simulate user behavior, like clicking buttons or typing in fields, by querying the DOM element (e.g. `compiled.querySelector('button')`) and calling standard DOM API methods or dispatching events (e.g. `button.click()`, `input.dispatchEvent(new Event('input'))`).
* **Inputs (Signal Inputs)**: When testing components with inputs (including modern Signal inputs like `request = input.required<ServiceRequest>()`), we use `fixture.componentRef.setInput('inputName', value)` inside our test to supply test data before triggering change detection.
* **Outputs (Event Emitters)**: When testing custom events emitted by the component (`closeModal = output<void>()`), we subscribe to the output stream directly in our test (e.g., `component.closeModal.subscribe(...)`) and perform assertions when the event is triggered.

---

## 4. How `HttpTestingController` Works

When writing service tests, we want to mock actual network requests so our tests are fast, reliable, and do not rely on a live backend server. Angular provides `HttpTestingController` (from `@angular/common/http/testing`) for this.

* **Request Interception**: By calling `provideHttpClientTesting()`, HTTP calls made by the `HttpClient` are intercepted by a mock backend instead of being sent to the network.
* **Mock Assertions**: We use `httpTestingController.expectOne(url)` or `match(url)` to verify that a specific request was made (e.g., correct URL, HTTP method like `GET` or `POST`, and request payload body).
* **Flushing Mock Data**: We call `.flush(mockData)` on the intercepted request to supply fake JSON responses, which triggers our service's subscription `next` callbacks. We can also simulate network errors by flushing with custom statuses (e.g. `status: 500`).
* **Verifying Slates**: In the `afterEach` hook, we call `httpTestingController.verify()` to ensure there are no unresolved or unexpected requests left open.

---

## 5. Why External Dependencies Are Mocked

Unit tests verify a module in *isolation*. If a component depends on external factors (like the browser's URL routing or network services), we mock them to ensure:

* **Determinism**: Mocks behave exactly the same way every time, removing external issues like server downtime or database connection failures.
* **Speed**: Simulated network responses or routing navigation happen instantaneously in-memory.
* **Focus**: If a component test fails, we know it is because of a bug in the *component's logic*, not because of a bug in a dependent service or router configuration.

Common mocked elements include:
* `Router`: Spied via `vi.fn()` to verify that navigation is requested with correct paths (e.g., `['/requests']`).
* `ActivatedRoute`: Mocked with fake route snapshots and param maps to simulate URL parameters (e.g., retrieving `id: '123'`).

---

## 6. Differences Between Unit, Integration, and End-to-End Tests

| Feature | Unit Tests | Integration Tests | End-to-End (E2E) Tests |
| :--- | :--- | :--- | :--- |
| **Scope** | Single class, method, or form rule in isolation. | Interaction between multiple components/modules (e.g. component + real service). | Entire application flow from the browser to the backend database. |
| **Speed** | Extremely fast (milliseconds). | Fast (seconds). | Slower (runs real browsers, database migrations, server startup). |
| **Mocking** | High (everything external is mocked). | Medium (some boundaries/externals are mocked). | Minimal (tests the live full-stack system). |
| **Confidence** | High confidence in code correctness. | High confidence in component wiring. | Absolute confidence in complete user flows. |
| **Complexity** | Low. | Medium. | High (requires database seeding, orchestrating multiple containers). |
