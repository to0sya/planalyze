import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContentCalendarService } from '../../services/content-calendar.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TruncatePipe } from '../../pipes/truncate.pipe';

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
  imports: [CommonModule, ReactiveFormsModule, TruncatePipe],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss'
})
export class CalendarViewComponent {
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: Array<Array<{date: Date, currentMonth: boolean, isToday: boolean}>> = [];
  
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  currentView = 'month';
  
  posts: Post[] = [];
  stories: Story[] = [];
  reels: any[] = []; // Add reels type later
  
  // Modal properties
  showContentModal = false;
  selectedDate: Date = new Date();
  contentForm!: FormGroup;
  
  constructor(
    private router: Router,
    private calendarService: ContentCalendarService,
    private formBuilder: FormBuilder
  ) {
    this.contentForm = this.formBuilder.group({
      contentType: ['post', Validators.required],
      caption: [''],
      time: ['12:00']
    });
  }
  
  ngOnInit(): void {
    this.loadCalendarData();
    this.generateCalendarDays();
  }
  
  get currentMonthName(): string {
    return new Date(this.currentYear, this.currentMonth, 1).toLocaleString('default', { month: 'long' });
  }
  
  setView(view: string): void {
    this.currentView = view;
    // Implement different view logic here
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
    const startDate = new Date(this.currentYear, this.currentMonth, 1);
    const endDate = new Date(this.currentYear, this.currentMonth + 1, 0);
    
    // this.calendarService.getScheduledContent(startDate, endDate)
    //   .subscribe(
    //     data => {
    //       this.posts = data.posts;
    //       this.stories = data.stories;
    //       this.reels = data.reels || [];
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
  
  getReelsForDate(date: Date): any[] {
    return this.reels.filter(reel => this.isSameDate(new Date(reel.scheduledAt), date));
  }
  
  formatTime(dateTimeString: string | null): string {
    if (dateTimeString) {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return '';
  }
  
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }
  
  openContentCreation(date?: Date): void {
    this.selectedDate = date || new Date();
    this.showContentModal = true;
    
    // Set default time to current time rounded to nearest half hour
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes() >= 30 ? 30 : 0;
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    this.contentForm.patchValue({
      contentType: 'post',
      caption: '',
      time: timeString
    });
  }
  
  closeContentModal(): void {
    this.showContentModal = false;
  }
  
  selectContentType(type: string): void {
    this.contentForm.patchValue({
      contentType: type
    });
  }
  
  createContent(): void {
    const formValue = this.contentForm.value;
    const scheduledDateTime = new Date(this.selectedDate);
    const [hours, minutes] = formValue.time.split(':').map(Number);
    
    scheduledDateTime.setHours(hours, minutes, 0, 0);
    
    const contentData = {
      caption: formValue.caption,
      scheduledAt: scheduledDateTime.toISOString(),
      status: 'scheduled'
    };
    
    switch (formValue.contentType) {
      case 'post':
        this.router.navigate(['/app/post/new'], { 
          queryParams: { 
            date: scheduledDateTime.toISOString(),
            caption: formValue.caption
          } 
        });
        break;
      case 'story':
        this.router.navigate(['/app/story/new'], { 
          queryParams: { 
            date: scheduledDateTime.toISOString(),
            caption: formValue.caption
          } 
        });
        break;
      case 'reel':
        this.router.navigate(['/app/reel/new'], { 
          queryParams: { 
            date: scheduledDateTime.toISOString(),
            caption: formValue.caption
          } 
        });
        break;
    }
    
    this.closeContentModal();
  }
  
  editPost(id: string, event: MouseEvent): void {
    event.stopPropagation(); // Prevent calendar day click
    this.router.navigate([`/app/post/edit/${id}`]);
  }
  
  editStory(id: string, event: MouseEvent): void {
    event.stopPropagation(); // Prevent calendar day click
    this.router.navigate([`/app/story/edit/${id}`]);
  }
  
  editReel(id: string, event: MouseEvent): void {
    event.stopPropagation(); // Prevent calendar day click
    this.router.navigate([`/app/reel/edit/${id}`]);
  }
}
