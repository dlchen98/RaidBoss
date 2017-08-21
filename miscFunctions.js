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
        if (response.values[j] != null && response.values[j] != "") {
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
  },

  cmdListHelp(msg, string, string2) {
    //build the beginning of the PM of possible instructions
    string = "```Raid Boss Commands:\n"
      + "Please use \">raid\" before any command.\n\n";

    //Handle BT Raid instructions
    string += "Black Tower/Skybreak Spire - Format: <raid#> <extra argugment>\n"
      + "\t<raid#> options: bt1, bt2, bt3, bt4\n";
    //arrays to hold individual BT raid commands
    var btArgs = ["roster", "1", "2", "3", "4"];
    var btArgDescriptions = ["list of all raiders\n",
        "roles for Venomsky Drake\n",
        "roles for Nightfall Imperators\n",
        "roles for Generals\n",
        "roles for Raven King\n",]
    for (var i = 0; i < btArgs.length; i++) {
      string2 = "\t" + btArgs[i];
      while (string2.length < 10) {
        string2 += " ";
      }
      string2 += btArgDescriptions[i];
      string += string2;
    }
    //example for people
    string += "\tex. '>raid bt1 4' => Wednesday RK Mechs\n"

    //arrays to hold general BT raid commands
    var btGeneralArgs = ["rosters"];
    var btGeneralDescriptions = ["display all BT raid rosters\n"];
    //miscellaneous commands for all raids or something
    string += "  Misc - Format: bt <extra argument>\n";
    for (var i = 0; i < btGeneralArgs.length; i++) {
      string2 = "\t" + btGeneralArgs[i];
      while (string2.length < 10) {
        string2 += " ";
      }
      string2 += btGeneralDescriptions[i];
      string += string2;
    }
    //example
    string += "\tex. '>raid bt rosters' => all BT raid rosters\n";

    //VT commands
    var vtArgs = ["roster", "1", "2", "3"];
    var vtArgDescriptions = ["list of all raiders\n",
        "roles for Twin Asuras\n",
        "roles for Super Thrall\n",
        "roles for Red Emperor\n",];
    string += "Vortex Temple/Temple of Eluvium - Format: <raid#> <extra argugment>\n"
          + "\t<raid#> options: vt1, vt2, vt3\n";
    for (var i = 0; i < vtArgs.length; i++) {
      string2 = "\t" + vtArgs[i];
      while (string2.length < 10) {
        string2 += " ";
      }
      string2 += vtArgDescriptions[i];
      string += string2;
    }
    string += "\tex. '>raid vt1 roster' => VT1 roster\n";

    //arrays to hold general commands
    var generalArgs = ['search'];
    var generalDescriptions = ['find raid day for a char (not case-sensitive)\n'];
    //general command header
    string += "General Commands - Format: <command> <extra arg>\n"
    //actually format the commands and their descriptions
    for (var i = 0; i < generalArgs.length; i++) {
      string2 = "\t" + generalArgs[i];
      while (string2.length < 10) {
        string2 += " ";
      }
      string2 += generalDescriptions[i];
      string += string2;
    }
    //example
    string += "\tex. '>raid search XScarlyt' => Scar's raid day(s)\n";

    //TODO: FUTURE INSTRUCTION GUIDE HERE

    string += "```";
    msg.channel.send(string);
  }

};
