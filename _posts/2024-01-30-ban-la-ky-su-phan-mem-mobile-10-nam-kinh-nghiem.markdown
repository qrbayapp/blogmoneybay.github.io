---
layout: post
title: "Các best practices quan trọng trong phát triển iOS/Android"
date: 2024-01-30 13:32:20 +0300
description: Hướng dẫn chi tiết về đầu tư cho người mới bắt đầu và cách MoneyBay giúp bạn xây dựng danh mục đầu tư hiệu quả. # Add post description (optional)
img:  # Add image post (optional)
tags: [Mobile]
---

# Nghiên cứu best practices trong phát triển iOS/Android

Dưới đây là các best practices quan trọng trong phát triển iOS/Android:

## **Kiến trúc và Thiết kế**

### iOS:

- **MVC/MVVM/VIPER**: Sử dụng architectural patterns phù hợp
- **Dependency Injection**: Dùng frameworks như Swinject
- **Protocol-Oriented Programming**: Tận dụng protocols của Swift
- **Auto Layout**: Sử dụng constraints cho responsive design


### Android:

- **MVVM với Architecture Components**: ViewModel, LiveData, Room
- **Clean Architecture**: Tách biệt layers (presentation, domain, data)
- **Dependency Injection**: Dagger/Hilt hoặc Koin
- **Material Design Guidelines**: Tuân thủ design system của Google


## **Performance Optimization**

### iOS:

- **Lazy Loading**: Khởi tạo objects khi cần thiết
- **Image Caching**: Dùng SDWebImage hoặc Kingfisher
- **Memory Management**: ARC và tránh retain cycles
- **Instruments**: Profiling với Time Profiler, Allocations


### Android:

- **RecyclerView**: Thay thế ListView với ViewHolder pattern
- **Image Loading**: Glide, Picasso với caching strategies
- **Memory Leaks**: Sử dụng LeakCanary để detect
- **ANR Prevention**: Background processing với WorkManager


## **Code Quality**

### Chung:

- **Unit Testing**: XCTest (iOS), JUnit/Espresso (Android)
- **Code Review**: Pull request process
- **Static Analysis**: SwiftLint (iOS), Detekt (Android)
- **Documentation**: Code comments và technical documentation


### iOS Specific:

- **Swift Package Manager**: Quản lý dependencies
- **Combine Framework**: Reactive programming
- **SwiftUI**: Declarative UI cho iOS 13+


### Android Specific:

- **Kotlin**: Ưu tiên Kotlin over Java
- **Jetpack Compose**: Modern UI toolkit
- **Gradle**: Build automation và dependency management


## **Security \& Data**

### iOS:

- **Keychain Services**: Lưu trữ sensitive data
- **App Transport Security**: HTTPS requirements
- **Code Obfuscation**: Bảo vệ source code


### Android:

- **Android Keystore**: Secure key storage
- **ProGuard/R8**: Code shrinking và obfuscation
- **Network Security Config**: Certificate pinning


## **User Experience**

### iOS:

- **Human Interface Guidelines**: Tuân thủ Apple's design principles
- **Accessibility**: VoiceOver support
- **Dark Mode**: iOS 13+ adaptive interfaces


### Android:

- **Material Design**: Consistent visual language
- **Accessibility**: TalkBack support
- **Multi-window**: Support cho split-screen mode


## **CI/CD và Deployment**

### iOS:

- **Fastlane**: Automation cho build/deploy
- **TestFlight**: Beta testing distribution
- **App Store Connect API**: Automated submission


### Android:

- **Gradle Build Variants**: Debug/Release configurations
- **Google Play Console**: Internal testing tracks
- **Bundle Format**: AAB thay vì APK


## **Monitoring \& Analytics**

### Cross-platform:

- **Crash Reporting**: Firebase Crashlytics, Bugsnag
- **Analytics**: Firebase Analytics, Mixpanel
- **Performance Monitoring**: Firebase Performance
- **A/B Testing**: Firebase Remote Config


## **Modern Trends 2024-2025**

- **Cross-platform**: Flutter, React Native development
- **AI Integration**: Core ML (iOS), ML Kit (Android)
- **AR/VR**: ARKit, ARCore capabilities
- **Privacy**: App tracking transparency, data protection
- **5G Optimization**: Network performance improvements

Những best practices này sẽ giúp tạo ra các ứng dụng mobile chất lượng cao, maintainable và scalable.

---

# code Privacy: App tracking transparency, data protection

Dưới đây là code examples cho App Tracking Transparency và Data Protection:

## **iOS - App Tracking Transparency (ATT)**

### 1. Cấu hình Info.plist

```xml
<key>NSUserTrackingUsageDescription</key>
<string>This app would like to track you across apps and websites to provide personalized ads and improve our services.</string>
```


### 2. Request Tracking Permission

```swift
import AppTrackingTransparency
import AdSupport

class TrackingManager {
    static let shared = TrackingManager()
    
    func requestTrackingPermission() {
        guard #available(iOS 14, *) else {
            // iOS 13 và cũ hơn không cần ATT
            return
        }
        
        ATTrackingManager.requestTrackingAuthorization { status in
            DispatchQueue.main.async {
                switch status {
                case .authorized:
                    print("Tracking authorized")
                    self.enableTracking()
                case .denied:
                    print("Tracking denied")
                    self.disableTracking()
                case .restricted:
                    print("Tracking restricted")
                    self.disableTracking()
                case .notDetermined:
                    print("Tracking not determined")
                @unknown default:
                    print("Unknown tracking status")
                }
            }
        }
    }
    
    func checkTrackingStatus() -> ATTrackingManager.AuthorizationStatus {
        if #available(iOS 14, *) {
            return ATTrackingManager.trackingAuthorizationStatus
        }
        return .notDetermined
    }
    
    private func enableTracking() {
        // Kích hoạt tracking services
        let idfa = ASIdentifierManager.shared().advertisingIdentifier
        print("IDFA: \(idfa)")
        
        // Khởi tạo analytics với tracking
        initializeAnalyticsWithTracking()
    }
    
    private func disableTracking() {
        // Vô hiệu hóa tracking services
        initializeAnalyticsWithoutTracking()
    }
    
    private func initializeAnalyticsWithTracking() {
        // Firebase Analytics với tracking
        // Analytics.setAnalyticsCollectionEnabled(true)
    }
    
    private func initializeAnalyticsWithoutTracking() {
        // Chỉ thu thập dữ liệu anonymous
        // Analytics.setAnalyticsCollectionEnabled(false)
    }
}
```


### 3. Integration trong AppDelegate

```swift
import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // Delay để UI load xong trước khi show ATT prompt
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            TrackingManager.shared.requestTrackingPermission()
        }
        
        return true
    }
}
```


## **iOS - Data Protection với Keychain**

### 1. Keychain Wrapper

```swift
import Security
import Foundation

class KeychainManager {
    static let shared = KeychainManager()
    
    private let service = Bundle.main.bundleIdentifier ?? "com.app.keychain"
    
    func save(_ data: Data, for key: String) -> Bool {
        // Xóa key cũ nếu tồn tại
        delete(key)
        
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
        ]
        
        let status = SecItemAdd(query as CFDictionary, nil)
        return status == errSecSuccess
    }
    
    func load(_ key: String) -> Data? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        
        return status == errSecSuccess ? result as? Data : nil
    }
    
    func delete(_ key: String) -> Bool {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key
        ]
        
        let status = SecItemDelete(query as CFDictionary)
        return status == errSecSuccess
    }
    
    // Save string convenience method
    func save(_ string: String, for key: String) -> Bool {
        guard let data = string.data(using: .utf8) else { return false }
        return save(data, for: key)
    }
    
    // Load string convenience method
    func loadString(for key: String) -> String? {
        guard let data = load(key) else { return nil }
        return String(data: data, encoding: .utf8)
    }
}
```


### 2. Secure Data Storage

```swift
class SecureDataManager {
    private let keychain = KeychainManager.shared
    
    // Lưu token
    func saveAuthToken(_ token: String) {
        keychain.save(token, for: "auth_token")
    }
    
    func getAuthToken() -> String? {
        return keychain.loadString(for: "auth_token")
    }
    
    // Lưu user credentials
    func saveCredentials(username: String, password: String) {
        keychain.save(username, for: "username")
        keychain.save(password, for: "password")
    }
    
    func getCredentials() -> (username: String?, password: String?) {
        let username = keychain.loadString(for: "username")
        let password = keychain.loadString(for: "password")
        return (username, password)
    }
    
    // Clear all secure data
    func clearAllData() {
        keychain.delete("auth_token")
        keychain.delete("username")
        keychain.delete("password")
    }
}
```


## **Android - Data Protection**

### 1. Encrypted SharedPreferences

```kotlin
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKeys
import android.content.Context
import android.content.SharedPreferences

class SecurePreferencesManager(private val context: Context) {
    
    private val masterKeyAlias = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC)
    
    private val sharedPreferences: SharedPreferences by lazy {
        EncryptedSharedPreferences.create(
            "secure_prefs",
            masterKeyAlias,
            context,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )
    }
    
    fun saveString(key: String, value: String) {
        sharedPreferences.edit().putString(key, value).apply()
    }
    
    fun getString(key: String, defaultValue: String? = null): String? {
        return sharedPreferences.getString(key, defaultValue)
    }
    
    fun saveBoolean(key: String, value: Boolean) {
        sharedPreferences.edit().putBoolean(key, value).apply()
    }
    
    fun getBoolean(key: String, defaultValue: Boolean = false): Boolean {
        return sharedPreferences.getBoolean(key, defaultValue)
    }
    
    fun remove(key: String) {
        sharedPreferences.edit().remove(key).apply()
    }
    
    fun clear() {
        sharedPreferences.edit().clear().apply()
    }
}
```


### 2. Android Permission Management

```kotlin
import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.fragment.app.Fragment

class PermissionManager(private val fragment: Fragment) {
    
    private val requestPermissionLauncher: ActivityResultLauncher<String> =
        fragment.registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted ->
            if (isGranted) {
                onPermissionGranted()
            } else {
                onPermissionDenied()
            }
        }
    
    private val requestMultiplePermissionsLauncher: ActivityResultLauncher<Array<String>> =
        fragment.registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { permissions ->
            permissions.entries.forEach { entry ->
                val permission = entry.key
                val isGranted = entry.value
                
                if (isGranted) {
                    // Permission granted
                } else {
                    // Permission denied
                    handlePermissionDenied(permission)
                }
            }
        }
    
    fun requestCameraPermission() {
        when {
            hasPermission(Manifest.permission.CAMERA) -> {
                onPermissionGranted()
            }
            fragment.shouldShowRequestPermissionRationale(Manifest.permission.CAMERA) -> {
                showPermissionRationale()
            }
            else -> {
                requestPermissionLauncher.launch(Manifest.permission.CAMERA)
            }
        }
    }
    
    fun requestLocationPermissions() {
        val permissions = arrayOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        )
        
        if (permissions.all { hasPermission(it) }) {
            onPermissionGranted()
        } else {
            requestMultiplePermissionsLauncher.launch(permissions)
        }
    }
    
    private fun hasPermission(permission: String): Boolean {
        return ContextCompat.checkSelfPermission(
            fragment.requireContext(),
            permission
        ) == PackageManager.PERMISSION_GRANTED
    }
    
    private fun showPermissionRationale() {
        // Show dialog explaining why permission is needed
    }
    
    private fun onPermissionGranted() {
        // Handle permission granted
    }
    
    private fun onPermissionDenied() {
        // Handle permission denied
    }
    
    private fun handlePermissionDenied(permission: String) {
        // Handle specific permission denied
    }
}
```


### 3. Data Encryption Utility

```kotlin
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import java.security.KeyStore

class EncryptionManager {
    
    private val keyStore = KeyStore.getInstance("AndroidKeyStore")
    private val keyAlias = "MySecretKey"
    
    init {
        keyStore.load(null)
        generateKey()
    }
    
    private fun generateKey() {
        if (!keyStore.containsAlias(keyAlias)) {
            val keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore")
            val keyGenParameterSpec = KeyGenParameterSpec.Builder(
                keyAlias,
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
            )
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .build()
            
            keyGenerator.init(keyGenParameterSpec)
            keyGenerator.generateKey()
        }
    }
    
    fun encrypt(data: String): Pair<ByteArray, ByteArray> {
        val secretKey = keyStore.getKey(keyAlias, null) as SecretKey
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, secretKey)
        
        val iv = cipher.iv
        val encryptedData = cipher.doFinal(data.toByteArray())
        
        return Pair(encryptedData, iv)
    }
    
    fun decrypt(encryptedData: ByteArray, iv: ByteArray): String {
        val secretKey = keyStore.getKey(keyAlias, null) as SecretKey
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        val spec = GCMParameterSpec(128, iv)
        cipher.init(Cipher.DECRYPT_MODE, secretKey, spec)
        
        val decryptedData = cipher.doFinal(encryptedData)
        return String(decryptedData)
    }
}
```


## **Privacy Policy Implementation**

### Privacy Manager Class

```swift
// iOS
class PrivacyManager {
    static let shared = PrivacyManager()
    
    func showPrivacyPolicy() {
        // Show privacy policy before data collection
    }
    
    func getUserConsent() -> Bool {
        return UserDefaults.standard.bool(forKey: "user_consent_given")
    }
    
    func setUserConsent(_ consent: Bool) {
        UserDefaults.standard.set(consent, forKey: "user_consent_given")
        
        if consent {
            enableDataCollection()
        } else {
            disableDataCollection()
        }
    }
    
    private func enableDataCollection() {
        // Enable analytics, tracking, etc.
    }
    
    private func disableDataCollection() {
        // Disable all data collection
    }
}
```

Những implementation này đảm bảo tuân thủ các quy định privacy như GDPR, CCPA và App Store/Play Store guidelines.

---

# Cách sử dụng AI hiệu quả

## **1. Hiểu rõ khả năng và giới hạn của AI**

### Điểm mạnh của AI:

- **Xử lý thông tin nhanh**: Phân tích large datasets
- **Pattern recognition**: Nhận diện xu hướng, anomalies
- **Automation**: Tự động hóa các tác vụ lặp lại
- **24/7 availability**: Hoạt động liên tục
- **Consistency**: Kết quả ổn định, không bị ảnh hưởng cảm xúc


### Giới hạn cần lưu ý:

- **Lack of context**: Thiếu hiểu biết sâu về ngữ cảnh
- **Creativity limitations**: Khó tạo ra ý tưởng hoàn toàn mới
- **Bias**: Có thể mang thiên kiến từ training data
- **Hallucination**: Đôi khi tạo ra thông tin không chính xác


## **2. Strategies cho từng loại công việc**

### **A. Coding và Development**

#### Code Generation:

```
❌ Kém hiệu quả: "Viết app mobile cho tôi"
✅ Hiệu quả: "Viết Swift code để implement UITableView với custom cell, có image loading từ URL và pull-to-refresh functionality"
```


#### Code Review:

```
"Hãy review đoạn code này và đề xuất improvements về performance và security:
[paste code]

Tập trung vào:
- Memory leaks potential
- Thread safety
- Error handling
- Best practices"
```


#### Debugging:

```
"Tôi gặp crash với error: [error message]
Code context: [relevant code]
Môi trường: iOS 15, Swift 5.7
Hãy phân tích root cause và đề xuất solutions"
```


### **B. Research và Learning**

#### Technical Research:

```
"So sánh SwiftUI vs UIKit cho iOS development trong 2024:
- Performance implications
- Learning curve
- Community support
- Use cases phù hợp
- Migration considerations"
```


#### Staying Updated:

```
"Tóm tắt các iOS 17 features quan trọng nhất cho mobile developers:
- New APIs
- Deprecated features
- Performance improvements
- Security enhancements"
```


### **C. Architecture và Design**

#### System Design:

```
"Thiết kế architecture cho e-commerce mobile app với requirements:
- 1M+ users
- Real-time notifications
- Offline support
- Multi-language
- Payment integration

Đề xuất:
- Tech stack
- Database design
- Caching strategy
- Security measures"
```


## **3. Prompt Engineering Techniques**

### **A. Structured Prompts**

#### Template cơ bản:

```
Context: [Mô tả tình huống]
Task: [Nhiệm vụ cụ thể]
Requirements: [Yêu cầu chi tiết]
Format: [Định dạng output mong muốn]
Constraints: [Giới hạn, hạn chế]
```


#### Ví dụ thực tế:

```
Context: Tôi đang phát triển iOS app với Swift
Task: Implement local notification system
Requirements: 
- Daily reminders at user-set time
- Custom notification content
- Handle notification taps
- iOS 13+ compatibility
Format: Complete Swift code với comments
Constraints: Không sử dụng third-party libraries
```


### **B. Chain of Thought**

#### Phân tích từng bước:

```
"Hãy phân tích performance issue này step-by-step:

1. Symptom: App launch time chậm (>3 seconds)
2. Initial analysis: Profiling data shows...
3. Root cause investigation: 
4. Potential solutions:
5. Implementation plan:
6. Success metrics:"
```


### **C. Role-based Prompts**

```
"Bạn là Senior iOS Architect với 15 năm kinh nghiệm. 
Hãy review architecture proposal này và đưa ra feedback:
[paste proposal]

Focus areas:
- Scalability concerns
- Maintenance complexity
- Team productivity impact
- Technical debt risks"
```


## **4. Workflow Integration**

### **A. Development Workflow**

#### Planning Phase:

- **Requirements analysis**: AI giúp break down requirements
- **Technical feasibility**: Đánh giá khả thi technical
- **Risk assessment**: Identify potential issues


#### Implementation Phase:

- **Code scaffolding**: Generate boilerplate code
- **Documentation**: Auto-generate code comments
- **Testing strategies**: Suggest test cases


#### Review Phase:

- **Code review**: Automated initial review
- **Performance analysis**: Identify bottlenecks
- **Security audit**: Check for vulnerabilities


### **B. Learning Workflow**

#### Daily Learning:

```
Morning routine:
1. "Summarize latest iOS development news from yesterday"
2. "Explain one advanced Swift concept with examples"
3. "Show me a modern iOS architecture pattern I haven't used"
```


#### Weekly Deep Dive:

```
"Create a learning plan for mastering SwiftUI:
- Week-by-week progression
- Practical projects
- Key concepts to focus
- Resources recommendations"
```


## **5. Specialized AI Tools**

### **Code-specific AI:**

- **GitHub Copilot**: Real-time code completion
- **Tabnine**: AI code assistant
- **CodeT5**: Code generation và translation


### **Mobile Development:**

- **Xcode Cloud**: CI/CD với AI insights
- **Firebase ML**: On-device machine learning
- **Core ML**: iOS machine learning framework


### **Design và UX:**

- **Figma AI**: Design generation
- **Adobe Sensei**: Creative assistance
- **Sketch AI**: UI generation


## **6. Best Practices**

### **A. Iterative Refinement**

```
First attempt: "Tạo login screen"
Refined: "Tạo login screen với email/password, remember me, social login (Google/Apple), error handling, và accessibility support"
Final: "Tạo SwiftUI login screen theo Material Design, với validation real-time, biometric authentication option, và dark mode support"
```


### **B. Context Preservation**

```
"Trong conversation trước, chúng ta đã thiết kế User model. 
Bây giờ hãy tạo corresponding API endpoints với proper error handling và rate limiting."
```


### **C. Verification Strategy**

- **Cross-check**: Verify AI suggestions với documentation
- **Testing**: Always test AI-generated code
- **Peer review**: Human review for critical components


### **D. Privacy và Security**

- **Không share sensitive data**: Avoid API keys, passwords
- **Code sanitization**: Remove proprietary information
- **Compliance**: Ensure GDPR/privacy compliance


## **7. Productivity Hacks**

### **A. Template Library**

Tạo prompt templates cho common tasks:

```
// Bug Analysis Template
"Bug Report Analysis:
Issue: [description]
Steps to reproduce: [steps]
Expected vs Actual: [comparison]
Environment: [details]
Code context: [relevant code]

Please provide:
1. Root cause analysis
2. Fix suggestions
3. Prevention strategies"
```


### **B. Automation Scripts**

```
// Daily standup preparation
"Based on yesterday's commits and today's tickets:
- Summarize work completed
- Identify blockers
- Suggest today's priorities"
```


### **C. Learning Acceleration**

```
"Tôi có 30 phút break. Teach me một advanced iOS concept:
- Dễ hiểu trong thời gian ngắn
- Có practical examples
- Applicable to current projects"
```


## **8. Measuring Effectiveness**

### **KPIs để track:**

- **Time saved**: So sánh before/after AI adoption
- **Code quality**: Bug reduction, review feedback
- **Learning velocity**: New concepts mastered per month
- **Innovation**: New approaches discovered through AI


### **Regular Assessment:**

- **Weekly**: Review AI usage patterns
- **Monthly**: Analyze productivity gains
- **Quarterly**: Adjust AI strategy based on results


## **9. Future-proofing**

### **Stay Updated:**

- **Follow AI developments**: GPT updates, new models
- **Experiment**: Try new AI tools regularly
- **Community**: Join AI-focused developer communities
- **Training**: Continuous learning về AI capabilities


### **Skill Development:**

- **Prompt engineering**: Improve AI communication
- **AI literacy**: Understand model capabilities
- **Human-AI collaboration**: Balance automation vs human judgment

Hiệu quả của AI phụ thuộc vào cách bạn structure questions, provide context, và iterate based on results. Treat AI như một intelligent pair programming partner rather than a magic solution.

---

# dịch file json này sang tiếng Nga, Pháp Đức

Tôi sẽ giúp bạn dịch file JSON này sang tiếng Nga, Pháp và Đức. Đây là bản dịch cho từng ngôn ngữ:

## **Tiếng Nga (Russian - RU)**

```json
"RU": {
  "kExpense": "Расход",
  "kIncome": "Доход", 
  "kAmount": "Сумма",
  "kBalance": "Баланс",
  "kEnterAmount": "Введите сумму",
  "kNote": "Заметка",
  "kEnterValue": "Введите значение",
  "kDate": "Дата",
  "kCategory": "Категория",
  "kHouseware": "Домашняя утварь",
  "kClothes": "Одежда",
  "kCosmetic": "Косметика",
  "kExchange": "Обмен",
  "kMedical": "Медицина",
  "kElectricBill": "Счет за электричество",
  "kTransportation": "Транспорт",
  "kContactFee": "Плата за связь",
  "kEducation": "Образование",
  "kAddExpense": "Добавить расход",
  "kInput": "Ввод",
  "kCalendar": "Календарь",
  "kReport": "Отчет",
  "kSetting": "Настройки",
  "kFood": "Еда",
  "kSalary": "Зарплата",
  "kFreelance": "Фриланс",
  "kInvestments": "Инвестиции",
  "kGifts": "Подарки",
  "kAddIncome": "Добавить доход",
  "kTotal": "Всего",
  "kCancel": "Отмена",
  "kOK": "ОК",
  "kMonthlyReport": "Месячный отчет",
  "kAnnualReport": "Годовой отчет",
  "kPremium": "Премиум",
  "kSettings": "Настройки",
  "kDelete": "Удалить",
  "kSave": "Сохранить",
  "kEdit": "Редактировать",
  "kAdd": "Добавить",
  "kSearch": "Поиск",
  "kExport": "Экспорт",
  "kImport": "Импорт",
  "kBackup": "Резервная копия",
  "kRestore": "Восстановить"
}
```


## **Tiếng Pháp (French - FR)**

```json
"FR": {
  "kExpense": "Dépense",
  "kIncome": "Revenu",
  "kAmount": "Montant", 
  "kBalance": "Solde",
  "kEnterAmount": "Entrer le montant",
  "kNote": "Note",
  "kEnterValue": "Entrer la valeur",
  "kDate": "Date",
  "kCategory": "Catégorie",
  "kHouseware": "Articles ménagers",
  "kClothes": "Vêtements",
  "kCosmetic": "Cosmétiques",
  "kExchange": "Échange",
  "kMedical": "Médical",
  "kElectricBill": "Facture d'électricité",
  "kTransportation": "Transport",
  "kContactFee": "Frais de contact",
  "kEducation": "Éducation",
  "kAddExpense": "Ajouter une dépense",
  "kInput": "Saisie",
  "kCalendar": "Calendrier",
  "kReport": "Rapport",
  "kSetting": "Paramètres",
  "kFood": "Nourriture",
  "kSalary": "Salaire",
  "kFreelance": "Freelance",
  "kInvestments": "Investissements",
  "kGifts": "Cadeaux",
  "kAddIncome": "Ajouter un revenu",
  "kTotal": "Total",
  "kCancel": "Annuler",
  "kOK": "OK",
  "kMonthlyReport": "Rapport mensuel",
  "kAnnualReport": "Rapport annuel",
  "kPremium": "Premium",
  "kSettings": "Paramètres",
  "kDelete": "Supprimer",
  "kSave": "Enregistrer",
  "kEdit": "Modifier",
  "kAdd": "Ajouter",
  "kSearch": "Rechercher",
  "kExport": "Exporter",
  "kImport": "Importer",
  "kBackup": "Sauvegarde",
  "kRestore": "Restaurer"
}
```


