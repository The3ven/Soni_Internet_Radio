import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})


export class RadioBrowserService {

  constructor(public apiService: ApiService) {}

  getAllStations() {
    return this.apiService.getData('json/stations');
  }

  getServerConfig() {
    return this.apiService.getData('json/config');
  }

  getServerMirrors() {
    return this.apiService.getData('json/servers');
  }

  getServerStats() {
    return this.apiService.getData('json/stats');
  }
  getStationById(id: string) {
    return this.apiService.getData(`json/station/${id}`);
  }
  getStationClicks(stationId: string) {
    return this.apiService.getData(`json/url/${stationId}`);
  }
  getStationVotes(stationId: string) {
    return this.apiService.getData(`json/vote/${stationId}`);
  }
  getStationsByBitrate(bitrate: number) {
    return this.apiService.getData(`json/stations/bitrate/${bitrate}`);
  }
  getStationsByClickCount(minClicks: number) {
    return this.apiService.getData(`json/stations/clickcount/${minClicks}`);
  }
  getStationsByCodec(codec: string) {
    return this.apiService.getData(`json/stations/codec/${codec}`);
  }
  getStationsByCountry(country: string) {
    return this.apiService.getData(`json/stations/bycountry/${country}`);
  }

  /**
   * @deprecated This method is deprecated and may be removed in future versions.
   * Use an alternative method if available.
   */
  getStationsByCountryCode(countryCode: string) {
    return this.apiService.getData(`json/stations/countrycode/${countryCode}`);
  }
  
  getStationsByExactBitrate(bitrate: number) {
    return this.apiService.getData(`json/stations/bybitrate/${bitrate}`);
  }
  getStationsByExactCodec(codec: string) {
    return this.apiService.getData(`json/stations/bycodec/${codec}`);
  }
  getStationsByExactCountry(country: string) {
    return this.apiService.getData(`json/stations/bycountryexact/${country}`);
  }
  getStationsByExactLanguage(language: string) {
    return this.apiService.getData(`json/stations/bylanguageexact/${language}`);
  }
  getStationsByExactName(name: string) {
    return this.apiService.getData(`json/stations/bynameexact/${name}`);
  }
  getStationsByExactState(state: string) {
    return this.apiService.getData(`json/stations/bystateexact/${state}`);
  }
  getStationsByExactTag(tag: string) {
    return this.apiService.getData(`json/stations/bytagexact/${tag}`);
  }
  getStationsByExactUrl(url: string) {
    return this.apiService.getData(`json/stations/byurl/${url}`);
  }
  getStationsByLanguage(language: string) {
    return this.apiService.getData(`json/stations/language/${language}`);
  }
  getStationsByLastChange(since: string) {
    return this.apiService.getData(`json/stations/lastchange/${since}`);
  }
  getStationsByLastCheck(since: string) {
    return this.apiService.getData(`json/stations/lastcheck/${since}`);
  }
  getStationsByLastClick(since: string) {
    return this.apiService.getData(`json/stations/lastclick/${since}`);
  }
  getStationsByName(name: string) {
    return this.apiService.getData(`json/stations/search?name=${name}`);
  }
  getStationsByState(state: string) {
    return this.apiService.getData(`json/stations/state/${state}`);
  }
  getStationsByTag(tag: string) {
    return this.apiService.getData(`json/stations/tag/${tag}`);
  }
  getStationsByVotes(minVotes: number) {
    return this.apiService.getData(`json/stations/votes/${minVotes}`);
  }
  getTopCountries() {
    return this.apiService.getData('json/countries/topclick');
  }
  getTopGenres() {
    return this.apiService.getData('json/genres/topclick');
  }
  getTopLanguages() {
    return this.apiService.getData('json/languages/topclick');
  }
  getTopRadios() {
    return this.apiService.getData('json/stations/topclick');
  }
  getTopRadiosByCountry(country: string) {
    return this.apiService.getData(`json/stations/topclick/country/${country}`);
  }
  getTopRadiosByCountryAndId(country: string, id: string) {
    return this.apiService.getData(`json/stations/topclick/country/${country}/id/${id}`);
  }
  getTopRadiosByCountryAndLanguage(country: string, language: string) {
    return this.apiService.getData(`json/stations/topclick/country/${country}/language/${language}`);
  }
  getTopRadiosByCountryAndName(country: string, name: string) {
    return this.apiService.getData(`json/stations/topclick/country/${country}/name/${name}`);
  }
  getTopRadiosByCountryAndUrl(country: string, url: string) {
    return this.apiService.getData(`json/stations/topclick/country/${country}/url/${url}`);
  }
  getTopRadiosById(id: string) {
    return this.apiService.getData(`json/stations/topclick/id/${id}`);
  }
  getTopRadiosByLanguage(language: string) {
    return this.apiService.getData(`json/stations/topclick/language/${language}`);
  }
  getTopRadiosByLanguageAndId(language: string, id: string) {
    return this.apiService.getData(`json/stations/topclick/language/${language}/id/${id}`);
  }
  getTopRadiosByLanguageAndName(language: string, name: string) {
    return this.apiService.getData(`json/stations/topclick/language/${language}/name/${name}`);
  }
  getTopRadiosByLanguageAndUrl(language: string, url: string) {
    return this.apiService.getData(`json/stations/topclick/language/${language}/url/${url}`);
  }
  getTopRadiosByName(name: string) {
    return this.apiService.getData(`json/stations/topclick/name/${name}`);
  }
  getTopRadiosByNameAndId(name: string, id: string) {
    return this.apiService.getData(`json/stations/topclick/name/${name}/id/${id}`);
  }
  getTopRadiosByTag(tag: string) {
    return this.apiService.getData(`json/stations/topclick/tag/${tag}`);
  }
  getTopRadiosByTagAndCountry(tag: string, country: string) {
    return this.apiService.getData(`json/stations/topclick/tag/${tag}/country/${country}`);
  }
  getTopRadiosByTagAndId(tag: string, id: string) {
    return this.apiService.getData(`json/stations/topclick/tag/${tag}/id/${id}`);
  }
  getTopRadiosByTagAndLanguage(tag: string, language: string) {
    return this.apiService.getData(`json/stations/topclick/tag/${tag}/language/${language}`);
  }
  getTopRadiosByTagAndName(tag: string, name: string) {
    return this.apiService.getData(`json/stations/topclick/tag/${tag}/name/${name}`);
  }
  getTopRadiosByTagAndUrl(tag: string, url: string) {
    return this.apiService.getData(`json/stations/topclick/tag/${tag}/url/${url}`);
  }
  getTopTags() {
    return this.apiService.getData('json/tags/topclick');
  }
}
