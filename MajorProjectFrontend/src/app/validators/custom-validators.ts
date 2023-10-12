import { ContentChild } from "@angular/core";
import { FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {

  //whitespace validation
  static notOnlyWhiteSpace(control: FormControl): ValidationErrors | null{

    //check if string only contains whitespace
    if(control.value != null && (control.value.trim().length === 0)){
      //invlid return error object
      return {'notOnlyWhiteSpace': true};
    }else{
      //valid return null
      return null;
    }
  }

}
