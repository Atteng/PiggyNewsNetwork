'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Cluster } from '@/lib/types';
interface PorktocracyVisualizationProps {
    clusters: Cluster[];
    onClusterClick?: (cluster: Cluster) => void;
    selectedCluster?: Cluster | null;
    selectedSubCircleName?: string | null;
}

export function PorktocracyVisualization({ clusters, onClusterClick, selectedCluster, selectedSubCircleName }: PorktocracyVisualizationProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [showInstructions, setShowInstructions] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const simulationRef = useRef<d3.Simulation<Cluster, undefined> | null>(null);

    // Refs to access current state in D3 event handlers (which capture stale closures)
    const selectedClusterRef = useRef(selectedCluster);
    selectedClusterRef.current = selectedCluster;
    const selectedSubCircleNameRef = useRef(selectedSubCircleName);
    selectedSubCircleNameRef.current = selectedSubCircleName;
    const onClusterClickRef = useRef(onClusterClick);
    onClusterClickRef.current = onClusterClick;

    // Helper to get consistent radius
    const getRadius = (d: Cluster) => d.radius || 80; // Default 80px for equal sizing
    // Dynamic expansion scale based on sub-circle count to prevent crowding
    const getExpandedScale = (d: Cluster) => {
        const count = d.subCircles?.length || 0;
        return count > 4 ? 2.8 : 2.2; // Larger scale (2.8x) for clusters with many sub-circles
    };
    const SHRINK_SCALE = 0.5; // Scale for non-selected clusters

    // Handle responsive resizing and mobile check
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
                setIsMobile(window.innerWidth < 1024); // lg breakpoint
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // ... (keep D3 Simulation Effect as is) ...
    // D3 Simulation - Only run once to preserve positions
    useEffect(() => {
        if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;
        if (simulationRef.current) return; // Don't re-initialize

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = dimensions.width;
        const height = dimensions.height;

        // Define target positions for "Pyramid" layout
        const getTargetPos = (id: string, w: number, h: number) => {
            const cx = w / 2;
            const cy = h / 2;

            if (isMobile) {
                // Mobile 2-2-1 Layout
                // Row 1: 1 & 2
                // Row 2: 3 & 4
                // Row 3: 5

                const yStep = 100; // Vertical spacing guide
                const xStep = 45;  // Horizontal pull force (collision handles actual spacing)

                if (id === '1') return { x: cx - xStep, y: cy - yStep };     // Top Left
                if (id === '2') return { x: cx + xStep, y: cy - yStep };     // Top Right
                if (id === '3') return { x: cx - xStep, y: cy + 10 };        // Mid Left
                if (id === '4') return { x: cx + xStep, y: cy + 10 };        // Mid Right
                if (id === '5') return { x: cx, y: cy + yStep + 20 };        // Bottom Center
            } else {
                // Desktop Pyramid Layout
                const rowOffset = 35;
                const colSpacing = 90;

                if (id === '1') return { x: cx - colSpacing / 2, y: cy - rowOffset };
                if (id === '2') return { x: cx + colSpacing / 2, y: cy - rowOffset };
                if (id === '3') return { x: cx - colSpacing, y: cy + rowOffset };
                if (id === '4') return { x: cx, y: cy + rowOffset };
                if (id === '5') return { x: cx + colSpacing, y: cy + rowOffset };
            }

            return { x: cx, y: cy };
        };

        // Initialize positions only once
        clusters.forEach(d => {
            if (!d.x) d.x = width / 2 + (Math.random() - 0.5) * 50;
            if (!d.y) d.y = height / 2 + (Math.random() - 0.5) * 50;
        });

        const simulation = d3.forceSimulation<Cluster>(clusters)
            .force("charge", d3.forceManyBody().strength(-100))
            .force("collide", d3.forceCollide<Cluster>().radius(d => {
                const currentRadius = selectedClusterRef.current && d.id === selectedClusterRef.current.id
                    ? getRadius(d) * getExpandedScale(d) + 20
                    : getRadius(d) + 10;
                return currentRadius;
            }).strength(0.8))
            .force("x", d3.forceX<Cluster>(d => getTargetPos(d.id, width, height).x).strength(0.3))
            .force("y", d3.forceY<Cluster>(d => getTargetPos(d.id, width, height).y).strength(0.3))
            .force("y-boundary", d3.forceY().y(height / 2).strength((d: any) => d.y < 120 ? 0.5 : 0.01))
            .on("tick", ticked);

        simulationRef.current = simulation;

        // Node Groups - FIXED: Initialize opacity to 1 immediately for hydration match, then animate if needed
        const nodes = svg.selectAll<SVGGElement, Cluster>("g")
            .data(clusters)
            .enter()
            .append("g")
            .attr("class", "cursor-pointer group")
            .attr("opacity", 0) // Fade in start
            .call(d3.drag<SVGGElement, Cluster>()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        nodes.transition().duration(800).ease(d3.easeCubicOut).attr("opacity", 1);

        // Main Circles
        const circles = nodes.append("circle")
            .attr("r", 0)
            .attr("fill", "#000000")
            .attr("stroke", "rgba(255, 255, 255, 0.2)")
            .attr("stroke-width", 2)
            .attr("class", "transition-all duration-300 main-circle")
            .style("pointer-events", "all");

        circles.transition().duration(800).ease(d3.easeCubicOut)
            .attr("r", d => getRadius(d));

        // Glow Effect
        nodes.append("circle")
            .attr("r", d => getRadius(d) + 5)
            .attr("fill", "none")
            .attr("stroke", "#ff2f7a")
            .attr("stroke-width", 0)
            .attr("opacity", 0)
            .attr("class", "glow-circle transition-all duration-300");

        // Labels Group
        const labelsGroup = nodes.append("g").attr("class", "labels-group");

        labelsGroup.append("text")
            .text(d => d.name.replace(' Strategy', ''))
            .attr("dy", "0em")
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr("font-weight", "bold")
            .attr("font-size", d => Math.min(getRadius(d) / 5, 14))
            .style("pointer-events", "none");

        labelsGroup.append("text")
            .attr("dy", "1.4em")
            .attr("text-anchor", "middle")
            .attr("fill", "#ff2f7a")
            .attr("font-size", d => Math.min(getRadius(d) / 6, 11))
            .attr("font-weight", "bold")
            .style("pointer-events", "none")
            .text(d => `${d.memberCount} Members`);

        labelsGroup.append("text")
            .attr("dy", "2.6em")
            .attr("text-anchor", "middle")
            .attr("fill", "#ff2f7a")
            .attr("font-size", d => Math.min(getRadius(d) / 6, 11))
            .attr("font-weight", "bold")
            .style("pointer-events", "none")
            .text(d => `${d.proposalCount} Proposals`);

        // Interactions
        nodes
            .on("mouseenter", function (event, d) {
                if (selectedClusterRef.current && selectedClusterRef.current.id === d.id) return;
                // Disable hover effects if on mobile and something is selected (other nodes are hidden)
                if (window.innerWidth < 1024 && selectedClusterRef.current) return;

                setShowInstructions(false);

                // Hover Expand
                d3.select(this).select(".main-circle")
                    .transition().duration(300)
                    .attr("r", getRadius(d) * 1.1)
                    .attr("stroke", "#ff2f7a")
                    .attr("stroke-width", 3);

                d3.select(this).select(".glow-circle")
                    .transition().duration(300)
                    .attr("r", (getRadius(d) * 1.1) + 10)
                    .attr("stroke-width", 2)
                    .attr("opacity", 0.5);

                simulation.force("collide", d3.forceCollide<Cluster>().radius(n => {
                    if (n.id === d.id) return (getRadius(n) * 1.1) + 10;
                    if (selectedClusterRef.current && n.id === selectedClusterRef.current.id) {
                        return getRadius(n) * getExpandedScale(n) + 20;
                    }
                    return getRadius(n) + 10;
                }).strength(0.8));
                simulation.alpha(0.1).restart();
            })
            .on("mouseleave", function (event, d) {
                if (selectedClusterRef.current && selectedClusterRef.current.id === d.id) return;
                if (window.innerWidth < 1024 && selectedClusterRef.current) return;

                if (!selectedClusterRef.current) {
                    setShowInstructions(true);
                }

                d3.select(this).select(".main-circle")
                    .transition().duration(300)
                    .attr("r", getRadius(d))
                    .attr("stroke", "rgba(255, 255, 255, 0.2)")
                    .attr("stroke-width", 2);

                d3.select(this).select(".glow-circle")
                    .transition().duration(300)
                    .attr("r", getRadius(d) + 5)
                    .attr("stroke-width", 0)
                    .attr("opacity", 0);

                simulation.force("collide", d3.forceCollide<Cluster>().radius(n => {
                    if (selectedClusterRef.current && n.id === selectedClusterRef.current.id) {
                        return getRadius(n) * getExpandedScale(n) + 20;
                    }
                    return getRadius(n) + 10;
                }).strength(0.8));
                simulation.alpha(0.1).restart();
            })
            .on("click", (event, d) => {
                setShowInstructions(false);
                if (onClusterClickRef.current) onClusterClickRef.current(d);
            });

        // Ticked function
        function ticked() {
            nodes.attr("transform", d => {
                let currentR = getRadius(d);
                if (selectedClusterRef.current && d.id === selectedClusterRef.current.id) {
                    currentR = getRadius(d) * getExpandedScale(d);
                }

                d.x = Math.max(currentR + 10, Math.min(width - currentR - 10, d.x!));
                d.y = Math.max(currentR + 90, Math.min(height - currentR - 10, d.y!));
                return `translate(${d.x},${d.y})`;
            });
        }

        // Drag Functions (Keep existing)
        function dragstarted(this: SVGGElement, event: any, d: any) {
            if (selectedClusterRef.current) return;
            setShowInstructions(false);
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
            d3.select(this).dispatch("mouseenter");
        }

        function dragged(event: any, d: any) {
            if (selectedClusterRef.current) return;
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event: any, d: any) {
            if (selectedClusterRef.current) return;
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return () => {
            simulation.stop();
        };

    }, [dimensions, isMobile]); // Re-run when dimensions or layout mode changes

    // Separate Effect for Selection State changes
    useEffect(() => {
        if (!svgRef.current) return;
        if (!simulationRef.current) return;

        const svg = d3.select(svgRef.current);
        const nodes = svg.selectAll<SVGGElement, Cluster>("g.group");
        const simulation = simulationRef.current;

        // Update collision force
        simulation.force("collide", d3.forceCollide<Cluster>().radius(d => {
            if (selectedCluster && d.id === selectedCluster.id) {
                return getRadius(d) * getExpandedScale(d) + 20;
            }
            return getRadius(d) + 10;
        }).strength(0.8));

        simulation.alpha(0.15).restart();

        if (!selectedCluster) {
            // RESET STATE
            nodes.each(function (d) {
                const node = d3.select(this);

                node.transition().duration(500).ease(d3.easeCubicOut)
                    .attr("opacity", 1) // Restore visibility
                    .style("pointer-events", "all"); // Restore interaction

                node.select(".main-circle")
                    .transition().duration(500).ease(d3.easeCubicOut)
                    .attr("r", getRadius(d))
                    .attr("fill", "#000000")
                    .attr("stroke", "rgba(255, 255, 255, 0.2)")
                    .attr("stroke-width", 2)
                    .attr("fill-opacity", 1);

                node.select(".glow-circle")
                    .transition().duration(500)
                    .attr("r", getRadius(d) + 5)
                    .attr("stroke-width", 0)
                    .attr("opacity", 0);

                node.select(".labels-group")
                    .transition().duration(500)
                    .attr("opacity", 1);

                node.select(".sub-circles-group").remove();
                node.select(".expanded-header").remove();
            });

        } else {
            // SELECTED STATE
            nodes.each(function (d) {
                const node = d3.select(this);
                const isSelected = d.id === selectedCluster.id;

                if (isSelected) {
                    const expandedRadius = getRadius(d) * getExpandedScale(d);

                    // Ensure selected node is fully visible
                    node.transition().duration(500).attr("opacity", 1).style("pointer-events", "all");

                    // Main outer circle
                    node.select(".main-circle")
                        .transition().duration(500).ease(d3.easeCubicOut)
                        .attr("r", expandedRadius)
                        .attr("fill", "rgba(0, 0, 0, 0.7)")
                        .attr("fill-opacity", 0.3)
                        .attr("stroke", "rgba(255, 255, 255, 0.3)")
                        .attr("stroke-width", 2);

                    node.select(".glow-circle")
                        .transition().duration(500)
                        .attr("r", expandedRadius + 15)
                        .attr("stroke-width", 0)
                        .attr("opacity", 0);

                    node.select(".labels-group")
                        .transition().duration(500)
                        .attr("opacity", 0);

                    // Draw Sub-Circles (keeping existing logic...)
                    // ... (rest of sub-circle logic same as before, no changes needed inside if-selected) ...
                    node.select(".sub-circles-group").remove();
                    const headerGroup = node.append("g")
                        .attr("class", "expanded-header")
                        .attr("opacity", 0)
                        .style("pointer-events", "none");

                    // Expand header logic...
                    headerGroup.append("text")
                        .text(d.name.replace(' Strategy', ''))
                        .attr("dy", -expandedRadius + 35)
                        .attr("text-anchor", "middle")
                        .attr("fill", "white")
                        .attr("font-size", 16)
                        .attr("font-weight", "600");

                    headerGroup.append("text")
                        .text(`${d.memberCount} Members • ${d.proposalCount} Proposals`)
                        .attr("dy", -expandedRadius + 52)
                        .attr("text-anchor", "middle")
                        .attr("fill", "#ff2f7a")
                        .attr("font-size", 11)
                        .attr("font-weight", "500");

                    headerGroup.transition().delay(200).duration(400).attr("opacity", 1);

                    const subCirclesGroup = node.append("g")
                        .attr("class", "sub-circles-group")
                        .attr("opacity", 1);

                    interface PackNode { name: string; value?: number; children?: PackNode[]; }
                    const packData: PackNode = { name: "root", children: d.subCircles ? d.subCircles.map(name => ({ name, value: 1 })) : [] };
                    const root = d3.hierarchy<PackNode>(packData).sum(d => d.value ?? 0);
                    const innerDiameter = expandedRadius * 1.76;
                    const pack = d3.pack<PackNode>().size([innerDiameter, innerDiameter]).padding(10);
                    const leaves = pack(root).leaves();

                    const subNodes = subCirclesGroup.selectAll<SVGGElement, any>("g")
                        .data(leaves).enter().append("g")
                        .attr("transform", p => `translate(${p.x - innerDiameter / 2},${p.y - innerDiameter / 2})`)
                        .attr("opacity", 0);

                    subNodes.append("circle")
                        .attr("r", p => p.r)
                        .attr("fill", "#ff2f7a")
                        .attr("fill-opacity", p => (selectedSubCircleNameRef.current && p.data.name === selectedSubCircleNameRef.current) ? 0.3 : 0.05)
                        .attr("stroke", "white")
                        .attr("stroke-opacity", 0.5)
                        .attr("stroke-width", 1)
                        .attr("class", "sub-circle")
                        .style("cursor", "pointer")
                        .on("mouseenter", function (event, p) {
                            if (selectedSubCircleNameRef.current && p.data.name === selectedSubCircleNameRef.current) return;
                            d3.select(this).transition().duration(200).attr("fill-opacity", 0.3).attr("stroke", "#ff2f7a").attr("stroke-opacity", 1).attr("stroke-width", 2);
                            d3.select(this.parentNode as any).selectAll("text").attr("fill", "white");
                        })
                        .on("mouseleave", function (event, p) {
                            if (selectedSubCircleNameRef.current && p.data.name === selectedSubCircleNameRef.current) return;
                            d3.select(this).transition().duration(200).attr("fill-opacity", 0.05).attr("stroke", "white").attr("stroke-opacity", 0.5).attr("stroke-width", 1);
                            d3.select(this.parentNode as any).selectAll("text").each(function (d, i) { d3.select(this).attr("fill", i === 0 ? "white" : "#ff2f7a"); });
                        })
                        .on("click", function (event, p) {
                            event.stopPropagation();
                            if (onClusterClick) onClusterClick({ ...d, subCircleName: p.data.name, isSubCircle: true } as any);
                        });


                    // Name text with intelligent wrapping based on actual text width
                    subNodes.append("text")
                        .attr("text-anchor", "middle")
                        .attr("fill", "white")
                        .attr("font-size", p => Math.min(p.r / 3, 11))
                        .attr("font-weight", "600")
                        .style("opacity", p => p.r > 25 ? 1 : 0)
                        .style("pointer-events", "none")
                        .each(function (p) {
                            const text = d3.select(this);
                            const words = p.data.name.split(/\s+/);
                            const lineHeight = 1.1;
                            const maxWidth = p.r * 1.7; // Max width with padding from edges
                            const fontSize = Math.min(p.r / 3, 11);

                            // Only wrap if there are multiple words and circle is large enough
                            if (words.length > 1 && p.r > 25) {
                                // Build lines by measuring width
                                const lines: string[] = [];
                                let currentLine = words[0];

                                for (let i = 1; i < words.length; i++) {
                                    const testLine = currentLine + ' ' + words[i];
                                    // Approximate width (chars * fontSize * 0.6)
                                    const testWidth = testLine.length * fontSize * 0.6;

                                    if (testWidth > maxWidth && currentLine.length > 0) {
                                        lines.push(currentLine);
                                        currentLine = words[i];
                                    } else {
                                        currentLine = testLine;
                                    }
                                }
                                lines.push(currentLine);

                                // Render lines with proper vertical centering
                                const totalLines = lines.length;
                                const startY = -(totalLines - 1) * lineHeight * 0.5;

                                lines.forEach((line, i) => {
                                    text.append('tspan')
                                        .attr('x', 0)
                                        .attr('dy', i === 0 ? `${startY}em` : `${lineHeight}em`)
                                        .text(line);
                                });
                            } else {
                                text.text(p.data.name).attr('dy', '0em');
                            }
                        });

                    // Member count text (full "Members" label)
                    subNodes.append("text")
                        .text(p => {
                            const subCircleCount = d.subCircles?.length || 1;
                            const membersPerCircle = Math.floor(d.memberCount / subCircleCount);
                            return `${membersPerCircle} Members`;
                        })
                        .attr("dy", "2.2em")
                        .attr("text-anchor", "middle")
                        .attr("fill", p => (selectedSubCircleNameRef.current && p.data.name === selectedSubCircleNameRef.current) ? "white" : "#ff2f7a")
                        .attr("font-size", p => Math.min(p.r / 5, 9))
                        .attr("font-weight", "500")
                        .style("opacity", p => p.r > 30 ? 1 : 0)
                        .style("pointer-events", "none");

                    // Proposal count text (full "Proposals" label)
                    subNodes.append("text")
                        .text(p => {
                            const subCircleCount = d.subCircles?.length || 1;
                            const proposalsPerCircle = Math.floor(d.proposalCount / subCircleCount);
                            return `${proposalsPerCircle} Proposals`;
                        })
                        .attr("dy", "3.3em")
                        .attr("text-anchor", "middle")
                        .attr("fill", p => (selectedSubCircleNameRef.current && p.data.name === selectedSubCircleNameRef.current) ? "white" : "#ff2f7a")
                        .attr("font-size", p => Math.min(p.r / 5, 9))
                        .attr("font-weight", "500")
                        .style("opacity", p => p.r > 30 ? 1 : 0)
                        .style("pointer-events", "none");


                    subNodes.transition().delay((d, i) => 400 + (i * 60)).duration(300).attr("opacity", 1);

                } else {
                    // NOT SELECTED STATE (Shrink or Hide)
                    const shrinkRadius = getRadius(d) * SHRINK_SCALE;

                    node.select(".sub-circles-group").remove();
                    node.select(".expanded-header").remove();

                    if (isMobile) {
                        // ON MOBILE: DISAPPEAR COMPLETELY
                        node.transition().duration(500).attr("opacity", 0).style("pointer-events", "none");
                    } else {
                        // ON DESKTOP: Shrink as before
                        node.transition().duration(500).attr("opacity", 1).style("pointer-events", "all"); // Ensure visible

                        node.select(".main-circle")
                            .transition().duration(500).ease(d3.easeCubicOut)
                            .attr("r", shrinkRadius)
                            .attr("fill", "#000000")
                            .attr("fill-opacity", 0.4)
                            .attr("stroke", "rgba(255, 255, 255, 0.1)")
                            .attr("stroke-width", 1);

                        node.select(".glow-circle")
                            .transition().duration(500)
                            .attr("r", shrinkRadius + 5)
                            .attr("stroke-width", 0)
                            .attr("opacity", 0);

                        node.select(".labels-group")
                            .transition().duration(500)
                            .attr("opacity", 0.6);
                    }
                }
            });
        }

    }, [selectedCluster, isMobile]); // Add isMobile dependency

    // ... (rest of file) ...

    return (
        <div ref={containerRef} className="w-full h-full relative">
            <svg
                ref={svgRef}
                className="w-full h-full"
                style={{ overflow: 'visible' }}
            />

            <div
                className="absolute bottom-24 lg:top-32 left-0 right-0 text-center pointer-events-none transition-opacity duration-300"
                style={{ opacity: showInstructions ? 1 : 0 }}
            >
                <p className="text-white/40 text-sm font-mono">
                    Click on a cluster to explore circles
                </p>
            </div>
        </div>
    );
}
