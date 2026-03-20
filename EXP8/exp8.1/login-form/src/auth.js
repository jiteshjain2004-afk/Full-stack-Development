// Simulated authentication — replace with real API call in production
// Demo credentials: admin@demo.com / password123

const DEMO_USERS = [
  { email: 'admin@demo.com',   password: 'password123', name: 'Admin User',   role: 'Administrator' },
  { email: 'student@demo.com', password: 'student123',  name: 'Jitesh Jain',  role: 'Student'       },
  { email: 'test@demo.com',    password: 'test1234',    name: 'Test Account', role: 'Tester'        },
];

export const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const user = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (user) {
        resolve({ success: true, user: { name: user.name, email: user.email, role: user.role } });
      } else {
        reject({ message: 'Invalid email or password. Please try again.' });
      }
    }, 1500);
  });
};
