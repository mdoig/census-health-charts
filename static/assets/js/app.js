(async function(){
    const
        svgWidth = 960,
        svgHeight = 700

    const margin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 100
    }

    const width = svgWidth - margin.left - margin.right
    const height = svgHeight - margin.top - margin.bottom

    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    const svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)

    const chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

    // Import data
    const healthData = await d3.csv("../census-health-charts/static/assets/data/data.csv")

    console.log(healthData)

    // Parse data/cast as numbers
    healthData.forEach(d => {
        d.poverty = +d.poverty
        d.povertyMoe = +d.povertyMoe
        d.age = +d.age
        d.ageMoe = +d.ageMoe
        d.income = +d.income
        d.incomeMoe = +d.incomeMoe
        d.healthcare = +d.healthcare
        d.healthcareLow = +d.healthcareLow
        d.healthcareHigh = +d.healthcareHigh
        d.obesity = +d.obesity
        d.obesityLow = +d.obesityLow
        d.obesityHigh = +d.obesityHigh
        d.smokes = +d.smokes
        d.smokesLow = +d.smokesLow
        d.smokesHigh = +d.smokesHigh
    })

    // Create scale functions
    const xScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.poverty) - 0.5, d3.max(healthData, d => d.poverty) + 2])
        .range([0, width])

    const yScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.healthcare) - 0.5, d3.max(healthData, d => d.healthcare) + 2])
        .range([height, 0])

    // Create axis functions
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    // Append axes to chart
    chartGroup.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)

    chartGroup.append('g')
        .call(yAxis)

    // Create circles
    const circles = chartGroup.selectAll('circle')
        .data(healthData)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.poverty))
        .attr('cy', d => yScale(d.healthcare))
        .attr('r', 12)
        .attr('class', 'stateCircle')

    // Create circle labels
    const labels = chartGroup.selectAll('.stateText')
        .data(healthData)
        .enter()
        .append('text')
        .attr('class', 'stateText')
        .attr('x', d => xScale(d.poverty))
        .attr('y', d => yScale(d.healthcare))
        .attr('dy', '0.35em')
        .text(d=>d.abbr)
        .attr('font-size', 11)

    // Initialize tooltip
    const toolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([80, -100])
        .html(d => {return (`<h4>${d.state}</h4><br><p>Poverty rate: ${d.poverty}%<br>Lacks healthcare: ${d.healthcare}%</p>`)})

    // Create tooltip on chart
    chartGroup.call(toolTip)

    // Event listeners for tooltip
    labels.on('mouseover', function(d) {
        toolTip.show(d, this)
    })

    labels.on('mouseout', function(d) {
        toolTip.hide(d)
    })

    // Create axis labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height * 0.5))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Lacks Healthcare (%)")

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "aText")
        .text("In Poverty (%)")    
})()