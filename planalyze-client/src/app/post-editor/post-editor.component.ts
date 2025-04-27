import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentCalendarService } from '../../services/content-calendar.service';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-editor.component.html',
  styleUrl: './post-editor.component.scss'
})
export class PostEditorComponent {
  postForm!: FormGroup;
  isEditMode = false;
  postId: string | null = null;
  submitted = false;
  previewUrls: string[] = [];
  selectedFiles: File[] = [];
  locationSearchResults: any[] = [];
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private calendarService: ContentCalendarService,
    // private locationService: LocationService
  ) { }
  
  ngOnInit(): void {
    this.createForm();
    
    this.route.paramMap.subscribe(params => {
      this.postId = params.get('id');
      if (this.postId) {
        this.isEditMode = true;
        this.loadPostData();
      } else {
        // Check if date was passed via query params (from calendar)
        this.route.queryParamMap.subscribe(queryParams => {
          const scheduledDate = queryParams.get('date');
          if (scheduledDate) {
            this.postForm.patchValue({
              publishingOption: 'scheduled',
              scheduledDate: scheduledDate
            });
          }
        });
      }
    });
  }
  
  createForm(): void {
    this.postForm = this.formBuilder.group({
      caption: ['', Validators.required],
      location: [''],
      locationId: [''],
      hashtags: [''],
      publishingOption: ['now'],
      scheduledDate: [''],
      scheduledTime: [''],
      hideComments: [false],
      disableComments: [false]
    });
  }
  
  loadPostData(): void {
    if (!this.postId) return;
    
    // this.calendarService.getPost(this.postId).subscribe(
    //   post => {
    //     // Generate preview URLs for existing media
    //     if (post.mediaUrls && post.mediaUrls.length) {
    //       this.previewUrls = [...post.mediaUrls];
    //     }
        
    //     // Parse scheduled date/time if set
    //     let scheduledDate = '';
    //     let scheduledTime = '';
    //     let publishingOption = 'now';
        
    //     if (post.scheduledAt) {
    //       const scheduledDateTime = new Date(post.scheduledAt);
    //       scheduledDate = scheduledDateTime.toISOString().split('T')[0];
    //       scheduledTime = scheduledDateTime.toTimeString().substring(0, 5);
    //       publishingOption = 'scheduled';
    //     }
        
    //     // Update form with post data
    //     this.postForm.patchValue({
    //       caption: post.caption,
    //       location: post.location ? post.location.name : '',
    //       locationId: post.location ? post.location.id : '',
    //       hashtags: post.hashtags ? post.hashtags.join(' ') : '',
    //       publishingOption,
    //       scheduledDate,
    //       scheduledTime,
    //       hideComments: post.hideComments,
    //       disableComments: post.disableComments
    //     });
    //   },
    //   error => {
    //     console.error('Error loading post', error);
    //   }
    // );
  }
  
  // convenience getter for easy access to form fields
  get f() { return this.postForm.controls; }
  
  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (this.selectedFiles.length + this.previewUrls.length >= 10) break;
        
        const file = files[i];
        this.selectedFiles.push(file);
        
        // Generate and store preview URL
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  
  removeMedia(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.previewUrls.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }
  
  searchLocations(event: any): void {
    const query = event.target.value.trim();
    
    if (query.length < 2) {
      this.locationSearchResults = [];
      return;
    }
    
    // this.locationService.searchLocations(query).subscribe(
    //   results => {
    //     this.locationSearchResults = results;
    //   },
    //   error => {
    //     console.error('Error searching locations', error);
    //   }
    // );
  }
  
  selectLocation(location: any): void {
    this.postForm.patchValue({
      location: location.name,
      locationId: location.id
    });
    this.locationSearchResults = [];
  }
  
  onPublishingOptionChange(option: string): void {
    // if (option === 'now') {
    //   this.postForm.patchValue({
    //     scheduledDate: '',
    //     scheduledTime: ''
    //   });
    // } else if (option === 'scheduled' && !this.f.scheduledDate.value) {
    //   // Set default to tomorrow
    //   const tomorrow = new Date();
    //   tomorrow.setDate(tomorrow.getDate() + 1);
    //   this.postForm.patchValue({
    //     scheduledDate: tomorrow.toISOString().split('T')[0],
    //     scheduledTime: '09:00'
    //   });
    // }
  }
  
  savePost(): void {
    this.submitted = true;
    
    if (this.postForm.invalid || (!this.isEditMode && this.previewUrls.length === 0)) {
      return;
    }
    
    let scheduledAt: Date | null = null;
    
    // if (this.f.publishingOption.value === 'scheduled') {
    //   const dateStr = this.f.scheduledDate.value;
    //   const timeStr = this.f.scheduledTime.value || '00:00';
    //   scheduledAt = new Date(`${dateStr}T${timeStr}`);
    // }
    
    // const hashtagsArray = this.f.hashtags.value
    //   ? this.f.hashtags.value.split(' ').filter((tag: string) => tag.trim() !== '').map((tag: string) => tag.startsWith('#') ? tag : `#${tag}`)
    //   : [];
    
    // const postData: Partial<Post> = {
    //   caption: this.f.caption.value,
    //   hashtags: hashtagsArray,
    //   hideComments: this.f.hideComments.value,
    //   disableComments: this.f.disableComments.value,
    //   scheduledAt: scheduledAt ? scheduledAt.toISOString() : null
    // };
    
    // if (this.f.locationId.value) {
    //   postData.location = {
    //     id: this.f.locationId.value,
    //     name: this.f.location.value
    //   };
    // }
    
    // if (this.isEditMode) {
    //   this.calendarService.updatePost(this.postId as string, postData, this.selectedFiles).subscribe(
    //     () => {
    //       this.navigateBack();
    //     },
    //     error => {
    //       console.error('Error updating post', error);
    //     }
    //   );
    // } else {
    //   this.calendarService.createPost(postData, this.selectedFiles).subscribe(
    //     () => {
    //       this.navigateBack();
    //     },
    //     error => {
    //       console.error('Error creating post', error);
    //     }
    //   );
    // }
  }
  
  navigateBack(): void {
    this.router.navigate(['/app/calendar']);
  }
}
