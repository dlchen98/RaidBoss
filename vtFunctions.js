//access general misc. functions to help parse get request data
var misc = require("./miscFunctions.js");

//all VT specific raid functions
module.exports = {

  vtRaidOptions(chosenOption, day, msg, sheets, spreadsheetId) {
    //based on the chosen option, print the approrpriate roster
    switch (chosenOption) {
      case "roster":
        this.vtRoster(day, msg, sheets, spreadsheetId);
        break;
      case "1":
        this.asuraMechs(day, msg, sheets, spreadsheetId);
        break;
      case "2":
        this.thrallMechs(msg);
        break;
      case "3":
        this.generalMechs(day, msg, sheets, spreadsheetId);
        break;
      default:
        msg.reply("I don't think that Temple option exists. If lost, use '>raid help'.");
    }
  },

  //one vt raid roster
  vtRoster(day, msg, sheets, spreadsheetId) {
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

  //twin asura mechs TODO
  asuraMechs(day, msg, sheets, spreadsheetId) {
    //set the range for the get request
    sheetRange = day + "!I1:J28";
    //get the roster data from the appropriate spreadsheet
    return sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetRange
    }, (err, response) => {
      //make sure the spreadsheet isn't missing core values (allow <= 3 buyers per 24m raid)
      if (response.values.length < 24) {
        msg.channel.send("Missing tank data. If this is intentional, just type something in the tank row.\n");
        return;
      }

      //boss 1 header
      string="```=====" + misc.checkValid(response.values[0][0]) + "=====\n";
      //ice/fire asura header
      string2 = misc.checkValid(response.values[1][0]) + "===";
      while (string2.length < 15) string2 += " ";
      string2 += misc.checkValid(response.values[1][1]) + "===\n";
      string += string2;

      //add all the roles
      for (var i = 2; i < response.values.length; i++) {
        //role headers
        if (response.values[i].length == 1) {
          string += "-" + misc.checkValid(response.values[i][0]) + ":\n";
        } else {
          //format spacing for playerNames
          string2 = misc.checkValid(response.values[i][0]);
          while (string2.length <15) string2 += " ";
          string2 += misc.checkValid(response.values[i][1]) + "\n";
          string += string2;
        }

      }

      string += "```";
      //print the roster to the channel
      msg.channel.send(string);
    })
  },

  //super thrall "mechs"
  thrallMechs(msg) {
    msg.channel.send("All on the tank lmao have fun.");
  },

  //red general mechs
  generalMechs(day, msg, sheets, spreadsheetId) {
    //set the range for the get request
    sheetRange = day + "!L1:O30";
    //get the roster data from the appropriate spreadsheet
    return sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetRange
    }, (err, response) => {
      //make sure the spreadsheet isn't missing core values (allow <= 3 buyers per 24m raid)
      if (response.values.length < 30) {
        msg.channel.send("Missing role data. If this is intentional, just type something in the breakdown row.\n");
        return;
      }

      //boss 1 header
      string="```=====" + misc.checkValid(response.values[0][0]) + "=====\n";


      //add all the roles
      for (var i = 1; i < response.values.length; i++) {
        //role headers
        if (response.values[i].length == 1) {
          string += "-" + misc.checkValid(response.values[i][0]) + ":\n";
        } else if (response.values[i].length == 3) {
          //format spacing for player positions
          string += misc.checkValid(response.values[i][0]) + "-" + misc.checkValid(response.values[i][2]) + "\n";
        } else {
          response.values[i].forEach(function(name) {
            if (name != undefined && name != "") string += name + ", ";
          });
          string += "\n";
        }

      }

      string += "```";
      //print the roster to the channel
      msg.channel.send(string);
    })
  }

}
