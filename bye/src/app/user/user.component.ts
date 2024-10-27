import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Define the User interface
export interface User {
  id: string; // Unique ID
  username?: string; // Username can be optional
  email?: string;
  createdAt?: Date;
   // Email can be optional
}

// Define the UserInsert interface for new user data
export interface UserInsert {
  username: string; // The username of the user
  role: string;     // The role of the user (e.g., admin, user)
  email: string;    // The email of the user
  department: string;
  createdAt?: Date; // The department of the user
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: User[] = []; // Array to hold user data
  newUser: UserInsert = { // Object to hold new user data
    username: '',
    role: '',
    email: '',
    department: ''
  };
  isInsertUserFormVisible = false; // Flag to toggle the visibility of the insert form
  errorMessage: string | undefined; // Variable to hold error messages

  constructor(private http: HttpClient, private router: Router) {} // Inject HttpClient and Router

  ngOnInit(): void {
    this.fetchUsers(); // Fetch users when the component initializes
  }

  fetchUsers(): void {
    const apiUrl = 'https://club-website-gice.onrender.com/api/users';
  
    this.http.get<{ message: string; users: User[] }>(apiUrl).subscribe({
      next: (data) => {
        this.users = data.users.map(user => ({
          ...user,
          year: user.createdAt ? new Date(user.createdAt).getFullYear() : null // Extract the year
        }));
        this.errorMessage = undefined;
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch users';
        console.error('Error fetching users:', error);
      }
    });
  }
  deleteUser (userId: string): void {
    const deleteUrl = `http://localhost:5000/api/users/${userId}`; // API URL for deleting a user

    this.http.delete<{ message: string }>(deleteUrl).subscribe({
      next: () => {
        this.fetchUsers(); // Refresh the user list after deletion
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete user'; // Set error message on failure
        console.error('Error deleting user:', error); // Log the error for debugging
      }
    });
  }
  
  
  // Update insertUser to send createdAt
  insertUser(): void {
    const apiUrl = 'http://localhost:5000/api/addUserRole';
    this.newUser.createdAt = new Date(); // Add the current date as createdAt
  
    this.http.post<{ message: string }>(apiUrl, this.newUser).subscribe({
      next: () => {
        this.fetchUsers();
        this.resetNewUserForm();
        this.isInsertUserFormVisible = false;
        this.errorMessage = undefined;
      },
      error: (error) => {
        this.errorMessage = 'Failed to add user';
        console.error('Error adding user:', error);
      }
    });
  }
  
  // Ensure resetNewUserForm clears createdAt
  resetNewUserForm(): void {
    this.newUser = {
      username: '',
      role: '',
      email: '',
      department: '',
      createdAt: undefined // Reset createdAt
    };
  }
  toggleInsertUserForm(): void {
    this.isInsertUserFormVisible = !this.isInsertUserFormVisible; // Toggle form visibility
  }

  
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']); // Navigate to the dashboard route
  }
}