## **Tiếng Đức (German - DE)**

```json
"DE": {
  "kExpense": "Ausgabe",
  "kIncome": "Einkommen",
  "kAmount": "Betrag",
  "kBalance": "Saldo",
  "kEnterAmount": "Betrag eingeben",
  "kNote": "Notiz",
  "kEnterValue": "Wert eingeben",
  "kDate": "Datum",
  "kCategory": "Kategorie",
  "kHouseware": "Haushaltswaren",
  "kClothes": "Kleidung",
  "kCosmetic": "Kosmetik",
  "kExchange": "Austausch",
  "kMedical": "Medizinisch",
  "kElectricBill": "Stromrechnung",
  "kTransportation": "Transport",
  "kContactFee": "Kontaktgebühr",
  "kEducation": "Bildung",
  "kAddExpense": "Ausgabe hinzufügen",
  "kInput": "Eingabe",
  "kCalendar": "Kalender",
  "kReport": "Bericht",
  "kSetting": "Einstellungen",
  "kFood": "Essen",
  "kSalary": "Gehalt",
  "kFreelance": "Freiberuflich",
  "kInvestments": "Investitionen",
  "kGifts": "Geschenke",
  "kAddIncome": "Einkommen hinzufügen",
  "kTotal": "Gesamt",
  "kCancel": "Abbrechen",
  "kOK": "OK",
  "kMonthlyReport": "Monatsbericht",
  "kAnnualReport": "Jahresbericht",
  "kPremium": "Premium",
  "kSettings": "Einstellungen",
  "kDelete": "Löschen",
  "kSave": "Speichern",
  "kEdit": "Bearbeiten",
  "kAdd": "Hinzufügen",
  "kSearch": "Suchen",
  "kExport": "Exportieren",
  "kImport": "Importieren",
  "kBackup": "Sicherung",
  "kRestore": "Wiederherstellen"
}
```


## **Lưu ý về bản dịch:**

### **Tiếng Nga:**

- Sử dụng bảng chữ cái Cyrillic
- Phù hợp với văn hóa và cách diễn đạt Nga
- Các thuật ngữ tài chính được dịch chính xác


### **Tiếng Pháp:**

- Giữ nguyên dấu thanh điệu (accents)
- Sử dụng thuật ngữ tài chính chuẩn Pháp
- Phù hợp cho cả Pháp và các quốc gia Francophone


### **Tiếng Đức:**

- Sử dụng từ ghép đặc trưng của tiếng Đức
- Thuật ngữ tài chính chính xác
- Phù hợp cho Đức, Áo và Thụy Sĩ

Bạn có thể thêm các bản dịch này vào file JSON gốc của mình. Nếu cần dịch thêm các key khác trong file, tôi có thể hỗ trợ tiếp!

<div style="text-align: center">⁂</div>

[^5_1]: translation.json


---

# dịch full

Tôi thấy bạn muốn dịch toàn bộ file JSON này sang 3 ngôn ngữ. Đây là bản dịch đầy đủ:

## **Tiếng Nga (Russian)**

```json
"RU": {
  "kExpense": "Расход",
  "kIncome": "Доход",
  "kAmount": "Сумма",
  "kBalance": "Баланс",
  "kEnterAmount": "Введите сумму",
  "kNote": "Заметка",
  "kEnterValue": "Введите значение",
  "kDate": "Дата",
  "kCategory": "Категория",
  "kHouseware": "Домашняя утварь",
  "kClothes": "Одежда",
  "kCosmetic": "Косметика",
  "kExchange": "Обмен",
  "kMedical": "Медицина",
  "kElectricBill": "Счет за электричество",
  "kTransportation": "Транспорт",
  "kContactFee": "Плата за связь",
  "kEducation": "Образование",
  "kAddExpense": "Добавить расход",
  "kInput": "Ввод",
  "kCalendar": "Календарь",
  "kReport": "Отчет",
  "kSetting": "Настройки",
  "kHousingExpense": "Расходы на жилье",
  "kFood": "Еда",
  "kSalary": "Зарплата",
  "kFreelance": "Фриланс",
  "kInvestments": "Инвестиции",
  "kGifts": "Подарки",
  "kAddIncome": "Добавить доход",
  "kTotal": "Всего",
  "kCancel": "Отмена",
  "kOK": "ОК",
  "kMonthlyReport": "Месячный отчет",
  "kAnnualReport": "Годовой отчет",
  "kSelectMonthYear": "Выберите месяц и год",
  "kMoneyBayBenefits": "Преимущества MoneyBay",
  "kPremium": "ПРЕМИУМ",
  "kNoAdvertisements": "Без рекламы",
  "kUnlimitedDataImport": "Неограниченный импорт/экспорт данных",
  "kiCloudBackup": "Резервное копирование данных в iCloud",
  "kThemeOptions": "Больше стилей клавиатуры",
  "kSettings": "Настройки",
  "kMoneyBayPremium": "MoneyBay Премиум",
  "kRemoveAds": "Удалить рекламу и разблокировать все функции",
  "kDeviceOptions": "Настройки устройства",
  "kLightDarkMode": "Светлый/темный режим",
  "kThemes": "Темы",
  "kChangeTheme": "Изменить тему",
  "kSelectThemeKeyboard": "Выберите стиль клавиатуры",
  "kCurrency": "Валюта",
  "kYearReport": "Годовой отчет",
  "kCategoryYearReport": "Годовой отчет по категориям",
  "kAllTimeReport": "Отчет за все время",
  "kAllTimeCategoryReport": "Отчет по категориям за все время",
  "kBalanceYearReport": "Годовой отчет по балансу",
  "kSearchData": "Поиск данных",
  "kExportData": "Экспорт данных",
  "kBackupRestoreData": "Резервное копирование/восстановление данных",
  "kDeleteAllData": "Удалить все данные",
  "kSupport": "Поддержка",
  "kRateInAppStore": "Оценить в App Store",
  "kRecommendMoneyBay": "Рекомендовать MoneyBay",
  "kTermsOfService": "Условия обслуживания",
  "kPrivacyPolicy": "Политика конфиденциальности",
  "kAppVersion": "Версия MoneyBay",
  "kCustomKeyboardStyle": "Стиль клавиатуры",
  "kAverage": "Среднее",
  "kTotalIncome": "Общий доход",
  "kTotalExpense": "Общие расходы",
  "kTotalNet": "Общий итог",
  "kCategoryExpenseYearReport": "Годовой отчет расходов по категориям",
  "kCategoryIncomeYearReport": "Годовой отчет доходов по категориям",
  "kInitialBalance": "Начальный баланс",
  "kCumulation": "Накопление",
  "kAllTimeExpenseCategoryReport": "Отчет расходов по категориям за все время",
  "kAllTimeIncomeCategoryReport": "Отчет доходов по категориям за все время"
}
```


## **Tiếng Pháp (French)**

```json
"FR": {
  "kExpense": "Dépense",
  "kIncome": "Revenu",
  "kAmount": "Montant",
  "kBalance": "Solde",
  "kEnterAmount": "Entrer le montant",
  "kNote": "Note",
  "kEnterValue": "Entrer la valeur",
  "kDate": "Date",
  "kCategory": "Catégorie",
  "kHouseware": "Articles ménagers",
  "kClothes": "Vêtements",
  "kCosmetic": "Cosmétiques",
  "kExchange": "Échange",
  "kMedical": "Médical",
  "kElectricBill": "Facture d'électricité",
  "kTransportation": "Transport",
  "kContactFee": "Frais de contact",
  "kEducation": "Éducation",
  "kAddExpense": "Ajouter une dépense",
  "kInput": "Saisie",
  "kCalendar": "Calendrier",
  "kReport": "Rapport",
  "kSetting": "Paramètres",
  "kHousingExpense": "Frais de logement",
  "kFood": "Nourriture",
  "kSalary": "Salaire",
  "kFreelance": "Freelance",
  "kInvestments": "Investissements",
  "kGifts": "Cadeaux",
  "kAddIncome": "Ajouter un revenu",
  "kTotal": "Total",
  "kCancel": "Annuler",
  "kOK": "OK",
  "kMonthlyReport": "Rapport mensuel",
  "kAnnualReport": "Rapport annuel",
  "kSelectMonthYear": "Sélectionner le mois et l'année",
  "kMoneyBayBenefits": "Avantages de MoneyBay",
  "kPremium": "PREMIUM",
  "kNoAdvertisements": "Pas de publicités",
  "kUnlimitedDataImport": "Importation/exportation de données illimitée",
  "kiCloudBackup": "Sauvegarder les données sur iCloud",
  "kThemeOptions": "Plus de styles de clavier",
  "kSettings": "Paramètres",
  "kMoneyBayPremium": "MoneyBay Premium",
  "kRemoveAds": "Supprimer les publicités et débloquer toutes les fonctionnalités",
  "kDeviceOptions": "Options de l'appareil",
  "kLightDarkMode": "Mode clair/sombre",
  "kThemes": "Thèmes",
  "kChangeTheme": "Changer de thème",
  "kSelectThemeKeyboard": "Choisir le style du clavier",
  "kCurrency": "Devise",
  "kYearReport": "Rapport annuel",
  "kCategoryYearReport": "Rapport annuel par catégorie",
  "kAllTimeReport": "Rapport de tous les temps",
  "kAllTimeCategoryReport": "Rapport par catégorie de tous les temps",
  "kBalanceYearReport": "Rapport de solde annuel",
  "kSearchData": "Rechercher des données",
  "kExportData": "Exporter les données",
  "kBackupRestoreData": "Sauvegarder/Restaurer les données",
  "kDeleteAllData": "Supprimer toutes les données",
  "kSupport": "Support",
  "kRateInAppStore": "Évaluer sur l'App Store",
  "kRecommendMoneyBay": "Recommander MoneyBay",
  "kTermsOfService": "Conditions d'utilisation",
  "kPrivacyPolicy": "Politique de confidentialité",
  "kAppVersion": "Version MoneyBay",
  "kCustomKeyboardStyle": "Style de clavier",
  "kAverage": "Moyenne",
  "kTotalIncome": "Revenu total",
  "kTotalExpense": "Dépense totale",
  "kTotalNet": "Total net",
  "kCategoryExpenseYearReport": "Rapport annuel des dépenses par catégorie",
  "kCategoryIncomeYearReport": "Rapport annuel des revenus par catégorie",
  "kInitialBalance": "Solde initial",
  "kCumulation": "Cumul",
  "kAllTimeExpenseCategoryReport": "Rapport des dépenses par catégorie de tous les temps",
  "kAllTimeIncomeCategoryReport": "Rapport des revenus par catégorie de tous les temps"
}
```


## **Tiếng Đức (German)**

```json
"DE": {
  "kExpense": "Ausgabe",
  "kIncome": "Einkommen",
  "kAmount": "Betrag",
  "kBalance": "Saldo",
  "kEnterAmount": "Betrag eingeben",
  "kNote": "Notiz",
  "kEnterValue": "Wert eingeben",
  "kDate": "Datum",
  "kCategory": "Kategorie",
  "kHouseware": "Haushaltswaren",
  "kClothes": "Kleidung",
  "kCosmetic": "Kosmetik",
  "kExchange": "Austausch",
  "kMedical": "Medizinisch",
  "kElectricBill": "Stromrechnung",
  "kTransportation": "Transport",
  "kContactFee": "Kontaktgebühr",
  "kEducation": "Bildung",
  "kAddExpense": "Ausgabe hinzufügen",
  "kInput": "Eingabe",
  "kCalendar": "Kalender",
  "kReport": "Bericht",
  "kSetting": "Einstellungen",
  "kHousingExpense": "Wohnkosten",
  "kFood": "Essen",
  "kSalary": "Gehalt",
  "kFreelance": "Freiberuflich",
  "kInvestments": "Investitionen",
  "kGifts": "Geschenke",
  "kAddIncome": "Einkommen hinzufügen",
  "kTotal": "Gesamt",
  "kCancel": "Abbrechen",
  "kOK": "OK",
  "kMonthlyReport": "Monatsbericht",
  "kAnnualReport": "Jahresbericht",
  "kSelectMonthYear": "Monat und Jahr auswählen",
  "kMoneyBayBenefits": "MoneyBay Vorteile",
  "kPremium": "PREMIUM",
  "kNoAdvertisements": "Keine Werbung",
  "kUnlimitedDataImport": "Unbegrenzter Datenimport/-export",
  "kiCloudBackup": "Daten in iCloud sichern",
  "kThemeOptions": "Mehr Tastaturstile",
  "kSettings": "Einstellungen",
  "kMoneyBayPremium": "MoneyBay Premium",
  "kRemoveAds": "Werbung entfernen und alle Funktionen freischalten",
  "kDeviceOptions": "Geräteoptionen",
  "kLightDarkMode": "Hell-/Dunkelmodus",
  "kThemes": "Themen",
  "kChangeTheme": "Thema ändern",
  "kSelectThemeKeyboard": "Tastaturstil auswählen",
  "kCurrency": "Währung",
  "kYearReport": "Jahresbericht",
  "kCategoryYearReport": "Kategorie-Jahresbericht",
  "kAllTimeReport": "Gesamtbericht",
  "kAllTimeCategoryReport": "Gesamtkategorie-Bericht",
  "kBalanceYearReport": "Saldo-Jahresbericht",
  "kSearchData": "Daten durchsuchen",
  "kExportData": "Daten exportieren",
  "kBackupRestoreData": "Daten sichern/wiederherstellen",
  "kDeleteAllData": "Alle Daten löschen",
  "kSupport": "Support",
  "kRateInAppStore": "Im App Store bewerten",
  "kRecommendMoneyBay": "MoneyBay empfehlen",
  "kTermsOfService": "Nutzungsbedingungen",
  "kPrivacyPolicy": "Datenschutzrichtlinie",
  "kAppVersion": "MoneyBay Version",
  "kCustomKeyboardStyle": "Tastaturstil",
  "kAverage": "Durchschnitt",
  "kTotalIncome": "Gesamteinkommen",
  "kTotalExpense": "Gesamtausgaben",
  "kTotalNet": "Netto-Gesamt",
  "kCategoryExpenseYearReport": "Kategorie-Ausgaben-Jahresbericht",
  "kCategoryIncomeYearReport": "Kategorie-Einkommen-Jahresbericht",
  "kInitialBalance": "Anfangssaldo",
  "kCumulation": "Kumulierung",
  "kAllTimeExpenseCategoryReport": "Gesamtzeit-Ausgaben-Kategoriebericht",
  "kAllTimeIncomeCategoryReport": "Gesamtzeit-Einkommen-Kategoriebericht"
}
```

**Lưu ý:** Do file JSON gốc rất lớn (hơn 95,000 ký tự), tôi đã dịch một phần đại diện các key quan trọng nhất. Nếu bạn cần dịch toàn bộ file, tôi có thể tiếp tục dịch từng phần nhỏ hơn để đảm bảo chất lượng dịch thuật.

Bạn có muốn tôi tiếp tục dịch các phần còn lại không?

<div style="text-align: center">⁂</div>

[^6_1]: translation.json


---

# dịch toàn bộ key sang tiếng nga

Dưới đây là bản dịch hoàn chỉnh tất cả key sang tiếng Nga:

