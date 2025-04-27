import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics-dashboard.component.html',
  styleUrl: './analytics-dashboard.component.scss'
})
export class AnalyticsDashboardComponent {
  selectedDateRange = '30';
  
  accountSummary = {
    totalFollowers: 0,
    followerGrowth: 0,
    totalReach: 0,
    reachGrowth: 0,
    totalImpressions: 0,
    impressionsGrowth: 0,
    engagementRate: 0,
    engagementGrowth: 0
  };
  
  topLocations: {name: string, percentage: number}[] = [];
  bestPosts: any[] = [];
  
  // constructor(private analyticsService: AnalyticsService) { }
  
  ngOnInit(): void {
    this.loadData();
  }
  
  onDateRangeChange(): void {
    this.loadData();
  }
  
  loadData(): void {
    // // Load account summary data
    // this.analyticsService.getAccountSummary(this.selectedDateRange).subscribe(
    //   data => {
    //     this.accountSummary = data;
    //   },
    //   error => {
    //     console.error('Error loading account summary', error);
    //   }
    // );
    
    // // Load follower growth data and render chart
    // this.analyticsService.getFollowerGrowth(this.selectedDateRange).subscribe(
    //   data => {
    //     this.renderFollowerGrowthChart(data);
    //   },
    //   error => {
    //     console.error('Error loading follower growth data', error);
    //   }
    // );
    
    // // Load content performance data and render chart
    // this.analyticsService.getContentPerformance(this.selectedDateRange).subscribe(
    //   data => {
    //     this.renderContentPerformanceChart(data);
    //   },
    //   error => {
    //     console.error('Error loading content performance data', error);
    //   }
    // );
    
    // // Load audience demographics and render charts
    // this.analyticsService.getAudienceDemographics().subscribe(
    //   data => {
    //     this.renderGenderChart(data.gender);
    //     this.renderAgeChart(data.ageGroups);
    //   },
    //   error => {
    //     console.error('Error loading audience demographics', error);
    //   }
    // );
    
    // // Load top locations
    // this.analyticsService.getTopLocations().subscribe(
    //   data => {
    //     this.topLocations = data;
    //   },
    //   error => {
    //     console.error('Error loading top locations', error);
    //   }
    // );
    
    // // Load best performing posts
    // this.analyticsService.getBestPerformingContent(this.selectedDateRange).subscribe(
    //   data => {
    //     this.bestPosts = data;
    //   },
    //   error => {
    //     console.error('Error loading best performing content', error);
    //   }
    // );
  }
  
  renderFollowerGrowthChart(data: any): void {
    const canvas = document.getElementById('followerGrowthChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Followers',
          data: data.values,
          borderColor: '#8253eb',
          backgroundColor: 'rgba(130, 83, 235, 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }
  
  renderContentPerformanceChart(data: any): void {
    const canvas = document.getElementById('contentPerformanceChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Likes', 'Comments', 'Shares', 'Saves'],
        datasets: [
          {
            label: 'Posts',
            data: [data.posts.likes, data.posts.comments, data.posts.shares, data.posts.saves],
            backgroundColor: '#8253eb'
          },
          {
            label: 'Stories',
            data: [data.stories.likes, data.stories.comments, data.stories.shares, data.stories.saves],
            backgroundColor: '#fe517e'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  renderGenderChart(data: any): void {
    const canvas = document.getElementById('genderChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Female', 'Male', 'Other'],
        datasets: [{
          data: [data.female, data.male, data.other],
          backgroundColor: ['#fe517e', '#00c9a7', '#ffa36a']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 10
              }
            }
          }
        }
      }
    });
  }
  
  renderAgeChart(data: any): void {
    const canvas = document.getElementById('ageChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['13-17', '18-24', '25-34', '35-44', '45+'],
        datasets: [{
          data: [data['13-17'], data['18-24'], data['25-34'], data['35-44'], data['45+']],
          backgroundColor: '#8253eb'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
