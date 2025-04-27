import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContentCalendarService } from '../../services/content-calendar.service';
import { CommonModule } from '@angular/common';

type Post = {
  id: string;
  caption: string;
  mediaUrls: string[];
  thumbnailUrl?: string;
  location?: Location;
  hashtags?: string[];
  scheduledAt: string | null;
  publishedAt?: string | null;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  hideComments: boolean;
  disableComments: boolean;
  stats?: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    reach: number;
    impressions: number;
  };
  createdAt: string;
  updatedAt: string;
}

type Story = {
  id: string;
  mediaUrls: string[];
  thumbnailUrl?: string;
  caption?: string;
  location?: Location;
  hashtags?: string[];
  scheduledAt: string | null;
  publishedAt?: string | null;
  status: 'draft' | 'scheduled' | 'published' | 'expired' | 'failed';
  stats?: {
    views: number;
    replies: number;
    shares: number;
    link_clicks: number;
    sticker_taps: number;
    exits: number;
  };
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss'
})
export class CalendarViewComponent {
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: Array<Array<{date: Date, currentMonth: boolean, isToday: boolean}>> = [];
  
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  
  posts: Post[] = [];
  stories: Story[] = [];
  
  constructor(
    private router: Router,
    private calendarService: ContentCalendarService
  ) { }
  
  ngOnInit(): void {
    this.loadCalendarData();
    this.generateCalendarDays();
  }
  
  get currentMonthName(): string {
    return new Date(this.currentYear, this.currentMonth, 1).toLocaleString('default', { month: 'long' });
  }
  
  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendarDays();
    this.loadCalendarData();
  }
  
  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendarDays();
    this.loadCalendarData();
  }
  
  generateCalendarDays(): void {
    this.calendarDays = [];
    
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    
    const firstDayOfCalendar = new Date(firstDayOfMonth);
    firstDayOfCalendar.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());
    
    const lastDayOfCalendar = new Date(lastDayOfMonth);
    const daysToAdd = 6 - lastDayOfMonth.getDay();
    lastDayOfCalendar.setDate(lastDayOfMonth.getDate() + daysToAdd);
    
    const currentDay = new Date(firstDayOfCalendar);
    
    while (currentDay <= lastDayOfCalendar) {
      const week = [];
      
      for (let i = 0; i < 7; i++) {
        const isToday = this.isSameDate(currentDay, new Date());
        const currentMonth = currentDay.getMonth() === this.currentMonth;
        
        week.push({
          date: new Date(currentDay),
          currentMonth,
          isToday
        });
        
        currentDay.setDate(currentDay.getDate() + 1);
      }
      
      this.calendarDays.push(week);
    }
  }
  
  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }
  
  loadCalendarData(): void {
    // In a real app, you would load data from your service
    const startDate = new Date(this.currentYear, this.currentMonth, 1);
    const endDate = new Date(this.currentYear, this.currentMonth + 1, 0);
    
    // this.calendarService.getScheduledContent(startDate, endDate)
    //   .subscribe(
    //     data => {
    //       this.posts = data.posts;
    //       this.stories = data.stories;
    //     },
    //     error => {
    //       console.error('Error loading calendar data', error);
    //     }
    //   );
  }
  
  getPostsForDate(date: Date): Post[] {
    return this.posts.filter(post => post.scheduledAt && this.isSameDate(new Date(post.scheduledAt), date));
  }
  
  getStoriesForDate(date: Date): Story[] {
    return this.stories.filter(story => story.scheduledAt && this.isSameDate(new Date(story.scheduledAt), date));
  }
  
  formatTime(dateTimeString: string | null): string {
    if (!dateTimeString) return '';
    
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  openContentCreation(date: Date): void {
    // Open a modal or dialog to choose between post and story
    const contentType = window.confirm('Create a post? Click Cancel to create a story instead.') ? 'post' : 'story';
    
    if (contentType === 'post') {
      this.router.navigate(['/app/post/new'], { 
        queryParams: { 
          date: date.toISOString().split('T')[0] 
        } 
      });
    } else {
      this.router.navigate(['/app/story/new'], { 
        queryParams: { 
          date: date.toISOString().split('T')[0] 
        } 
      });
    }
  }
  
  editPost(id: string): void {
    this.router.navigate([`/app/post/edit/${id}`]);
  }
  
  editStory(id: string): void {
    this.router.navigate([`/app/story/edit/${id}`]);
  }
}
