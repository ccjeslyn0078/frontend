export interface Project {
  id: string;
  name: string;
  description: string;
  moduleCount: number;
}

export interface Module {
  id: string;
  projectId: string;
  name: string;
  description: string;
  screenCount: number;
}

export interface Screen {
  id: string;
  moduleId: string;
  name: string;
  description?: string;
}

export interface TestCase {
  id: string;
  screenId: string;
  title: string;
  description: string;
  expectedResult: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Pass' | 'Fail';
}

export interface TestRunItem extends TestCase {
  actualResult: string;
}

export interface Bug {
  id: string;
  tcId: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo: string;
  createdDate: string;
}

export const mockProjects: Project[] = [
  { id: '1', name: 'E-Commerce Platform', description: 'Main shopping application', moduleCount: 5 },
  { id: '2', name: 'Mobile Banking App', description: 'Banking and finance app', moduleCount: 8 },
  { id: '3', name: 'CRM Dashboard', description: 'Customer relationship management', moduleCount: 6 },
  { id: '4', name: 'Analytics Portal', description: 'Data analytics and reporting', moduleCount: 4 },
];

export const mockModules: Module[] = [
  { id: '1', projectId: '1', name: 'Authentication', description: 'Login and signup flows', screenCount: 4 },
  { id: '2', projectId: '1', name: 'Product Catalog', description: 'Product browsing and search', screenCount: 6 },
  { id: '3', projectId: '1', name: 'Shopping Cart', description: 'Cart management', screenCount: 3 },
  { id: '4', projectId: '1', name: 'Checkout', description: 'Payment and order placement', screenCount: 5 },
  { id: '5', projectId: '1', name: 'User Profile', description: 'User account management', screenCount: 4 },
];

export const mockScreens: Screen[] = [
  { id: '1', moduleId: '1', name: 'Login Screen', description: 'User login page' },
  { id: '2', moduleId: '1', name: 'Sign Up Screen', description: 'New user registration' },
  { id: '3', moduleId: '1', name: 'Forgot Password', description: 'Password recovery flow' },
  { id: '4', moduleId: '1', name: 'Email Verification', description: 'Email confirmation page' },
  { id: '5', moduleId: '2', name: 'Product List', description: 'Browse all products' },
  { id: '6', moduleId: '2', name: 'Product Details', description: 'Individual product view' },
];

export const mockTestCases: TestCase[] = [
  { 
    id: 'TC001', 
    screenId: '1', 
    title: 'Valid Login', 
    description: 'User should be able to login with valid credentials',
    expectedResult: 'User is redirected to dashboard',
    priority: 'High',
    status: 'Pass'
  },
  { 
    id: 'TC002', 
    screenId: '1', 
    title: 'Invalid Password', 
    description: 'System should reject login with incorrect password',
    expectedResult: 'Error message displayed',
    priority: 'High',
    status: 'Pass'
  },
  { 
    id: 'TC003', 
    screenId: '1', 
    title: 'Empty Credentials', 
    description: 'System should validate empty fields',
    expectedResult: 'Validation errors shown',
    priority: 'Medium',
    status: 'Pending'
  },
  { 
    id: 'TC004', 
    screenId: '1', 
    title: 'Remember Me Checkbox', 
    description: 'User session should persist when remember me is checked',
    expectedResult: 'User stays logged in after browser restart',
    priority: 'Low',
    status: 'Fail'
  },
  { 
    id: 'TC005', 
    screenId: '1', 
    title: 'Account Lockout', 
    description: 'Account should lock after 5 failed attempts',
    expectedResult: 'Account locked message displayed',
    priority: 'High',
    status: 'Pass'
  },
];

export const mockBugs: Bug[] = [
  {
    id: 'BUG001',
    tcId: 'TC004',
    title: 'Remember me functionality not working',
    severity: 'Medium',
    status: 'Open',
    assignedTo: 'John Doe',
    createdDate: '2026-04-15'
  },
  {
    id: 'BUG002',
    tcId: 'TC003',
    title: 'Validation message not appearing',
    severity: 'Low',
    status: 'In Progress',
    assignedTo: 'Jane Smith',
    createdDate: '2026-04-14'
  },
];
