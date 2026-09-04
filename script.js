/* ==========================================================================
   Ahmed Ibrahim Mahrous — Personal Report
   Interactions: count-up stats, ledger accordion, career trajectory chart
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Count-up stats ---------------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count-to"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }
    var duration = 1100;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      var value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statStrip = document.getElementById("stat-strip");
  if (statStrip) {
    var statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            statStrip.querySelectorAll(".stat-figure").forEach(animateCount);
            statObserver.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    statObserver.observe(statStrip);
  }

  /* ---------------- Ledger accordion ---------------- */
  document.querySelectorAll(".ledger-head").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = btn.closest(".ledger-row");
      var isOpen = row.getAttribute("data-open") === "true";
      row.setAttribute("data-open", String(!isOpen));
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* ---------------- Career trajectory chart ---------------- */
  var careerData = [
    { date: "Jan 2018", role: "Accountant", org: "Amazon", level: 1 },
    { date: "Sep 2018", role: "Senior Accountant", org: "Amazon", level: 2 },
    { date: "Apr 2021", role: "Senior Accountant", org: "Delivery Hero D-mart", level: 3 },
    { date: "Nov 2022", role: "Budgeting & Reporting Section Head", org: "Sinai Cement Company", level: 4 },
    { date: "Mar 2023", role: "Assistant Finance Manager", org: "Delivery Hero D-mart", level: 5 }
  ];

  var svgNS = "http://www.w3.org/2000/svg";
  var chart = document.getElementById("career-chart");
  var tooltip = document.getElementById("chart-tooltip");

  if (chart) {
    var W = 720, H = 300;
    var padL = 20, padR = 20, padT = 30, padB = 40;
    var innerW = W - padL - padR;
    var innerH = H - padT - padB;
    var maxLevel = 5, minLevel = 1;

    function xFor(i) { return padL + (i / (careerData.length - 1)) * innerW; }
    function yFor(level) {
      return padT + innerH - ((level - minLevel) / (maxLevel - minLevel)) * innerH;
    }

    // Baseline
    var baseline = document.createElementNS(svgNS, "line");
    baseline.setAttribute("x1", padL);
    baseline.setAttribute("x2", W - padR);
    baseline.setAttribute("y1", H - padB);
    baseline.setAttribute("y2", H - padB);
    baseline.setAttribute("stroke", "rgba(25,21,16,0.15)");
    baseline.setAttribute("stroke-width", "1");
    chart.appendChild(baseline);

    // Path
    var points = careerData.map(function (d, i) { return [xFor(i), yFor(d.level)]; });
    var pathD = points
      .map(function (p, i) { return (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1); })
      .join(" ");

    var path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", pathD);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#7C2434");
    path.setAttribute("stroke-width", "2.5");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    chart.appendChild(path);

    // Prep the draw-in animation
    var pathLength = path.getTotalLength();
    if (!prefersReducedMotion) {
      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = pathLength;
      path.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
    }

    // Date labels + points
    careerData.forEach(function (d, i) {
      var p = points[i];

      var label = document.createElementNS(svgNS, "text");
      label.setAttribute("x", p[0]);
      label.setAttribute("y", H - padB + 22);
      label.setAttribute("text-anchor", i === 0 ? "start" : i === careerData.length - 1 ? "end" : "middle");
      label.setAttribute("font-family", "IBM Plex Mono, monospace");
      label.setAttribute("font-size", "11");
      label.setAttribute("fill", "rgba(25,21,16,0.55)");
      label.textContent = d.date;
      chart.appendChild(label);

      var g = document.createElementNS(svgNS, "g");
      g.setAttribute("class", "chart-point");
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");
      g.setAttribute("aria-label", d.role + " at " + d.org + ", " + d.date);

      var haloCircle = document.createElementNS(svgNS, "circle");
      haloCircle.setAttribute("cx", p[0]);
      haloCircle.setAttribute("cy", p[1]);
      haloCircle.setAttribute("r", "12");
      haloCircle.setAttribute("fill", "transparent");
      g.appendChild(haloCircle);

      var dot = document.createElementNS(svgNS, "circle");
      dot.setAttribute("cx", p[0]);
      dot.setAttribute("cy", p[1]);
      dot.setAttribute("r", "5");
      dot.setAttribute("fill", i === careerData.length - 1 ? "#C79A3E" : "#7C2434");
      dot.setAttribute("stroke", "#F2EEE3");
      dot.setAttribute("stroke-width", "2");
      g.appendChild(dot);

      function showTip() {
        tooltip.innerHTML = "<strong>" + d.role + "</strong>" + d.org + " · " + d.date;
        var rect = chart.getBoundingClientRect();
        var scaleX = rect.width / W;
        var scaleY = rect.height / H;
        tooltip.style.left = (p[0] * scaleX) + "px";
        tooltip.style.top = (p[1] * scaleY) + "px";
        tooltip.hidden = false;
      }
      function hideTip() { tooltip.hidden = true; }

      g.addEventListener("mouseenter", showTip);
      g.addEventListener("mouseleave", hideTip);
      g.addEventListener("focus", showTip);
      g.addEventListener("blur", hideTip);
      g.addEventListener("click", showTip);

      chart.appendChild(g);
    });

    if (!prefersReducedMotion) {
      var chartObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              requestAnimationFrame(function () { path.style.strokeDashoffset = "0"; });
              chartObserver.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      chartObserver.observe(chart);
    }
  }
})();
