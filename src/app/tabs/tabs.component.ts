import { Component, OnInit } from '@angular/core';
import * as crypto from 'crypto-js';
import {ClipboardService} from 'ngx-clipboard';
import {MatSnackBar, SimpleSnackBar, MatSnackBarRef, MatSnackBarDismiss, MatSnackBarConfig} from '@angular/material/snack-bar';

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

  /** Array of algorithms that we support.  Used to populate tabs. */
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

  /** How long to leave the copy-snackbar open for. */
  private readonly copiedDuration = 1500;

  /** How long to leave the whitespace warning snack bar open for. */
  private readonly whitespaceWarningDuration = 10000;

  /** All-algo flag for upper case vs lower */
  upperCase = false;

  /** All-algo flag for trimming spaces from the input automatically. */
  trimSpace = false;

  /** 
   * Reference to leading/trailing whitespace warning to ensure that only
   * one is shown at a time.
   */
  whitespaceSnackbar: MatSnackBarRef<SimpleSnackBar>;

  /** 
   * Flag used to keep track of the whitespace warning - used to prevent
   * 'bouncing' of the warning if user is typing into the input field.
   */
  private whitespaceWarningVisible = false;

  constructor(private readonly clipboard: ClipboardService,
              private readonly snackbar: MatSnackBar) {}

  ngOnInit() {
  }

  /** Get the target of the event, cast, then return the value. */
  getEventValue(event:KeyboardEvent): string {
    return (<HTMLInputElement>event.target).value;
  }

  /** Copy the algorithm's last hash to the clipboard. */
  copy(algo:Algorithm) {
    if (!algo.lastHash) return;
    this.clipboard.copyFromContent(algo.lastHash);
    this.snackbar.open(algo.name + ' hash copied to clipboard',
        undefined,
        {duration: this.copiedDuration},
      );
  }

  /** Perform the actual hash. */
  doHash(event:KeyboardEvent, algo:Algorithm) {
    let value = this.getEventValue(event);
    if (this.trimSpace) {
      value = value.trim();
    } else {
      // If they are not trimming and there is whitespace, dispaly warning if
      // it is not already displayed.
      if (this.valueHasTrimmableWhitespace(value)) {
        this.displayWhitespaceSnackbar();
      } else {
        // Hide the warning if there is no-longer any whitespace.
        if (this.whitespaceSnackbar) this.whitespaceSnackbar.dismiss();
      }
    }
    const hash = crypto[algo.func](value);
    let toBeHashed:string = hash.toString();
    algo.lastHash = toBeHashed;
  }

  /**
   * Logic to control displaying the whitespace snackbar or not.  We have to do
   * some more work here to prevent the snackbar continually showing again and
   * again if the user is typing into the input field and there are leading or
   * trailing spaces.
   */
  displayWhitespaceSnackbar() {
    if (!this.whitespaceWarningVisible) {
      this.whitespaceSnackbar = this.snackbar.open(
        'Input contains leadng or trailing whitespace',
        'Dismiss',
        {duration: this.whitespaceWarningDuration},
      );
      this.whitespaceWarningVisible = true;

      // Subscribe to the dismiss event so we can keep track of when
      // it is no-longer visible.
      this.whitespaceSnackbar.afterDismissed().subscribe(() => {
          this.whitespaceWarningVisible = false;
        }
      );
    }
  }

  /** Check for any leading or trailing whitepsace - true if found. */
  valueHasTrimmableWhitespace(value:string): boolean {
    // TODO: replace with regex
    if (value.startsWith(' ') || value.endsWith(' ')) {
      return true;
    }
    return false;
  }

  /** Display the hash in the DOM. */
  displayHash(algo:Algorithm) {
    if (!algo.lastHash) return;
    if (this.upperCase) {      
      return algo.lastHash.toUpperCase();
    }
    return algo.lastHash;
  }
}
