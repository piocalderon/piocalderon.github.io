---
layout: post
title: The Words of The Oscars
categories: [Data]
excerpt: We look at which words (and consequently topics) appear in plot summaries of Oscar-worthy films from 1928 to 2016.

---

![](https://drraa3ej68s2c.cloudfront.net/wp-content/uploads/2020/01/07082647/eeaf9e7342a0d077a20f395dfcb8791e3d240e5afc2b69f74870afcac3979626.jpg)

Oscar nominations for 2017 will be revealed on January 23. As a tribute to the award-giving body, let’s do a quick post to see which topics commonly appear in Oscar-worthy films.

We look at word clouds made out of plot summaries from Best Picture nominees and winners in the 1928 Oscars ceremony up to 2016.

Plot summaries were scraped from Wikipedia with `Beautiful Soup` and subsequently processed with `Pandas`, `Textblob` and `NLTK`. Only nouns, adjectives and verbs were retained, and proper nouns and stop words were filtered out. Check out my [Jupyter notebook](https://github.com/piocalderon/oscars-analysis) for the complete code.

## Winners

![](/images/20180121/01.png)
![](/images/20180121/02.png)
![](/images/20180121/03.png)
![](/images/20180121/04.png)
![](/images/20180121/05.png)
![](/images/20180121/06.png)
![](/images/20180121/07.png)
![](/images/20180121/08.png)
![](/images/20180121/09.png)
![](/images/20180121/10.png)

## Nominees
Now, let's widen our sample set and include all nominees.

![](/images/20180121/11.png)
![](/images/20180121/12.png)
![](/images/20180121/13.png)
![](/images/20180121/14.png)
![](/images/20180121/15.png)
![](/images/20180121/16.png)
![](/images/20180121/17.png)
![](/images/20180121/18.png)
![](/images/20180121/19.png)
![](/images/20180121/20.png)
