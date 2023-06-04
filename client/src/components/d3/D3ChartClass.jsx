import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export const BarChart = ({ data }) => {
  const svgRef = useRef(null);
  const chartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Remove any existing chart before updating
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 10, bottom: 50, left: 40 };
    const width = chartWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    console.log("Chart width " + width);
    console.log("Chart height " + height);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, width])
      .padding(0.5);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([height, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.label))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", "teal");

    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "0.15em");

    g.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y).ticks(5).tickSize(-width))
      .selectAll("line")
      .attr("stroke", "#ddd");

    g.selectAll(".y-axis .tick line").attr("stroke-dasharray", "2,2");
  }, [data, chartWidth, chartHeight]);

  useEffect(() => {
    const resizeChart = () => {
      const screenWidth = window.screen.width;
      const chartElement = chartRef.current;
      const chartWidth = window.screen.width * 0.27;
      const chartHeight = window.screen.height/2;
      setChartWidth(chartWidth);
      setChartHeight(chartHeight);
    };

    resizeChart();
    window.addEventListener("resize", resizeChart);

    return () => {
      window.removeEventListener("resize", resizeChart);
    };
  }, []);

  return <div ref={chartRef}><svg ref={svgRef} width={chartWidth} height={chartHeight} /></div>;
};
