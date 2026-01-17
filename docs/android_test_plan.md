# Android JUnit Test Plan

## Scope
- Validate the Android shell app launches and the primary interactive surface is responsive.
- Ensure Gradle tasks compile and run instrumentation tests in CI.

## Dependencies
- AndroidX Test: `androidx.test.ext:junit`
- Espresso: `androidx.test.espresso:espresso-core`
- Kotlin test support for Espresso test source set

## Targeted Gradle Tasks
- `./gradlew :app:assembleDebug`
- `./gradlew :app:connectedDebugAndroidTest`

## Test Cases
1. **App Launch Sanity**
   - Launch `MainActivity` using `ActivityScenario`.
   - Assert the main WebView is visible.
2. **Primary Surface Clickability**
   - Perform a click on the main WebView to confirm the UI layer receives input.
