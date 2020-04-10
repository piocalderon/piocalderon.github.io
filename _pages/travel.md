---
layout: archive
permalink: /travel/
title: Travel
---

<style>
    .graphcontainer { 
        /* position: relative;  */
        display: flex; 
        justify-content: center;
        padding-bottom: 0%; 
        /* border: 4px solid red; */
        text-align: center; 
        width: 100%; 
        /* background-color: red;" */
      } 

    .tooltip {
        position: absolute;
        z-index: 1000;
        visibility: visible; 
        background-color: transparent;
        /* font-weight: bold; */
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
"Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans",
"Droid Sans", "Helvetica Neue", sans-serif;
    }

    h2 {
        margin-BOTTOM: 0; 
        text-align: left;
    }

    p  {
        margin-TOP: 0;
    }

    .selected {

        stroke: black;
        stroke-width: 3px;

    }

    .unselected {
        stroke: transparent;
        stroke-width: 3px;
    }
</style>
<script src="https://d3js.org/d3.v5.min.js"></script>

<div id="example" class="graphcontainer"></div>
<script src="/assets/map.js"></script>

<!-- <div id="archives">
{% for category in site.categories %}
  {% capture category_name %}{{ category | first }}{% endcapture %}
  {% if category_name == "Travel" %}
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
{% endfor %} -->
<!-- </div> -->
