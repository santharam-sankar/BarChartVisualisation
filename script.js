// Set up chart dimensions
const margin = {top: 20, right: 20, bottom: 50, left: 70};
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG element
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load and process data
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(data => {
        const dataset = data.data;

        // Create scales
        const xScale = d3.scaleBand()
            .domain(dataset.map(d => d[0]))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d[1])])
            .range([height, 0]);

        // Create axes
        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat("%Y"));
        
        const yAxis = d3.axisLeft(yScale);

        // Add x-axis
        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis);

        // Add y-axis
        svg.append("g")
            .attr("id", "y-axis")
            .call(yAxis);

        // Create bars
        svg.selectAll(".bar")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d[0]))
            .attr("y", d => yScale(d[1]))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d[1]))
            .attr("data-date", d => d[0])
            .attr("data-gdp", d => d[1]);

        // Add tooltip
        const tooltip = d3.select("#chart-container")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0);

        // Add mouseover and mouseout events
        svg.selectAll(".bar")
            .on("mouseover", (event, d) => {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                tooltip.html(`Date: ${d[0]}<br>GDP: $${d[1]} Billion`)
                    .attr("data-date", d[0])
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    });