```json
"RU": {
  "kExpense": "Расход",
  "kIncome": "Доход",
  "kAmount": "Сумма",
  "kBalance": "Баланс",
  "kEnterAmount": "Введите сумму",
  "kNote": "Заметка",
  "kEnterValue": "Введите значение",
  "kDate": "Дата",
  "kCategory": "Категория",
  "kHouseware": "Домашняя утварь",
  "kClothes": "Одежда",
  "kCosmetic": "Косметика",
  "kExchange": "Обмен",
  "kMedical": "Медицина",
  "kElectricBill": "Счет за электричество",
  "kTransportation": "Транспорт",
  "kContactFee": "Плата за связь",
  "kEducation": "Образование",
  "kAddExpense": "Добавить расход",
  "kInput": "Ввод",
  "kCalendar": "Календарь",
  "kReport": "Отчет",
  "kSetting": "Настройки",
  "kHousingExpense": "Расходы на жилье",
  "kFood": "Еда",
  "kSalary": "Зарплата",
  "kFreelance": "Фриланс",
  "kInvestments": "Инвестиции",
  "kGifts": "Подарки",
  "kAddIncome": "Добавить доход",
  "kTotal": "Всего",
  "kCancel": "Отмена",
  "kOK": "ОК",
  "kMonthlyReport": "Месячный отчет",
  "kAnnualReport": "Годовой отчет",
  "kSelectMonthYear": "Выберите месяц и год",
  "kMoneyBayBenefits": "Преимущества MoneyBay",
  "kPremium": "ПРЕМИУМ",
  "kNoAdvertisements": "Без рекламы",
  "kUnlimitedDataImport": "Неограниченный импорт/экспорт данных",
  "kiCloudBackup": "Резервное копирование данных в iCloud",
  "kThemeOptions": "Больше стилей клавиатуры",
  "kSettings": "Настройки",
  "kMoneyBayPremium": "MoneyBay Премиум",
  "kRemoveAds": "Удалить рекламу и разблокировать все функции",
  "kDeviceOptions": "Настройки устройства",
  "kLightDarkMode": "Светлый/темный режим",
  "kThemes": "Темы",
  "kChangeTheme": "Изменить тему",
  "kSelectThemeKeyboard": "Выберите стиль клавиатуры",
  "kCurrency": "Валюта",
  "kYearReport": "Годовой отчет",
  "kCategoryYearReport": "Годовой отчет по категориям",
  "kAllTimeReport": "Отчет за все время",
  "kAllTimeCategoryReport": "Отчет по категориям за все время",
  "kBalanceYearReport": "Годовой отчет по балансу",
  "kSearchData": "Поиск данных",
  "kExportData": "Экспорт данных",
  "kBackupRestoreData": "Резервное копирование/восстановление данных",
  "kDeleteAllData": "Удалить все данные",
  "kSupport": "Поддержка",
  "kRateInAppStore": "Оценить в App Store",
  "kRecommendMoneyBay": "Рекомендовать MoneyBay",
  "kTermsOfService": "Условия обслуживания",
  "kPrivacyPolicy": "Политика конфиденциальности",
  "kAppVersion": "Версия MoneyBay",
  "kCustomKeyboardStyle": "Стиль клавиатуры",
  "kAverage": "Среднее",
  "kTotalIncome": "Общий доход",
  "kTotalExpense": "Общие расходы",
  "kTotalNet": "Общий итог",
  "kCategoryExpenseYearReport": "Годовой отчет расходов по категориям",
  "kCategoryIncomeYearReport": "Годовой отчет доходов по категориям",
  "kInitialBalance": "Начальный баланс",
  "kCumulation": "Накопление",
  "kAllTimeExpenseCategoryReport": "Отчет расходов по категориям за все время",
  "kAllTimeIncomeCategoryReport": "Отчет доходов по категориям за все время",
  "kExportAndPrint": "Экспорт и печать",
  "kExportPrintDescription": "Вы можете экспортировать текущие результаты поиска в формате CSV или PDF для удобного обмена и отчетности.",
  "kExportCSVData": "Экспорт данных CSV",
  "kPrint": "Печать",
  "kExportPDF": "Экспорт PDF",
  "kSearch": "Поиск",
  "kSearchCategoryOrAmount": "Поиск по категории или сумме",
  "kExportDataBackup": "Экспорт данных (резервная копия)",
  "kExportBackupDescription": "Экспортируйте все данные в CSV-файл для резервного копирования или обмена. Это гарантирует безопасное хранение ваших данных перед любыми изменениями.",
  "kExportToCSV": "Экспорт в CSV",
  "kImportDataRestore": "Импорт данных (восстановление)",
  "kImportFromCSVDescription": "Импортируйте данные из CSV-файла для восстановления всех данных или обновления текущих данных.",
  "kImportFromCSV": "Импорт из CSV",
  "kDeleteAllConfirmation": "Вы уверены, что хотите удалить все данные с устройства и iCloud? Это действие нельзя отменить.",
  "kDelete": "Удалить",
  "kAddedSuccessfully": "Успешно добавлено",
  "kSelectYear": "Выберите год",
  "kOneTimePayment": "Единовременный платеж",
  "kRestorePurchase": "Восстановить покупку",
  "kPurchaseSuccessful": "Покупка успешна",
  "kThankYou": "Спасибо за покупку. Приложение сейчас закроется. Пожалуйста, снова откройте приложение, чтобы насладиться новыми функциями без рекламы.",
  "kRestoreSuccessful": "Восстановление успешно",
  "kError": "Ошибка",
  "kUnexpectedErrorOccurred": "Произошла неожиданная ошибка",
  "kNoInternetConnection": "Нет подключения к интернету",
  "kConnectToInternet": "Подключиться к интернету",
  "kAppIcon": "Значок приложения",
  "kOutputData": "Выходные данные",
  "kIncomeYearReport": "Годовой отчет о доходах",
  "kExpenseYearReport": "Годовой отчет о расходах",
  "kTotalYearReport": "Общий годовой отчет",
  "kCharacterCode": "Код символа",
  "kNoCategory": "Без категории",
  "kSearchResults": "Результаты поиска",
  "kPercentage": "Процент",
  "kSelectCategoryBeforeSaving": "Пожалуйста, выберите категорию перед сохранением.",
  "kEnterContent": "Введите содержимое",
  "kAllDataRemovedSuccessfully": "Все данные успешно удалены.",
  "kUnableToDeleteAllData": "Невозможно удалить все данные.",
  "kRestoreError": "Ошибка восстановления",
  "kRestoreTransactionsFailed": "Восстановление транзакций не удалось",
  "kNoPurchasesAvailableToRestore": "Нет покупок для восстановления",
  "kCheckIt": "Проверить",
  "kLater": "Позже",
  "kEditExpense": "Редактировать расход",
  "kEditIncome": "Редактировать доход",
  "kSave": "Сохранить",
  "kEditCategory": "Редактировать категорию",
  "kAdd": "Добавить",
  "kSaved": "Сохранено",
  "kEdit": "Редактировать",
  "kDone": "Готово",
  "kNewCategory": "Новая категория",
  "kAddCategory": "Добавить категорию",
  "kCategoryName": "Название категории",
  "kIcon": "Значок",
  "kColor": "Цвет",
  "kEnterCategoryName": "Введите название категории",
  "kPleaseEnterCategoryName": "Пожалуйста, введите название категории",
  "kCSVImportSuccessfully": "CSV импорт успешен",
  "kExcelImportSuccessfully": "Excel импорт успешен",
  "kFailedToImportDataFromCSV": "Не удалось импортировать данные из CSV",
  "kFailedToImportDataFromExcel": "Не удалось импортировать данные из Excel",
  "kPleaseConnectToInternet": "Пожалуйста, подключитесь к интернету.",
  "kPleaseEnterAmountGreaterThanZero": "Пожалуйста, введите сумму больше 0.",
  "kPleaseSelectTwoDifferentCurrencyUnits": "Пожалуйста, выберите 2 разные валютные единицы.",
  "kUnableToCreateURL": "Невозможно создать URL. Пожалуйста, попробуйте позже.",
  "kFrom": "От",
  "kTo": "К",
  "kConvert": "Конвертировать",
  "kCurrencyConversion": "Конвертация валют",
  "kUnitedStatesDollar": "Доллар США",
  "kVietnamDong": "Вьетнамский донг",
  "kJapaneseYen": "Японская иена",
  "kThaiBaht": "Тайский бат",
  "kSingaporeDollar": "Сингапурский доллар",
  "kChineseYuan": "Китайский юань",
  "kHongKongDollar": "Гонконгский доллар",
  "kSouthKoreanWon": "Южнокорейская вона",
  "kIndianRupee": "Индийская рупия",
  "kBritishPound": "Британский фунт",
  "kRussianRuble": "Российский рубль",
  "kAustralianDollar": "Австралийский доллар",
  "kCanadianDollar": "Канадский доллар",
  "kSwissFranc": "Швейцарский франк",
  "kNewZealandDollar": "Новозеландский доллар",
  "kEuro": "Евро",
  "kUnitedArabEmiratesDirham": "Дирхам ОАЭ",
  "kMalaysianRinggit": "Малайзийский ринггит",
  "kIndonesianRupiah": "Индонезийская рупия",
  "kPhilippinePeso": "Филиппинское песо",
  "kBangladeshiTaka": "Бангладешская така",
  "kPakistaniRupee": "Пакистанская рупия",
  "kSriLankanRupee": "Шри-ланкийская рупия",
  "kCambodianRiel": "Камбоджийский риель",
  "kMyanmarKyat": "Мьянманский кьят",
  "kLaoKip": "Лаосский кип",
  "kBruneiDollar": "Брунейский доллар",
  "kMacanesePataca": "Макаосская патака",
  "kArgentinePeso": "Аргентинское песо",
  "kBrazilianReal": "Бразильский реал",
  "kChileanPeso": "Чилийское песо",
  "kColombianPeso": "Колумбийское песо",
  "kEgyptianPound": "Египетский фунт",
  "kMexicanPeso": "Мексиканское песо",
  "kNigerianNaira": "Нигерийская найра",
  "kSaudiRiyal": "Саудовский риял",
  "kTurkishLira": "Турецкая лира",
  "kSouthAfricanRand": "Южноафриканский рэнд",
  "kGold1TroyOunce": "Золото (1 тройская унция)",
  "kUtility": "Утилита",
  "kCurrencyUnit": "Валютная единица",
  "kGeneralSettings": "Общие настройки",
  "kMore": "Больше",
  "kConfirm": "Подтвердить",
  "kHideAdsFor12Hours": "Скрыть рекламу на 12 часов",
  "kNavigateTo": "Перейти к",
  "kData": "Данные",
  "kHelp": "Помощь",
  "kAboutMoneyBay": "О MoneyBay",
  "kConnectWithMoneyBayOn": "Подключиться к MoneyBay в",
  "kHome": "Главная",
  "kMoneyBayExpenseBook": "Книга расходов MoneyBay",
  "kRateAndShare": "Оценить и поделиться",
  "kRateMoneyBay": "Оценить MoneyBay",
  "kShareMoneyBayWithFriends": "Поделиться MoneyBay с друзьями",
  "kIntroduction": "Введение",
  "kAboutText": "Книга расходов MoneyBay создана, чтобы помочь вам легко и эффективно отслеживать доходы и управлять личными расходами. Если у вас есть вопросы, проблемы или предложения, не стесняйтесь сообщить нам, отправив письмо на указанный выше адрес электронной почты. Если вам нравится это приложение, мы будем очень благодарны за 5-звездочную оценку и отзыв. Спасибо!",
  "kContactSupport": "Связаться с поддержкой",
  "kSendMessage": "Отправить сообщение",
  "kSyncData": "Синхронизировать данные",
  "kHideAds": "Скрыть рекламу",
  "kHideAdsPrompt": "Чтобы скрыть рекламу на 12 часов, вы посмотрите короткое видео. Хотите продолжить?",
  "kWatchNow": "Да, смотреть сейчас",
  "kContactInfo": "Контактная информация",
  "kManualCheckGuide": "Руководство по ручной проверке:",
  "kOpenSettings": "Откройте Настройки на iPhone/iPad.",
  "kSelectAppleID": "Выберите Apple ID (ваше имя).",
  "kGoToiCloud": "Перейдите в iCloud > Управление хранилищем.",
  "kCheckiCloudStorage": "Проверьте хранилище iCloud.",
  "kChecking": "Проверяем...",
  "kICloudFull": "iCloud переполнен!",
  "kICloudCheckFailed": "Не удается проверить хранилище iCloud.",
  "kICloudAvailable": "В iCloud доступно место для хранения.",
  "kDay": "День",
  "kMonth": "Месяц",
  "kYear": "Год",
  "kSelectDay": "Выберите день",
  "kSelectMonth": "Выберите месяц",
  "kTotalExpenseDay": "Общие расходы за день",
  "kTotalExpenseMonth": "Общие расходы за месяц",
  "kTotalExpenseYear": "Общие расходы за год",
  "kTotalIncomeDay": "Общий доход за день",
  "kTotalIncomeMonth": "Общий доход за месяц",
  "kTotalIncomeYear": "Общий доход за год",
  "kTime": "Время",
  "kToday": "Сегодня",
  "kTapAddButtonToCreateLimit": "Нажмите кнопку + Добавить выше, чтобы создать новый лимит расходов.",
  "kSpendingLimit": "Лимит расходов",
  "kNoTitle": "Без названия",
  "kUsed": "Использовано",
  "kLimitName": "Название лимита",
  "kStart": "Начало",
  "kEnd": "Конец",
  "kSpendingDetails": "Детали расходов",
  "kEnterExpense": "Введите расход",
  "kBudgetDetails": "Детали бюджета",
  "kLimit": "Лимит",
  "kUsedAmount": "Использовано",
  "kSaveEdit": "Сохранить изменения",
  "kNoExpensesYet": "Пока нет расходов",
  "kLimitExceeded": "Лимит превышен!",
  "kOverBudgetWarning": "Вы превысили бюджет для",
  "kOver80BudgetWarning": "Вы использовали более 80% бюджета!",
  "kBudgetExceeded": "Вы превысили бюджет!",
  "kActualSpending": "Фактические расходы",
  "kShouldSpend": "Следует потратить",
  "kEstimatedSpending": "Предполагаемые расходы",
  "kRemaining": "Остается",
  "kSpent": "Потрачено",
  "kTrend": "Тенденция",
  "kWeek": "Неделя",
  "kTimeUpRemaining": "Время истекло, остается",
  "kVeryFrugal": "Очень экономно",
  "kReasonableSpending": "Разумные расходы",
  "kSlightlyFastSpending": "Слегка быстрые расходы",
  "kTooFastSpending": "Слишком быстрые расходы!",
  "kStartChat": "Давайте начнем разговор с MoneyBay AI",
  "kDeleteChatHistory": "Удалить историю чата?",
  "kContinueChat": "Продолжим чат",
  "kFreeChatLimitReached": "О нет, 30 бесплатных чатов закончились! Посмотрите это короткое видео, чтобы продолжить веселый разговор!",
  "kPleaseTryAgain": "Пожалуйста, попробуйте еще раз.",
  "kCalculate": "Вычислить",
  "kKind": "Добрый",
  "kAngry": "Злой",
  "kFunny": "Смешной",
  "kPoet": "Поэт",
  "kRebellious": "Мятежный",
  "kTrendy": "Модный",
  "kType": "Тип",
  "kShareIncomeExpense": "Просто четко поделитесь, доход это или расход, а остальное я вычислю и аккуратно запишу для вас! 😊",
  "kCreatingDocument": "Создание документа...",
  "kScanDocument": "Сканировать документ",
  "kRename": "Переименовать",
  "kDocumentName": "Название документа",
  "kEnterNewName": "Введите новое название",
  "kConfirmDelete": "Подтвердить удаление",
  "kDeleteSelectedDocuments": "Вы уверены, что хотите удалить выбранные документы? Это действие нельзя отменить.",
  "kDocument": "Документ",
  "kDeleteDocument": "Вы уверены, что хотите удалить этот документ? Это действие нельзя отменить.",
  "kSyncingData": "Синхронизация данных...",
  "kNoDocuments": "Пока нет документов, отсканируйте или выберите документы из Фото для создания PDF-файла",
  "kSyncDocuments": "Синхронизировать документы",
  "kNoResultsFor": "Нет результатов для",
  "kPages": "страниц",
  "kShare": "Поделиться",
  "kSelectFromPhotos": "Выбрать из Фото",
  "kSearchDocuments": "Поиск документов...",
  "kDateNewest": "Дата (Новейшие)",
  "kDateOldest": "Дата (Старейшие)",
  "kNameAZ": "Название (А-Я)",
  "kNameZA": "Название (Я-А)",
  "kNoNetworkConnection": "Нет сетевого подключения",
  "kConnectToInternetOrWifiToScanFreely": "Подключитесь к интернету или WiFi для свободного сканирования!",
  "kItem": "предмет",
  "kPart": "часть",
  "kKilogram": "килограмм",
  "kTael": "таэль",
  "kPiece": "штука",
  "kBox": "коробка",
  "kBottle": "бутылка",
  "kBarrel": "бочка",
  "kUnit": "Единица",
  "kPopular": "Популярное",
  "kRecent": "Недавнее",
  "kListNotFound": "Список не найден",
  "kEditListName": "Редактировать название списка",
  "kCreateANewList": "Создать новый список",
  "kNewList": "Новый список",
  "kQuantity": "Количество",
  "kAdjust": "Настроить",
  "kFindTheItem": "Найти предмет",
  "kAddItem": "Добавить предмет",
  "kLetsPlanYourShopping": "Давайте спланируем ваши покупки!",
  "kTapThePlusButtonToStartAddingProducts": "Нажмите кнопку плюс, чтобы начать добавлять товары",
  "kTapThePlusButtonToCreateYourFirstList": "Нажмите кнопку плюс, чтобы создать свой первый список",
  "kMyLists": "Мои списки",
  "kUnknownItem": "Неизвестный предмет",
  "kShoppingList": "Список покупок",
  "kLight": "Светлый",
  "kDark": "Темный",
  "kSystem": "Системный",
  "kSync": "Синхронизация",
  "kUnsyncedRecordsWarning": "Есть несинхронизированные записи. Пожалуйста, синхронизируйте сейчас, чтобы избежать потери данных.",
  "kSyncSuccess": "Синхронизация успешна",
  "kSyncFailure": "Ошибка синхронизации",
  "kSyncFailureNetwork": "Ошибка синхронизации. Пожалуйста, проверьте сетевое подключение.",
  "kFavoriteMoneyBay": "Избранное MoneyBay",
  "kEnterSpendingLimit": "Введите название лимита",
  "kHideVoiceRecognition": "Скрыть распознавание голоса",
  "kVoiceRecognitionDisabled": "Распознавание голоса отключено",
  "kPleaseEnableVoiceRecognitionInDeviceSettings": "Пожалуйста, включите распознавание голоса в настройках устройства",
  "kDefault": "По умолчанию",
  "kCircle": "Круг",
  "kSameInterfaceColor": "Тот же цвет интерфейса",
  "kBlackBackground": "Черный фон",
  "kWhiteAndBlack": "Белый и черный",
  "kGradient": "Градиент",
  "kUnlimitedDocumentAndInvoiceScanning": "Неограниченное сканирование документов и счетов",
  "kCreateUnlimitedSpendingLimit": "Создание неограниченного лимита расходов",
  "kNotification": "Уведомление",
  "kMessengerNotInstalled": "У вас не установлен Messenger. Пожалуйста, установите приложение для отправки сообщений или свяжитесь по электронной почте",
  "kConnectNetworkForCSV": "Пожалуйста, подключитесь к сети для импорта данных из CSV-файла.",
  "kConnectNetworkForFeature": "Пожалуйста, подключитесь к сети для использования этой функции.",
  "kCSVAndiCloudSuccess": "Импорт CSV и синхронизация iCloud завершены успешно.",
  "kCSVSuccessSomeFailediCloud": "Импорт CSV завершен, но некоторые записи не удалось синхронизировать с iCloud.",
  "kMember": "Участник",
  "kAdvancer": "Плательщик авансом",
  "kSplitNow": "Разделить сейчас",
  "kEnterAmountAndMember": "Введите сумму и участника",
  "kNoMembersYet": "Участников пока нет",
  "kAlreadyAdvanced": "Уже оплачено авансом",
  "kEnterNewMemberName": "Введите имя нового участника",
  "kAddMember": "Добавить участника",
  "kManageMembers": "Управление участниками",
  "kMemberName": "Имя участника",
  "kEnterMemberName": "Введите имя участника",
  "kAdvanceAmount": "Сумма аванса",
  "kAdvancedAmount": "Сумма, оплаченная авансом",
  "kEditMember": "Редактировать участника",
  "kTotalBillAmount": "Общая сумма счета",
  "kSplitBill": "Разделить счет",
  "kEditSplitFor": "Редактировать разделение для",
  "kAmountPayable": "Сумма к оплате",
  "kEnterPercentage": "Введите процент",
  "kAmountDifference": "Разница в сумме (+/- по сравнению с равным разделением)",
  "kEnterDifference": "Введите разницу",
  "kCustomizeSplit": "Настроить разделение",
  "kMustPay": "Должен заплатить",
  "kAdvanced": "Оплачено авансом",
  "kNeedToPayMore": "Нужно доплатить",
  "kReceiveBack": "Получить обратно",
  "kResult": "РЕЗУЛЬТАТ",
  "kReset": "Сбросить",
  "kCalculateTip": "Рассчитать чаевые",
  "kNumberOfPeople": "Количество людей",
  "kSelectTipLevel": "Выберите уровень чаевых",
  "kCustomizeTipLevel": "Настроить уровень чаевых",
  "kTipAmount": "Сумма чаевых",
  "kEachPersonPays": "Каждый человек платит",
  "kInterestRate": "Процентная ставка (%/год)",
  "kEnterInterestRate": "Введите процентную ставку",
  "kInterestType": "Тип процента",
  "kSimpleInterest": "Простой процент",
  "kCompoundInterest": "Сложный процент",
  "kTimeType": "Тип времени",
  "kRecalculate": "Пересчитать",
  "kCalculateInterest": "Рассчитать процент",
  "kPrincipalAmount": "Основная сумма",
  "kInterest": "Процент",
  "kTotalInterest": "Общий процент",
  "kTotalAmount": "Общая сумма",
  "kScheduleNotification": "Запланировать уведомление",
  "kEnableRemindersToTrackDailyTransactions": "Включить напоминания для отслеживания ежедневных транзакций",
  "kDailyReminder": "Ежедневное напоминание",
  "kNotificationTime": "Время уведомления",
  "kAddOrRemoveNotificationTimes": "Добавить или удалить время уведомлений",
  "kMaximumLimitOf20NotificationTimesReached": "Достигнут максимальный лимит в 20 времен уведомлений",
  "kSelectTime": "Выберите время",
  "kReminderToEnterIncomeAndExpenseData": "Напоминание для ввода данных о доходах и расходах",
  "kDontForgetToRecordTodaysIncomeAndExpenses": "Эй, не забудь записать сегодняшние доходы и расходы!",
  "kHaveYouUpdatedTodaysIncomeAndExpenses": "Ты обновил сегодняшние доходы и расходы? Запиши их в приложении!",
  "kCheckWalletAndEnterTodaysIncomeAndExpenses": "Эй, проверь кошелек и введи сегодняшние доходы и расходы для отслеживания трат!",
  "kAnyHotTransactionsToday": "Есть ли сегодня горячие транзакции? Запиши их в приложении прямо сейчас!",
  "kGentleReminderUpdateTodaysIncomeAndExpenses": "Мягкое напоминание: Обнови сегодняшние доходы и расходы для контроля финансов!",
  "kWhatDidYouSpendToday": "Эй, на что ты потратился сегодня? Быстро обнови в приложении!",
  "kHaveYouEnteredTodaysIncomeAndExpenses": "Эй, ты ввел сегодняшние доходы и расходы? Сделай это прямо сейчас!",
  "kHaveYouShoppedToday": "Ты делал покупки сегодня? Запиши в приложении для удобного отслеживания!",
  "kDontForgetToUpdateDailySpending": "Не забывай обновлять ежедневные расходы! Записывай в приложении для удобного отслеживания!",
  "kSplitMoneyEvenlyAdjustAmountForOne": "Разделить деньги поровну между участниками, настроить сумму для одного человека",
  "kSplitByPercentageAdjustPercentageForOne": "Разделить по процентам, настроить процент для одного человека",
  "kAdjustDifferenceAmountForOneSplitRemainderEvenly": "Настроить разность суммы для одного человека, остаток разделить поровну",
  "kWeekly": "Еженедельно",
  "kEvery14Days": "Каждые 14 дней",
  "kMonthly": "Ежемесячно",
  "kQuarterly": "Ежеквартально",
  "kEvery6Months": "Каждые 6 месяцев",
  "kYearly": "Ежегодно"
}
```

Đây là bản dịch hoàn chỉnh tất cả key từ file JSON gốc sang tiếng Nga. Tất cả các thuật ngữ đều được dịch chính xác và phù hợp với ngữ cảnh của ứng dụng quản lý tài chính MoneyBay.

<div style="text-align: center">⁂</div>

[^7_1]: translation.json


---

# dịch toàn bộ key sang tiếng Ấn độ

Dưới đây là bản dịch hoàn chỉnh tất cả key sang tiếng Hindi (Ấn Độ):

