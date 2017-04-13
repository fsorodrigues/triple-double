// ------------------------
// START:
// Script for diff_TDR x MP Scatter Plot
// #chart_2

var svg2 = d3.select(".chart_2")
            .append("svg")
            .attr("class", "svg2");


var tooltip2 = d3.tip() //setting the tool_tip <div> with d3-tip
                 .attr("class", "d3-tip")
                 .offset([0, 20])
                 .html(function(d) { var tooltipAVG = "<b>" + d.Player + "</b>"
                                                      + "<br> <b>P:</b> " + d.PTS
                                                      + " <b>R:</b> " + d.TRB
                                                      + " <b>A:</b> " + d.AST
                                                      + "<br> <b>TDR:</b> " + d.TDR
                                                      + "<br> <b>MP:</b> " + d.MP ;

                                     var tooltipText = "<b>" + d.Player + "</b>"
                                                        + "<br> <b>" + d.Date + "</b> vs. " + d.Opp + "</b>"
                                                        + "<br> <b>P:</b> " + d.PTS
                                                        + " <b>R:</b> " + d.TRB
                                                        + " <b>A:</b> " + d.AST
                                                        + "<br> <b>TDR:</b> " + d.TDR
                                                        + "<br> <b>Diff to AVG:</b> " + d.diff_tot_TDR
                                                        + "<br> <b>MP:</b> " + d.MP;

                                     if (d.Player === "Average NBA Triple-Double") {
                                        return tooltipAVG;
                                      }
                                     else {
                                        return tooltipText;
                                      }
                                    });

    svg.call(tooltip2); //calling tool_tip in svg context


d3.csv("westbrook_harden_1617_diff_clean.csv", function (data) {

  data.forEach(function(d) {
        d.diff_tot_TDR = +d.diff_tot_TDR;
        d.MP = +d.MP;
  });

  var width = 500;
  var height = 500;
  var radius = 6;

  var margin = { top:10, bottom:60, left:60, right:10 }

  var  fillColor = function(d) {
                      if (d.Player === "Russell Westbrook") {
                          return "#51B2EE"
                    }
                      else if (d.Player === "James Harden") {
                          return "#c13e3e"
                      }
                      else {
                          return "#000000"
                    };
                  };

  var chartTitle = svg2.append("text")
                      .attr("class", "chartTitle")
                      .text("Westbrook vs Harden, Race to the MVP")
                      .attr("transform", function(d, i) {
                                         return "translate(0,21)" });

  var chartSubtitle = svg2.append("text")
                     .attr("class", "chartSubtitle")
                     .text("Includes every triple-double recorded by Russell Westbrook and James Harden in 2016-17")
                     .attr("transform", function(d, i) {
                                        return "translate(0,42)" });

   var chartContainer = svg2.append("g")
                            .attr("id", "svg2")
                            .attr("width", width)
                            .attr("height", height)
                            .attr("transform", function(d, i) {
                                              return "translate(15,80)" });

   var scaleX = d3.scaleLinear()
                   .domain([20, 50]) //using 20 min and 60 min = 4QT + 1OT
                   .range([10, 500]);

   var scaleY = d3.scaleLinear()
                     .domain([d3.min(data, function(d) { return d.diff_tot_TDR; }), d3.max(data, function(d) { return d.diff_tot_TDR; })])
                     .range([500, 0]);

   var axisBottom = d3.axisBottom(scaleX).ticks(6)
                                            .tickSize(-height)
                                            .tickSizeOuter(0)
                                            .tickPadding(10);

   var axisLeft = d3.axisLeft(scaleY).ticks(8)
                                      .tickSizeInner(-width + margin.top)
                                      .tickSizeOuter(0)
                                      .tickPadding(5);

   chartContainer.append('g')
      .attr("class", "ticksVert")
      .attr("transform", "translate(0,500)") //+ (height - 149.6) +
      .call(axisBottom);

   chartContainer.append('g')
     .attr("class", "ticksHorz")
     .attr("transform", "translate(10,0)")
     .call(axisLeft);

   chartContainer.append("text")
    //  .attr("transform", "rotate(-90)")
     .attr("x", 0)
     .attr("y", -7)
     .style("text-anchor", "left")
     .attr("class", "axisLabel")
     .text("Difference to Avg TDR");

   chartContainer.append("text")
     .attr("x", width)
     .attr("y", 540)
     .style("text-anchor", "end")
     .attr("class", "axisLabel")
     .text("Minutes Played");

   function positionX(d) {
     return scaleX(d.MP);
                         }

   function positionY(d) {
     return scaleY(d.diff_tot_TDR);
                       }

   var scatterPlot = chartContainer.selectAll("circle")
                        .data(data)
                        .enter()
                        .append("circle");

   var attributes = scatterPlot.attr("cx", positionX)
                               .attr("cy", positionY)
                               .attr("r", radius)
                               .style("fill", fillColor)
                               .style("opacity", 0.6)
                               //Hover animation
                               .on('mouseover', function(d) { tooltip2.attr('class', 'd3-tip animate').show(d);
                                                              d3.select(this).transition().duration(200).style("opacity", 1).style("stroke", "black").style("stroke-width", "0.5pt"); })
                               .on('mouseout', function(d) { tooltip2.attr('class', 'd3-tip').show(d);
                                                             tooltip2.hide();
                                                             d3.select(this).transition().duration(0).style("opacity", 0.6).style("stroke", "none").style("stroke-width", "0pt"); });




}) //closing d3.csv

var source = svg2.append("text")
                 .attr("class", "source")
                    .text("source: basketball-reference.com, NBA, Oscar Robertson archive")
                    .attr("transform", function(d, i) {
                                       return "translate(20,640)" });
