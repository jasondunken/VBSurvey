import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, FormControl } from '@angular/forms';

import { DbServiceService } from '../db-service.service';

import { Record } from '../record';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})

export class SurveyComponent implements OnInit {
  surveyForm: FormGroup;
  submitted = false;

  constructor(private db: DbServiceService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.surveyForm = this.formBuilder.group({
      org: ['', Validators.required],
      site: ['', Validators.required],
      actId: ['', Validators.required],
      state: ['', Validators.required],
      county: ['', Validators.required],
      beachDescriptors: new FormGroup({
        bdDeep: new FormControl(false),
        bdShallow: new FormControl(false),
        bdOpen: new FormControl(false),
        bdEmbayed: new FormControl(false),
        bdFresh: new FormControl(false),
        bdMarine: new FormControl(false),
        bdPier: new FormControl(false),
        bdDrain: new FormControl(false),
        bdOtherCheck: new FormControl(false)
      }, this.checkboxValidator()),
      organismModeled: new FormControl('', Validators.required),
      adviLevel: ['', Validators.required],
      daysPerYear: new FormGroup({
        dPosted: new FormControl(false),
        dClosed: new FormControl(false)
      }, this.textGroupValidator()),
      softwarePackage: new FormControl('', Validators.required),
      statModel: new FormControl('', Validators.required),
      timePeriod: ['', Validators.required],
      modelUse: new FormGroup({
        muNow: new FormControl(false),
        muFore: new FormControl(false),
        muResearch: new FormControl(false)
      }, this.checkboxValidator()),
      iVariables: new FormGroup({
        ivAirTemp: new FormControl(false),
        ivWaterTemp: new FormControl(false),
        ivDewpoint: new FormControl(false),
        ivWindSpeed: new FormControl(false),
        ivCurrentSpeed: new FormControl(false),
        ivWaveHeight: new FormControl(false),
        ivRain: new FormControl(false),
        ivTurbidity: new FormControl(false),
        ivTribDischarge: new FormControl(false),
        ivCloudCover: new FormControl(false),
        ivUV: new FormControl(false),
        ivRelHumidity: new FormControl(false),
        ivConductivity: new FormControl(false),
        ivAbsorbance: new FormControl(false),
        ivDepth: new FormControl(false),
        ivHumans: new FormControl(false),
        ivBirds: new FormControl(false),
        ivWildlife: new FormControl(false),
        ivOtherCheck: new FormControl(false)
      }, this.checkboxValidator()),
      ivSource: new FormGroup({
        onSite: new FormControl(false),
        onLine: new FormControl(false)
      }, this.checkboxValidator()),
      evalCriterion: new FormGroup({
        ecRsquared: new FormControl(false),
        ecAicBic: new FormControl(false),
        ecSenSpecAcc: new FormControl(false),
        ecPress: new FormControl(false),
        ecOtherCheck: new FormControl(false)
      }, this.checkboxValidator())
    });
  }

  // convenience getter for easy access to form fields
  // thanks https://stackoverflow.com/users/5688490/mick !
  get f() { return this.surveyForm.controls; }

  submitSurvey(): void {
    this.submitted = true;
    if (this.surveyForm.invalid) {
      window.scrollTo(0, 0);
      return;
    }
    const record = new Record();
    this.buildRecord(record);
    this.db.addRecord(record).subscribe();
  }

  buildRecord(record: Record): void {
    const inputs = document.getElementsByTagName('input');
    for (const i in inputs) {
        if (record.hasOwnProperty(inputs[i].id)) {
          if (inputs[i].type === 'text' || inputs[i].type === 'email') {
            record[inputs[i].id] = '"' + inputs[i].value + '"';
          } else if (inputs[i].type === 'number') {
            record[inputs[i].id] = inputs[i].value !== '' ? inputs[i].value : 0;
          } else {
            record[inputs[i].id] = inputs[i].checked === true ? 1 : 0;
          }
        }
    }
    const selects = document.getElementsByTagName('select');
    for (const j in selects) {
        if (record.hasOwnProperty(selects[j].id)) {
          if (selects[j].id === 'state') {
            record[selects[j].id] = '"' + selects[j].options[selects[j].selectedIndex].text + '"';
          }
        }
    }
    const textAreas = document.getElementsByTagName('textarea');
    for (const k in textAreas) {
        if (record.hasOwnProperty(textAreas[k].id)) {
        record[textAreas[k].id] = '"' + textAreas[k].value + '"';
      }
    }
  }

  toggleDisable(name): void {
    const textbox = document.getElementById(name) as HTMLInputElement;
    textbox.classList.toggle('disabled');
    textbox.disabled = !textbox.disabled;
  }

  radioDisable(event: any, id): void {
    const textbox = document.getElementById(id) as HTMLInputElement;
    if (event.target.id !== id) {
      if (event.target.id === id + 'Check') {
        textbox.classList.remove('disabled');
        textbox.disabled = false;
      } else {
        textbox.classList.add('disabled');
        textbox.disabled = true;
        textbox.value = '';
      }
    }
  }

  clearForm(): void {
    const inputs = document.getElementsByTagName('input');
    for (const i in inputs) {
      if (inputs[i].type === 'text' || inputs[i].type === 'email' || inputs[i].type === 'number') {
        inputs[i].value = '';
        if (inputs[i].name.substring(inputs[i].name.length - 4) === 'Text') {
          inputs[i].classList.add('disabled');
        }
      } else if (inputs[i].type === 'radio' || inputs[i].type === 'checkbox') {
        inputs[i].checked = false;
      }
    }
    const selects = document.getElementsByTagName('select');
    for (const j in selects) {
      if (selects[j].id === 'state') {
        selects[j].selectedIndex = 0;
      }
    }
    window.scrollTo(0, 0);
  }

  checkboxValidator(minRequired = 1): ValidatorFn {
    return function validate(formGroup: FormGroup) {
      let checked = 0;
      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key];
        if (control.value === true) {
          checked++;
        }
      });
      if (checked < minRequired) {
        return { selectionMade: true };
      }
      return null;
    };
  }

  textGroupValidator(minRequired = 1): ValidatorFn {
    return function validate(formGroup: FormGroup) {
      let checked = 0;
      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key];
        if (control.value !== false) {
          checked++;
        }
      });
      if (checked < minRequired) {
        return { selectionMade: true };
      }
      return null;
    };
  }

  radioValidator(): ValidatorFn {
    return function validate(formGroup: FormGroup) {
      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key];
        if (control.value === true) {
          return { selctionMade: true };
        }
      });
      return null;
    };
  }
}