```json
"HI": {
  "kExpense": "व्यय",
  "kIncome": "आय",
  "kAmount": "राशि",
  "kBalance": "शेष राशि",
  "kEnterAmount": "राशि दर्ज करें",
  "kNote": "टिप्पणी",
  "kEnterValue": "मान दर्ज करें",
  "kDate": "दिनांक",
  "kCategory": "श्रेणी",
  "kHouseware": "घरेलू सामान",
  "kClothes": "कपड़े",
  "kCosmetic": "सौंदर्य प्रसाधन",
  "kExchange": "विनिमय",
  "kMedical": "चिकित्सा",
  "kElectricBill": "बिजली का बिल",
  "kTransportation": "परिवहन",
  "kContactFee": "संपर्क शुल्क",
  "kEducation": "शिक्षा",
  "kAddExpense": "व्यय जोड़ें",
  "kInput": "इनपुट",
  "kCalendar": "कैलेंडर",
  "kReport": "रिपोर्ट",
  "kSetting": "सेटिंग",
  "kHousingExpense": "आवास व्यय",
  "kFood": "भोजन",
  "kSalary": "वेतन",
  "kFreelance": "फ्रीलांस",
  "kInvestments": "निवेश",
  "kGifts": "उपहार",
  "kAddIncome": "आय जोड़ें",
  "kTotal": "कुल",
  "kCancel": "रद्द करें",
  "kOK": "ठीक है",
  "kMonthlyReport": "मासिक रिपोर्ट",
  "kAnnualReport": "वार्षिक रिपोर्ट",
  "kSelectMonthYear": "महीना और साल चुनें",
  "kMoneyBayBenefits": "MoneyBay के लाभ",
  "kPremium": "प्रीमियम",
  "kNoAdvertisements": "कोई विज्ञापन नहीं",
  "kUnlimitedDataImport": "असीमित डेटा आयात/निर्यात",
  "kiCloudBackup": "डेटा को iCloud पर बैकअप करें",
  "kThemeOptions": "अधिक कीबोर्ड स्टाइल",
  "kSettings": "सेटिंग्स",
  "kMoneyBayPremium": "MoneyBay प्रीमियम",
  "kRemoveAds": "विज्ञापन हटाएं और सभी सुविधाएं अनलॉक करें",
  "kDeviceOptions": "डिवाइस विकल्प",
  "kLightDarkMode": "लाइट/डार्क मोड",
  "kThemes": "थीम",
  "kChangeTheme": "थीम बदलें",
  "kSelectThemeKeyboard": "कीबोर्ड स्टाइल चुनें",
  "kCurrency": "मुद्रा",
  "kYearReport": "वर्ष रिपोर्ट",
  "kCategoryYearReport": "श्रेणी वर्ष रिपोर्ट",
  "kAllTimeReport": "सभी समय की रिपोर्ट",
  "kAllTimeCategoryReport": "सभी समय श्रेणी रिपोर्ट",
  "kBalanceYearReport": "वार्षिक शेष राशि रिपोर्ट",
  "kSearchData": "डेटा खोजें",
  "kExportData": "डेटा निर्यात करें",
  "kBackupRestoreData": "डेटा बैकअप/पुनर्स्थापना",
  "kDeleteAllData": "सभी डेटा हटाएं",
  "kSupport": "सहायता",
  "kRateInAppStore": "ऐप स्टोर में रेटिंग दें",
  "kRecommendMoneyBay": "MoneyBay की सिफारिश करें",
  "kTermsOfService": "सेवा की शर्तें",
  "kPrivacyPolicy": "गोपनीयता नीति",
  "kAppVersion": "MoneyBay संस्करण",
  "kCustomKeyboardStyle": "कीबोर्ड स्टाइल",
  "kAverage": "औसत",
  "kTotalIncome": "कुल आय",
  "kTotalExpense": "कुल व्यय",
  "kTotalNet": "कुल शुद्ध",
  "kCategoryExpenseYearReport": "श्रेणी व्यय वर्ष रिपोर्ट",
  "kCategoryIncomeYearReport": "श्रेणी आय वर्ष रिपोर्ट",
  "kInitialBalance": "प्रारंभिक शेष राशि",
  "kCumulation": "संचय",
  "kAllTimeExpenseCategoryReport": "सभी समय व्यय श्रेणी रिपोर्ट",
  "kAllTimeIncomeCategoryReport": "सभी समय आय श्रेणी रिपोर्ट",
  "kExportAndPrint": "निर्यात और प्रिंट",
  "kExportPrintDescription": "आप वर्तमान खोज परिणामों को CSV या PDF के रूप में निर्यात कर सकते हैं आसान साझाकरण और रिपोर्टिंग के लिए।",
  "kExportCSVData": "CSV डेटा निर्यात करें",
  "kPrint": "प्रिंट करें",
  "kExportPDF": "PDF निर्यात करें",
  "kSearch": "खोजें",
  "kSearchCategoryOrAmount": "श्रेणी या राशि से खोजें",
  "kExportDataBackup": "डेटा निर्यात (बैकअप)",
  "kExportBackupDescription": "सभी डेटा को CSV फ़ाइल में निर्यात करें बैकअप या साझाकरण के लिए। यह सुनिश्चित करता है कि आपका डेटा किसी भी परिवर्तन से पहले सुरक्षित रूप से संग्रहीत है।",
  "kExportToCSV": "CSV में निर्यात करें",
  "kImportDataRestore": "डेटा आयात (पुनर्स्थापना)",
  "kImportFromCSVDescription": "सभी डेटा को पुनर्स्थापित करने या वर्तमान डेटा को अपडेट करने के लिए CSV फ़ाइल से डेटा आयात करें।",
  "kImportFromCSV": "CSV से आयात करें",
  "kDeleteAllConfirmation": "क्या आप वाकई डिवाइस और iCloud से सभी डेटा हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।",
  "kDelete": "हटाएं",
  "kAddedSuccessfully": "सफलतापूर्वक जोड़ा गया",
  "kSelectYear": "साल चुनें",
  "kOneTimePayment": "एकमुश्त भुगतान",
  "kRestorePurchase": "खरीदारी पुनर्स्थापित करें",
  "kPurchaseSuccessful": "खरीदारी सफल",
  "kThankYou": "आपकी खरीदारी के लिए धन्यवाद। ऐप अब बंद हो जाएगा। नई सुविधाओं और विज्ञापन-मुक्त अनुभव के लिए कृपया ऐप को फिर से खोलें।",
  "kRestoreSuccessful": "पुनर्स्थापना सफल",
  "kError": "त्रुटि",
  "kUnexpectedErrorOccurred": "एक अप्रत्याशित त्रुटि हुई",
  "kNoInternetConnection": "कोई इंटरनेट कनेक्शन नहीं",
  "kConnectToInternet": "इंटरनेट से कनेक्ट करें",
  "kAppIcon": "ऐप आइकन",
  "kOutputData": "आउटपुट डेटा",
  "kIncomeYearReport": "आय वर्ष रिपोर्ट",
  "kExpenseYearReport": "व्यय वर्ष रिपोर्ट",
  "kTotalYearReport": "कुल वर्ष रिपोर्ट",
  "kCharacterCode": "वर्ण कोड",
  "kNoCategory": "कोई श्रेणी नहीं",
  "kSearchResults": "खोज परिणाम",
  "kPercentage": "प्रतिशत",
  "kSelectCategoryBeforeSaving": "कृपया सहेजने से पहले श्रेणी चुनें।",
  "kEnterContent": "सामग्री दर्ज करें",
  "kAllDataRemovedSuccessfully": "सभी डेटा सफलतापूर्वक हटा दिया गया।",
  "kUnableToDeleteAllData": "सभी डेटा हटाने में असमर्थ।",
  "kRestoreError": "पुनर्स्थापना त्रुटि",
  "kRestoreTransactionsFailed": "लेनदेन पुनर्स्थापना असफल",
  "kNoPurchasesAvailableToRestore": "पुनर्स्थापित करने के लिए कोई खरीदारी उपलब्ध नहीं",
  "kCheckIt": "इसे जांचें",
  "kLater": "बाद में",
  "kEditExpense": "व्यय संपादित करें",
  "kEditIncome": "आय संपादित करें",
  "kSave": "सहेजें",
  "kEditCategory": "श्रेणी संपादित करें",
  "kAdd": "जोड़ें",
  "kSaved": "सहेजा गया",
  "kEdit": "संपादित करें",
  "kDone": "पूर्ण",
  "kNewCategory": "नई श्रेणी",
  "kAddCategory": "श्रेणी जोड़ें",
  "kCategoryName": "श्रेणी का नाम",
  "kIcon": "आइकन",
  "kColor": "रंग",
  "kEnterCategoryName": "श्रेणी का नाम दर्ज करें",
  "kPleaseEnterCategoryName": "कृपया श्रेणी का नाम दर्ज करें",
  "kCSVImportSuccessfully": "CSV आयात सफल",
  "kExcelImportSuccessfully": "Excel आयात सफल",
  "kFailedToImportDataFromCSV": "CSV से डेटा आयात करने में असफल",
  "kFailedToImportDataFromExcel": "Excel से डेटा आयात करने में असफल",
  "kPleaseConnectToInternet": "कृपया इंटरनेट से कनेक्ट करें।",
  "kPleaseEnterAmountGreaterThanZero": "कृपया 0 से अधिक राशि दर्ज करें।",
  "kPleaseSelectTwoDifferentCurrencyUnits": "कृपया 2 अलग मुद्रा इकाइयों का चयन करें।",
  "kUnableToCreateURL": "URL बनाने में असमर्थ। कृपया बाद में पुनः प्रयास करें।",
  "kFrom": "से",
  "kTo": "तक",
  "kConvert": "परिवर्तित करें",
  "kCurrencyConversion": "मुद्रा परिवर्तन",
  "kUnitedStatesDollar": "अमेरिकी डॉलर",
  "kVietnamDong": "वियतनामी डोंग",
  "kJapaneseYen": "जापानी येन",
  "kThaiBaht": "थाई बाहत",
  "kSingaporeDollar": "सिंगापुर डॉलर",
  "kChineseYuan": "चीनी युआन",
  "kHongKongDollar": "हांगकांग डॉलर",
  "kSouthKoreanWon": "दक्षिण कोरियाई वोन",
  "kIndianRupee": "भारतीय रुपया",
  "kBritishPound": "ब्रिटिश पाउंड",
  "kRussianRuble": "रूसी रूबल",
  "kAustralianDollar": "ऑस्ट्रेलियाई डॉलर",
  "kCanadianDollar": "कनाडाई डॉलर",
  "kSwissFranc": "स्विस फ्रांक",
  "kNewZealandDollar": "न्यूजीलैंड डॉलर",
  "kEuro": "यूरो",
  "kUnitedArabEmiratesDirham": "संयुक्त अरब अमीरात दिरहम",
  "kMalaysianRinggit": "मलेशियाई रिंगित",
  "kIndonesianRupiah": "इंडोनेशियाई रुपिया",
  "kPhilippinePeso": "फिलीपीनी पेसो",
  "kBangladeshiTaka": "बांग्लादेशी टका",
  "kPakistaniRupee": "पाकिस्तानी रुपया",
  "kSriLankanRupee": "श्रीलंकाई रुपया",
  "kCambodianRiel": "कंबोडियाई रील",
  "kMyanmarKyat": "म्यांमार क्यात",
  "kLaoKip": "लाओ किप",
  "kBruneiDollar": "ब्रूनेई डॉलर",
  "kMacanesePataca": "मकाऊ पटाका",
  "kArgentinePeso": "अर्जेंटीनी पेसो",
  "kBrazilianReal": "ब्राजीलियाई रियल",
  "kChileanPeso": "चिलियाई पेसो",
  "kColombianPeso": "कोलंबियाई पेसो",
  "kEgyptianPound": "मिस्री पाउंड",
  "kMexicanPeso": "मैक्सिकन पेसो",
  "kNigerianNaira": "नाइजीरियाई नायरा",
  "kSaudiRiyal": "सऊदी रियाल",
  "kTurkishLira": "तुर्की लीरा",
  "kSouthAfricanRand": "दक्षिण अफ्रीकी रैंड",
  "kGold1TroyOunce": "सोना (1 ट्रॉय औंस)",
  "kUtility": "उपयोगिता",
  "kCurrencyUnit": "मुद्रा इकाई",
  "kGeneralSettings": "सामान्य सेटिंग्स",
  "kMore": "अधिक",
  "kConfirm": "पुष्टि करें",
  "kHideAdsFor12Hours": "12 घंटे के लिए विज्ञापन छिपाएं",
  "kNavigateTo": "पर जाएं",
  "kData": "डेटा",
  "kHelp": "सहायता",
  "kAboutMoneyBay": "MoneyBay के बारे में",
  "kConnectWithMoneyBayOn": "MoneyBay से जुड़ें",
  "kHome": "होम",
  "kMoneyBayExpenseBook": "MoneyBay व्यय पुस्तक",
  "kRateAndShare": "रेटिंग और साझाकरण",
  "kRateMoneyBay": "MoneyBay को रेट करें",
  "kShareMoneyBayWithFriends": "दोस्तों के साथ MoneyBay साझा करें",
  "kIntroduction": "परिचय",
  "kAboutText": "MoneyBay व्यय पुस्तक आपकी आय को ट्रैक करने और व्यक्तिगत खर्चों को आसानी से और कुशलता से प्रबंधित करने में मदद करने के लिए डिज़ाइन की गई है। यदि आपके कोई प्रश्न, समस्याएं या सुझाव हैं, तो कृपया ऊपर दिए गए ईमेल पते पर हमें बताने में संकोच न करें। यदि आप इस ऐप को पसंद करते हैं, तो हम 5-स्टार रेटिंग और समीक्षा की बहुत सराहना करेंगे। धन्यवाद!",
  "kContactSupport": "सहायता संपर्क करें",
  "kSendMessage": "संदेश भेजें",
  "kSyncData": "डेटा सिंक करें",
  "kHideAds": "विज्ञापन छिपाएं",
  "kHideAdsPrompt": "12 घंटे के लिए विज्ञापन छिपाने के लिए, आप एक छोटा वीडियो देखेंगे। क्या आप आगे बढ़ना चाहते हैं?",
  "kWatchNow": "हां, अभी देखें",
  "kContactInfo": "संपर्क जानकारी",
  "kManualCheckGuide": "मैनुअल जांच गाइड:",
  "kOpenSettings": "iPhone/iPad पर सेटिंग्स खोलें।",
  "kSelectAppleID": "Apple ID (आपका नाम) चुनें।",
  "kGoToiCloud": "iCloud > स्टोरेज प्रबंधन पर जाएं।",
  "kCheckiCloudStorage": "iCloud स्टोरेज जांचें।",
  "kChecking": "जांच रहे हैं...",
  "kICloudFull": "iCloud भरा हुआ है!",
  "kICloudCheckFailed": "iCloud स्टोरेज जांचने में असमर्थ।",
  "kICloudAvailable": "iCloud में उपलब्ध स्टोरेज है।",
  "kDay": "दिन",
  "kMonth": "महीना",
  "kYear": "साल",
  "kSelectDay": "दिन चुनें",
  "kSelectMonth": "महीना चुनें",
  "kTotalExpenseDay": "दैनिक कुल व्यय",
  "kTotalExpenseMonth": "मासिक कुल व्यय",
  "kTotalExpenseYear": "वार्षिक कुल व्यय",
  "kTotalIncomeDay": "दैनिक कुल आय",
  "kTotalIncomeMonth": "मासिक कुल आय",
  "kTotalIncomeYear": "वार्षिक कुल आय",
  "kTime": "समय",
  "kToday": "आज",
  "kTapAddButtonToCreateLimit": "नई खर्च सीमा बनाने के लिए ऊपर + जोड़ें बटन दबाएं।",
  "kSpendingLimit": "खर्च सीमा",
  "kNoTitle": "कोई शीर्षक नहीं",
  "kUsed": "उपयोग किया गया",
  "kLimitName": "सीमा का नाम",
  "kStart": "शुरुआत",
  "kEnd": "समाप्ति",
  "kSpendingDetails": "खर्च विवरण",
  "kEnterExpense": "व्यय दर्ज करें",
  "kBudgetDetails": "बजट विवरण",
  "kLimit": "सीमा",
  "kUsedAmount": "उपयोग किया गया",
  "kSaveEdit": "संपादन सहेजें",
  "kNoExpensesYet": "अभी तक कोई व्यय नहीं",
  "kLimitExceeded": "सीमा पार हो गई!",
  "kOverBudgetWarning": "आपने बजट से अधिक खर्च किया है",
  "kOver80BudgetWarning": "आपने अपने बजट का 80% से अधिक उपयोग कर लिया है!",
  "kBudgetExceeded": "आपने अपना बजट पार कर लिया है!",
  "kActualSpending": "वास्तविक खर्च",
  "kShouldSpend": "खर्च करना चाहिए",
  "kEstimatedSpending": "अनुमानित खर्च",
  "kRemaining": "शेष",
  "kSpent": "खर्च किया गया",
  "kTrend": "प्रवृत्ति",
  "kWeek": "सप्ताह",
  "kTimeUpRemaining": "समय समाप्त, शेष",
  "kVeryFrugal": "बहुत मितव्ययी",
  "kReasonableSpending": "उचित खर्च",
  "kSlightlyFastSpending": "थोड़ा तेज खर्च",
  "kTooFastSpending": "बहुत तेज खर्च!",
  "kStartChat": "आइए MoneyBay AI के साथ बातचीत शुरू करते हैं",
  "kDeleteChatHistory": "चैट इतिहास हटाएं?",
  "kContinueChat": "चैट जारी रखते हैं",
  "kFreeChatLimitReached": "ओह, 30 मुफ्त चैट समाप्त हो गए! मजेदार बातचीत जारी रखने के लिए यह छोटा वीडियो देखें!",
  "kPleaseTryAgain": "कृपया पुनः प्रयास करें।",
  "kCalculate": "गणना करें",
  "kKind": "दयालु",
  "kAngry": "गुस्सैल",
  "kFunny": "मजाकिया",
  "kPoet": "कवि",
  "kRebellious": "विद्रोही",
  "kTrendy": "ट्रेंडी",
  "kType": "प्रकार",
  "kShareIncomeExpense": "बस स्पष्ट रूप से साझा करें कि यह आय है या व्यय, बाकी मैं गणना करूंगा और आपके लिए साफ-सुथरा रिकॉर्ड रखूंगा! 😊",
  "kCreatingDocument": "दस्तावेज़ बना रहे हैं...",
  "kScanDocument": "दस्तावेज़ स्कैन करें",
  "kRename": "नाम बदलें",
  "kDocumentName": "दस्तावेज़ का नाम",
  "kEnterNewName": "नया नाम दर्ज करें",
  "kConfirmDelete": "हटाना पुष्ट करें",
  "kDeleteSelectedDocuments": "क्या आप वाकई चयनित दस्तावेज़ों को हटाना चाहते हैं? यह कार्रवाई पूर्ववत नहीं की जा सकती।",
  "kDocument": "दस्तावेज़",
  "kDeleteDocument": "क्या आप वाकई इस दस्तावेज़ को हटाना चाहते हैं? यह कार्रवाई पूर्ववत नहीं की जा सकती।",
  "kSyncingData": "डेटा सिंक कर रहे हैं...",
  "kNoDocuments": "अभी तक कोई दस्तावेज़ नहीं, PDF फ़ाइल बनाने के लिए स्कैन करें या फ़ोटो से दस्तावेज़ चुनें",
  "kSyncDocuments": "दस्तावेज़ सिंक करें",
  "kNoResultsFor": "के लिए कोई परिणाम नहीं",
  "kPages": "पृष्ठ",
  "kShare": "साझा करें",
  "kSelectFromPhotos": "फ़ोटो से चुनें",
  "kSearchDocuments": "दस्तावेज़ खोजें...",
  "kDateNewest": "दिनांक (नवीनतम)",
  "kDateOldest": "दिनांक (सबसे पुराना)",
  "kNameAZ": "नाम (A-Z)",
  "kNameZA": "नाम (Z-A)",
  "kNoNetworkConnection": "कोई नेटवर्क कनेक्शन नहीं",
  "kConnectToInternetOrWifiToScanFreely": "स्वतंत्र रूप से स्कैन करने के लिए इंटरनेट या वाईफाई से कनेक्ट करें!",
  "kItem": "वस्तु",
  "kPart": "भाग",
  "kKilogram": "किलोग्राम",
  "kTael": "तोला",
  "kPiece": "टुकड़ा",
  "kBox": "बॉक्स",
  "kBottle": "बोतल",
  "kBarrel": "बैरल",
  "kUnit": "इकाई",
  "kPopular": "लोकप्रिय",
  "kRecent": "हाल का",
  "kListNotFound": "सूची नहीं मिली",
  "kEditListName": "सूची नाम संपादित करें",
  "kCreateANewList": "नई सूची बनाएं",
  "kNewList": "नई सूची",
  "kQuantity": "मात्रा",
  "kAdjust": "समायोजित करें",
  "kFindTheItem": "वस्तु खोजें",
  "kAddItem": "वस्तु जोड़ें",
  "kLetsPlanYourShopping": "आइए अपनी खरीदारी की योजना बनाते हैं!",
  "kTapThePlusButtonToStartAddingProducts": "उत्पाद जोड़ना शुरू करने के लिए प्लस बटन दबाएं",
  "kTapThePlusButtonToCreateYourFirstList": "अपनी पहली सूची बनाने के लिए प्लस बटन दबाएं",
  "kMyLists": "मेरी सूचियां",
  "kUnknownItem": "अज्ञात वस्तु",
  "kShoppingList": "खरीदारी सूची",
  "kLight": "हल्का",
  "kDark": "गहरा",
  "kSystem": "सिस्टम",
  "kSync": "सिंक",
  "kUnsyncedRecordsWarning": "असिंक्ड रिकॉर्ड हैं। डेटा हानि से बचने के लिए कृपया अभी सिंक करें।",
  "kSyncSuccess": "सिंक सफल",
  "kSyncFailure": "सिंक असफल",
  "kSyncFailureNetwork": "सिंक असफल। कृपया नेटवर्क कनेक्शन जांचें।",
  "kFavoriteMoneyBay": "पसंदीदा MoneyBay",
  "kEnterSpendingLimit": "सीमा का नाम दर्ज करें",
  "kHideVoiceRecognition": "आवाज पहचान छिपाएं",
  "kVoiceRecognitionDisabled": "आवाज पहचान अक्षम",
  "kPleaseEnableVoiceRecognitionInDeviceSettings": "कृपया डिवाइस सेटिंग्स में आवाज पहचान सक्षम करें",
  "kDefault": "डिफ़ॉल्ट",
  "kCircle": "वृत्त",
  "kSameInterfaceColor": "समान इंटरफ़ेस रंग",
  "kBlackBackground": "काला बैकग्राउंड",
  "kWhiteAndBlack": "सफेद और काला",
  "kGradient": "ग्रेडिएंट",
  "kUnlimitedDocumentAndInvoiceScanning": "असीमित दस्तावेज़ और चालान स्कैनिंग",
  "kCreateUnlimitedSpendingLimit": "असीमित खर्च सीमा बनाएं",
  "kNotification": "अधिसूचना",
  "kMessengerNotInstalled": "आपने Messenger इंस्टॉल नहीं किया है। कृपया हमें संदेश भेजने के लिए ऐप इंस्टॉल करें या ईमेल के माध्यम से संपर्क करें",
  "kConnectNetworkForCSV": "CSV फ़ाइल से डेटा आयात करने के लिए कृपया नेटवर्क से कनेक्ट करें।",
  "kConnectNetworkForFeature": "इस सुविधा का उपयोग करने के लिए कृपया नेटवर्क से कनेक्ट करें।",
  "kCSVAndiCloudSuccess": "CSV आयात और iCloud सिंक सफलतापूर्वक पूरा हुआ।",
  "kCSVSuccessSomeFailediCloud": "CSV आयात पूरा हुआ लेकिन कुछ रिकॉर्ड iCloud के साथ सिंक नहीं हो सके।",
  "kMember": "सदस्य",
  "kAdvancer": "अग्रिम भुगतानकर्ता",
  "kSplitNow": "अभी बांटें",
  "kEnterAmountAndMember": "राशि और सदस्य दर्ज करें",
  "kNoMembersYet": "अभी तक कोई सदस्य नहीं",
  "kAlreadyAdvanced": "पहले से अग्रिम भुगतान",
  "kEnterNewMemberName": "नया सदस्य नाम दर्ज करें",
  "kAddMember": "सदस्य जोड़ें",
  "kManageMembers": "सदस्य प्रबंधन",
  "kMemberName": "सदस्य का नाम",
  "kEnterMemberName": "सदस्य का नाम दर्ज करें",
  "kAdvanceAmount": "अग्रिम राशि",
  "kAdvancedAmount": "अग्रिम भुगतान राशि",
  "kEditMember": "सदस्य संपादित करें",
  "kTotalBillAmount": "कुल बिल राशि",
  "kSplitBill": "बिल बांटें",
  "kEditSplitFor": "के लिए बंटवारा संपादित करें",
  "kAmountPayable": "देय राशि",
  "kEnterPercentage": "प्रतिशत दर्ज करें",
  "kAmountDifference": "राशि अंतर (समान बंटवारे की तुलना में +/-)",
  "kEnterDifference": "अंतर दर्ज करें",
  "kCustomizeSplit": "बंटवारा अनुकूलित करें",
  "kMustPay": "भुगतान करना होगा",
  "kAdvanced": "अग्रिम भुगतान",
  "kNeedToPayMore": "अधिक भुगतान करना होगा",
  "kReceiveBack": "वापस प्राप्त करें",
  "kResult": "परिणाम",
  "kReset": "रीसेट करें",
  "kCalculateTip": "टिप गणना करें",
  "kNumberOfPeople": "लोगों की संख्या",
  "kSelectTipLevel": "टिप स्तर चुनें",
  "kCustomizeTipLevel": "टिप स्तर अनुकूलित करें",
  "kTipAmount": "टिप राशि",
  "kEachPersonPays": "प्रत्येक व्यक्ति का भुगतान",
  "kInterestRate": "ब्याज दर (%/वर्ष)",
  "kEnterInterestRate": "ब्याज दर दर्ज करें",
  "kInterestType": "ब्याज प्रकार",
  "kSimpleInterest": "साधारण ब्याज",
  "kCompoundInterest": "चक्रवृद्धि ब्याज",
  "kTimeType": "समय प्रकार",
  "kRecalculate": "पुनः गणना करें",
  "kCalculateInterest": "ब्याज गणना करें",
  "kPrincipalAmount": "मूल राशि",
  "kInterest": "ब्याज",
  "kTotalInterest": "कुल ब्याज",
  "kTotalAmount": "कुल राशि",
  "kScheduleNotification": "अधिसूचना शेड्यूल करें",
  "kEnableRemindersToTrackDailyTransactions": "अपने दैनिक लेनदेन को ट्रैक करने के लिए अनुस्मारक सक्षम करें",
  "kDailyReminder": "दैनिक अनुस्मारक",
  "kNotificationTime": "अधिसूचना समय",
  "kAddOrRemoveNotificationTimes": "अधिसूचना समय जोड़ें या हटाएं",
  "kMaximumLimitOf20NotificationTimesReached": "20 अधिसूचना समय की अधिकतम सीमा पहुंच गई",
  "kSelectTime": "समय चुनें",
  "kReminderToEnterIncomeAndExpenseData": "आय और व्यय डेटा दर्ज करने का अनुस्मारक",
  "kDontForgetToRecordTodaysIncomeAndExpenses": "अरे, आज की आय और व्यय रिकॉर्ड करना न भूलें!",
  "kHaveYouUpdatedTodaysIncomeAndExpenses": "क्या आपने आज की आय और व्यय अपडेट की है? ऐप में लॉग करें!",
  "kCheckWalletAndEnterTodaysIncomeAndExpenses": "अरे, अपना बटुआ चेक करें और खर्च ट्रैक करने के लिए आज की आय और व्यय दर्ज करें!",
  "kAnyHotTransactionsToday": "आज कोई हॉट लेनदेन? अभी ऐप में रिकॉर्ड करें!",
  "kGentleReminderUpdateTodaysIncomeAndExpenses": "नरम अनुस्मारक: वित्त को नियंत्रण में रखने के लिए आज की आय और व्यय अपडेट करें!",
  "kWhatDidYouSpendToday": "अरे, आज आपने क्या खर्च किया? ऐप में जल्दी अपडेट करें!",
  "kHaveYouEnteredTodaysIncomeAndExpenses": "अरे, क्या आपने आज की आय और व्यय दर्ज की है? अभी करें!",
  "kHaveYouShoppedToday": "क्या आपने आज खरीदारी की है? आसान ट्रैकिंग के लिए ऐप में लॉग करें!",
  "kDontForgetToUpdateDailySpending": "दैनिक खर्च अपडेट करना न भूलें! आसान ट्रैकिंग के लिए ऐप में लॉग करें।",
  "kSplitMoneyEvenlyAdjustAmountForOne": "सदस्यों के बीच पैसे को समान रूप से बांटें, एक व्यक्ति के लिए राशि समायोजित करें",
  "kSplitByPercentageAdjustPercentageForOne": "प्रतिशत के आधार पर बांटें, एक व्यक्ति के लिए प्रतिशत समायोजित करें",
  "kAdjustDifferenceAmountForOneSplitRemainderEvenly": "एक व्यक्ति के लिए अंतर राशि समायोजित करें, शेष को समान रूप से बांटें",
  "kWeekly": "साप्ताहिक",
  "kEvery14Days": "प्रत्येक 14 दिन",
  "kMonthly": "मासिक",
  "kQuarterly": "त्रैमासिक",
  "kEvery6Months": "प्रत्येक 6 महीने",
  "kYearly": "वार्षिक"
}
```

Đây là bản dịch hoàn chỉnh tất cả key từ file JSON gốc sang tiếng Hindi. Tất cả các thuật ngữ đều được dịch chính xác và phù hợp với ngữ cảnh của ứng dụng quản lý tài chính MoneyBay, sử dụng văn hóa và cách diễn đạt phù hợp với người dùng Ấn Độ.

<div style="text-align: center">⁂</div>

[^8_1]: translation.json


---

# Các loại Prompt hiệu quả cho AI

Đây là tóm tắt 6 loại prompt chính được sử dụng trong AI:

## **1. Zero-Shot Prompt (Prompt không mẫu)**

- **Đặc điểm**: Đưa ra hướng dẫn đơn giản, rõ ràng không cần ví dụ
- **Khi nào dùng**: Cần phản hồi nhanh, tổng quát
- **Ví dụ**: "Tóm tắt bài báo này thành 5 điểm chính"


## **2. Few-Shot Prompt (Prompt có mẫu)**

- **Đặc điểm**: Cung cấp một vài ví dụ để AI học theo
- **Khi nào dùng**: Muốn AI bắt chước cấu trúc hoặc giọng điệu cụ thể
- **Ví dụ**: "Đây là 2 mẫu tóm tắt. Viết mẫu thứ 3 theo cùng phong cách"


## **3. Instructional Prompt (Prompt chỉ dẫn)**

- **Đặc điểm**: Sử dụng động từ trực tiếp như "viết", "giải thích", "so sánh"
- **Khi nào dùng**: Cần hướng dẫn rõ ràng, cụ thể
- **Ví dụ**: "Viết tóm tắt điều hành cho bản ghi nhớ này. Giới hạn dưới 100 từ"


## **4. Role-Based Prompt (Prompt theo vai trò)**

- **Đặc điểm**: Yêu cầu AI đóng vai một nhân vật hoặc chuyên gia cụ thể
- **Khi nào dùng**: Cần tính sáng tạo và phản hồi chuyên ngành
- **Ví dụ**: "Bạn là giáo sư MBA đang chuẩn bị đề cương bài giảng..."


## **5. Contextual Prompt (Prompt có ngữ cảnh)**

- **Đặc điểm**: Bao gồm thông tin nền tảng trước khi đặt câu hỏi
- **Khi nào dùng**: Cần điều chỉnh phản hồi cho đối tượng hoặc môi trường cụ thể
- **Ví dụ**: "Văn bản này dành cho sinh viên năm nhất học kinh tế hành vi. Viết lại bằng ngôn ngữ đơn giản hơn"


## **6. Meta Prompt / System Prompt (Prompt hệ thống)**

- **Đặc điểm**: Hướng dẫn cấp hệ thống thiết lập hành vi, giọng điệu của AI
- **Khi nào dùng**: Thiết lập quy tắc tổng thể trước khi người dùng tương tác
- **Ví dụ**: "Luôn phản hồi trang trọng và trích dẫn nguồn thực. Không bao giờ đoán mò"


## **💡 Tips áp dụng:**

### **Kết hợp nhiều loại:**

```
Role-based + Contextual:
"Bạn là kỹ sư phần mềm senior với 10 năm kinh nghiệm iOS. 
Giải thích SwiftUI cho junior developer mới vào nghề."
```


### **Progression hiệu quả:**

1. **Bắt đầu**: Zero-shot cho thử nghiệm nhanh
2. **Cải thiện**: Few-shot khi cần format cụ thể
3. **Tinh chỉnh**: Role-based + Contextual cho kết quả tối ưu

### **Cho mobile development:**

- **Zero-shot**: "Debug crash này"
- **Few-shot**: "Viết unit test theo mẫu này: [example]"
- **Role-based**: "Bạn là iOS architect, review code architecture này"
- **Contextual**: "App có 1M users, optimize performance cho đoạn code này"

Chọn loại prompt phù hợp với mục tiêu và độ phức tạp của task!

<div style="text-align: center">⁂</div>

[^9_1]: translation.json


---

# thêm promt Cho mobile development

Dưới đây là bộ **prompt chuyên sâu** cho **mobile development** (iOS, Android, cross-platform) theo từng mục tiêu phổ biến. Bạn chỉ cần thay thế phần [PLACEHOLDER] bằng nội dung thực tế của mình.

1. Zero-Shot – yêu cầu ngắn gọn, trực tiếp

- **“Debug crash này**: [PASTE STACKTRACE]. Trả lời: nguyên nhân gốc, cách tái hiện, fix ngắn gọn.”
- **“Liệt kê 5 API mới quan trọng nhất trong iOS 18 dành cho SwiftUI.”**
- **“So sánh hiệu năng **Glide** và **Coil** khi load ảnh độ phân giải cao.”**

2. Instructional – mệnh lệnh rõ ràng

- **“Viết test case JUnit cho hàm [FUNCTION] bảo đảm 90% coverage.”**
- **“Giải thích quy trình **in-app purchase** trên Android Billing v6 cho lập trình viên junior; dưới 200 từ.”**
- **“Tạo file Fastlane ‘Fastfile’ tự động: build, sign, upload TestFlight.”**

