// ------------------------
// START
// Script for interactive horizontal stacked bar chart
// #chart_1

var unit = 10;
var h = unit;
var w = unit;
var rectH = h + "px";
var rectW = w + "px";
var stacking = unit*1.1;

var svg = d3.select(".chart_1")
            .append("svg")
            .attr("class", "svg1");

var  fillColor = function(d) {
                    if (d.TDR === "N/A") {
                        return "#872B2B"
                  }
                    else {
                        return "#c13e3e"
                  };
                };



var tool_tip = d3.tip() //setting the tool_tip <div> with d3-tip
                 .attr("class", "d3-tip")
                 .offset([0, 20])
                 .html(function(d) { var tooltipNA = "<b>Data</b> " + d.TDR;

                                     var tooltipText = "<b>" + d.Date + "</b> vs. " + d.Opp + "</b>"
                                                        + "<br> <b>P:</b> " + d.PTS
                                                        + " <b>R:</b> " + d.TRB
                                                        + " <b>A:</b> " + d.AST
                                                        + "<br> <b>TDR:</b> " + d.TDR ;if (d.TDR === "N/A") {
                                      return tooltipNA;
                                    }
                                    else {
                                      return tooltipText;
                                    }
                                  });

    svg.call(tool_tip); //calling tool_tip in svg context

d3.csv('triple_doubles_8384_to_1617_apr_10th_leaders_clean.csv', function(error, dataset) { //setting callback csv function

  var nested_dataset = d3.nest()
                       .key(function(d) { return d.Player; }) //nesting by Player. To sort A-Z add: .sortKeys(d3.ascending)
                       .sortValues(function(a,b) { return parseFloat(a.TDR) - parseFloat(b.TDR); }) //sorting ascending by TDR
                       .entries(dataset);

  // console.log(nested_dataset);

  // var count_nested_dataset = d3.nest()
  //                              .rollup(function(count) { return count.length; })
  //                              .entries(nested_dataset);
  //
  // console.log(count_nested_dataset);

  // Setting up title
  var chartTitle = svg.append("text")
                      .attr("class", "chartTitle")
                      .text("Total triple-double leaders all-time")
                      .attr("transform", function(d, i) {
                                         return "translate(0,21)" });

 var chartSubtitle = svg.append("text")
                     .attr("class", "chartSubtitle")
                     .text("Includes all triple-doubles recorded by top 12 players. Game stats are only partly available")
                     .attr("transform", function(d, i) {
                                        return "translate(0,42)" });

  var chartContainer = svg.append("g")
                          .attr("class", "chartContainer")
                          .attr("transform", function(d, i) {
                                             return "translate(0,80)" });

  //Creating players
  var players = chartContainer.selectAll("g")
                              .data(nested_dataset)
                              .enter()
                              .append("g")
                              .attr("class", "player-section")
                              .attr('transform', function(d, i) {
                                                 return "translate(0," + i * unit * 6.5 + ")"; });

 //Printing player name
 var label = players.append("text")
                    .attr("class", "label")
                    .text(function(d) { return d.key; });

 //Printing total triple-doubles
 var printTD = players.append("text")
                      .attr("class", "label2")
                      .text(function(d) { return d.values.length + ":"; }) // + " total triple-doubles"
                      .attr('dy', 20);



 var timeline =  players.append("g")
                         .attr("class", "timeline")
                         .attr('transform', function(d, i) {
                                             return "translate(35, 0)"; }); // " + i + "


 //Appending each triple-double as a rect
 var entries = timeline.selectAll(".entries")
                       .data(function (d) { return d.values; }) //Acessing nested values
                       .enter()
                       .append("rect")
                       .attr("class", "entries")
                       .attr("width", rectW)
                       .attr("height", rectH)
                       .style("fill", fillColor)
                       //Hover animation
                       .on('mouseover', function(d) { tool_tip.attr('class', 'd3-tip animate').show(d);
                                                      d3.select(this).transition().duration(200).style("fill", "#D0D3D4"); })
                       .on('mouseout', function(d) { tool_tip.attr('class', 'd3-tip').show(d);
                                                     tool_tip.hide();
                                                     d3.select(this).transition().duration(0).style("fill", fillColor); });

 //Stacking rect, conditionals to stack in next line
 var stackedRect = entries.attr("x", function(d,i) { if (i >=122) { return (i - 122) * stacking } else if (i >= 61) { return ((i - 61) * stacking) } else { return i * stacking } })
                           .attr("y", function(d,i) { if (i >=122) { return 33 } else if (i >= 61) { return 22 } else { return 11 } });

}); //closing csv function

var source = svg.append("text")
                 .attr("class", "source")
                    .text("source: basketball-reference.com, NBA, Oscar Robertson archive")
                    .attr("transform", function(d, i) {
                                       return "translate(0,860)" });

// END
// ------------------------



// ------------------------
// START:
// Script for Top 10 triple-double by TDR
// .table_1

