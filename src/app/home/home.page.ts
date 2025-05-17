import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IonHeader, IonToolbar, IonSegment, IonSegmentButton, IonTitle, IonItem, IonContent, IonLabel, IonList, IonThumbnail, IonIcon, IonSearchbar, IonButton, IonButtons } from '@ionic/angular/standalone'; // Import IonLabel, IonThumbnail, and IonSearchbar
import { AlertController, ToastController } from '@ionic/angular';
import { RadioBrowserService } from '../services/radio-browser.service'; // Import the service
import { CommonModule, TitleCasePipe } from '@angular/common'; // Import CommonModule for ngIf and ngFor
import { addIcons } from 'ionicons';
import { playSkipForward, searchOutline, chevronDownOutline, arrowDown, playSkipBackOutline, close, playSkipBackSharp, pause, play } from 'ionicons/icons';
import videojs from 'video.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonButtons, IonButton, IonHeader, IonToolbar, IonIcon, IonTitle, IonSegment, IonSegmentButton, IonContent, IonLabel, IonList, IonThumbnail, IonItem, IonSearchbar, CommonModule, TitleCasePipe], // Add IonLabel, IonThumbnail, and IonSearchbar to imports
})
export class HomePage implements OnInit, AfterViewInit {
  @ViewChild('audioPlayer', { static: false }) audioPlayer!: ElementRef<HTMLAudioElement>;
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;

  indianLanguages: string[] = ['all', 'hindi', 'english', 'bengali', 'telugu', 'marathi', 'tamil', 'gujarati', 'urdu', 'kannada'];
  displayedLanguages: string[] = []; // Filtered languages
  matchedStations: any[] = []; // Array to store matched stations
  displayedStations: any[] = []; // List of stations
  allStations: any[] = []; // Array to store all stations
  currentStation: any = null;
  currentIndex: number = -1;
  isPlaying: boolean = false;
  player: any = null; // Video.js player instance
  isPlayerExpanded: boolean = false;

  currentPlayer: string = ''; // Default player type
  isSearchBarVisible: boolean = false; // Track the visibility of the search bar

  retryCount: number = 0; // Track the number of retries
  maxRetries: number = 1; // Maximum number of retries allowed

  constructor(
    private radioBrowserService: RadioBrowserService,
    private alertController: AlertController,
    private toastController: ToastController // Add ToastController
  ) {
    addIcons({ 'search-outline': searchOutline, 'chevron-down-outline': chevronDownOutline, 'close': close, 'play-skip-forward': playSkipBackSharp, 'play-skip-back': playSkipBackSharp, 'play': play, 'pause': pause }); // Add icons
  }

  ngOnInit() {
    // Fetch stations by country
    this.radioBrowserService.getStationsByCountry('in').subscribe(
      (stations) => {
        console.log('Stations:', stations); // Log all stations

        // Filter stations whose language matches the `indianLanguages` array and country code is 'IN'
        const filteredStations = stations.filter((station: any) => {
          const stationLanguage = station.language?.toLowerCase(); // Convert station language to lowercase
          const stationCountryCode = station.countrycode?.toUpperCase(); // Convert country code to uppercase
          return this.indianLanguages.includes(stationLanguage) && stationCountryCode === 'IN';
        });

        console.log('Filtered Stations:', filteredStations); // Log matched stations

        // Remove duplicates based on station.name and station.url
        const uniqueStations = Array.from(
          new Map(
            filteredStations.map((station: any) => [`${station.name}-${station.url}`, station])
          ).values()
        );

        this.matchedStations = uniqueStations;
        this.allStations = uniqueStations; // Store all stations
        this.displayedStations = uniqueStations; // Initially display all stations

        console.log('Matched Stations:', this.matchedStations); // Log matched stations

        this.filterLanguages(); // Filter languages based on available stations

        console.log('All Stations:', this.allStations);
        console.log('Displayed Stations:', this.displayedStations);
      },
      (error) => {
        console.error('Error fetching stations:', error); // Handle errors
      }
    );
  }

  initializePlayer() {
    console.log('Video player element found:', this.videoPlayer.nativeElement);
    this.player = videojs(this.videoPlayer.nativeElement, {
      autoplay: 'play',
      controls: false,
      preload: 'auto',
      fluid: true,
      muted: false,
    });
  }

  ngAfterViewInit() {
    console.log('Video player reference:', this.videoPlayer);
    if (this.videoPlayer) {
 
      this.initializePlayer(); // Initialize the video player
      // Listen for errors
      this.player.on('error', () => {
        const error = this.player.error();
        if (error && error.code === 4) { // Error code 4 indicates a network error (e.g., 404)
          console.error('Error playing stream:', error.message);
          this.showToast('Channel is not available to play right now.');
        }
        if (!error.msg.includes('init')) {
           // Automatically switch to the next station on error
        }
      });
    } else {
      console.error('Video player element is not available');
    }
  }

  filterLanguages() {
    console.log('All Stations:', this.allStations); // Debugging log
    this.displayedLanguages = this.indianLanguages.filter((language) =>
      language === 'all' || this.allStations.some((station) => station.language === language)
    );
    console.log('Filtered Languages:', this.displayedLanguages); // Debugging log
  }

