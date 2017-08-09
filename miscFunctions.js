//general functions that will be used for all raids
module.exports = {
  //
  checkValid(name) {
    if (name == null || name == "") {
      return "N/A";
    }
    return name;
  },

  async searchPlayerHelper(name,msg, index, signUpIndices, sheets, spreadsheetId, raidDays) {
    //set the range for the get request from the signup page
    sheetRange = "BT Sign Up!" + signUpIndices[index] + "3:"+ signUpIndices[index] + "26";

    //save the raidDay for the person
    string2 = "";

    //one get request per raid day roster
    sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetRange
    }, (err, response) => {
      if (err) console.log(err);
      //make sure the spreadsheet isn't missing core roles
      if (response.values.length < 16) {
        msg.channel.send("Missing critical rolls on sign up. If this is intentional, just type something in any dps spot of " + raidDays[index] + ".\n");
        return;
      }

      //search the roster for the name
      for (var j = 0; j < response.values.length; j++) {
        //if theyre in the roster they raid on this day
        if (response.values[j] != undefined && response.values[j] != "") {
          if (response.values[j][0].toLowerCase().indexOf(name) > -1) {
            //save string2 to the person's raidDay
            string2 = raidDays[index];
          }
        }
      }
    });
    //return the raidDay, or an empty string if no matches
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(string2);
      }, 500);
    });
  }

};