d3.csv('top10_triple_doubles_by_TDR_clean.csv', function (error,data) {

  var tableTitle = d3.select(".table_1")
                     .append("text")
                     .attr("class", "tableTitle")
                     .text("Top 10 triple-double games all-time by TDR");

  function tabulate(data, columns) {
		var table = d3.select('.table_1')
                  .append('table');

    var thead = table.append('thead');

		var	tbody = table.append('tbody');

		thead.append('tr')
		     .selectAll('th')
		     .data(columns)
         .enter()
		     .append('th')
		     .text(function (column) { return column; })
         .attr("id", function (column) { return column; });

		var rows = tbody.selectAll('tr')
		  .data(data)
		  .enter()
		  .append('tr');

		var cells = rows.selectAll('td')
		                .data(function (row) {

        return columns.map(function (column) {
		      return {column: column, value: row[column]};

		    });
		  })
		  .enter()
		  .append('td')
		    .html(function (d) { return d.value; });

	  return table;
	}

	tabulate(data, ["RK", "Player", "Pos", "Date", "Tm", "Opp", "W-L", "MP", "PTS", "FG%", "TRB", "AST", "STL", "BLK", "TOV", "TDR"]);

  var source = d3.select(".table_1")
                 .append("text")
                   .attr("class", "source")
                      .text("source: basketball-reference.com, NBA, Oscar Robertson archive");

});

// END
// ------------------------



// ------------------------
// START:
// Script for career TDR leaders table
// .table_2

d3.csv('top10_triple_doubles_8384_to_1617_career_val_clean.csv', function (error,data) {

  var tableTitle = d3.select(".table_2")
                     .append("text")
                     .attr("class", "tableTitle")
                     .text("Top 10 players by career TDR");

  function tabulate(data, columns) {
		var table = d3.select('.table_2')
                  .append('table');

    var thead = table.append('thead');

		var	tbody = table.append('tbody');

		thead.append('tr')
		     .selectAll('th')
		     .data(columns)
         .enter()
		     .append('th')
		     .text(function (column) { return column; })
         .attr("id", function (column) { return column; });

		var rows = tbody.selectAll('tr')
		  .data(data)
		  .enter()
		  .append('tr');

		var cells = rows.selectAll('td')
		                .data(function (row) {

        return columns.map(function (column) {
		      return {column: column, value: row[column]};

		    });
		  })
		  .enter()
		  .append('td')
		    .html(function (d) { return d.value; });

	  return table;
	}

	tabulate(data, ["RK", "Player", "Pos", "Total", "FG%", "3P%", "FT%", "PTSG", "TRBG", "ASTG", "STLG", "BLKG", "TOVG", "oTDR", "dTDR", "TDR"]);


  var source = d3.select(".table_2")
                 .append("text")
                   .attr("class", "source")
                      .text("source: basketball-reference.com, NBA, Oscar Robertson archive");

});

// END
// ------------------------



// ------------------------
// START:
// Script for Top 5 triple-double by oTDR
// .table_3

d3.csv('top5_triple_double_8384_to_1617_by_oTDR.csv', function (error,data) {

  var tableTitle = d3.select(".table_3")
                     .append("text")
                     .attr("class", "tableTitle")
                     .text("Top 5 triple-double games by oTDR");


  function tabulate(data, columns) {
		var table = d3.select('.table_3')
                  .append('table');

    var thead = table.append('thead');

		var	tbody = table.append('tbody');

		thead.append('tr')
		     .selectAll('th')
		     .data(columns)
         .enter()
		     .append('th')
		     .text(function (column) { return column; })
         .attr("id", function (column) { return column; });

		var rows = tbody.selectAll('tr')
		  .data(data)
		  .enter()
		  .append('tr');

		var cells = rows.selectAll('td')
		                .data(function (row) {

        return columns.map(function (column) {
		      return {column: column, value: row[column]};

		    });
		  })
		  .enter()
		  .append('td')
		    .html(function (d) { return d.value; });

	  return table;
	}

	tabulate(data, ["RK", "Player", "Pos", "Date", "Tm", "Opp", "FG%", "3P%", "FT%", "PTS", "TRB", "AST", "STL", "BLK", "TOV", "oTDR", "TDR"]);

  var source = d3.select(".table_3")
                 .append("text")
                   .attr("class", "source")
                      .text("source: basketball-reference.com, NBA, Oscar Robertson archive");

});

// END
// ------------------------



// ------------------------
// START:
// Script for Top 5 triple-double by oTDR
// .table_4

d3.csv('top5_triple_double_8384_to_1617_by_dTDR.csv', function (error,data) {

  var tableTitle = d3.select(".table_4")
                     .append("text")
                     .attr("class", "tableTitle")
                     .text("Top 5 triple-double games by dTDR");

  function tabulate(data, columns) {
		var table = d3.select('.table_4')
                  .append('table');

    var thead = table.append('thead');

		var	tbody = table.append('tbody');

		thead.append('tr')
		     .selectAll('th')
		     .data(columns)
         .enter()
		     .append('th')
		     .text(function (column) { return column; })
         .attr("id", function (column) { return column; });

		var rows = tbody.selectAll('tr')
		  .data(data)
		  .enter()
		  .append('tr');

		var cells = rows.selectAll('td')
		                .data(function (row) {

        return columns.map(function (column) {
		      return {column: column, value: row[column]};

		    });
		  })
		  .enter()
		  .append('td')
		    .html(function (d) { return d.value; });

	  return table;
	}

	tabulate(data, ["RK", "Player", "Pos", "Date", "Tm", "Opp", "FG%", "3P%", "FT%", "PTS", "TRB", "AST", "STL", "BLK", "TOV", "dTDR", "TDR"]);

  var source = d3.select(".table_4")
                 .append("text")
                   .attr("class", "source")
                      .text("source: basketball-reference.com, NBA, Oscar Robertson archive");

});