  onLanguageChange(event: any) {
    const selectedLanguage = event.detail.value;
    console.log('Selected Language:', selectedLanguage); // Debugging log

    if (selectedLanguage === 'all') {
      this.displayedStations = [...this.allStations]; // Create a new array reference
    } else {
      this.displayedStations = [...this.allStations.filter(
        (station) => station.language?.toLowerCase() === selectedLanguage
      )]; // Create a new array reference
    }

    console.log('Filtered Stations:', this.displayedStations); // Debugging log
  }

  async showStationDetails(station: any) {
    const alert = await this.alertController.create({
      header: station.name,
      subHeader: station.language,
      message: `
        <p><strong>Country:</strong> ${station.country}</p>
        <p><strong>Bitrate:</strong> ${station.bitrate} kbps</p>
        <p><strong>Stream URL:</strong> <a href="${station.url}" target="_blank">${station.url}</a></p>
      `,
      buttons: ['OK'],
    });

    await alert.present();
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/default-radio.png'; // Set the default image
  }

  sanitizeUrl(url: string): string {
    if (url && url.startsWith('http:')) {
      return url.replace('http:', 'https:'); // Convert http to https
    }
    return url || 'assets/default-radio.png'; // Return the default image if the URL is null or undefined
  }

  playStream(station: any, index: number) {
    // Update the currentIndex dynamically based on the displayedStations array
    this.currentIndex = this.displayedStations.findIndex(
      (s) => s.name === station.name && s.url === station.url
    );

    this.currentStation = station;

    this.playVideo(this.sanitizeUrl(station.url));
    this.logActivePlayerState();
  }

  playVideo(url: string) {
    console.log('Playing URL:', url); // Debugging log

    if (url.includes('icecast') || url.endsWith('.mp3') || url.endsWith('.ogg')) {
      // Handle audio playback
      this.cleanupPlayers(); // Ensure both players are stopped before starting

      const audioElement = this.audioPlayer.nativeElement;

      // Set the audio source
      audioElement.src = url;

      // Play the audio
      audioElement.play().then(() => {
        console.log('Audio playback started successfully');
        this.currentPlayer = 'audio'; // Set the current player type to audio
        this.isPlaying = true;
        this.retryCount = 0; // Reset the retry count on success
      }).catch((error: any) => {
        console.error('Error playing audio:', error);
        this.showToast('Error playing audio. Retrying with resolved URL...');
        this.retryWithResolvedUrl(); // Retry with the resolved URL
      });

      // Listen for errors
      audioElement.onerror = () => {
        console.error('Error playing audio:', audioElement.error);
        this.retryWithResolvedUrl(); // Retry with the resolved URL
      };

      // Hide the video player and show the audio player
      this.videoPlayer.nativeElement.hidden = true;
      audioElement.hidden = false;

    } else {
      // Handle video playback
      this.cleanupPlayers(); // Ensure both players are stopped before starting

      if (this.videoPlayer && this.videoPlayer.nativeElement) {
        // Initialize or reinitialize the video.js player
        this.player = videojs(this.videoPlayer.nativeElement, {
          autoplay: 'play',
          controls: false,
          preload: 'auto',
          fluid: true,
          muted: false,
        });

        this.player.src({
          src: url,
          type: url.endsWith('.m3u8') ? 'application/x-mpegURL' : 'audio/mp3',
        });

        setTimeout(() => {
          console.log('Player initialized and ready after 3 second delay');
        }, 3000);

        this.player.play().then(() => {
          console.log('Video playback started successfully');
          this.currentPlayer = 'video'; // Set the current player type to video
          this.isPlaying = true;
          this.retryCount = 0; // Reset the retry count on success
        }).catch((error: any) => {
          console.error('Error playing video:', error);
          this.showToast('Error playing video. Retrying with resolved URL...');
          this.retryWithResolvedUrl(); // Retry with the resolved URL
        });

        // Listen for errors
        this.player.on('error', () => {
          const error = this.player.error();
          console.error('Error playing video:', error?.message);
          this.retryWithResolvedUrl(); // Retry with the resolved URL
        });

        // Hide the audio player and show the video player
        this.videoPlayer.nativeElement.hidden = false;
        this.audioPlayer.nativeElement.hidden = true;

      } else {
        console.error('Video player element is not available');
        this.showToast('Player initialization failed. Please reload the app.');
      }
    }
  }

  retryWithResolvedUrl() {
    if (this.retryCount >= this.maxRetries) {
      console.error('Maximum retry attempts reached');
      this.showToast('Unable to play this station. Trying the next one.');
      this.retryCount = 0; // Reset the retry count
      // this.goToNextStation(); // Automatically switch to the next station
      return;
    }

    if (this.currentStation && this.currentStation.url_resolved && this.currentStation === this.currentStation.url_resolved) {
      console.log('Retrying with resolved URL:', this.currentStation.url_resolved);
      this.retryCount++; // Increment the retry count
      this.playVideo(this.sanitizeUrl(this.currentStation.url_resolved));
    } else {
      console.error('No resolved URL available for retry');
      this.showToast('Unable to play this station. Trying the next one.');
      this.retryCount = 0; // Reset the retry count
      // this.goToNextStation(); // Automatically switch to the next station
    }
  }