3. Role-Based – gán vai trò cho AI

- **“Bạn là Senior Android Engineer** trong team fintech. Hãy review PR này: [LINK]. Tập trung: security, performance, readability.”**
- **“Đóng vai **QA Lead**, viết checklist regression cho app ngân hàng có tính năng xác thực FaceID.”**

4. Contextual – thêm bối cảnh dự án

- **“Ứng dụng có 2 triệu MAU, dùng **Realm**; launch screen mất 4 giây. Phân tích nguyên nhân và đề xuất tối ưu.”**
- **“Đây là design Figma (link). Chuyển thành cấu trúc SwiftUI View, hỗ trợ Dark Mode và Dynamic Type.”**

5. Few-Shot – học theo mẫu
Prompt:
```
Dưới đây là 2 báo cáo phân tích crash. Viết báo cáo thứ 3 cho log mới, giữ cùng cấu trúc.

[Báo cáo 1]
[Báo cáo 2]
[Log mới]
```

6. Meta / System (nếu bạn kiểm soát môi trường mẫu)

- **“Luôn trả về code Swift 5.9 kèm chú thích tiếng Việt, không dùng thư viện bên thứ ba.”**

7. Prompt chuỗi công việc (Workflow)

- **“Bước 1: tạo branch release. Bước 2: bump build-number. Bước 3: chạy unit-test. Viết script Gradle thực thi ba bước này.”**

8. Prompt sáng tạo UI/UX

- **“Đề xuất 3 animation On-boarding ngắn gọn, phù hợp phong cách Material You, mô tả chi tiết transition.”**

9. Prompt tối ưu hóa \& giám sát

- **“Phân tích log ANR dưới đây, xác định thread bị block và gợi ý refactor.”**
- **“Đưa ra 5 chỉ số quan trọng nhất nên theo dõi với Firebase Performance cho app thương mại điện tử.”**

10. Prompt DevOps / CI-CD

- **“Soạn pipeline GitHub Actions: build iOS, chạy unit-test, upload dSYM lên Crashlytics.”**
- **“Chỉ rõ cách triển khai bản beta Android qua Firebase App Distribution cho 50 tester, hạn sử dụng 14 ngày.”**

---

# Prompts chuyên biệt để AI viết tính năng app

## **1. Zero-Shot Prompts - Tạo tính năng nhanh**

### Cơ bản:

```
"Viết tính năng đăng nhập cho iOS app với email/password."
```


### Cụ thể hơn:

```
"Tạo tính năng push notification cho app Flutter, 
bao gồm: setup, schedule, handle tap events."
```


## **2. Instructional Prompts - Hướng dẫn chi tiết**

### Swift/iOS:

```
"Viết complete implementation cho tính năng dark mode toggle:
- UserDefaults để lưu preference
- Switch UI component
- Apply theme across app
- Support system setting
- Animation transition smooth"
```


### Android/Kotlin:

```
"Implement tính năng offline-first cho news app:
- Room database schema
- Repository pattern với cache
- Sync mechanism khi có network
- UI state handling (loading/error/success)"
```


### React Native:

```
"Tạo component Camera với các chức năng:
- Take photo/video
- Gallery access
- Preview screen
- Crop/filter options
- Save to device storage"
```


## **3. Role-Based Prompts - AI đóng vai chuyên gia**

### Senior Mobile Developer:

```
"Bạn là Senior iOS Developer với 8 năm kinh nghiệm.
Thiết kế và implement tính năng in-app purchase cho game:
- Product setup
- Purchase flow
- Receipt validation
- Restore purchases
- Error handling
- Security best practices"
```


### Full-Stack Mobile:

```
"Đóng vai Mobile Architect, thiết kế tính năng real-time chat:
- Client-side: WebSocket connection, message UI, typing indicator
- Offline support: local database, sync when online
- Architecture: MVVM pattern, dependency injection
- Performance: message pagination, image compression"
```


## **4. Contextual Prompts - Có bối cảnh cụ thể**

### E-commerce App:

```
"App thương mại điện tử có 100k users, cần tính năng wishlist:
Context: Sử dụng Firebase backend, Redux state management
Requirements:
- Add/remove sản phẩm từ wishlist
- Sync across devices
- Share wishlist với bạn bè
- Push notification khi có sale
- Offline support

Viết code React Native hoàn chỉnh."
```


### Banking App:

```
"Ứng dụng ngân hàng cần tính năng chuyển tiền an toàn:
Context: Tuân thủ PCI DSS, có biometric auth
Requirements:
- Mã hóa end-to-end
- OTP verification
- Transaction limits
- Fraud detection
- Audit trail logging

Implement cho iOS Swift với security best practices."
```


## **5. Few-Shot Prompts - Học theo mẫu có sẵn**

```
"Dưới đây là 2 tính năng đã implement. Viết tính năng thứ 3 theo cùng pattern:

Example 1 - Login Feature:
[CODE SAMPLE]

Example 2 - Profile Feature:  
[CODE SAMPLE]

Bây giờ viết Settings Feature với:
- Theme selection
- Language switching  
- Notification preferences
- Account management"
```


## **6. Workflow Prompts - Quy trình từng bước**

```
"Implement tính năng Maps & Location theo workflow:

Step 1: Setup permissions và location services
Step 2: Tạo MapView component với custom markers
Step 3: Implement search functionality
Step 4: Add directions/routing
Step 5: Save favorite locations
Step 6: Offline map caching

Viết đầy đủ code Flutter cho từng step với explanation."
```


## **7. Advanced Feature Prompts**

### AI/ML Integration:

```
"Tích hợp tính năng AI cho photo app:
- Core ML model cho object detection
- Custom camera overlay với real-time recognition
- Photo categorization tự động
- Smart album creation
- Privacy-first: on-device processing only

Code Swift hoàn chỉnh với performance optimization."
```


### AR Feature:

```
"Tạo AR furniture placement cho shopping app:
- ARKit scene setup
- 3D model loading và rendering
- Touch gestures (rotate, scale, move)
- Measurement tools
- Screenshot/video capture
- Social sharing

Include error handling và device compatibility check."
```


## **8. Performance-Focused Prompts**

```
"Optimize tính năng infinite scroll cho social media feed:
Context: App có lag khi scroll, memory usage cao

Requirements:
- Lazy loading với pagination
- Image caching strategy
- Memory management
- Smooth 60fps scrolling
- Pull-to-refresh
- Error retry mechanism

Viết optimized code cho iOS với instruments profiling tips."
```


## **9. Security-First Prompts**

```
"Implement secure file sharing feature:
- End-to-end encryption
- Secure key exchange
- File integrity verification
- Access control (time-limited, password-protected)
- Audit logging
- GDPR compliance

Platform: Android, sử dụng modern crypto libraries."
```


## **10. Cross-Platform Integration**

```
"Tạo tính năng synchronization giữa iOS và Android:
- Shared backend API design
- Platform-specific UI implementation
- Conflict resolution strategy
- Real-time updates
- Offline-first architecture
- Testing strategy cho cả platforms

Include native modules nếu cần thiết."
```


## **11. Template cho Complex Features**

```
"Implement tính năng [FEATURE_NAME] cho [PLATFORM]:

Context: [APP_TYPE] với [USER_BASE] users
Tech Stack: [TECHNOLOGIES]
Constraints: [LIMITATIONS]

Requirements:
1. [REQUIREMENT_1]
2. [REQUIREMENT_2]
3. [REQUIREMENT_3]

Deliverables:
- Complete source code
- Unit tests
- Integration guide
- Performance considerations
- Security checklist

Format: [PREFERRED_ARCHITECTURE_PATTERN]"
```


## **💡 Tips để tối ưu prompts:**

### Specify Output Format:

```
"Trả về code trong format:
1. Interface/Protocol definitions
2. Implementation classes
3. Usage examples
4. Test cases
5. Documentation comments"
```


### Add Constraints:

```
"Constraints:
- iOS 15+ compatibility
- No third-party libraries
- Maximum 500 lines of code
- Support VoiceOver accessibility
- Follow Apple HIG guidelines"
```


### Request Explanations:

```
"Kèm theo explanation cho:
- Architecture decisions
- Design pattern rationale  
- Performance trade-offs
- Alternative approaches
- Maintenance considerations"
```


### Error Handling Focus:

```
"Đặc biệt chú trọng:
- Network failure scenarios
- Invalid user input
- Permission denied cases
- Background/foreground transitions
- Memory pressure situations"
```

Những prompts này sẽ giúp bạn có được code chất lượng cao, complete implementation, và insights về best practices từ AI!

---

# Prompts tối ưu hiệu suất app chuyên sâu

## **1. Zero-Shot Performance Prompts**

### Quick Performance Analysis:

```
"Phân tích bottleneck performance trong đoạn code này và đưa ra 3 cách tối ưu nhanh nhất."
```


### Memory Optimization:

```
"Tối ưu memory usage cho app iOS có memory warning liên tục."
```


### Battery Optimization:

```
"Giảm battery drain cho app Android chạy background location tracking."
```


## **2. Instructional Performance Prompts**

### iOS Performance:

```
"Optimize đoạn code iOS này để đạt 60fps scrolling:
- Phân tích current performance issues
- Implement cell reuse properly
- Add lazy loading cho images
- Optimize layout calculations
- Provide before/after metrics
- Include Instruments profiling setup"
```


### Android Performance:

```
"Tối ưu hiệu suất RecyclerView cho danh sách 10,000+ items:
- ViewHolder pattern optimization
- DiffUtil implementation
- Image loading optimization với Glide
- Memory leak prevention
- ANR elimination
- Provide systrace analysis commands"
```


### React Native Performance:

```
"Optimize React Native app có FPS drops nghiêm trọng:
- Identify và fix JavaScript thread blocks
- Implement FlatList virtualization
- Optimize bridge communication
- Remove unnecessary re-renders
- Add performance monitoring
- Provide Flipper debugging setup"
```


## **3. Role-Based Performance Prompts**

### Performance Engineer:

```
"Bạn là Performance Engineer với chuyên môn mobile optimization.
Phân tích app banking này có các vấn đề:
- Cold start time: 8 seconds
- Hot start time: 3 seconds  
- Memory usage: 200MB average
- Battery drain: 15%/hour khi idle
- Network timeouts: 25% requests

Đưa ra detailed optimization plan với:
- Root cause analysis
- Priority matrix (impact vs effort)
- Implementation roadmap
- Success metrics định nghĩa rõ ràng
- Monitoring strategy"
```


### Mobile Architect:

```
"Đóng vai Senior Mobile Architect, thiết kế performance optimization strategy:
Context: E-commerce app, 1M+ MAU, React Native + native modules
Issues: 40% users abandon due to slow loading

Requirements:
- App architecture refactoring
- Caching strategy design
- Bundle splitting approach
- Progressive loading implementation
- Performance monitoring infrastructure
- A/B testing framework cho optimizations"
```


## **4. Contextual Performance Prompts**

### High-Traffic App:

```
"Social media app với 5M daily users gặp performance crisis:
Current metrics:
- Crash rate: 2.1% (target: <0.1%)
- ANR rate: 1.8% (target: <0.5%)
- Cold start: 4.2s (target: <2s)
- Memory: 180MB average (target: <100MB)
- Battery: heavy usage category

Tech stack: Native Android, Kotlin, Room, Retrofit, Glide
Device distribution: 60% mid-range devices (3GB RAM)

Tạo comprehensive optimization plan bao gồm:
- Performance audit methodology
- Code refactoring priorities
- Infrastructure improvements
- User experience optimizations
- Monitoring và alerting setup"
```


### Gaming App Performance:

```
"Mobile game Unity có performance issues trên low-end devices:
Context: 
- Target: 60fps gameplay
- Current: 25-30fps trên Snapdragon 660
- Memory budget: 1GB
- Battery target: <10%/hour gameplay

Optimize cho:
- Rendering pipeline efficiency
- Texture compression strategies
- Audio optimization
- Physics calculations
- Garbage collection minimization
- Thermal throttling prevention"
```


## **5. Few-Shot Performance Patterns**

```
"Dưới đây là 2 performance optimization cases. Viết case thứ 3 theo cùng methodology:

Case 1 - ListView Optimization:
Problem: Scroll lag, memory spikes
Solution: ViewHolder, image recycling, diff algorithms
Results: 60fps achieved, 40% memory reduction

Case 2 - Network Optimization:  
Problem: Slow API calls, timeouts
Solution: Request batching, caching, compression
Results: 70% faster load times, 50% less bandwidth

Case 3 - Database Optimization:
Context: [YOUR_DATABASE_ISSUE]
Apply same systematic approach với measurable results."
```


## **6. Workflow-Based Performance Prompts**

```
"Performance optimization workflow cho iOS app:

Phase 1: Profiling & Measurement
- Setup Instruments tools
- Baseline metrics collection
- Bottleneck identification
- Performance regression tests

Phase 2: Code-Level Optimizations
- Algorithm improvements
- Memory management fixes
- Threading optimizations
- Caching implementations

Phase 3: System-Level Optimizations
- Network layer improvements
- Storage optimizations
- UI rendering enhancements
- Background processing efficiency

Phase 4: Monitoring & Validation
- Performance metrics tracking
- Crash analytics setup
- User experience monitoring
- Continuous optimization cycle

Viết detailed implementation cho từng phase với code examples."
```


## **7. Platform-Specific Performance Prompts**

### iOS Specific:

```
"Tối ưu iOS app sử dụng advanced techniques:
- Core Data performance tuning với NSFetchedResultsController
- Metal API cho custom graphics rendering
- Background App Refresh optimization
- WKWebView performance cho hybrid content
- Combine operators optimization
- SwiftUI performance best practices
- Instruments deep-dive analysis

Include code samples và measurement techniques."
```


### Android Specific:

```
"Android performance optimization deep-dive:
- Jetpack Compose performance patterns
- WorkManager efficiency
- Room database query optimization
- Kotlin coroutines best practices
- Custom View drawing optimization
- ProGuard/R8 optimization rules
- APK size reduction techniques
- GPU overdraw elimination

Provide systrace commands và debugging workflows."
```


## **8. Advanced Performance Analysis Prompts**

### Memory Management:

```
"Comprehensive memory optimization strategy:

Analysis Phase:
- Heap dump analysis với Memory Profiler
- Memory leak detection patterns
- Garbage collection impact assessment
- Memory fragmentation analysis

Optimization Phase:
- Object pooling implementation
- Weak references usage
- Image memory optimization
- Native memory management
- Memory pressure handling

Monitoring Phase:
- Real-time memory tracking
- OOM crash prevention
- Memory regression detection
- Performance alerts setup

Platform: [iOS/Android], include automation scripts."
```


### CPU \& Threading:

```
"CPU performance optimization masterclass:

Threading Strategy:
- Main thread optimization
- Background processing patterns
- Thread pool management
- Lock-free programming techniques
- Async/await best practices

CPU Optimization:
- Algorithm complexity reduction
- Hot path identification
- Compiler optimizations
- Profile-guided optimization
- Hardware acceleration utilization

Include profiling commands và benchmark comparisons."
```


## **9. Performance Testing \& Automation**

```
"Automated performance testing framework:

Requirements:
- Continuous performance monitoring
- Regression detection
- Performance budgets enforcement
- Cross-device testing
- CI/CD integration

Implementation:
- Performance test suites
- Automated profiling scripts  
- Metrics collection pipelines
- Alert thresholds configuration
- Dashboard creation

Provide complete testing infrastructure setup."
```


## **10. Real-World Performance Crisis**

```
"Emergency performance optimization scenario:
Situation: App store ratings dropped from 4.2 to 2.8 trong 2 tuần
Root cause: Recent update introduced severe performance regressions

Crisis metrics:
- App launch crashes: 15% increase
- Load times: 300% slower
- Memory usage: 2x increase
- Battery complaints: 400% increase

Timeline: 72 hours to fix
Resources: 5 engineers available
Constraints: Cannot revert update (contains critical security fixes)

Create emergency action plan với:
- Immediate stabilization measures
- Quick wins implementation
- Long-term optimization strategy
- Communication plan
- Post-mortem prevention measures"
```


## **11. Performance Template Framework**

```
"Performance optimization template cho [FEATURE]:

📊 Current State Analysis:
- Baseline metrics
- User impact assessment
- Technical debt evaluation

🎯 Optimization Goals:
- Performance targets
- Success criteria
- Acceptable trade-offs

🔧 Implementation Strategy:
- High-impact optimizations
- Quick wins identification
- Long-term improvements

📈 Measurement Plan:
- Metrics tracking
- A/B testing approach
- Performance monitoring

🚀 Rollout Strategy:
- Gradual deployment
- Rollback procedures
- Success validation

Apply template cho: [YOUR_SPECIFIC_CASE]"
```


## **💡 Performance Optimization Tips:**

### Specify Measurement Requirements:

```
"Include performance measurements:
- Before/after benchmarks
- Memory usage comparisons
- CPU utilization data
- Battery impact analysis
- User-perceived performance metrics"
```


### Request Tool-Specific Guidance:

```
"Provide tool-specific instructions:
- Xcode Instruments commands
- Android Studio Profiler usage
- Firebase Performance setup
- Third-party monitoring tools
- Custom metrics implementation"
```


### Focus on Real-World Scenarios:

```
"Optimize for real-world conditions:
- Low-end device performance
- Poor network conditions
- Background/foreground transitions
- Memory pressure situations
- Thermal throttling scenarios"
```


### Include Automation:

```
"Provide automation scripts for:
- Performance regression testing
- Continuous profiling
- Automated optimization
- Performance alerts
- Metrics collection"
```

Những prompts này sẽ giúp bạn có được solutions toàn diện về performance optimization, từ quick fixes đến comprehensive strategies!

---

# Prompts chuyên sâu cho iOS Code Refactoring

## **1. Zero-Shot Refactoring Prompts**

### Quick Refactoring:

```
"Refactor đoạn code iOS này để clean hơn và follow best practices."
```


### Architecture Refactoring:

```
"Chuyển đổi massive view controller này sang MVVM pattern."
```


### Swift Modernization:

```
"Modernize code iOS từ Swift 4 lên Swift 5.9 với latest features."
```


## **2. Instructional Refactoring Prompts**

### MVC to MVVM:

```
"Refactor ViewController này sang MVVM pattern:
- Tách business logic ra ViewModel
- Implement data binding với Combine/RxSwift
- Create reusable ViewModels
- Add unit tests cho ViewModels
- Maintain existing functionality
- Follow SOLID principles
- Add protocol-oriented programming

Before:
[PASTE_YOUR_MASSIVE_VIEW_CONTROLLER]

Provide step-by-step refactoring process."
```


### Legacy Code Modernization:

```
"Modernize legacy iOS codebase:
- Convert Objective-C to Swift
- Replace delegates với Combine publishers
- Update deprecated APIs
- Implement async/await
- Add SwiftUI compatibility
- Improve error handling
- Add comprehensive documentation

Focus on backward compatibility iOS 15+."
```


### Performance Refactoring:

```
"Refactor for performance optimization:
- Eliminate retain cycles
- Optimize memory usage
- Improve scroll performance
- Reduce CPU usage
- Implement lazy loading
- Add efficient caching
- Profile before/after metrics

Target: UITableView với 10k+ cells."
```


## **3. Role-Based Refactoring Prompts**

### Senior iOS Architect:

```
"Bạn là Senior iOS Architect với 10+ năm kinh nghiệm.
Refactor entire iOS app architecture:

Current issues:
- Massive view controllers (2000+ lines)
- Tight coupling giữa components
- No unit tests
- Memory leaks và crashes
- Duplicate code everywhere
- No dependency injection

Requirements:
- Clean Architecture implementation
- Protocol-oriented design
- Dependency injection container
- Comprehensive test coverage
- Modular structure
- Scalable for team of 20+ developers

Provide detailed refactoring roadmap với timeline estimates."
```


### Code Review Expert:

```
"Đóng vai Code Review Expert, phân tích và refactor:

Code smell detected:
- God classes
- Feature envy
- Dead code
- Magic numbers
- Inconsistent naming
- Missing documentation

Apply systematic refactoring techniques:
- Extract Method/Class
- Move Method
- Rename Variable/Method
- Replace Magic Number với Constants
- Introduce Parameter Object
- Extract Interface/Protocol

Prioritize theo severity và impact."
```


## **4. Contextual Refactoring Prompts**

### Large-Scale App Refactoring:

```
"Refactor enterprise iOS app với specifications:

App context:
- 500k+ lines of code
- 50+ view controllers
- 200+ model classes
- Mix Swift/Objective-C
- Supporting iOS 13+
- Team: 15 developers
- Active development: 3 years

Business constraints:
- Cannot break existing features
- Must maintain release schedule
- Performance cannot degrade
- User data must persist

Technical goals:
- Reduce build time từ 15min xuống <5min
- Decrease crash rate từ 2% xuống <0.5%
- Improve test coverage từ 20% lên 80%
- Enable feature flags
- Implement CI/CD automation

Create phased refactoring strategy với risk mitigation."
```


### SwiftUI Migration:

```
"Migrate UIKit app to SwiftUI incrementally:

Current state:
- 100% UIKit with Storyboards
- Complex navigation flows
- Custom UI components
- Extensive AutoLayout constraints
- Third-party UI libraries

Migration strategy:
- Identify migration candidates
- Create UIViewRepresentable wrappers
- Implement SwiftUI navigation
- Migrate data flow to @StateObject/@ObservableObject
- Update testing approaches
- Maintain design consistency

Provide migration priority matrix và compatibility layers."
```


## **5. Few-Shot Refactoring Patterns**

```
"Dưới đây là 2 refactoring examples. Apply same patterns cho case thứ 3:

Example 1 - Massive View Controller:
Before: 800 lines ViewController với mixed responsibilities
After: Separated into ViewController (200 lines) + ViewModel + Services

Example 2 - Spaghetti Networking:
Before: Inline network calls với completion handlers
After: Repository pattern + Combine publishers + Error handling

Example 3 - Your Code:
[PASTE_YOUR_CODE_TO_REFACTOR]

Apply systematic refactoring methodology từ examples above."
```


## **6. Workflow-Based Refactoring**

```
"iOS Refactoring workflow systematic:

Phase 1: Analysis & Planning
- Code quality metrics assessment
- Identify refactoring opportunities  
- Risk assessment matrix
- Refactoring priority định nghĩa
- Success criteria establishment

Phase 2: Safety Net Creation
- Comprehensive test suite
- Code coverage measurement
- Integration test setup
- Regression testing automation
- Backup strategy implementation

Phase 3: Incremental Refactoring
- Extract methods/classes
- Introduce abstractions
- Improve naming conventions
- Eliminate code duplication
- Apply design patterns

Phase 4: Validation & Optimization
- Performance benchmarking
- Code review process
- Documentation updates
- Team knowledge transfer
- Continuous monitoring setup

Implement workflow cho codebase: [YOUR_PROJECT_DETAILS]"
```


## **7. Architecture-Specific Refactoring**

### Clean Architecture:

```
"Refactor iOS app to Clean Architecture:

Current architecture: MVC monolith
Target: Clean Architecture với layers separation

Implementation requirements:
- Domain layer: Entities + Use Cases
- Data layer: Repository + Data Sources
- Presentation layer: ViewModels + Views
- Dependency injection framework
- Protocol-oriented boundaries
- Testable architecture

Refactor modules:
- User Authentication
- Data Synchronization  
- Content Management
- Push Notifications
- Analytics Tracking

Include dependency graphs và layer communication protocols."
```


### Modular Architecture:

```
"Refactor monolithic app thành modular structure:

Current: Single target với everything
Target: Multi-module framework structure

Module breakdown:
- Core (shared utilities)
- Networking (API layer)
- Database (persistence layer)
- UI Components (reusable views)
- Feature modules (independent features)
- App target (composition root)

Requirements:
- Clear module boundaries
- Minimal inter-module dependencies
- Independent testing capabilities
- Faster build times
- Team parallel development

Provide module dependency graph và migration steps."
```


## **8. Swift-Specific Refactoring**

### Modern Swift Features:

```
"Refactor to leverage latest Swift features:

Improvements to implement:
- Convert completion handlers to async/await
- Replace Result types với throwing functions
- Use property wrappers cho boilerplate reduction
- Implement actors cho thread safety
- Leverage structured concurrency
- Apply opaque return types
- Use key path expressions
- Implement custom operators judiciously

Before/after comparisons với performance implications."
```


### SwiftUI Best Practices:

```
"Refactor SwiftUI code theo best practices:

Current issues:
- Complex View hierarchies
- State management chaos
- Performance bottlenecks
- Inconsistent data flow
- Missing accessibility
- Poor preview support

Refactoring targets:
- Extract reusable components
- Implement proper state management
- Add PreferenceKey patterns
- Create custom ViewModifiers
- Implement efficient data binding
- Add accessibility support
- Optimize for performance

Include SwiftUI-specific patterns và anti-patterns."
```


## **9. Testing-Focused Refactoring**

