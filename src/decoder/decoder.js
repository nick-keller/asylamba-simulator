/*

Fleet format is a base64 encoded binary string.
Binary string consists of groups of 15 bits.
Each group is composed of :

* 5 bits for squadron (0 to 24)
* 4 bits for type (0 to 11)
* 6 bits for number (0-50)

 */


function encodeFleet(fleet) {
    var data = [];

    // Get data
    for(var line=0; line<fleet.length; ++line) {
        for(var squadron=0; squadron<fleet[line].length; ++squadron) {
            for(var ship=0; ship<fleet[line][squadron].length; ++ship) {
                if(fleet[line][squadron][ship]) {
                    data.push({
                        pos: line * fleet[line].length + squadron,
                        type: ship,
                        qty: fleet[line][squadron][ship]
                    });
                }
            }
        }
    }

    // Convert to binary
    var bin = '';
    data.forEach(function(element) {
        bin += _.padLeft(element.pos.toString(2), 5, '0');
        bin += _.padLeft(element.type.toString(2), 4, '0');
        bin += _.padLeft(element.qty.toString(2), 6, '0');
    });

    bin = _.padRight(bin, Math.ceil(bin.length/6) *6, '0');

    // Base64 encode
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
    var result = '';

    for(var char=0; char<bin.length/6; ++char) {
        result += chars[parseInt(bin.substr(char*6, 6), 2)];
    }

    return result;
}

function decodeFleet(coded) {

    var fleet = [];

    // create empty fleet
    for(var line = 0; line <5; ++line) {
        fleet.push([]);
        for(var squadron = 0; squadron<5; ++squadron) {
            fleet[line].push(_.fill(Array(12), 0));
        }
    }

    // Base64 decode
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
    var bin = '';

    coded.split('').forEach(function(char) {
        bin += _.padLeft(chars.indexOf(char).toString(2), 6, '0');
    });

    // Get data
    var data = [];
    for(var char=0; char<Math.floor(bin.length/15); ++char) {
        data.push({
            pos: parseInt(bin.substr(char*15, 5), 2),
            type: parseInt(bin.substr(char*15 +5, 4), 2),
            qty: parseInt(bin.substr(char*15 +9, 6), 2)
        });
    }

    // Compute fleet
    data.forEach(function(ships) {
        var line = Math.floor(ships.pos / 5);
        var squadron = ships.pos % 5;

        fleet[line][squadron][ships.type] = ships.qty;
    });

    return fleet;
}