  togglePlayer(event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevent triggering other click events
    }
    this.isPlayerExpanded = !this.isPlayerExpanded;
  }

  closePlayer(event: Event) {
    event.stopPropagation(); // Prevent triggering the togglePlayer method
    this.currentStation = null;
    this.isPlaying = false;
    const player = this.activePlayer;
    if (player) {
      if (this.currentPlayer === 'audio') {
        player.pause();
        player.src = ''; // Clear the audio source
      } else if (this.currentPlayer === 'video') {
        player.dispose(); // Dispose of the video.js player
        this.player = null;
      }
    }
  }

  togglePlayPause(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.logActivePlayerState(); // Log the state before toggling
    const player = this.activePlayer;

    if (player) {
      if (this.currentPlayer === 'audio') {
        // Handle the native audio player
        if (player.paused) {
          player.play();
          this.isPlaying = true;
        } else {
          player.pause();
          this.isPlaying = false;
        }
      } else if (this.currentPlayer === 'video') {
        // Handle the video.js player
        if (player.paused()) {
          player.play();
          this.isPlaying = true;
        } else {
          player.pause();
          this.isPlaying = false;
        }
      }
    }
  }

  goToNextStation() {
    this.cleanupPlayers(); // Dispose and pause both players before switching

    setTimeout(() => {
      if (this.currentIndex < this.displayedStations.length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0; // Loop back to the first station
      }

      this.playStream(this.displayedStations[this.currentIndex], this.currentIndex);
    }, 500); // Add a 500ms delay before playing the next station
  }

  get nextStation() {
    if (this.currentIndex >= 0 && this.currentIndex < this.displayedStations.length - 1) {
      return this.displayedStations[this.currentIndex + 1];
    } else if (this.currentIndex === this.displayedStations.length - 1) {
      return this.displayedStations[0]; // Show the first station if at the end of the list
    }
    return null;
  }

  prevStation() {
    this.cleanupPlayers(); // Dispose and pause both players before switching

    setTimeout(() => {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else {
        this.currentIndex = this.displayedStations.length - 1; // Loop back to the last station
      }

      this.playStream(this.displayedStations[this.currentIndex], this.currentIndex);
    }, 500); // Add a 500ms delay before playing the previous station
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000, // Toast will disappear after 3 seconds
      position: 'bottom', // Display at the bottom of the screen
      color: 'danger', // Use a red color to indicate an error
    });
    await toast.present();
  }

  onSearchChannel(event: any) {
    const query = event.target.value.toLowerCase(); // Get the search query and convert it to lowercase
    if (query.trim() === '') {
      // If the search query is empty, reset to show all stations
      this.displayedStations = [...this.allStations];
    } else {
      // Filter stations based on the search query
      this.displayedStations = this.allStations.filter((station) => {
        const name = station.name.toLowerCase();
        const language = station.language?.toLowerCase();
        const country = station.country?.toLowerCase();
        return name.includes(query) || language?.includes(query) || country?.includes(query);
      });
    }
    console.log('Filtered Stations:', this.displayedStations); // Debugging log
  }

  handlePlaybackError(playerType: string) {
    this.logActivePlayerState(); // Log the state during error handling
    const player = this.activePlayer;
    if (player) {
      console.error(`${playerType} playback error`);
      this.showToast(`${playerType} playback failed. Trying again.`);
      
    }
  }

  cleanupPlayers() {
    if (this.audioPlayer && this.audioPlayer.nativeElement) {
      this.audioPlayer.nativeElement.pause(); // Pause the audio player
      this.audioPlayer.nativeElement.src = ''; // Clear the audio source
    }

    if (this.player) {
      this.player.pause(); // Pause the video.js player
      this.player.src({ src: '', type: '' }); // Clear the video source
      this.player.dispose(); // Dispose of the video.js player
      this.player = null; // Reset the player reference
    }

    this.isPlaying = false; // Reset the playing state
  }

  get activePlayer() {
    return this.currentPlayer === 'audio' ? this.audioPlayer.nativeElement : this.player;
  }

  logActivePlayerState() {
    const player = this.activePlayer;
    if (player) {
      console.log('Active Player:', this.currentPlayer);

      if (this.currentPlayer === 'audio') {
        // Handle the native audio player
        console.log('Is Playing:', !player.paused);
      } else if (this.currentPlayer === 'video') {
        // Handle the video.js player
        console.log('Is Playing:', !player.paused());
      }
    }
  }

  toggleSearchBar() {
    this.isSearchBarVisible = !this.isSearchBarVisible; // Toggle the search bar visibility
  }

  closeSearchBar() {
    this.isSearchBarVisible = false; // Close the search bar when it loses focus
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose(); // Clean up the video.js player instance
      this.player = null; // Reset the player reference
    }
  }
}
