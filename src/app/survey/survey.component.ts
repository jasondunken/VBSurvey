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
        bdDeep: new FormControl(),
        bdShallow: new FormControl(),
        bdOpen: new FormControl(),
        bdEmbayed: new FormControl(),
        bdFresh: new FormControl(),
        bdMarine: new FormControl(),
        bdPier: new FormControl(),
        bdDrain: new FormControl(),
        bdOther: new FormControl({value: '', disabled: true}, Validators.minLength(1))
      }, this.groupValidator()),
      organismModeled: new FormGroup({
        OM: new FormControl({value: null}, Validators.required),
        omOther: new FormControl({value: '', disabled: true}, Validators.minLength(1)),
      }, this.radioWithTextValidator()),
      adviLevel: ['', Validators.required],
      daysPerYear: new FormGroup({
        dPosted: new FormControl(false),
        dClosed: new FormControl(false)
      }, this.numberGroupValidator()),
      softwarePackage: new FormGroup({
        SP: new FormControl({value: null}, Validators.required),
        spOther: new FormControl({value: '', disabled: true}, Validators.minLength(1)),
      }, this.radioWithTextValidator()),
      statModel: new FormGroup({
        SM: new FormControl({value: null}, Validators.required),
        smOther: new FormControl({value: '', disabled: true}, Validators.minLength(1)),
      }, this.radioWithTextValidator()),
      tpDevelop: ['', Validators.required],
      tpImplement: ['', Validators.required],
      modelUse: new FormGroup({
        muNow: new FormControl(),
        muFore: new FormControl(),
        muResearch: new FormControl()
      }, this.groupValidator()),
      dvTransform: ['', Validators.required],
      iVariables: new FormGroup({
        ivAirTemp: new FormControl(),
        ivWaterTemp: new FormControl(),
        ivDewpoint: new FormControl(),
        ivWindSpeed: new FormControl(),
        ivCurrentSpeed: new FormControl(),
        ivWaveHeight: new FormControl(),
        ivRain: new FormControl(),
        ivTurbidity: new FormControl(),
        ivTribDischarge: new FormControl(),
        ivCloudCover: new FormControl(),
        ivUV: new FormControl(),
        ivRelHumidity: new FormControl(),
        ivConductivity: new FormControl(),
        ivAbsorbance: new FormControl(),
        ivDepth: new FormControl(),
        ivHumans: new FormControl(),
        ivBirds: new FormControl(),
        ivWildlife: new FormControl(),
        ivOther: new FormControl({value: '', disabled: true}, Validators.minLength(1))
      }, this.groupValidator()),
      ivSource: new FormGroup({
        onSite: new FormControl(),
        onLine: new FormControl()
      }, this.groupValidator()),
      evalCriterion: new FormGroup({
        ecRsquared: new FormControl(),
        ecAicBic: new FormControl(),
        ecSenSpecAcc: new FormControl(),
        ecPress: new FormControl(),
        ecOther: new FormControl({value: '', disabled: true}, Validators.minLength(1))
      }, this.groupValidator()),
      dCriterion: ['', Validators.required]
    });
  }

  // thanks https://stackoverflow.com/users/5688490/mick !
  // for help with angular form controls/custom validators
  // this function is only used from the html for reactive form actions,
  // convenience getter for easy access to form fields
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

  toggleDisable(name, parent?): void {
    if (parent) {
      const control = this.surveyForm.get([parent, name]);
      if (control) {
        if (control.disabled) {
          control.enable();
        } else {
          control.disable();
          control.reset('');
        }
      }
    }
  }

  radioDisable(event: any, id: string, parent?: string, group?: string): void {
    console.log(id + ' | ' + parent + ' | ' + group);
    if (event.target.id !== id) {
      const control = this.surveyForm.get([parent, id]);
      if (event.target.id === id + 'Check') {
        control.enable();
        if (group) {
          // in order for the reactive form to behave properly this value needs to be reset when otherCheck is selected
          this.surveyForm.get([parent, group]).reset({value: null});
        }
      } else {
        control.disable();
        control.reset('');
      }
    }
  }

  // it really should be this easy, but alas
  clearForm2(): void {
    this.surveyForm.reset(/* an initial form state object */);
    window.scrollTo(0, 0);
  }

  clearForm(): void {
    const inputs = document.getElementsByTagName('input');
    for (const i in inputs) {
      if (inputs[i].type === 'text' || inputs[i].type === 'email' || inputs[i].type === 'number') {
        inputs[i].value = '';
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
    /* Object.keys(this.surveyForm.controls).forEach(key => {
      const control = this.surveyForm.controls[key];
      if (control) {
       control.reset();
      }
    }); */
    window.scrollTo(0, 0);
  }

  groupValidator(minRequired = 1): ValidatorFn {
    return function validate(formGroup: FormGroup) {
      let numValid = 0;
      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key];
        if ((key.substring(2) === 'Other' && control.value !== '') || (key.substring(2) !== 'Other' && control.value === true)) {
          numValid++;
        }
      });
      if (numValid < minRequired) {
        return { selectionMade: true };
      }
      return null;
    };
  }

  numberGroupValidator(minRequired = 1): ValidatorFn {
    return function validate(formGroup: FormGroup) {
      let numValid = 0;
      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key];
        if (control.value !== false) {
          numValid++;
        }
      });
      if (numValid < minRequired) {
        return { selectionMade: true };
      }
      return null;
    };
  }

  /* radioValidator(): ValidatorFn {
    return function validate(formGroup: FormGroup) {
      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key];
        if (control.value === true) {
          return { selectionMade: true };
        }
      });
      return null;
    };
  } */

  radioWithTextValidator(minRequired = 1): ValidatorFn {
    return function validate(formGroup: FormGroup) {
      let numValid = 0;
      let index = 0;
      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key];
        if ((key.substring(2) === 'Other' && control.value !== '') || (key.substring(2) !== 'Other' && control.value > 0)) {
          numValid++;
        }
        index++;
      });
      console.log('numValid: ' + numValid);
      if (numValid < minRequired) {
        return { selectionMade: true };
      }
      return null;
    };
  }
}
