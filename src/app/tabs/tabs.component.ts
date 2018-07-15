import { Component, OnInit } from '@angular/core';
import * as crypto from 'crypto-js';

/** Represents an algorithm. */
export interface Algorithm {
  name: string;
  func: string;
  lastHash: string;
  shortcut: string;
}

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {

  /** The algorithms we support. */
  private readonly algoMd5 = {name: 'MD5', func: 'MD5'};
  private readonly algoSHA1 = {name: 'SHA-1', func: 'SHA1'};
  private readonly algoSHA224 = {name: 'SHA-224', func: 'SHA224'};
  private readonly algoSHA256 = {name: 'SHA-256', func: 'SHA256'};
  private readonly algoSHA384 = {name: 'SHA-384', func: 'SHA384'};
  private readonly algoSHA512 = {name: 'SHA-512', func: 'SHA512'};
  private readonly algoSHA3 = {name: 'SHA-3', func: 'SHA3'};
  private readonly algoRIPEMD160 = {name: 'RIPEMD-160', func: 'RIPEMD160'};

  public readonly algos = [
    this.algoMd5,
    this.algoSHA1,
    this.algoSHA224,
    this.algoSHA256,
    this.algoSHA384,
    this.algoSHA512,
    this.algoSHA3,
    this.algoRIPEMD160,
  ];

  /** All-algo flag for upper case vs lower */
  upperCase = false;

  constructor() { }

  ngOnInit() {
  }

  /** Get the target of the event, cast, then return the value. */
  getEventValue(event:KeyboardEvent): string {
    return (<HTMLInputElement>event.target).value;
  }

  /** Perform the actual hash. */
  doHash(event:KeyboardEvent, algo:Algorithm) {
    const value = this.getEventValue(event);
    const hash = crypto[algo.func](value);
    algo.lastHash = hash.toString();
  }

  displayHash(algo:Algorithm) {
    if (!algo.lastHash) return;
    if (this.upperCase) {      
      return algo.lastHash.toUpperCase();
    }
    return algo.lastHash;
  }

}
