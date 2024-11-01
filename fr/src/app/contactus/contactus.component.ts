// Import required modules
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Define User interface
export interface User {
  _id: string;
  username: string;
  email: string;
  department: string;
  role: string;
  createdAt?: Date; // Assuming createdAt is available for year categorization
}

@Component({
  selector: 'app-user-role-fetch',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
  users: User[] = []; // Holds raw user data
  categorizedUsers: { [key: string]: User[] } = {}; // Object to categorize users by year
  errorMessage: string | undefined; // Stores any error message
  yearRanges: string[] = []; // Will be dynamically populated based on user data
  selectedYearRange: string = ''; // Holds selected year range

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers(); // Fetch users on initialization
  }

  // Method to fetch users from API
  async fetchUsers(): Promise<void> {
    const apiUrl = 'http://localhost:5000/api/userRoles';

    try {
      const data = await this.http.get<{ message: string; userRoles: User[] }>(apiUrl).toPromise();
      this.users = data?.userRoles || []; // Store raw user data
      this.yearRanges = this.getUniqueYears(this.users); // Populate yearRanges based on user data
      this.categorizeUsersByYear(this.users); // Categorize users based on year
      this.errorMessage = undefined;
    } catch (error) {
      this.errorMessage = 'Failed to fetch users';
      console.error('Error fetching users:', error);
    }
  }

  // Method to extract unique years from users
  getUniqueYears(users: User[]): string[] {
    const yearsSet = new Set<number>(); // Use a Set to store unique years

    users.forEach(user => {
      if (user.createdAt) {
        const year = new Date(user.createdAt).getFullYear();
        yearsSet.add(year); // Add the year to the set
      }
    });

    return Array.from(yearsSet).map(year => year.toString()).sort(); // Convert to array and sort
  }

  // Method to categorize users by year
  categorizeUsersByYear(users: User[]): void {
    this.categorizedUsers = {}; // Clear existing categories

    this.yearRanges.forEach((year) => {
      this.categorizedUsers[year] = users.filter((user) => {
        const createdAtYear = user.createdAt ? new Date(user.createdAt).getFullYear() : null;
        return createdAtYear === Number(year); // Match users created in the specific year
      });
    });
  }

  // Method to navigate to dashboard
  navigateToDashboard(): void {
    this.router.navigate(['/Dashboard']);
  }
}
