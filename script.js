var unit = 8
var h = unit;
var w = unit;
var rectH = h + "px";
var rectW = w + "px";
var stacking = unit*1.1;

var svg = d3.select(".content")
            .append("svg");

var tool_tip = d3.tip() //setting the tool_tip <div> with d3-tip
                 .attr("class", "d3-tip")
                 .offset([0, 50])
                 .html(function(d) { var tooltipText = "<b>" + d.Date + "</b> vs. " + d.Opp + "</b>"
                                                        + "<br> <b>P:</b> " + d.PTS
                                                        + " <b>R:</b> " + d.TRB
                                                        + " <b>A:</b> " + d.AST
                                                        + "<br> <b>TDR:</b> " + d.TDR ;

                                         return tooltipText; });

    svg.call(tool_tip); //calling tool_tip in svg context

d3.csv("triple-doubles_8384_to1617_apr_3rd - raw_data_8384_to_1617_apr_3rd.csv", function(error, dataset) { //setting callback csv function

  var nested_dataset = d3.nest()
                       .key(function(d) { return d.Player; }) //nesting by Player. To sort A-Z add: .sortKeys(d3.ascending)
                       .sortValues(function(a,b) { return parseFloat(a.TDR) - parseFloat(b.TDR); } ) //sorting ascending by TDR
                       .entries(dataset);

  // console.log(nested_dataset);

  // var count_nested_dataset = d3.nest()
  //                              .rollup(function(count) { return count.length; })
  //                              .entries(nested_dataset);
  //
  // console.log(count_nested_dataset);

  //Creating players
  var players = svg.selectAll("g")
                   .data(nested_dataset)
                   .enter()
                   .append("g")
                   .attr("class", "player-section")
                   .attr('transform', function(d, i) {
                                       return "translate(0," + i * 50 + ")"; });

 //Printing player name
 var label = players.append("text")
                    .attr("class", "label")
                    .text(function(d) { return d.key; });

 //Printing total triple-doubles
 var printTD = players.append("text")
                      .attr("class", "label2")
                      .text(function(d) { return d.values.length + " total triple-doubles"; })
                      .attr('dx', 150);

 var timeline =  players.append("g")
                         .attr("class", "timeline");

 //Appending each triple-double as a rect
 var entries = timeline.selectAll(".entries")
                       .data(function (d) { return d.values; }) //Acessing nested values
                       .enter()
                       .append("rect")
                       .attr("class", "entries")
                       .attr("width", rectW)
                       .attr("height", rectH)
                       .style("fill", "#c13e3e")
                       //Hover animation
                       .on('mouseover', function(d) { tool_tip.attr('class', 'd3-tip animate').show(d)
                                                      d3.select(this).transition().duration(200).style("fill", "hsla(0,0%,0%,0.7)"); })
                       .on('mouseout', function(d) { tool_tip.attr('class', 'd3-tip').show(d)
                                                     tool_tip.hide()
                                                     d3.select(this).transition().duration(0).style("fill", "#c13e3e"); });

 //Stacking rect, conditionals to stack in next line
 var stackedRect = entries.attr("x", function(d,i) { if (i >= 60) { return ((i - 60) * stacking) } else { return i * stacking }; })
                           .attr("y", function(d,i) { if (i >= 60) { return 17 } else { return 8 }; });

}); //closing csv function
