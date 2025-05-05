import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { RadioBrowserService } from '../services/radio-browser.service'; // Import the service

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements OnInit {
  indianLanguages: string[] = [
    'hindi',
    'english',
    'bengali',
    'telugu',
    'marathi',
    'tamil',
    'gujarati',
    'urdu',
    'kannada',
    'odia',
    'malayalam',
    'punjabi',
    'assamese',
    'maithili',
    'santali',
    'kashmiri',
    'nepali',
    'konkani',
    'sindhi',
    'dogri',
    'manipuri',
    'bodo',
    'sanskrit',
    'tulu',
    'bhili',
    'garo',
    'khasi',
    'mizo',
    'ladakhi',
    'sikkimese',
    'nagamese',
  ];

  matchedStations: any[] = []; // Array to store matched stations

  constructor(private radioBrowserService: RadioBrowserService) { } // Inject the service

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

        console.log('Matched Stations:', this.matchedStations); // Log matched stations

        // Group stations by language
        const stationsByLanguage: { [key: string]: any[] } = {};
        this.matchedStations.forEach((station: any) => {
          const language = station.language?.toLowerCase();
          if (!stationsByLanguage[language]) {
            stationsByLanguage[language] = [];
          }
          stationsByLanguage[language].push(station);
        });

        // Log stations for each language
        Object.keys(stationsByLanguage).forEach((language) => {
          console.log(`Stations for language "${language}":`, stationsByLanguage[language]);
        });

        console.log('Stations Grouped by Language:', stationsByLanguage); // Log grouped stations
      },
      (error) => {
        console.error('Error fetching stations:', error); // Handle errors
      }
    );
  }
}
