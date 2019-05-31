String.prototype.format = function() {
  a = this;
  for (k in arguments) {
    a = a.replace("{" + k + "}", arguments[k])
  }
  return a
}

function isNullOrEmpty(str) {
  return (!str);
}


var queryURL = "https://api.epa.gov/vbsurvey/?api=vb_survey&api_key=wrlquCuSTnmhfDSwS7j4QeO39KDlkTlDjIJ3dtOW";

function radioButtonFilterStr2(rbName, otherText, dbVar, otherVar)
{
  var filterStr = "";
  //Get value for Modeled organism/condition
  //First some defensive programming
  //var tmp = "input[type=radio][name={0}]:checked".format(rbName);
  var rb_org_cond = $( "input[type=radio][name={0}]:checked".format(rbName) ).val();

  //If no radio button is selected
  if (typeof rb_org_cond == "undefined")
    return "";

  //Check for valid radio button value - 1-4
  if (rb_org_cond < 1 || rb_org_cond > 4)
    return "";

  //Handle Other case - get the value from the associated textbox
  if (rb_org_cond == 4)
  {
    var rb_org_other =  getValue(otherText);
    if (rb_org_other == "")
      return "";
    filterStr = "filter[]={0},cs,".format(otherVar) + rb_org_other.toString();
    return filterStr;
  }
  //Radio button value 1-3
  filterStr = "filter[]={0},eq,".format(dbVar) + rb_org_cond.toString();
  return filterStr;

}

function getValue(itemID)
{
  //alert(itemID);
  var val = $("#"+itemID).val().trim();
  return val;
}

function radioButtonFilterStr(rbName, dbVar)
{
  var filterStr = "";
  //Get value for Modeled organism/condition
  //First some defensive programming
  //var tmp = "input[type=radio][name={0}]:checked".format(rbName);
  var rb_val = $( "input[type=radio][name={0}]:checked".format(rbName) ).val();

  //If no radio button is selected
  if (typeof rb_val == "undefined")
    return "";

  //Check for valid radio button value - 1-4
  if (rb_val < 1 || rb_val > 5)
    return "";

  filterStr = "filter[]={0},eq,".format(dbVar) + rb_val.toString();
  return filterStr;
}



var formFields =   ["beach","beachid","state","county","shallow","deep","open","closed","fresh","marine",
  "nowcast","forecast","research","airtemp","watertemp","dewpoint","wind","current","waves","rain","turbidity","trib","clouds",
  "par","relhumd","conduct","absorb","depth","human","bird","wild","ivother"];


var statModelDict = {"1": "MLR", "2":"GBM", "3":"GBM", "4":"Other"};

var beach_desc = ["shallow", "deep", "open", "closed", "fresh", "marine", "descother"];


//Test comment
//Build the query filter by looping over the field values on the query form.
function buildFilter()
{
  var queryString = "";
  //var key = "api_key=wrlquCuSTnmhfDSwS7j4QeO39KDlkTlDjIJ3dtOW";
  //queryString += key;

  //Add condition for form caption is Modeled organism/condition, dbvar is rg_condition
  //var filterRV = radioButtonFilterStr("RV", "RVText", "org_condition", "rvother");
  var filterRV = radioButtonFilterStr("RV", "org_condition");
  if (filterRV != "")
    queryString += "&" + filterRV;
  //Add condition for form caption is Model Type, dbvar is stat_model
  //var filterMT = radioButtonFilterStr("ModelType", "ModelTypeText", "stat_model", "mdlother");
  var filterMT = radioButtonFilterStr("ModelType", "stat_model");
  if (filterMT != "")
    queryString += "&" + filterMT;

  var filterStat = radioButtonFilterStr("STAT", "stat");
  if (filterStat != "")
    queryString += "&" + filterStat;

  var filterStr = "filter[]";
  var len = formFields.length;
  for (var i = 0; i < len; i++)
  {
    var filterStr = getFilterValue(formFields[i]);
    if (filterStr != "")
    {
      queryString += "&" + filterStr;
    }
    //var val = $("#"+formFields[i]).val();
  }
  var filterRV = radioButtonFilterStr("MDS", "eval_criterion");
  if (filterRV != "")
    queryString += "&" + filterRV;
  return queryString;
}