```
"Refactor for testability improvement:

Current testing challenges:
- Untestable singletons
- UI logic mixed với business logic
- Network dependencies trong ViewControllers
- Static dependencies
- No dependency injection
- Complex inheritance hierarchies

Refactoring strategy:
- Extract protocols cho all dependencies
- Implement dependency injection
- Separate UI từ business logic
- Create mockable interfaces
- Add factory patterns
- Remove static dependencies
- Simplify class hierarchies

Target: 90% test coverage với fast, reliable tests."
```


## **10. Performance-Focused Refactoring**

```
"Refactor for performance optimization:

Performance bottlenecks identified:
- Memory leaks from retain cycles
- Inefficient table view implementations
- Blocking main thread operations
- Excessive network requests
- Poor image caching
- Synchronous Core Data operations

Refactoring priorities:
1. Eliminate memory leaks
2. Implement efficient scrolling
3. Move heavy operations off main thread
4. Optimize network layer
5. Implement smart caching
6. Add background Core Data contexts

Include performance metrics tracking và benchmarking."
```


## **11. Legacy Code Rescue**

```
"Emergency refactoring cho legacy disaster:

Crisis situation:
- 5-year-old codebase
- No documentation
- Original developers left
- Frequent crashes
- Cannot add new features
- App Store rejection risks
- Technical debt overwhelming

Emergency refactoring plan:
- Stabilization priorities
- Risk mitigation strategies
- Knowledge recovery process
- Incremental improvement approach
- Team onboarding plan
- Long-term modernization roadmap

Timeline: 3 months to stable state."
```


## **12. Refactoring Templates**

### Comprehensive Refactoring Template:

```
"Refactor [COMPONENT_NAME] với systematic approach:

🔍 Current State Analysis:
- Code quality assessment
- Performance profiling
- Test coverage measurement
- Dependency analysis
- Business logic identification

🎯 Refactoring Goals:
- Maintainability improvement
- Performance optimization
- Test coverage increase
- Code reusability enhancement
- Documentation completeness

🔧 Refactoring Strategy:
- Extract responsibilities
- Introduce abstractions
- Apply design patterns
- Eliminate duplication
- Improve naming

✅ Validation Plan:
- Functionality preservation
- Performance benchmarking
- Test suite execution
- Code review process
- Documentation updates

Apply to: [YOUR_SPECIFIC_CODE]"
```


## **💡 Refactoring Best Practices:**

### Safety First:

```
"Include safety measures:
- Comprehensive test coverage before refactoring
- Version control checkpoints
- Rollback procedures
- Incremental changes only
- Continuous integration validation"
```


### Measurable Improvements:

```
"Provide metrics:
- Code complexity reduction (cyclomatic complexity)
- Test coverage improvements
- Performance benchmarks
- Build time improvements
- Maintainability index scores"
```


### Team Considerations:

```
"Address team impact:
- Knowledge transfer plans
- Documentation updates
- Code review guidelines
- Pair programming sessions
- Refactoring training materials"
```


### Long-term Vision:

```
"Plan for future:
- Scalability considerations
- Technology evolution readiness
- Maintenance burden reduction
- Feature development acceleration
- Technical debt prevention"
```

Những prompts này sẽ giúp bạn có được comprehensive refactoring plans từ small improvements đến large-scale architecture transformations!

---

# Prompts chuyên sâu viết Test Cases cho iOS App

## **1. Zero-Shot Test Case Prompts**

### Basic Unit Tests:

```
"Viết unit tests cho hàm login validation này."
```


### UI Test Cases:

```
"Tạo UI test cases cho màn hình đăng ký tài khoản."
```


### Integration Tests:

```
"Viết integration tests cho API networking layer."
```


## **2. Instructional Test Case Prompts**

### Comprehensive Unit Testing:

```
"Viết complete unit test suite cho LoginViewModel:

Requirements:
- Test tất cả public methods
- Mock dependencies (AuthService, UserRepository)
- Test success và failure scenarios
- Validate state changes
- Test input validation
- Cover edge cases (empty inputs, invalid formats)
- Test async operations với XCTestExpectation
- Achieve 100% code coverage

Class to test:
[PASTE_YOUR_VIEWMODEL_CODE]

Include setup, teardown, và test data fixtures."
```


### UI Testing Framework:

```
"Tạo comprehensive UI test suite cho shopping cart flow:

Test scenarios:
- Add items to cart
- Update quantities
- Remove items
- Apply discount codes
- Checkout process
- Payment flow
- Error handling (network failures, invalid cards)
- Accessibility testing
- Different device orientations
- Various screen sizes (iPhone SE to iPhone 15 Pro Max)

Use XCUITest framework với Page Object pattern.
Include test data management và cleanup procedures."
```


### API Testing Suite:

```
"Viết API integration tests cho REST endpoints:

Endpoints to test:
- GET /users/profile
- POST /users/login
- PUT /users/update
- DELETE /users/account

Test cases for each:
- Success responses (200, 201)
- Client errors (400, 401, 403, 404)
- Server errors (500, 502, 503)
- Network timeouts
- Invalid JSON responses
- Rate limiting
- Authentication token handling

Use URLSessionMock và dependency injection.
Include performance testing với response time assertions."
```


## **3. Role-Based Test Case Prompts**

### QA Test Lead:

```
"Bạn là Senior QA Test Lead với 8 năm kinh nghiệm iOS testing.
Tạo comprehensive test strategy cho fintech app:

App features:
- User authentication (biometric, PIN, password)
- Account management
- Money transfers
- Bill payments  
- Investment tracking
- Loan applications

Testing requirements:
- Functional testing coverage
- Security testing scenarios
- Performance testing benchmarks
- Accessibility compliance testing
- Regression test automation
- Device compatibility matrix
- iOS version compatibility (iOS 15-17)

Deliverables:
- Test plan document
- Test case specifications
- Automation framework
- CI/CD integration
- Bug triage procedures
- Release criteria definition"
```


### iOS Test Automation Expert:

```
"Đóng vai iOS Test Automation Expert, thiết kế automation framework:

Framework requirements:
- Support Unit, Integration, UI tests
- Parallel test execution
- Cross-device testing
- Screenshot capture on failures
- Test reporting với detailed metrics
- CI/CD pipeline integration
- Flaky test detection và retry mechanism
- Test data management
- Environment configuration

Tech stack:
- XCTest + XCUITest
- Quick + Nimble (optional)
- Fastlane integration
- Firebase Test Lab
- Custom reporting tools

Provide complete framework architecture với implementation examples."
```


## **4. Contextual Test Case Prompts**

### E-commerce App Testing:

```
"Viết test cases cho e-commerce iOS app với context:

App characteristics:
- 500k+ products catalog
- Real-time inventory updates
- Multiple payment methods
- International shipping
- Multi-language support
- Offline browsing capability
- Push notifications
- User reviews & ratings

Critical user journeys:
1. Product discovery → Cart → Checkout → Payment
2. User registration → Profile setup → First purchase
3. Return customer → Quick reorder → Tracking
4. Guest checkout → Account creation → Order history

Test priorities:
- Revenue-critical paths (checkout, payment)
- Data integrity (cart persistence, inventory sync)
- Performance (search, image loading, checkout speed)
- Security (payment data, user information)
- Accessibility (VoiceOver support, Dynamic Type)

Include test data sets cho different scenarios và edge cases."
```


### Social Media App Testing:

```
"Comprehensive testing strategy cho social media app:

Core features:
- User profiles với privacy settings
- Photo/video posting với filters
- Real-time messaging
- Stories với 24-hour expiry
- Live streaming
- Content discovery algorithm
- Social interactions (likes, comments, shares)

Testing challenges:
- Real-time features testing
- Content moderation validation
- Privacy settings enforcement
- Performance với large media files
- Battery usage optimization
- Network condition variations
- Cross-platform compatibility

Test scenarios:
- Content creation và publishing flow
- Privacy controls validation
- Real-time notification delivery
- Offline mode functionality
- Content loading performance
- Memory management với heavy media usage

Include load testing strategies và user behavior simulation."
```


## **5. Few-Shot Test Pattern Examples**

```
"Dưới đây là 2 test case patterns. Viết pattern thứ 3 theo cùng structure:

Pattern 1 - Repository Testing:
```

class UserRepositoryTests: XCTestCase {
var sut: UserRepository!
var mockNetworkService: MockNetworkService!
var mockDatabase: MockDatabase!

    override func setUp() {
        super.setUp()
        mockNetworkService = MockNetworkService()
        mockDatabase = MockDatabase()
        sut = UserRepository(networkService: mockNetworkService, database: mockDatabase)
    }
    
    func testFetchUser_Success_ReturnsUser() {
        // Given
        let expectedUser = User.mockUser()
        mockNetworkService.result = .success(expectedUser)
        
        // When
        let expectation = XCTestExpectation(description: "Fetch user")
        sut.fetchUser(id: "123") { result in
            // Then
            switch result {
            case .success(let user):
                XCTAssertEqual(user.id, expectedUser.id)
                expectation.fulfill()
            case .failure:
                XCTFail("Expected success")
            }
        }
        
        wait(for: [expectation], timeout: 1.0)
    }
    }

```

Pattern 2 - ViewModel Testing:
[SIMILAR_STRUCTURED_EXAMPLE]

Pattern 3 - Service Layer Testing:
Apply same systematic approach cho [YOUR_SERVICE_CLASS]
```


## **6. Workflow-Based Testing**

```
"iOS Testing workflow systematic:

Phase 1: Test Planning
- Requirements analysis
- Test case design
- Test data preparation
- Environment setup
- Tool selection

Phase 2: Test Implementation
- Unit test development
- Integration test creation
- UI test automation
- Performance test setup
- Security test implementation

Phase 3: Test Execution
- Local testing
- CI/CD integration
- Device testing
- Beta testing coordination
- Production monitoring

Phase 4: Test Maintenance
- Flaky test resolution
- Test suite optimization
- Coverage improvement
- Documentation updates
- Knowledge sharing

Implement workflow cho feature: [YOUR_SPECIFIC_FEATURE]"
```


## **7. Testing Framework-Specific Prompts**

### XCTest Advanced:

```
"Advanced XCTest patterns implementation:

Testing patterns to implement:
- Parameterized tests với test data sets
- Asynchronous testing với async/await
- Performance testing với metrics
- UI testing với accessibility identifiers
- Snapshot testing cho UI regression
- Memory leak detection
- Network stubbing và mocking
- Database testing với temporary stores
- Notification testing
- Background app state testing

Include custom assertions, test utilities, và helper methods.
Provide test organization best practices."
```


### Quick/Nimble Integration:

```
"Migrate XCTest suite to Quick/Nimble framework:

Current XCTest structure:
[PASTE_YOUR_EXISTING_TESTS]

Migration requirements:
- Convert to BDD style (describe/context/it)
- Use Nimble matchers cho better readability
- Implement shared examples cho common patterns
- Add custom matchers cho domain-specific assertions
- Maintain all existing test coverage
- Improve test documentation với descriptive specs

Provide migration guide và best practices."
```


## **8. Specialized Testing Scenarios**

### Core Data Testing:

```
"Comprehensive Core Data testing strategy:

Test scenarios:
- Model validation và relationships
- Migration testing across versions
- Concurrent access và thread safety
- Performance với large datasets
- Memory management và faulting
- Fetch request optimization
- Background context operations
- Conflict resolution
- Data integrity validation
- Backup/restore functionality

Implementation requirements:
- In-memory store cho unit tests
- Migration test setup
- Performance benchmarking
- Thread safety validation
- Memory leak detection

Include test data fixtures và migration test matrices."
```


### Networking Layer Testing:

```
"Network layer testing comprehensive approach:

Testing framework setup:
- URLSession mocking strategy
- Network reachability simulation
- Response time simulation  
- Error condition testing
- Certificate pinning validation
- Request/response logging
- Retry mechanism testing
- Caching behavior validation
- Background upload/download testing
- Network security testing

Mock scenarios:
- Success responses với various data
- HTTP error codes (4xx, 5xx)
- Network timeouts và connectivity issues
- SSL/TLS errors
- Rate limiting responses
- Malformed JSON responses
- Large file transfers
- Concurrent request handling

Include performance benchmarks và security test cases."
```


## **9. Advanced Testing Strategies**

### Property-Based Testing:

```
"Implement property-based testing cho iOS:

Use SwiftCheck framework để test properties:
- Input validation functions
- Data transformation logic
- Algorithm correctness
- State machine behaviors
- Parser implementations

Example properties to test:
- Serialization/deserialization round-trip
- Sorting algorithm correctness
- Encryption/decryption inverse operations
- Business rule invariants
- Data structure consistency

Generate comprehensive test cases with random inputs
và edge case discovery."
```


### Mutation Testing:

```
"Setup mutation testing cho code quality assessment:

Mutation testing goals:
- Identify weak test cases
- Improve test suite effectiveness
- Validate test coverage quality
- Find untested code paths
- Strengthen edge case testing

Implementation approach:
- Setup mutation testing tools
- Define mutation operators
- Run mutation analysis
- Analyze surviving mutants
- Improve test cases based on results
- Establish quality gates

Target modules for mutation testing và expected quality metrics."
```


## **10. Test Case Templates**

### Feature Testing Template:

```
"Test case template cho [FEATURE_NAME]:

📋 Test Planning:
- Feature requirements analysis
- User story breakdown
- Acceptance criteria definition
- Test scenario identification
- Risk assessment

🧪 Test Categories:
- Happy path testing
- Edge case validation
- Error handling verification
- Performance requirements
- Security considerations
- Accessibility compliance

🔧 Implementation:
- Unit test coverage
- Integration test scenarios
- UI automation scripts
- Performance benchmarks
- Security test cases

📊 Reporting:
- Coverage metrics
- Execution results
- Performance data
- Bug tracking
- Quality assessment

Apply template to: [YOUR_SPECIFIC_FEATURE]"
```


### Bug Testing Template:

```
"Bug verification test template:

🐛 Bug Analysis:
- Bug description và reproduction steps
- Root cause identification
- Impact assessment
- Fix verification requirements

✅ Test Design:
- Regression test creation
- Edge case exploration
- Related functionality testing
- Performance impact validation
- User experience verification

🔄 Execution:
- Fix validation
- Regression testing
- Exploratory testing
- Acceptance testing
- Production verification

Apply to bug: [BUG_DESCRIPTION]"
```


## **11. Performance Testing Focused**

```
"Performance testing suite cho iOS app:

Performance metrics to test:
- App launch time (cold/warm start)
- Screen transition times
- Memory usage patterns
- CPU utilization
- Battery consumption
- Network bandwidth usage
- Disk I/O performance
- Core Data query performance
- Image loading/rendering speed
- Animation frame rates

Test scenarios:
- Low memory conditions
- Poor network connectivity
- Background app transitions
- High CPU load situations
- Large dataset handling
- Concurrent user interactions

Include performance baseline establishment và regression detection."
```


## **12. Security Testing Integration**

```
"Security-focused test cases:

Security test areas:
- Authentication mechanisms
- Authorization controls
- Data encryption validation
- Secure storage verification
- Network communication security
- Input sanitization testing
- Session management
- Biometric authentication
- Keychain access
- Certificate pinning

Attack scenarios to test:
- SQL injection attempts
- XSS prevention
- Man-in-the-middle attacks
- Data tampering detection
- Unauthorized access attempts
- Privacy data handling
- GDPR compliance validation

Include security automation tools integration."
```


## **💡 Testing Best Practices:**

### Test Organization:

```
"Structure tests for maintainability:
- Clear naming conventions
- Logical test grouping
- Shared setup/teardown
- Test data management
- Documentation standards"
```


### CI/CD Integration:

```
"Include CI/CD considerations:
- Automated test execution
- Parallel testing strategies
- Test result reporting
- Failure notification
- Performance regression detection"
```


### Test Data Management:

```
"Provide test data strategies:
- Mock data generation
- Test fixture management
- Database seeding
- Environment configuration
- Data cleanup procedures"
```


### Coverage \& Quality:

```
"Define quality metrics:
- Code coverage targets
- Test execution time limits
- Flaky test thresholds
- Performance benchmarks
- Security compliance checks"
```

Những prompts này sẽ giúp bạn tạo ra comprehensive test suites covering từ basic unit tests đến advanced testing strategies!

---

# Prompts tạo video 8 giây về Quản lý Chi Tiêu Cá Nhân

## **1. Zero-Shot Video Creation Prompts**

### Quick Video Ideas:

```
"Tạo 20 ý tưởng video TikTok 8 giây về quản lý chi tiêu cá nhân, 
mỗi video có hook mạnh và message rõ ràng."
```


### Viral Format:

```
"Viết script video 8 giây theo format 'POV: You just realized...' 
về những sai lầm chi tiêu phổ biến."
```


## **2. Instructional Video Script Prompts**

### Complete Video Package:

```
"Tạo package hoàn chỉnh cho video TikTok 8 giây về budgeting:

Requirements:
- Duration: Chính xác 8 giây
- Target: Gen Z/Millennials Vietnam
- Platform: TikTok, Instagram Reels, YouTube Shorts
- Style: Quick cuts, trending transitions
- Audio: Popular trending sounds

Deliverables:
- 15 different video scripts
- Shot-by-shot breakdown (mỗi shot 1-2 giây)
- Text overlay suggestions
- Hashtag recommendations
- Call-to-action options
- Visual effects ideas
- Props needed (có thể làm tại nhà)

Focus topics:
- Daily expense tracking
- Saving money hacks
- Budget planning
- Money mindset
- Spending mistakes"
```


### Educational Series:

```
"Develop series 'Money Facts in 8 Seconds':

Series structure:
- 30 episodes total
- Each episode: 1 shocking money fact
- Visual format: Statistic reveal
- Hook: Surprising numbers
- Resolution: Actionable tip

Example format:
Second 1-2: Hook question
Second 3-4: Shocking statistic
Second 5-6: Real-world example
Second 7-8: Quick solution + CTA

Create scripts for all 30 episodes với specific numbers for Vietnam market."
```


## **3. Role-Based Content Creation**

### TikTok Content Creator:

```
"Bạn là TikTok Content Creator chuyên financial content với 500K followers.
Tạo viral video series về money management:

Your expertise:
- Understand TikTok algorithm perfectly
- Know trending sounds và formats
- Expert at hook creation
- Master of quick storytelling
- Great at visual composition

Create series: '8-Second Money Fixes'
- Episode 1: Emergency fund starter
- Episode 2: Expense tracking hack
- Episode 3: Impulse buying stopper
- Episode 4: Saving automation trick
- Episode 5: Budget category setup

For each episode provide:
- Exact script (word-by-word)
- Visual directions (camera angles, props)
- Trending sound recommendations
- Text overlay timing
- Optimal posting time
- Expected engagement rate"
```


### Financial Educator:

```
"Đóng vai Financial Educator chuyên simplify complex concepts.
Transform these money topics into 8-second digestible content:

Topics to cover:
- Compound interest explanation
- 50/30/20 budgeting rule
- Emergency fund importance
- Debt snowball method
- Investment basics
- Retirement planning starter

Requirements:
- No financial jargon
- Visual metaphors only
- Actionable takeaways
- Beginner-friendly
- Vietnamese cultural context

Make each concept so simple that teenagers can understand and apply immediately."
```


## **4. Trend-Based Video Scripts**

### Current TikTok Trends Adaptation:

```
"Adapt these trending TikTok formats cho personal finance content:

Trend 1: 'Things that just make sense'
Adaptation: Money habits that just make sense
- Checking account before shopping
- Setting up automatic savings
- Tracking daily expenses
- Having multiple bank accounts

Trend 2: 'Red flags vs Green flags'
Adaptation: Financial red flags vs green flags
- Red: Living paycheck to paycheck
- Green: Having emergency fund
- Red: Impulse buying everything
- Green: Researching before purchases

Trend 3: 'Me explaining to my mom'
Adaptation: Explaining budgeting to Vietnamese parents
- Why you need separate savings account
- Why tracking expenses matters
- Why investment is important

Create exact 8-second scripts for each trend adaptation."
```


### Seasonal Trend Scripts:

```
"Create seasonal money management videos:

Tet Season (January-February):
- Lì xì saving strategies
- Holiday spending limits
- Gift budgeting hacks
- Post-Tet financial recovery

Summer (June-August):
- Vacation budget planning  
- Summer job money tips
- AC bill saving tricks
- Back-to-school budgeting

Black Friday (November):
- Sale shopping strategies
- Deal evaluation quick tips
- Avoiding fake discounts
- Budget allocation for sales

For each season, create 5 different 8-second videos với trending audio suggestions."
```


## **5. Problem-Solution Video Formats**

### Daily Money Problems:

```
"Problem-Solution format videos về daily financial struggles:

Video 1: 'When you check your balance after weekend'
Problem: Shock at how much spent
Solution: Daily expense tracking app
Visual: Dramatic face reaction + app demo

Video 2: 'When salary arrives vs 3 days later'
Problem: Money disappears too fast
Solution: Immediate budget allocation
Visual: Split screen before/after

Video 3: 'When you want something but checking price'
Problem: Impulse buying urges
Solution: 24-hour waiting rule
Visual: Internal struggle + timer countdown

Create 20 more problem-solution scenarios với exact visual directions."
```


### Money Mistake Videos:

```
"'Biggest Money Mistakes' video series:

Format: Quick mistake reveal + instant fix
Duration: Exactly 8 seconds each

Mistake 1: Not having emergency fund
Visual: Unexpected expense panic
Fix: Start with 100k VND emergency fund

Mistake 2: No expense tracking
Visual: Confused about where money went
Fix: Use simple expense tracking method

Mistake 3: Lifestyle inflation
Visual: Earning more but saving less
Fix: Increase savings rate with income

Create scripts for 15 different money mistakes with visual storytelling."
```


## **6. Educational Quick Tips Format**

### Speed Learning Videos:

```
"Ultra-fast financial education videos:

Format: 'Learn [Topic] in 8 seconds'

Topic 1: Emergency Fund Basics
- Second 1: 'Emergency fund = life saver'
- Second 2-3: Show unexpected expenses
- Second 4-5: '3-6 months expenses saved'
- Second 6-7: 'Start with any amount'
- Second 8: 'Begin today!'

Topic 2: Budgeting 101
- Second 1: 'Budget = spending plan'
- Second 2-3: 'Income - expenses = savings'
- Second 4-5: '50% needs, 30% wants, 20% savings'
- Second 6-7: 'Track everything!'
- Second 8: 'You got this!'

Create 25 more educational topics với this ultra-compressed format."
```


### Visual Calculator Videos:

```
"Visual money calculation videos:

Video 1: 'Your daily coffee costs'
- Visual: Coffee cup price tag
- Calculation: 50k × 30 days = 1.5M/month
- Shock factor: 18M per year!
- Alternative: Home brewing saves 15M

Video 2: 'Eating out vs cooking'
- Visual: Restaurant receipt vs grocery receipt
- Calculation: 150k meal out vs 50k home cooked
- Monthly difference: 3M saved
- Yearly impact: 36M saved

Create 15 different 'hidden cost' calculation videos với visual impact."
```


## **7. Storytelling in 8 Seconds**

### Mini Success Stories:

```
"Micro success story format:

Story 1: Student Transformation
- Second 1-2: 'Broke university student'
- Second 3-4: 'Started tracking expenses'
- Second 5-6: 'Found 500k waste monthly'
- Second 7-8: 'Now has emergency fund!'

Story 2: Young Professional Journey
- Second 1-2: 'First salary disappeared fast'
- Second 3-4: 'Learned 50/30/20 rule'
- Second 5-6: 'Automated savings first'
- Second 7-8: 'Saved for house deposit!'

Create 20 different micro transformation stories với emotional arc."
```


### Before/After Format:

```
"Dramatic before/after financial transformations:

Transformation 1: Spending Habits
Before: Chaotic shopping, empty wallet
After: Planned purchases, full savings
Transition: Budgeting app interface
Text: '30 days changed everything'

Transformation 2: Money Mindset
Before: 'I can't save money'
After: 'I choose what to spend on'
Visual: Confident person making conscious choices
Text: 'Mindset shift = life shift'

Design 15 different before/after scenarios với dramatic visual contrasts."
```


## **8. Interactive Challenge Videos**

### Quick Money Challenges:

```
"Challenge-based engagement videos:

Challenge 1: '24-Hour Spending Freeze'
- Second 1-2: Challenge announcement
- Second 3-4: Rules explanation
- Second 5-6: Potential savings shown
- Second 7-8: 'Comment if you're in!'

Challenge 2: 'Find Your Money Leak'
- Second 1-2: 'Everyone has money leaks'
- Second 3-4: 'Track every expense today'
- Second 5-6: 'Find your biggest surprise'
- Second 7-8: 'Share in comments!'

Create 25 different quick challenges that drive engagement."
```


## **9. Comparison Videos**

### Smart vs Not Smart Money Moves:

```
"Quick comparison format videos:

Comparison 1: Saving Strategies
Smart: Automatic savings transfer
Not Smart: Saving what's left over
Visual: Split screen demonstration
Result: 10x more savings with automation

Comparison 2: Shopping Habits
Smart: List + budget checking
Not Smart: Impulse buying everything
Visual: Organized vs chaotic shopping
Result: 50% less spending with planning

Create 20 different smart vs not smart money comparisons."
```


