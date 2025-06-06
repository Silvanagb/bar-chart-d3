const width = 800;
const height = 400;
const padding = 60;

const tooltip = d3.select("#tooltip");

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
  .then(data => {
    const dataset = data.data;

    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + padding * 2)
      .attr("height", height + padding * 2);

    const xScale = d3.scaleTime()
      .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length - 1][0])])
      .range([padding, width + padding]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => d[1])])
      .range([height + padding, padding]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height + padding})`)
      .call(xAxis);

    svg.append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    const barWidth = width / dataset.length;

    svg.selectAll(".bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(new Date(d[0])))
      .attr("y", d => yScale(d[1]))
      .attr("width", barWidth)
      .attr("height", d => height + padding - yScale(d[1]))
      .attr("data-date", d => d[0])
      .attr("data-gdp", d => d[1])
      .attr("fill", "#4682b4")
      .on("mouseover", function(event, d) {
        tooltip
          .style("visibility", "visible")
          .html(`${d[0]}<br>$${d[1]} Billion`)
          .attr("data-date", d[0])
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 40 + "px");
        d3.select(this).attr("fill", "#2a6da1");
      })
      .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("fill", "#4682b4");
      });
  });
