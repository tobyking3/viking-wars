main();

function main() {
    var input = "Nouris, Philippos; Petherick, Joshua; Boyd, Bryce; Hankins, Richard; Bleyl, Jonas; Hedington, Mischa; Pietrzycki, Adam; Tuckey, Kyle; Macleod Campbell, Malcolm; Scott, Ashley; Davies, Ryan; Hocking, Arran; Doung, Amy; Du, Wei; Bradley, Will; Vicarey, George; Mouyiassis, Alexandros; Edwards, Aaron; Vieweg, Nick; Khan, Bradley";
    var students = input.split(";");

    students.sort(function() {
        return Math.random() - 0.5;
    });

    var output = "";
    var mins = 0;

    for (var i = 0; i < students.length; i++) {
        output += "<br>" + (i+1) + ". " + students[i].trim() + " 16:" + mins + "<br>";
        mins += 5;

        if (i == 9) {
            mins = 0;
        }
    }

    //console.log(output);
    printNames(output);
}

function printNames(input) {
    document.getElementById("terminal").innerHTML = input;
}