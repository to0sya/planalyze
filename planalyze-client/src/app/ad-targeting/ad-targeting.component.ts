import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-ad-targeting',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ad-targeting.component.html',
  styleUrl: './ad-targeting.component.scss'
})
export class AdTargetingComponent {
  targetingForm!: FormGroup;
  interestInput: FormControl;
  behaviorInput: FormControl;
  
  isEditMode = false;
  submitted = false;
  
  targetingPresets: any[] = [];
  selectedPresetId: string | null = null;
  
  selectedInterests: string[] = [];
  selectedBehaviors: string[] = [];
  
  interestSuggestions: string[] = [];
  behaviorSuggestions: string[] = [];
  
  constructor(
    private formBuilder: FormBuilder,
    // private adTargetingService: AdTargetingService
  ) {
    this.interestInput = new FormControl('');
    this.behaviorInput = new FormControl('');
  }
  
  ngOnInit(): void {
    this.createForm();
    this.loadTargetingPresets();
    
    this.interestInput.valueChanges.subscribe(value => {
      if (value && value.length > 1) {
        // this.searchInterests(value);
      } else {
        this.interestSuggestions = [];
      }
    });
    
    this.behaviorInput.valueChanges.subscribe(value => {
      if (value && value.length > 1) {
        // this.searchBehaviors(value);
      } else {
        this.behaviorSuggestions = [];
      }
    });
  }
  
  createForm(): void {
    this.targetingForm = this.formBuilder.group({
      presetName: ['', Validators.required],
      description: [''],
      ageMin: ['18'],
      ageMax: ['65+'],
      genderAll: [true],
      genderMale: [false],
      genderFemale: [false],
      automaticPlacements: [true],
      placementFeed: [false],
      placementStories: [false],
      placementExplore: [false],
      placementReels: [false]
    });
  }
  
  // convenience getter for easy access to form fields
  get f() { return this.targetingForm.controls; }
  
  loadTargetingPresets(): void {
    // this.adTargetingService.getTargetingPresets().subscribe(
    //   data => {
    //     this.targetingPresets = data;
    //   },
    //   error => {
    //     console.error('Error loading targeting presets', error);
    //   }
    // );
  }
  
  selectPreset(preset: any): void {
    this.selectedPresetId = preset.id;
    this.isEditMode = true;
    
    // Update form with preset data
    this.targetingForm.patchValue({
      presetName: preset.name,
      description: preset.description,
      ageMin: preset.targeting.ageMin,
      ageMax: preset.targeting.ageMax,
      genderAll: preset.targeting.gender === 'all',
      genderMale: preset.targeting.gender === 'male' || preset.targeting.gender === 'all',
      genderFemale: preset.targeting.gender === 'female' || preset.targeting.gender === 'all',
      automaticPlacements: preset.placements.automatic,
      placementFeed: preset.placements.feed,
      placementStories: preset.placements.stories,
      placementExplore: preset.placements.explore,
      placementReels: preset.placements.reels
    });
    
    // Update selected interests and behaviors
    this.selectedInterests = [...preset.targeting.interests];
    this.selectedBehaviors = [...preset.targeting.behaviors];
  }
  
  createNewPreset(): void {
    this.selectedPresetId = null;
    this.isEditMode = false;
  }
}