//Loop over controls and get values
function getFilterValue(itemID)
{
  try {
    var val = "";
    var ctlType = $("#"+itemID).prop("type");
    if (ctlType == "checkbox") {
      if ($("#"+itemID).is(":checked"))
        val = "1";
    }
    else
      val = $("#"+itemID).val();
    //If no radio button is selected
    val =val.trim();
    if (typeof val == "undefined" || val == "")
      return "";

    var sFilter = "filter[]=" + itemID + ",eq," + val;
  }
  catch(err){
    alert(itemID);
  }
  return sFilter;
}

function getColumnDefs()
{
  var i;
  var columnDefs = [];
  for (i=0; i<56; i++ )
  {
    var colDef = {"name": "", "targets" :[i], "visible" : false, "searchable": false};
    columnDefs.push(colDef);
  }
  return columnDefs;
}

var columnDefs = [
  {
    "targets": [ 0 ],
    "visible": false,
    "searchable": false
  },
  {
    "targets": [ 1 ],
    "visible": false,
    "searchable": false
  }
]

//Takes an array of html control ids and values.  Populates fields on survey form
function setSurveyFormFieldValues(columns, record) {

  numCols = columns.length;

  var data = {}
  //Populate dictionary with column names/values
  for (var i=0;i<numCols;i++) {
    data[columns[i]] = record[i]
  }

  //Loop over all the columns
  for (var i=0;i<numCols;i++)
  {
    var colName = columns[i];
    var colVal = record[i];
    //Dont need to populate any field with 'id' value
    if (colName == 'id')
      continue;

    //Handle Beach Description data
    // if ($.inArray(colName, beach_desc) >= 0) {
    //     //Beach Descriptors: if descother is not empty set the value and associated checkbox
    //     if (colName == 'descother') {
    //         if (!isNullOrEmpty(colVal)) {
    //             $("#descother").prop('checked', true);
    //             $('#descothertext').val(data['descother']);
    //         }
    //         else {
    //             if (colVal == '1')
    //                 $('#'+colName).prop('checked', true);
    //         }
    //     }
    //     continue;
    // }   //End Beach Descriptors

    //Handle Beach Description data
    //Beach Descriptors: if descother is not empty set the value and associated checkbox
    if (colName == 'descother') {
      var descVal = data['descother'];
      if (!isNullOrEmpty(descVal)) {
        $('#descother').prop('checked', true);
        $('#descothertext').val(data['descother']);
      }
      continue;
    }


    //Organism/condition modeled - radio buttons
    if (colName == 'org_condition') {
      var orgVal = data['org_condition'];
      $('#rv'+ orgVal).prop('checked', true);
      if (orgVal == '4')
        $('#rvtext').val(data['rvother']);

      continue;
    }

    //What software package was used - radio buttons
    if (colName == 'stat') {
      var statModelVal = data['stat'];
      $('#stat'+ statModelVal).prop('checked', true);
      if (statModelVal == '5')
        $('#stattext').val(data['statother']);

      continue;
    }

    //What statistical model was used
    if (colName == 'stat_model') {
      var statModelVal = data['stat_model'];
      $('#mt'+ statModelVal).prop('checked', true);
      if (statModelVal == '4')
        $('#modeltypetext').val(data['mdlother']);

      continue;
    }

    //Handle the case of Other Independent Variable - checkboxes
    if (colName == 'ivother') {
      var ivother = data['ivother'];
      if (!isNullOrEmpty(ivother))
        $('#ivstext').val(ivother);

      continue;
    }

    //What evaluation criteria was used
    if (colName == 'eval_criterion') {
      var evalCrit = data['eval_criterion'];
      $('#mds'+ evalCrit).prop('checked', true);
      if (evalCrit == '5')
        $('#mdstext').val(data['evalother']);

      continue;
    }

    //Get control type - checkbox, text, select-one
    var ctlType = $("#"+colName).prop('type');

    //Handle checkboxes
    if (ctlType == 'checkbox') {
      if (data[colName] == '1')
        $('#' + colName).prop('checked', true);
    }

    //Handle textboxes
    if (ctlType == 'text' || ctlType == 'select-one' || ctlType == 'email' || ctlType == 'number')
      $('#'+colName).val(data[colName]);

  }


}
