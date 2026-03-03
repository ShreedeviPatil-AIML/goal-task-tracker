class ApiConfig {
  // API Base URL
  // For Android Emulator: Use 10.0.2.2 instead of localhost
  // For iOS Simulator: Use localhost
  // For Physical Device: Use your computer's IP address
  static const String baseUrl = 'http://10.0.2.2:5000/api';
  
  // Production URL (update when deployed)
  // static const String baseUrl = 'https://your-api.onrender.com/api';
  
  // API Endpoints
  static const String auth = '/auth';
  static const String goals = '/goals';
  static const String completions = '/completions';
  static const String analytics = '/analytics';
  
  // Timeout durations
  static const Duration connectTimeout = Duration(seconds: 10);
  static const Duration receiveTimeout = Duration(seconds: 10);
}

// Made with Bob