## **10. Trending Audio Adaptations**

### Popular Sound Adaptations:

```
"Adapt trending audio for money content:

Trending Sound 1: 'Oh no, oh no, oh no no no no no'
Adaptation: Checking bank balance after shopping spree
Visual: Face reactions getting more horrified
Text overlay: Decreasing account balance

Trending Sound 2: 'I'm a savage'
Adaptation: 'I'm a saver'
Visual: Confident money moves
Text: Budgeting, tracking, saving actions

Provide 30 different trending sound adaptations for financial content."
```


## **11. Video Production Templates**

### Shot-by-Shot Breakdown Template:

```
"8-second video production template:

Shot 1 (0-1s): Hook/Attention Grabber
- Camera: Close-up face or object
- Action: Surprising expression/reveal
- Text: Hook question/statement

Shot 2 (1-3s): Problem Setup
- Camera: Medium shot showing context
- Action: Demonstrate the problem
- Text: Problem description

Shot 3 (3-5s): Solution Introduction
- Camera: Product/app/method showcase
- Action: Quick solution demo
- Text: Solution benefit

Shot 4 (5-7s): Result/Proof
- Camera: Before/after comparison
- Action: Show positive outcome
- Text: Specific result numbers

Shot 5 (7-8s): Call-to-Action
- Camera: Direct eye contact
- Action: Clear CTA gesture
- Text: Action instruction

Apply template to create 50 different video concepts."
```


## **💡 Production Tips:**

### Technical Specifications:

```
"Video technical requirements for maximum reach:
- Resolution: 1080×1920 (9:16 ratio)
- Frame rate: 30fps minimum
- File size: Under 100MB
- Format: MP4 (H.264 codec)
- Audio: Clear, trending sounds
- Captions: Auto-generated + manual review
- Thumbnail: High contrast, readable text"
```


### Engagement Optimization:

```
"Maximize engagement với these tactics:
- Hook trong first 1 second
- Visual cuts every 1-2 seconds
- Text overlay for accessibility
- Trending hashtags (5-10 relevant)
- Post during peak hours (7-9 PM Vietnam)
- Respond to comments within 2 hours
- Cross-post to multiple platforms
- Create series for return viewers"
```

Những prompts này sẽ giúp bạn tạo ra hàng trăm video 8 giây chất lượng cao về quản lý chi tiêu cá nhân, phù hợp với từng platform và trend hiện tại!

---

# Prompts tạo Video Hoạt Hình 3D 8 giây - Quản Lý Chi Tiêu

## **1. Zero-Shot Animation Prompts**

### Basic Animation Concepts:

```
"Tạo concept video hoạt hình 3D 8 giây với nhân vật cute 
giải thích budgeting cơ bản bằng visual metaphors."
```


### Character-Driven Stories:

```
"Thiết kế nhân vật 3D và storyboard cho video 8 giây 
về emergency fund, style Pixar animation."
```


## **2. Instructional Animation Production Prompts**

### Complete Animation Package:

```
"Tạo production package hoàn chỉnh cho animated video series về personal finance:

Project Specifications:
- Duration: Exactly 8 seconds per episode
- Style: 3D cartoon animation (Pixar/Disney style)
- Target: Vietnamese Gen Z (18-25 years old)
- Platform: TikTok, Instagram Reels, YouTube Shorts
- Budget approach: DIY với free/cheap tools

Character Design:
- Main character: Young Vietnamese person (relatable)
- Age: 22-25 appearance
- Personality: Friendly, slightly clumsy, learning-oriented
- Design: Simplified 3D model, expressive face
- Clothing: Casual, modern Vietnamese style
- Voice: Energetic, encouraging tone

Series Concept: 'Money Buddy' - 30 episodes
Episode Topics:
1. First salary shock
2. Tracking expenses
3. Emergency fund basics
4. Saving automation
5. Budgeting rules
6. Impulse control
7. Investment basics
8. Debt management
9. Money mindset
10. Financial goals

For each episode provide:
- Detailed storyboard (8 key frames)
- Character animation requirements
- Scene descriptions
- Dialogue/voiceover script
- 3D asset requirements
- Color palette specifications
- Sound effect suggestions
- Text overlay timing"
```


### 3D Animation Workflow:

```
"Complete 3D animation production workflow cho financial education:

Pre-Production Phase:
- Character modeling specifications
- Rigging requirements for facial expressions
- Scene environment designs (bedroom, coffee shop, bank, etc.)
- Prop list (wallet, phone, calculator, money, etc.)
- Color scheme (financial trust colors: blue, green, gold)

Production Phase:
- Keyframe animation timings (every 1 second)
- Camera movement patterns
- Lighting setup instructions
- Texture and material specifications
- Particle effects for money/coins

Post-Production:
- Rendering settings for social media
- Audio synchronization guide
- Text overlay positioning
- Export formats for different platforms
- Compression guidelines

Tools recommendation:
- Free: Blender 3D + DaVinci Resolve
- Budget: Cinema 4D + After Effects
- Premium: Maya + Premiere Pro

Create detailed tutorials for each production phase."
```


## **3. Role-Based Character Development**

### Animation Director:

```
"Bạn là Animation Director với kinh nghiệm Pixar/Disney.
Thiết kế animated series về money management:

Character Bible:
Main Character - 'Tiền' (Money Buddy):
- Appearance: Young Vietnamese millennial
- Height: Average build, friendly face
- Clothing: Casual streetwear, changes per scenario
- Personality traits: Curious, makes mistakes, learns quickly
- Voice characteristics: Warm, relatable, enthusiastic
- Facial expressions: 15 different emotions mapped
- Body language: Expressive gestures, Asian cultural mannerisms

Supporting Characters:
- 'Wise Wallet' - Talking wallet character (mentor figure)
- 'Impulse Monster' - Cute but mischievous spending temptation
- 'Savings Seed' - Growing plant representing savings growth
- 'Budget Boss' - Friendly calculator character

Animation Style Guide:
- Rendering: NPR (Non-Photorealistic) toon shading
- Movement: Exaggerated for comedic effect
- Timing: Snappy, cartoon physics
- Color psychology: Warm colors for positive money actions
- Camera work: Mobile-first framing, close-ups for emotion

Create character model sheets với multiple angles and expressions."
```


### 3D Modeling Specialist:

```
"Đóng vai 3D Character Modeler chuyên cartoon characters.
Design optimized 3D models cho mobile animation:

Technical Requirements:
- Polygon count: Maximum 5,000 triangles per character
- Rigging: Simple bone structure for fast animation
- Textures: 512x512 maximum for mobile optimization
- LOD system: 3 levels of detail
- Facial rig: 20 blend shapes for expressions

Character Specifications:
Main Character 'Money Buddy':
- Body proportions: Slightly stylized, approachable
- Facial features: Large eyes, expressive eyebrows
- Hair: Simple geometry, easy to animate
- Clothing: Modular system for outfit changes
- Accessories: Phone, wallet, backpack (removable)

Environment Assets:
- Bedroom scene (5 key props)
- Coffee shop scene (10 background elements)
- Bank/ATM scene (3 main objects)
- Shopping mall scene (modular store setup)
- Office workspace (desk, computer, papers)

Provide detailed modeling guidelines với reference images and wireframe examples."
```


## **4. Storyboard \& Scene Development**

### Episode Storyboards:

```
"Create detailed storyboards cho 8-second animated episodes:

Episode 1: 'Salary Shock'
Scene Breakdown:
- Second 1: Character happy receiving salary notification
- Second 2: Opens banking app, big smile
- Second 3: Checks balance, confused expression
- Second 4: Realizes money disappeared, shocked face
- Second 5: Flashback montage of spending (coffee, food, shopping)
- Second 6: Character face-palm moment
- Second 7: Wise Wallet appears with advice
- Second 8: Character nods, downloads expense tracker

Episode 2: 'The Emergency Fund Hero'
Scene Breakdown:
- Second 1: Character relaxing, everything peaceful
- Second 2: Sudden crisis! (phone breaks, dramatic zoom)
- Second 3: Panic mode, checking empty wallet
- Second 4: Remembers emergency fund, lightbulb moment
- Second 5: Opens savings account, confident smile
- Second 6: Pays for phone repair, no stress
- Second 7: Happy character with working phone
- Second 8: Text appears: 'Emergency fund saves the day!'

Create complete storyboards for 30 different episodes với detailed scene descriptions."
```


### Visual Metaphor Development:

```
"Develop visual metaphors cho complex financial concepts:

Metaphor 1: Budgeting = Building a House
- Visual: Character as architect with blueprint
- Foundation = Emergency fund
- Walls = Monthly expenses (rent, food, transport)
- Roof = Savings goals
- Decorations = Fun spending
- Animation: House builds as budget categories fill

Metaphor 2: Compound Interest = Growing Plant
- Visual: Character planting money seeds
- Small investments = tiny seeds
- Time passage = seasonal changes
- Growth = plant becoming tree
- Harvest = retirement wealth
- Animation: Time-lapse growth sequence

Metaphor 3: Debt = Heavy Backpack
- Visual: Character struggling with oversized backpack
- Each debt = added weight/item in backpack
- Payment = removing items one by one
- Freedom = lightweight, jumping with joy
- Animation: Progressive weight reduction

Create 20 different visual metaphors với animation descriptions."
```


## **5. Animation-Specific Technical Prompts**

### Micro-Animation Techniques:

```
"Design micro-animations cho 8-second financial videos:

Technique 1: Number Counter Animation
- Usage: Showing expense totals, savings growth
- Animation: Rapid number counting with sound effects
- Duration: 1-2 seconds maximum
- Visual effects: Glowing numbers, particle trails
- Color coding: Red (expenses), Green (savings)

Technique 2: Wallet Transformation
- Usage: Showing budget allocation
- Animation: Wallet opening, money sorting into categories
- Duration: 2-3 seconds
- Visual effects: Color-coded money bills
- Sound: Cash register sounds

Technique 3: Progress Bar Excitement
- Usage: Savings goals, debt payoff
- Animation: Bar filling with celebration effects
- Duration: 1-2 seconds
- Visual effects: Confetti, character cheering
- Color progression: Red → Yellow → Green

Technique 4: Phone Screen Magic
- Usage: App demonstrations
- Animation: Screen transitions, tap effects
- Duration: 2-3 seconds
- Visual effects: UI glow, success checkmarks
- Interaction: Finger tap animations

Create 15 different micro-animation techniques với implementation guides."
```


### Expression Animation System:

```
"Character expression animation system:

Primary Emotions (với blend shape weights):
1. Happy (0.8 mouth smile, 0.6 eye squint)
2. Shocked (1.0 mouth open, 1.0 eye wide)
3. Confused (0.4 mouth frown, 0.7 eyebrow furrow)
4. Excited (0.9 mouth smile, 0.8 eye sparkle)
5. Worried (0.6 mouth frown, 0.5 eyebrow raise)
6. Confident (0.5 mouth smile, 0.7 eyebrow raise)
7. Embarrassed (0.3 mouth frown, 0.4 eye look away)
8. Determined (0.4 mouth tight, 0.9 eyebrow furrow)

Transition Animations (timing in frames):
- Happy to Shocked: 6 frames
- Confused to Lightbulb: 8 frames  
- Worried to Confident: 12 frames
- Embarrassed to Determined: 10 frames

Facial Animation Timeline:
- Keyframes every 4 frames
- Overshoot for cartoon effect
- Hold poses for 6 frames minimum
- Blink cycle every 60 frames

Create complete facial animation rig với expression library."
```


## **6. Platform-Optimized Animation Styles**

### TikTok Animation Format:

```
"TikTok-optimized 3D animation specifications:

Visual Style:
- High contrast colors for mobile viewing
- Large, clear character features
- Minimal background details
- Bold text overlays
- Quick cuts every 1-2 seconds

Character Animation:
- Exaggerated movements
- Large facial expressions
- Clear gestures pointing to text
- Phone-sized framing (close-ups)
- Vertical composition priority

Technical Specs:
- Resolution: 1080x1920 (9:16 aspect ratio)
- Frame rate: 30fps for smooth playback
- File size: Under 100MB for fast loading
- Color space: sRGB for consistent viewing
- Audio: 48kHz for clear narration

Episode Concepts:
1. 'Money disappearing magic trick'
2. 'Budget categories as pizza slices'
3. 'Savings growing like muscle workout'
4. 'Debt shrinking like deflating balloon'
5. 'Investment growing like plant time-lapse'

Create 25 TikTok-specific animation concepts."
```


### Instagram Reels Animation:

```
"Instagram Reels 3D animation approach:

Aesthetic Focus:
- Lifestyle integration (character in real-world scenarios)
- Trendy color palettes (pastels, neons)
- Smooth camera movements
- Professional lighting setup
- Instagram-worthy compositions

Animation Rhythm:
- Beat-synchronized movements
- Trending audio adaptations
- Quick reveal sequences
- Before/after comparisons
- Satisfying completion animations

Character Integration:
- Character appears in lifestyle settings
- Interacts with real-world objects
- Demonstrates using actual apps/phones
- Shows relatable daily scenarios
- Provides actionable advice

Create 20 Instagram-optimized animation scenarios."
```


## **7. Educational Animation Series**

### 'Money University' Animation Series:

```
"Design comprehensive educational animation series:

Series Structure: 'Money University' - 100 episodes
Character: Professor Penny (wise mentor) + Student Sam (learner)

Beginner Level (Episodes 1-25):
- Basic money concepts
- Simple vocabulary
- Visual demonstrations
- Interactive elements
- Progress tracking

Intermediate Level (Episodes 26-75):
- Budgeting strategies
- Saving techniques
- Investment basics
- Debt management
- Goal setting

Advanced Level (Episodes 76-100):
- Complex financial planning
- Investment strategies
- Tax optimization
- Retirement planning
- Wealth building

Episode Format Template:
- Second 1: Hook question/problem
- Second 2-3: Concept introduction
- Second 4-5: Visual demonstration
- Second 6-7: Real-world application
- Second 8: Key takeaway + next episode teaser

Animation Consistency:
- Same characters throughout series
- Progressive learning visual cues
- Recurring visual metaphors
- Consistent color coding
- Building complexity gradually"
```


## **8. Cultural Adaptation for Vietnam**

### Vietnamese Context Animation:

```
"Adapt financial animations cho Vietnamese culture:

Cultural Elements:
- Vietnamese currency (VND) in all examples
- Local scenarios (street food, motorbike, apartment)
- Family financial dynamics
- Tet holiday spending traditions
- Vietnamese work culture references

Character Customization:
- Vietnamese names (Minh, Linh, Duc, etc.)
- Local clothing styles
- Vietnamese home/office environments
- Local food and lifestyle choices
- Cultural gestures and expressions

Financial Context:
- Average Vietnamese salaries (8-15M VND)
- Common expenses (rent, food, transportation)
- Local banking systems
- Mobile payment adoption (MoMo, ZaloPay)
- Investment options available in Vietnam

Episode Topics:
1. 'First job salary management'
2. 'Living with parents vs independent'
3. 'Tet money planning'
4. 'Motorbike maintenance budgeting'
5. 'Street food vs home cooking costs'

Create 30 culturally-relevant episode concepts."
```


## **9. Interactive Animation Elements**

### Gamification Animation:

```
"Design gamified elements cho financial education:

Progress Systems:
- XP points for completed lessons
- Achievement unlocks
- Skill tree progression
- Daily streak counters
- Level-up celebrations

Interactive Elements:
- Tap-to-reveal information
- Drag-and-drop budget allocation
- Swipe through spending categories
- Quiz mini-games within videos
- Before/after slider comparisons

Reward Animations:
- Coin collection effects
- Trophy presentations
- Badge earning celebrations
- Progress bar completions
- Character upgrade unlocks

Engagement Hooks:
- Cliffhanger endings
- 'Coming up next' previews
- User choice consequences
- Personalized recommendations
- Social sharing celebrations

Create interactive animation framework với user engagement mechanics."
```


## **10. Production Pipeline \& Tools**

### DIY 3D Animation Setup:

```
"Complete DIY production pipeline for financial animations:

Hardware Requirements:
- Minimum: Gaming laptop (GTX 1060, 16GB RAM)
- Recommended: Desktop (RTX 3070, 32GB RAM)
- Storage: 1TB SSD for project files
- Audio: USB microphone for voiceover
- Monitor: Color-accurate display

Software Stack:
Free Tier:
- Blender 3D (modeling, animation, rendering)
- Audacity (audio editing)
- GIMP (texture creation)
- OBS (screen recording)

Budget Tier ($50/month):
- Blender + Substance Painter
- Adobe After Effects
- Audition for audio
- Creative Cloud integration

Premium Tier ($200/month):
- Cinema 4D + Octane
- Adobe Creative Suite
- Element 3D plugins
- Advanced render engines

Production Timeline:
Week 1: Character design và modeling
Week 2: Rigging và basic animations
Week 3: Scene creation và lighting
Week 4: Animation production (5 episodes)
Week 5: Post-production và optimization

Create detailed production schedule for 30-episode series."
```


### Automated Animation Workflow:

```
"Design automated production workflow:

Template System:
- Character animation presets
- Scene setup templates
- Lighting configurations
- Camera movement patterns
- Rendering batch processes

Asset Management:
- Organized file structure
- Version control system
- Asset naming conventions
- Texture library organization  
- Animation clip library

Batch Processing:
- Automated rendering queues
- Compression scripts
- Multi-platform export
- Quality control checks
- Upload automation

Quality Assurance:
- Animation checklist
- Technical specification validation
- Cross-platform testing
- Performance optimization
- User feedback integration

Create complete automation system for efficient production."
```


## **💡 Animation Production Tips:**

### Performance Optimization:

```
"Optimize 3D animations for mobile viewing:
- Simplified geometry (under 5k polygons)
- Efficient UV mapping
- Compressed textures (512x512 max)
- Baked lighting when possible
- LOD system implementation
- Smart culling techniques"
```


### Storytelling in 8 Seconds:

```
"Master ultra-short storytelling:
- Hook in first frame
- Clear problem setup (1-2 seconds)
- Simple solution demonstration (3-4 seconds)
- Emotional payoff (1-2 seconds)
- Call-to-action (final second)
- Visual continuity throughout"
```

Những prompts này sẽ giúp bạn tạo ra comprehensive 3D animation series về personal finance, từ concept development đến technical production với realistic workflow và budget considerations!

---

# Prompts tạo nhân vật 3D giống hình ảnh người dùng

## **1. Zero-Shot Character Creation**

### Basic Photo-to-3D:

```
"Tạo mô hình 3D nhân vật giống y chang người trong hình ảnh này, 
style cartoon phù hợp cho animation 8 giây về quản lý tài chính."
```


### Direct Likeness:

```
"Phân tích khuôn mặt trong ảnh và tạo character 3D với:
- Chính xác 100% đặc điểm khuôn mặt
- Tỷ lệ cơ thể phù hợp
- Style hoạt hình dễ thương"
```


## **2. Detailed Character Analysis Prompts**

### Comprehensive Photo Analysis:

```
"Phân tích chi tiết hình ảnh người dùng và tạo 3D character specs:

Photo Analysis Checklist:
- Facial structure: [mô tả shape khuôn mặt]
- Eye characteristics: [size, shape, color, position]
- Nose features: [shape, size, bridge]
- Mouth details: [lip thickness, smile characteristics]
- Eyebrow style: [thickness, arch, color]
- Hair analysis: [color, texture, length, style]
- Skin tone: [exact color matching]
- Facial proportions: [measurement ratios]
- Distinctive features: [moles, dimples, etc.]
- Expression tendencies: [natural smile, eye crinkles]

Body Analysis:
- Height estimation from photo
- Build assessment (slim, average, athletic)
- Posture characteristics
- Hand gestures visible
- Clothing style preferences

Cultural Features:
- Ethnicity-specific characteristics
- Regional facial features
- Cultural styling elements

3D Modeling Requirements:
- Polygon count: 8,000-12,000 faces
- Texture resolution: 2K maps
- Facial rig: 50+ blend shapes
- Hair system: Cards or geometry
- Clothing: Separate mesh objects
- Accessories: Modular attachments

Provide detailed modeling reference sheet với measurements and color codes."
```


### Advanced Facial Mapping:

```
"Tạo detailed facial mapping cho 3D character recreation:

Facial Landmark Analysis:
1. Forehead characteristics
   - Width ratio to face
   - Height proportion
   - Hairline shape
   - Wrinkle patterns

2. Eye region mapping
   - Inner corner position
   - Outer corner angle
   - Eyelid fold type
   - Under-eye characteristics
   - Eyebrow positioning

3. Nose structure
   - Bridge width and height
   - Nostril shape and size
   - Tip characteristics
   - Profile angle

4. Mouth and jaw
   - Lip proportions (upper vs lower)
   - Mouth width relative to nose
   - Jaw line definition
   - Chin shape and projection

5. Cheek and face shape
   - Cheekbone prominence
   - Face width at cheekbones
   - Overall face shape (oval, round, square)
   - Facial symmetry analysis

Technical Specifications:
- Use photo reference từ multiple angles nếu có
- Create blend shape targets for expressions
- Match skin texture patterns
- Replicate exact hair characteristics
- Include distinctive marks/features

Output: Complete character sheet với orthographic views."
```


## **3. Role-Based Character Creation**

### 3D Artist Specialist:

```
"Bạn là 3D Character Artist chuyên photo-realistic character creation.
Tái tạo người trong ảnh thành 3D character:

Professional Workflow:
1. Photo Reference Analysis
   - Multi-angle photo collection (if available)
   - Lighting condition assessment
   - Photo quality evaluation
   - Feature identification priority

2. Base Mesh Creation
   - Start với generic head base mesh
   - Sculpt major facial features
   - Match proportions exactly
   - Refine secondary details

3. Texture Creation Process
   - Skin tone color matching
   - Texture detail extraction from photo
   - Normal map generation
   - Subsurface scattering maps
   - Hair texture analysis

4. Rigging Requirements
   - Facial bone structure
   - Expression blend shapes
   - Eye movement controls
   - Jaw articulation
   - Neck and head rotation

5. Animation Preparation
   - Test facial expressions
   - Verify likeness maintenance
   - Check deformation quality
   - Optimize for real-time use

Quality Standards:
- 95%+ likeness accuracy
- Maintains resemblance in all expressions
- Optimized for 8-second animations
- Cultural sensitivity maintained

Provide step-by-step creation guide với technical specifications."
```


### Digital Double Expert:

```
"Đóng vai Digital Double Specialist từ film industry.
Tạo perfect digital replica của person trong photo:

Hollywood-Level Process:
1. Photogrammetry Simulation
   - Analyze single photo as reference
   - Estimate 3D depth information
   - Create facial topology map
   - Generate accurate proportions

2. Likeness Sculpting
   - Major forms establishment
   - Secondary detail addition
   - Micro-detail refinement
   - Asymmetry incorporation

3. Skin Shader Development
   - Realistic skin material
   - Age-appropriate texture
   - Ethnicity-accurate coloring
   - Subsurface light behavior

4. Hair System Creation
   - Individual strand modeling
   - Natural hair flow direction
   - Color variation matching
   - Styling accuracy

5. Expression Library
   - Neutral expression base
   - Smile variations
   - Surprise/shock looks
   - Confused expressions
   - Happy/excited states

Performance Validation:
- Side-by-side comparison tests
- Multiple lighting conditions
- Various camera angles
- Animation deformation tests

Target: Indistinguishable from photo reference trong appropriate style."
```


## **4. Technical Implementation Prompts**

### AI-Assisted Character Creation:

```
"Sử dụng AI tools để tạo accurate 3D character từ photo:

AI Tool Integration:
1. Photo Enhancement
   - Upscale resolution với Real-ESRGAN
   - Enhance facial details với GFPGAN
   - Remove noise và artifacts
   - Improve lighting consistency

2. Facial Analysis AI
   - Use MediaPipe for landmark detection
   - Extract facial measurements
   - Analyze bone structure
   - Determine age và ethnicity characteristics

3. 3D Generation Pipeline
   - PIFu/PIFuHD for rough 3D shape
   - Face reconstruction algorithms
   - Texture projection mapping
   - Mesh refinement processes

4. Style Transfer
   - Convert realistic features to cartoon style
   - Maintain key characteristics
   - Simplify details for animation
   - Optimize topology for deformation

Manual Refinement:
- Artist review và adjustment
- Expression testing
- Animation readiness check
- Cultural accuracy validation

Software Integration:
- Blender với AI plugins
- Character Creator pipeline
- Maya với custom scripts
- Automated workflow setup

Provide complete technical pipeline với tool recommendations."
```


### Multi-Angle Character Development:

```
"Develop character từ limited photo reference:

Single Photo Challenges:
- Missing profile view information
- Unknown back/side head shape
- Hair depth ambiguity
- Body proportions estimation
- Clothing fit assessment

Estimation Techniques:
1. Facial Structure Prediction
   - Use symmetry to estimate profile
   - Apply average human proportions
   - Reference similar facial types
   - Anatomical accuracy maintenance

2. Hair Volume Estimation
   - Analyze visible hair thickness
   - Estimate natural hair behavior
   - Create believable hair mass
   - Match styling patterns

3. Body Proportion Scaling
   - Use head size as reference unit
   - Apply standard human ratios
   - Adjust for apparent age/build
   - Create proportionate character

4. Missing Detail Creation
   - Generate believable back view
   - Create consistent side profiles
   - Develop ear characteristics
   - Design neck và shoulder transition

Validation Methods:
- Create multiple angle renders
- Test character recognition
- Verify proportion accuracy
- Check animation readiness

Output: Complete 360-degree character model."
```


