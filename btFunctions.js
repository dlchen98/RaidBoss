//access general misc. functions to help parse get request data
var misc = require("./miscFunctions.js");

//export the BT specific functions for bot usage
module.exports = {
  //all 8 BT functions
  //day = appropriate raidDay index value

  btRaidOptions(chosenOption, day, msg, sheets, spreadsheetId) {
    //based on the chosen option, print the approrpriate roster
    switch (chosenOption) {
      case "roster":
        this.btRoster(day, msg, sheets, spreadsheetId);
        break;
      case "1":
        this.venomskyMechs(day, msg, sheets, spreadsheetId);
        break;
      case "2":
        this.nightfallMechs(day, msg, sheets, spreadsheetId);
        break;
      case "3":
        this.generalsMechs(day, msg, sheets, spreadsheetId);
        break;
      case "4":
        this.ravenMechs(day, msg, sheets, spreadsheetId);
        break;
      default:
        msg.reply("I don't think that Spire option exists. If lost, use '>raid help'.");
    }
  },

  btRoster(day, msg, sheets, spreadsheetId) {
    //set the range for the get request
    sheetRange = day + "!A2:C29";
    //get the roster data from the appropriate spreadsheet
    return sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetRange
    }, (err, response) => {
      //make sure the spreadsheet isn't missing core values (allow <= 3 buyers per 24m raid)
      if (response.values.length < 25) {
        msg.channel.send(day + " has less than 21 names. If this is intentional, just type something in the last roster row.\n");
        return;
      }
      //raid message header
      string = '```=====' + day + " Raid" + "=====\n";
      // string += '==' + "Name-Class \t ~Buff/Rez/Iframe" + "\n"
      string += response.values[0][0] + '========';
      //read each member details
      for (var i = 1; i < response.values.length; i++) {
        //handle Pt # vs name and class
        if (i % 7 == 0) {
          //add Party # to the string
          string += "\n" + response.values[i][0] + '========';
        } else {
          //add names to the string
          string2 = "\n" + (i-Math.floor(i/7)) + ". " + misc.checkValid(response.values[i][0])
            + "-" + misc.checkValid(response.values[i][2]);
          string += string2;
        }
      }
      string += "```";
      //print the roster to the channel
      msg.channel.send(string);
    })
  },

  venomskyMechs(day, msg, sheets, spreadsheetId) {
    //set the range for the get request
    sheetRange = day + "!I2:L16";
    return sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetRange
    }, (err, response) => {
      //make sure the spreadsheet isn't missing core values
      if (response.values.length < 14) {
        msg.channel.send("Missing positioning data. If this is intentional, just type something in the last add row.\n");
        return;
      }
      var string = '```=====' + "First Boss Mechanics" + "=====";

      //various add phases
      for (var i = 1; i < response.values.length; i++) {
        if (i % 5 == 0) {
          //phase %
          string += "\n" + response.values[i][0] + "=====";
        } else {
          //add position and PT/names
          string += "\n" + response.values[i][0]
            + " - " + misc.checkValid(response.values[i][2]);
        }
      }

      string += "```";
      //actually send mssg to channel
      msg.channel.send(string);
    })
  },

  nightfallMechs(day, msg, sheets, spreadsheetId) {
    //set the range for the get request
    sheetRange = day + "!I20:L24";
    return sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetRange
    }, (err, response) => {
      //make sure the spreadsheet isn't missing core values
      if (response.values.length < 5) {
        msg.channel.send("Missing SS data. If this is intentional, just type something in the last roster row.\n");
        return;
      }
      var string = '```=====' + "Second Boss Mechanics" + "=====\n";
      //Soul Sep Line
      string += response.values[0][0] + "=====\n";
      //Party 1 SS people
      string += "-" + response.values[1][0] + "\n";
      for (var i = 2; i < 5; i++) {
        //string2 is an attempt to line up the spacing
        string2 = misc.checkValid(response.values[i][0]);
        while (string2.length < 11) string2 += " ";
        string2 += misc.checkValid(response.values[i][2]) + "\n";
        //add the party 1 ss people to the string
        string += string2;
      }
      string += "```";
      //actually send mssg to channel
      msg.channel.send(string);
    })
  },

  generalsMechs(day, msg, sheets, spreadsheetId) {
    //set the range for the get request
    sheetRange = day + "!N3:O18";
    return sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetRange
    }, (err, response) => {
      //make sure the spreadsheet isn't missing core values (can miss one row of aerial callers)
      if (response.values.length < 15) {
        msg.channel.send("Missing generals data. If this is intentional, just type something in an aerial shotcaller row.\n");
        return;
      }
      var string = '```=====' + "Third Boss Mechanics" + "=====\n";
      //boss mechs header
      string += response.values[0][0] + '====|' + response.values[0][1] + '====\n'

      //DPS roles per boss
      string += "-DPS:\n";
      for (var i = 1; i < 13; i++) {
        string2 = misc.checkValid(response.values[i][0]);
        while (string2.length < 13) string2 += " ";
        string2 += "|" + misc.checkValid(response.values[i][1]) + "\n";
        string += string2;
      }

      //aerial shotcallers
      string += "-" + response.values[13][0] + ":\n";
      for (var i = 14; i < response.values.length; i++) {
        string2 = misc.checkValid(response.values[i][0]);
        while (string2.length < 13) string2 += " ";
        string2 += "|" + misc.checkValid(response.values[i][1]) + "\n";
        string += string2;
      }

      //actually send mssg to channel
      string += "```";
      msg.channel.send(string);
    })
  },

  ravenMechs(day, msg, sheets, spreadsheetId) {
    //set the range for the get request
    sheetRange = day + "!Q1:T26";

    return sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetRange
    }, (err, response) => {
      //make sure the spreadsheet isn't missing core values
      if (response.values.length < 26) {
        msg.channel.send("Missing RK data. If this is intentional, just type something in the tank row.\n");
        return;
      }
      var string = '```=====' + response.values[0][0] + "=====\n";
      //outer adds
      string += response.values[1][0] + '=====\n';
      //86,56,26% outside adds
      for (var i = 2; i < 11; i+=3) {
        //% add header
        string += "-" + response.values[i][0] + '\n';
        //handle the 8 people per add
        for (var j = 0; j < 8; j++) {
          //string2 handles the 8 people individually
          string2 = misc.checkValid(response.values[i+1+Math.floor(j/4)][j%4]);
          //adjust to uniform spacing
          while (string2.length < 13) string2 += " ";
          //make a new line after 4 names
          if ( (j+1)%4 == 0) string2 += "\n";
          //add the name to the output string
          string += string2;
        }
      }
      //innner ss adds
      string += response.values[11][0] + '=====\n';
      //86% (56% got removed)
      for (var i = 12; i < 13; i+=3) {
        string += "-" + response.values[i][0] + ' adds\n';
        string += misc.checkValid(response.values[i+1][1]) + '\n'
          + misc.checkValid(response.values[i+2][0]) + '\n'
          + misc.checkValid(response.values[i+2][2]) + '\n'
      }
      //26% header
      string += "-" + response.values[15][0] + ' adds\n';
      //print the (up to) 6 names of 26% people
      for (var i = 0; i < 8; i++) {
        //check if cell is empty
        if (response.values[16+Math.floor(i/4)][i%4] == null) {
          //do nothing
        } else {
          //string2 is the individual name
          string2 = response.values[16+Math.floor(i/4)][i%4];
          //apply uniform spacing
          while (string2.length < 13) string2 += " ";
          //create a new line after the 4th name
          if ((i+1)%4 == 0) string2 += "\n";
          //add individual name to the response string
          string += string2;
        }
      }
      string += "\n";
      //Other Roles
      string += "-" + response.values[18][0] + '\n';
      //stack caller
      string += response.values[19][0] + ': ' + misc.checkValid(response.values[20]) + '\n';
      //calling boss rotations
      string += response.values[21][0] + ': ' + misc.checkValid(response.values[22])
        + ", " + misc.checkValid(response.values[23][0]) + "\n";
      //RK TANK
      string += response.values[24][0] + ': ' + misc.checkValid(response.values[25]) + '\n';

      string += "```";
      //actually send mssg to channel
      msg.channel.send(string);
    })
  },

  btRosterList(raidDays,msg, sheets, spreadsheetId) {
    //print rosters for all BT raids
    for (var i = 0; i < raidDays.length; i++) {
      this.btRoster(raidDays[i],msg, sheets, spreadsheetId);
    }
  },

  async searchPlayerBT(name, msg, sheets, spreadsheetId, raidDays) {

    //start the return message
    string = "```" + name + "'s BT raid day(s):\n";
    //column indices for the signup sheet
    var signUpIndices = ["A", "F", "K", "P"];
    var foundDay = false;

    //iterate through all the raid days
    for (var i = 0; i < raidDays.length; i++) {
      //one get request per raid day roster every 500ms
      // setTimeout(searchPlayerHelper, 500, name, msg, i, signUpIndices);

      //save the found raidDay/empty string
      string3 = await misc.searchPlayerHelper(name, msg, i, signUpIndices, sheets, spreadsheetId, raidDays);
      //set to true if a raidDay is found
      if (string3 != "") {
        foundDay = true;
        //add the raidDay
        string += string3;
      }
    }
    string += "```\n";
    //print message in discord
    if (foundDay) {
      //raid found
      msg.channel.send(string);
    } else {
      //different message if no raid found
      msg.channel.send("I couldn't find a BT raid for " + name + ".");
    }
  }

};
