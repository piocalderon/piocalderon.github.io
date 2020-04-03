---
layout: archive
permalink: /data/
title: Data
---

<style>
    .container { display: flex; justify-content: center; } 
    .tooltip {
        position: absolute;
        z-index: 1000;
        visibility: visible; 
        background-color: transparent;
        /* font-weight: bold; */
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
"Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans",
"Droid Sans", "Helvetica Neue", sans-serif;
        font-size: 200%;
    }

    .selected {

        stroke: blue;
        stroke-width: 10px;

    }

    .link.selected {

    stroke: red;
    stroke-width: 10px;
                
    }

    .link.background {

    stroke: lightgray;
    stroke-width: 10px;
                
    }

    .link.unselected {

    stroke: gray;
    stroke-width: 10px;
                
    }
    .unselected {
        stroke: transparent;
        stroke-width: 3px;
    }
</style>
<script src="https://d3js.org/d3.v5.min.js"></script>

<div id="example" class="container" style="text-align: center;"></div>
<script src="/assets/bipartite.js"></script>

<!-- <div id="archives">
{% for category in site.categories %}
  {% capture category_name %}{{ category | first }}{% endcapture %}
  {% if category_name == "Data" %}
    <div class="archive-group">
      <div id="#{{ category_name | slugize }}"></div>
      <p></p>
      {% for post in site.categories[category_name] %}
      <article class="archive-item">
        <h4><a href="{{ site.baseurl }}{{ post.url }}">{% if post.title and post.title != "" %}{{post.title}}{% else %}{{post.excerpt |strip_html}}{%endif%}</a></h4>
      </article>
      {% endfor %}
    </div>
  {% endif %}
{% endfor %}
</div> -->