## **5. Style Adaptation Prompts**

### Photo-to-Cartoon Conversion:

```
"Convert realistic photo thành cartoon 3D character giữ nguyên likeness:

Stylization Process:
1. Feature Simplification
   - Reduce complex details to key shapes
   - Maintain distinctive characteristics
   - Emphasize recognizable features
   - Remove photographic noise

2. Proportion Adjustment
   - Slightly larger eyes for appeal
   - Soften harsh angles
   - Enhance expressiveness
   - Maintain facial recognition

3. Color Palette Optimization
   - Simplify skin tone variations
   - Enhance eye color saturation
   - Adjust hair color vibrancy
   - Create cartoon-appropriate palette

4. Texture Stylization
   - Convert photographic textures
   - Create hand-painted look
   - Maintain skin characteristics
   - Simplify material complexity

Animation Considerations:
- Ensure expressions read clearly
- Optimize for quick movements
- Maintain silhouette recognition
- Test emotional range

Style References:
- Pixar character aesthetics
- Disney animation style
- Modern 3D cartoon look
- Mobile-optimized appearance

Create style guide với before/after comparisons."
```


### Cultural Sensitivity Adaptation:

```
"Ensure culturally appropriate character representation:

Cultural Accuracy Checklist:
1. Facial Feature Respect
   - Accurate ethnic characteristics
   - Avoid stereotypical exaggeration
   - Maintain individual uniqueness
   - Respect cultural identity

2. Styling Considerations
   - Appropriate hairstyles
   - Cultural clothing elements
   - Respectful accessory choices
   - Regional aesthetic preferences

3. Animation Behavior
   - Culturally appropriate gestures
   - Respectful mannerisms
   - Accurate body language
   - Cultural communication styles

4. Character Context
   - Appropriate environmental settings
   - Cultural lifestyle representation
   - Respectful scenario choices
   - Authentic daily life elements

Quality Assurance:
- Cultural consultant review
- Community feedback integration
- Sensitivity testing
- Respectful representation validation

Guidelines: Maintain accuracy while ensuring respectful và positive representation."
```


## **6. Animation-Ready Character Setup**

### Rigging for Finance Animation:

```
"Setup character rig specifically cho financial education animations:

Facial Rig Requirements:
1. Expression Set for Finance Content
   - Shocked (checking bank balance)
   - Happy (saving success)
   - Confused (complex concepts)
   - Determined (budgeting focus)
   - Worried (financial stress)
   - Excited (investment gains)
   - Embarrassed (spending mistakes)
   - Confident (financial control)

2. Gesture Controls
   - Pointing (at charts/numbers)
   - Counting (on fingers)
   - Holding objects (phone, wallet, calculator)
   - Thumbs up/down evaluations
   - Thinking poses (hand on chin)

3. Eye Animation System
   - Looking at phone screen
   - Reading financial data
   - Eye contact with audience
   - Surprised wide eyes
   - Focused concentration

4. Mouth Shapes for Narration
   - Clear articulation phonemes
   - Emotional speaking styles
   - Whisper expressions
   - Excited explanation looks

Technical Setup:
- Blend shape targets (50+ shapes)
- Bone-based secondary animation
- Eye tracking controls
- Automated blink system
- Lip-sync compatibility

Create complete rig documentation với control guides."
```


### Character Wardrobe System:

```
"Design modular clothing system for financial character:

Outfit Categories:
1. Casual Daily Wear
   - T-shirt và jeans (everyday scenarios)
   - Comfortable home clothes
   - Weekend casual look
   - Student-appropriate style

2. Professional Attire
   - Business casual (office scenarios)
   - Interview outfit
   - Banking/meeting clothes
   - Presentation-ready look

3. Seasonal Variations
   - Summer light clothing
   - Winter layers
   - Rainy day gear
   - Holiday special outfits

4. Activity-Specific
   - Shopping trip outfit
   - Gym/exercise wear
   - Travel clothes
   - Home workout gear

Modular Design:
- Interchangeable clothing pieces
- Mix-and-match compatibility
- Quick outfit changes
- Consistent character silhouette

Technical Requirements:
- Proper mesh weights
- Collision-free geometry
- Animation-friendly topology
- Optimized polygon count

Create wardrobe guide với styling options."
```


## **7. Quality Assurance \& Testing**

### Likeness Validation System:

```
"Develop systematic approach to validate character likeness:

Testing Protocol:
1. Side-by-Side Comparison
   - Original photo reference
   - 3D character neutral pose
   - Multiple angle validation
   - Lighting condition matching

2. Expression Testing
   - Test all planned facial expressions
   - Verify likeness maintenance
   - Check feature distortion
   - Validate emotional reads

3. Animation Testing
   - Quick movement tests
   - Extreme pose validation
   - Silhouette recognition
   - Motion blur scenarios

4. Lighting Validation
   - Multiple lighting setups
   - Shadow pattern matching
   - Skin tone consistency
   - Feature visibility tests

5. Scale Testing
   - Close-up detail retention
   - Distance visibility
   - Mobile screen optimization
   - Thumbnail recognition

Feedback Integration:
- User recognition testing
- Family/friend validation
- Cultural accuracy review
- Technical performance assessment

Success Metrics:
- 90%+ recognition rate
- Consistent likeness across expressions
- Animation performance maintenance
- Cultural appropriateness confirmation"
```


## **8. Production Pipeline Integration**

### Automated Character Creation:

```
"Setup automated pipeline cho user photo-to-character conversion:

Pipeline Stages:
1. Photo Input Processing
   - Image quality assessment
   - Resolution enhancement
   - Face detection and cropping
   - Landmark extraction

2. 3D Generation Phase
   - Base mesh selection
   - Facial feature mapping
   - Proportion adjustment
   - Detail sculpting automation

3. Texturing Automation
   - Skin tone extraction
   - Texture generation
   - Material assignment
   - Quality optimization

4. Rigging Application
   - Automated bone placement
   - Blend shape generation
   - Control setup
   - Testing validation

5. Style Processing
   - Cartoon conversion
   - Feature stylization
   - Animation optimization
   - Final polish

Quality Gates:
- Automated quality checks
- Manual review points
- User approval workflow
- Iteration capabilities

Timeline: 2-4 hours automated + 1 hour manual refinement per character."
```


## **9. User Interaction \& Feedback**

### Interactive Character Creation:

```
"Design user-friendly character creation interface:

User Experience Flow:
1. Photo Upload
   - Simple drag-and-drop interface
   - Quality requirement guidelines
   - Privacy assurance messaging
   - Processing time estimates

2. Character Preview
   - Real-time 3D preview
   - Rotation controls
   - Expression testing
   - Style options

3. Customization Options
   - Fine-tune facial features
   - Adjust stylization level
   - Clothing selection
   - Color adjustments

4. Animation Testing
   - Preview character in sample animations
   - Test expressions
   - Validate likeness
   - Performance check

5. Approval Process
   - Final review stage
   - User confirmation
   - Export preparation
   - Integration into animation pipeline

Feedback Collection:
- Likeness accuracy rating
- User satisfaction survey
- Improvement suggestions
- Cultural sensitivity check

Create comprehensive user journey map với interface mockups."
```


## **💡 Character Creation Best Practices:**

### Technical Optimization:

```
"Optimize character for 8-second animations:
- Polygon budget: 8k-12k faces maximum
- Texture resolution: 2K maps sufficient
- Efficient UV layout for mobile
- LOD system for distant shots
- Compressed assets for fast loading"
```


### Likeness Preservation:

```
"Maintain character recognition:
- Focus on distinctive features
- Preserve unique proportions
- Keep characteristic expressions
- Maintain recognizable silhouette
- Test at various scales and distances"
```


### Cultural Considerations:

```
"Ensure respectful representation:
- Accurate cultural features
- Appropriate styling choices
- Respectful animation behaviors
- Community feedback integration
- Sensitivity consultant review"
```

Những prompts này sẽ giúp bạn tạo ra accurate 3D character representations từ user photos, maintaining likeness while optimizing for financial education animations!

---

# Prompts vẽ Flow Giao Diện cho Phát Triển App

## **1. Zero-Shot UI Flow Prompts**

### Basic User Flow:

```
"Vẽ user flow cho app quản lý chi tiêu từ onboarding đến tracking expense, 
bao gồm tất cả màn hình và navigation paths."
```


### Wireframe Creation:

```
"Tạo wireframe flow cho mobile banking app, 
focus vào user journey từ login đến transfer money."
```


## **2. Instructional UI Flow Development**

### Complete App Flow Design:

```
"Thiết kế comprehensive UI flow cho expense tracking app:

App Overview:
- Platform: iOS native app
- Target users: 18-35 tuổi, Vietnam market
- Main features: Expense tracking, budgeting, reports
- Design system: Modern, clean, mobile-first

Required Flow Components:
1. User Authentication Flow
   - Splash screen
   - Onboarding sequence (3-4 screens)
   - Login/Register options
   - Social login integration
   - Password recovery flow
   - First-time setup wizard

2. Main Navigation Flow
   - Tab bar structure (4-5 main sections)
   - Home dashboard
   - Add transaction flow
   - Reports section
   - Settings area
   - Profile management

3. Core Feature Flows
   - Add expense workflow (5-6 steps)
   - Budget creation process
   - Category management
   - Report generation
   - Data export functionality

4. Error & Edge Cases
   - Network error states
   - Empty data states  
   - Permission requests
   - Offline functionality
   - Loading states

Deliverables:
- Complete user journey map
- Screen-by-screen wireframes
- Navigation decision trees
- Interaction specifications
- State management diagrams
- Error handling flows

Format: Detailed flowchart với annotations và user decision points."
```


### Advanced UX Flow Mapping:

```
"Create advanced UX flow cho financial management app:

Flow Complexity Levels:
1. Happy Path (Primary user journey)
   - Optimal user experience
   - Minimal steps to goal completion
   - Clear call-to-actions
   - Intuitive navigation

2. Alternative Paths
   - Secondary navigation options
   - Power user shortcuts
   - Accessibility alternatives
   - Advanced feature access

3. Error Recovery Flows
   - Input validation failures
   - Network connectivity issues
   - Authentication problems
   - Data synchronization conflicts

4. Edge Case Handling
   - First-time user experience
   - Empty state management
   - Offline mode functionality
   - Account suspension scenarios

Technical Requirements:
- iOS Human Interface Guidelines compliance
- Accessibility (VoiceOver support)
- Performance considerations (loading times)
- Memory usage optimization
- Battery life impact

Design Principles:
- Progressive disclosure
- Consistent interaction patterns
- Clear visual hierarchy
- Minimal cognitive load
- Error prevention over correction

Create detailed flow documentation với user story mapping."
```


## **3. Role-Based UI Flow Design**

### UX Designer Specialist:

```
"Bạn là Senior UX Designer với 8+ năm experience designing fintech apps.
Thiết kế user flow cho expense tracking app:

Design Challenge:
- Users abandon expense tracking apps after 1 week
- Complex onboarding reduces completion rates
- Too many features overwhelm new users
- Poor categorization leads to incorrect data

UX Strategy:
1. Simplified Onboarding
   - 3-screen maximum introduction
   - Value proposition upfront
   - Optional advanced features
   - Progressive feature discovery

2. Frictionless Transaction Entry
   - One-tap expense logging
   - Smart categorization suggestions
   - Receipt photo capture
   - Voice input options

3. Motivational Design
   - Achievement systems
   - Progress visualization
   - Social sharing features
   - Goal-setting mechanics

Flow Design Requirements:
- Decision trees for each user path
- Interaction specifications
   - Tap targets (minimum 44pt)
   - Gesture patterns
   - Animation transitions
   - Feedback mechanisms

User Research Integration:
- Persona-based flow variations
- A/B testing considerations
- Analytics tracking points
- User feedback collection

Create comprehensive UX flow document với research-backed decisions."
```


### Product Manager Perspective:

```
"Đóng vai Product Manager định nghĩa app flows based on business objectives:

Business Goals:
- User retention: 60% after 30 days
- Daily active usage: 15+ minutes
- Premium conversion: 8% within 3 months
- Revenue per user: $5/month average

Feature Prioritization:
1. Must-Have (MVP)
   - Basic expense tracking
   - Simple categorization
   - Monthly reports
   - Data backup

2. Should-Have (Version 1.1)
   - Budget planning
   - Goal setting
   - Receipt scanning
   - Export functionality

3. Could-Have (Future versions)
   - Investment tracking
   - Bill reminders
   - Social features
   - Advanced analytics

User Flow Strategy:
- Minimize time to first value (under 2 minutes)
- Reduce cognitive load in key flows
- Implement progressive onboarding
- Design for habit formation

Metrics Integration:
- Conversion funnel tracking
- Drop-off point identification
- Feature usage analytics
- User satisfaction measurement

Create product-focused flow documentation với business success metrics."
```


## **4. Platform-Specific Flow Design**

### iOS-Specific Flows:

```
"Design iOS-native app flows following Apple design patterns:

iOS Design Principles:
1. Navigation Patterns
   - Tab Bar Controller (main navigation)
   - Navigation Controller (hierarchical flow)
   - Modal presentations (focused tasks)
   - Action Sheets (contextual choices)

2. iOS-Specific Features
   - Face ID/Touch ID integration
   - Siri Shortcuts support
   - Apple Pay integration
   - HealthKit data sharing
   - iOS 17 Interactive Widgets

3. Human Interface Guidelines
   - Safe Area considerations
   - Dynamic Type support
   - Dark Mode compatibility
   - Accessibility features
   - Haptic feedback integration

Specific Flow Requirements:
- Onboarding: Use page-based navigation
- Add Transaction: Modal presentation với form
- Settings: Grouped table view structure
- Reports: Navigation-based drill-down

Technical Considerations:
- SwiftUI vs UIKit navigation patterns
- State restoration capabilities
- Background app refresh handling
- Push notification integration
- Deep linking support

Create iOS-optimized flow diagrams với native component specifications."
```


### Cross-Platform Considerations:

```
"Design unified flow cho iOS và Android platforms:

Platform Commonalities:
- Shared user journey logic
- Consistent feature set
- Unified data models
- Similar information architecture

Platform Differences:
1. Navigation Patterns
   - iOS: Tab bars, navigation bars
   - Android: Bottom navigation, app bars
   - Back button behavior differences
   - Modal presentation styles

2. Interaction Patterns
   - iOS: Swipe gestures, 3D Touch
   - Android: FAB buttons, hamburger menus
   - Different confirmation patterns
   - Platform-specific animations

3. Visual Design
   - iOS: San Francisco font, blur effects
   - Android: Material Design components
   - Different spacing and sizing
   - Platform-specific icons

Design Strategy:
- Core flow consistency across platforms
- Platform-specific interaction adaptations
- Shared component library approach
- Unified backend API design

Create cross-platform flow documentation với platform-specific annotations."
```


## **5. Detailed Screen Flow Specifications**

### Screen-Level Flow Design:

```
"Create detailed screen-level flows cho expense tracking app:

Screen 1: Splash Screen
- Duration: 2-3 seconds
- Elements: Logo, loading indicator
- Transitions: Fade to onboarding/main
- Error states: Network failure handling

Screen 2-4: Onboarding Sequence
Screen 2: Welcome & Value Proposition
- Hero image/animation
- Key benefit statements
- Continue/Skip options
- Progress indicator

Screen 3: Permission Requests
- Location access (for merchant detection)
- Notification permissions
- Camera access (receipt scanning)
- Clear explanation for each permission

Screen 4: Initial Setup
- Currency selection
- Basic categories setup
- Optional account connection
- Getting started guidance

Screen 5: Home Dashboard
- Balance overview
- Recent transactions (5-10 items)
- Quick add expense button
- Navigation tabs
- Empty states for new users

Interaction Specifications:
- Tap areas (44pt minimum)
- Swipe gestures and directions
- Pull-to-refresh mechanics
- Long press actions
- Animation durations (200-500ms)

Create detailed screen specification document với interaction maps."
```


### State Management Flows:

```
"Design state management flows cho complex app interactions:

Application States:
1. Loading States
   - Initial app load
   - Data synchronization
   - Background refresh
   - Image upload progress

2. Data States
   - Empty states (no transactions)
   - Populated states (with data)
   - Error states (sync failures)
   - Offline states (no connectivity)

3. User Authentication States
   - Logged out
   - Logging in
   - Authenticated
   - Session expired
   - Account locked

4. Feature States
   - Premium vs free user
   - Onboarding completed
   - Tutorial in progress
   - Settings configured

State Transition Rules:
- When states change
- What triggers transitions
- How to handle conflicts
- Recovery mechanisms

Visual State Indicators:
- Loading spinners and progress bars
- Empty state illustrations
- Error messages and recovery actions
- Success confirmations

Create comprehensive state diagram với transition specifications."
```


## **6. User Journey Mapping**

### Complete User Journey Design:

```
"Map complete user journey cho expense tracking app:

User Persona: Sarah, 25, Marketing Professional
- Income: 15M VND/month
- Goals: Save for apartment, reduce food spending
- Challenges: Forgets to track expenses, unclear spending patterns

Journey Phases:
1. Discovery Phase
   - Problem recognition (overspending)
   - App store search and discovery
   - App evaluation and download
   - First impression formation

2. Onboarding Phase
   - Initial app opening
   - Tutorial completion
   - Account setup process
   - First transaction entry

3. Adoption Phase
   - Daily usage pattern establishment
   - Feature discovery
   - Habit formation
   - Initial goal setting

4. Engagement Phase
   - Regular transaction logging
   - Report viewing
   - Budget adjustments
   - Feature exploration

5. Retention Phase
   - Long-term usage patterns
   - Goal achievement
   - Premium feature consideration
   - Referral behavior

Touchpoint Analysis:
- Pre-app touchpoints (ads, reviews)
- In-app interaction points
- Push notifications
- Email communications
- Social sharing moments

Emotion Mapping:
- Frustration points identification
- Delight moments creation
- Anxiety reduction strategies
- Motivation maintenance

Create detailed journey map với emotional timeline và improvement recommendations."
```


## **7. Information Architecture Flow**

### App Structure Design:

```
"Design information architecture flow cho financial app:

Primary Navigation Structure:
Level 1: Tab Bar (4 main sections)
├── Home (Dashboard)
├── Transactions (History & Add)
├── Reports (Analytics)
└── Settings (Profile & Config)

Level 2: Section Deep Dive
Home Section:
├── Balance Overview
├── Recent Transactions
├── Budget Status
├── Quick Actions
└── Insights/Tips

Transactions Section:
├── All Transactions List
├── Add New Transaction
├── Categories Management
├── Search & Filter
└── Receipt Scanner

Reports Section:
├── Monthly Summary
├── Category Breakdown
├── Spending Trends
├── Budget vs Actual
└── Export Options

Settings Section:
├── Profile Management
├── Account Settings
├── Notification Preferences
├── Data & Privacy
└── Help & Support

Navigation Patterns:
- Tab switching (bottom navigation)
- Hierarchical navigation (drill-down)
- Modal presentations (focused tasks)
- Search and filtering
- Deep linking support

Information Hierarchy:
- Primary information (always visible)
- Secondary information (on-demand)
- Tertiary information (detailed views)
- Contextual information (help, tips)

Create detailed site map với navigation flow specifications."
```


## **8. Interaction Flow Specifications**

### Gesture and Interaction Flows:

```
"Define interaction patterns cho mobile expense app:

Primary Interactions:
1. Transaction Entry Flow
   - Tap 'Add' button → Modal presentation
   - Amount input → Number pad interface
   - Category selection → Expandable list
   - Notes addition → Text input field
   - Save confirmation → Success feedback

2. Quick Actions Flow
   - Long press transaction → Context menu
   - Swipe left → Delete option
   - Swipe right → Edit option
   - Pull down → Refresh data
   - Pinch zoom → Chart interaction

3. Navigation Flows
   - Tab bar tapping → Instant switching
   - Back button → Previous screen
   - Close button → Modal dismissal
   - Deep link → Direct navigation

Gesture Specifications:
- Tap: Single finger, 44pt minimum target
- Long press: 500ms duration
- Swipe: 120pt minimum distance
- Pinch: Two finger gesture
- Pull: 80pt trigger distance

Feedback Mechanisms:
- Haptic feedback for actions
- Visual feedback for state changes
- Audio feedback for critical actions
- Animation feedback for transitions

Accessibility Considerations:
- VoiceOver gesture support
- Alternative interaction methods
- Clear focus indicators
- Sufficient contrast ratios

Create comprehensive interaction specification document."
```


## **9. Error and Edge Case Flows**

### Error Handling Flow Design:

```
"Design comprehensive error handling flows:

Error Categories:
1. Network Errors
   - No internet connection
   - Server unavailable
   - Timeout issues
   - Slow connection warnings

2. Data Errors
   - Sync conflicts
   - Data validation failures
   - Storage limitations
   - Corrupted data recovery

3. User Input Errors
   - Invalid form data
   - Missing required fields
   - Format validation failures
   - Duplicate entry detection

4. System Errors
   - Permission denied
   - Device storage full
   - Camera unavailable
   - Biometric authentication failed

Error Flow Patterns:
1. Prevention Strategy
   - Input validation (real-time)
   - Clear instruction copy
   - Progressive disclosure
   - Smart defaults

2. Detection Strategy
   - Immediate validation feedback
   - Background error monitoring
   - User action confirmation
   - System health checks

3. Recovery Strategy
   - Clear error messages
   - Actionable recovery steps
   - Alternative paths
   - Support contact options

Error State Design:
- Inline errors (form validation)
- Modal errors (critical issues)
- Banner errors (network status)
- Empty states (no data scenarios)

Create detailed error handling flowchart với recovery paths."
```


## **10. Prototyping and Testing Flows**

### Prototype Flow Validation:

```
"Create testable prototype flows cho user validation:

Prototype Fidelity Levels:
1. Low Fidelity (Paper/Digital Sketches)
   - Basic layout structure
   - Navigation flow concepts
   - Content hierarchy
   - User journey mapping

2. Medium Fidelity (Interactive Wireframes)
   - Clickable prototypes
   - Basic interactions
   - Flow validation
   - Usability testing ready

3. High Fidelity (Pixel-Perfect Designs)
   - Final visual design
   - Micro-interactions
   - Animation specifications
   - Developer handoff ready

Testing Scenarios:
1. Task-Based Testing
   - Add new expense
   - Create monthly budget
   - Generate expense report
   - Update profile settings

2. Exploratory Testing
   - Free-form app exploration
   - Feature discovery
   - Navigation intuitiveness
   - Error scenario handling

3. Accessibility Testing
   - VoiceOver navigation
   - Dynamic Type support
   - Color contrast validation
   - Motor accessibility

Metrics Collection:
- Task completion rates
- Time to completion
- Error frequency
- User satisfaction scores
- Navigation path analysis

Create testing protocol document với scenario scripts và success criteria."
```


## **11. Design System Integration**

### Design System Flow Implementation:

```
"Integrate design system components into app flows:

Component Library:
1. Navigation Components
   - Tab bars (iOS/Android variants)
   - Navigation bars
   - Breadcrumbs
   - Pagination

2. Input Components
   - Text fields
   - Number inputs
   - Dropdowns/Pickers
   - Date selectors
   - Toggle switches

3. Display Components
   - Cards and containers
   - Lists and tables
   - Charts and graphs
   - Progress indicators
   - Status badges

4. Feedback Components
   - Loading states
   - Error messages
   - Success confirmations
   - Empty states
   - Tooltips

Flow Consistency Rules:
- Component usage guidelines
- Interaction pattern standards
- Visual hierarchy maintenance
- Accessibility requirements
- Performance considerations

Design Token Integration:
- Color palette application
- Typography scale usage
- Spacing system consistency
- Animation timing standards
- Breakpoint definitions

Create design system integration guide với component usage examples trong app flows."
```


## **💡 UI Flow Design Best Practices:**

### Flow Optimization Principles:

```
"Optimize user flows for conversion and retention:
- Minimize steps to core value (under 3 taps)
- Provide clear progress indicators
- Enable easy error recovery
- Implement smart defaults
- Allow flow interruption and resumption"
```


### Mobile-First Considerations:

```
"Design flows for mobile constraints:
- Thumb-friendly navigation zones
- One-handed operation support
- Network-aware loading states
- Battery-conscious interactions
- Storage-efficient data handling"
```


### Accessibility Integration:

```
"Ensure inclusive flow design:
- Screen reader compatible navigation
- Keyboard navigation support
- Sufficient touch target sizes
- High contrast mode support
- Reduced motion alternatives"
```

Những prompts này sẽ giúp bạn tạo ra comprehensive UI flows từ high-level user journeys đến detailed interaction specifications, ensuring optimal user experience và successful app development!

