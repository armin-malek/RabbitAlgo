ZC.LICENSE = [
  "569d52cefae586f634c54f86dc99e6a9",
  "b55b025e438fa8a98e32482b5f768ff5",
];

function Calculate() {
  let uuid = uuidv4();
  let tableData = [];
  let rabbits = [
    {
      id: uuid,
      parent: "",
      name: "child",
      isGrown: false,
      bornRound: 0,
      //cls: "fam",
      style: {
        "background-fit": "xy",
        backgroundImage: "./assets/child.png",
      },
    },
  ];

  tableData.push({ round: 1, grownUps: 0, children: 1 });

  let round = 1;
  let maxRound = document.getElementById("RoudInput").value;
  let LastIdx = 0;

  let StartTime = Date.now();
  while (round < maxRound) {
    let lenf = rabbits.length;
    let grownUps = 0;
    let children = 0;
    for (let i = LastIdx; i < lenf; i++) {
      const rabbit = rabbits[i];

      if (rabbit.bornRound + 1 === round)
        if (rabbit.isGrown === true) {
          //Rabbit is Grown

          rabbits.push({
            id: uuidv4(),
            parent: rabbit.id,
            name: "Grown",
            isGrown: true,
            bornRound: round,
            style: {
              "background-fit": "xy",
              backgroundImage: "./assets/grown.png",
            },
          });

          rabbits.push({
            id: uuidv4(),
            parent: rabbit.id,
            name: "child",
            isGrown: false,
            bornRound: round,
            style: {
              "background-fit": "xy",
              backgroundImage: "./assets/child.png",
            },
          });
        } else {
          rabbits[i].isGrown = true;

          rabbits.push({
            id: uuidv4(),
            parent: rabbits[i].id,
            name: "Grown",
            isGrown: true,
            bornRound: round,
            style: {
              "background-fit": "xy",
              backgroundImage: "./assets/grown.png",
            },
          });
        }
      /*
        if (rabbits[i].isGrown === true) grownUps++;
        else children++;
        */
    }

    for (let i = 0; i < rabbits.length; i++) {
      const element = rabbits[i];
      if (element.bornRound === round) {
        if (element.name === "Grown") grownUps++;
        if (element.name === "child") children++;
      }
    }
    tableData.push({ round: round + 1, grownUps, children });

    LastIdx = lenf - 1;
    round++;
  }

  console.log("took", Date.now() - StartTime + " ms");
  let str = "";
  tableData.forEach((element) => {
    str += `
            <tr>
              <th>${element.round}</th>
              <td>${element.grownUps}</td>
              <td>${element.children}</td>
              <td>${element.grownUps + element.children}</td>
            </tr>\n`;
  });
  $("#tableBody").html(str);

  let chartConfig = {
    type: "tree",
    exact: true, // is recommended when you want the chart to paint ALL nodes and not sample your data
    smartSampling: true,
    plotarea: {
      backgroundColor: "#1D8A99",
      "background-fit": "xy",
      "background-repeat": false,
    },
    options: {
      link: {
        aspect: "arc",
      },
      maxSize: 15,
      minSize: 5,
      node: {
        type: "circle",
        tooltip: {
          padding: "8px 10px",
          borderRadius: "3px",
        },
      },
      node: {
        size: 24,
        borderWidth: 3,
        borderColor: "white",
        backgroundColor: "#fff",
        backgroundRepeat: "no-repeat",
        backgroundScale: 0.75,
        label: {
          color: "white",
          fontWeight: "bold",
          offsetY: 35,
        },
        tooltip: {
          text: "%data-full-name",
          visible: true,
        },
      },
      "node[cls-fam]": {
        size: 12,
        borderWidth: 2,
        borderColor: "#000",
        backgroundColor: "white",
        label: {
          visible: false,
        },
      },
      link: {
        lineWidth: 3,
        lineColor: "red",
      },
    },
    series: rabbits,
  };

  zingchart.render({
    id: "myChart",
    data: chartConfig,
    height: "95%",
    width: "100%",
    output: "canvas",
  });

  // change tree layout
  document
    .getElementById("tree-aspect")
    .addEventListener("change", function (e) {
      chartConfig.options.aspect = e.srcElement.value;
      zingchart.exec("myChart", "setdata", {
        data: chartConfig,
      });
    });

  // change tree connector
  document.getElementById("tree-node").addEventListener("change", function (e) {
    chartConfig.options.link.aspect = e.srcElement.value;
    zingchart.exec("myChart", "setdata", {
      data: chartConfig,
    });
  });
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
