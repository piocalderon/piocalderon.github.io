---
layout: post
title: Learning JRPG Tropes from Video Game Transcripts
categories: [Data, NLP, Video Games]
excerpt: <img src="/images/vgtranscript/extra/jrpgcover.png"> We uncover common character archetypes from Final Fantasy and other JRPGs using video game transcripts and Doc2Vec.
---
![](/images/vgtranscript/extra/dqxis.jpeg)

*(This article is best viewed on desktop.)*

It’s been several months into quarantine, and just like many of you I've been bored as hell. Luckily, I have video games to keep me occupied. I recently finished Dragon Quest XI on the Switch, and I must say what an amazing game. It made me feel very nostalgic of my youth, which was spent mostly in fantasy worlds. RPGs were my video game poison of choice, and Final Fantasy was the series at the top of my list.

Having played a lot of Japanese RPGs (JRPGs), it's very easy to see that the main cast mostly follow a template:  an angsty protagonist, a bubbly love interest, a comic relief, or some other variations thereof. If you think hard enough, it's not hard to see that Cloud and Squall are basically the same archetype, ditto Wakka and Zell.

![](/images/vgtranscript/extra/cloudsquall.jpg)

This had me thinking. Is there a way to discover these *character tropes* just from the things they say (i.e. their spoken lines in the game)? 

By transforming this question into a data science question, we can decompose it into three subproblems:
1. Can we construct a *meaningful representation* of JRPG characters using dialog? By meaningful, I mean that the representation admits a notion of *distance* so that we can measure how close or how far two characters are from each other.
2. Can we identify *intuitive* parallel characters belonging to different games? In other words, does our representation allow us to say that Wakka (Final Fantasy X) is the Zell of Final Fantasy X?
3. Can we group characters, independent of the game they are from, similar in terms of tropes?

## A. Representation

In data science terms, our first subproblem is to transform game characters into vectors using a dataset of game dialog transcripts. 

![](/images/vgtranscript/extra/dialog.png)

For this project I used character dialog from 15 major JRPGs: Final Fantasy (2, 4, 5, 6, 7, 8, 9, 10, 10-2, 12, 13-2, Tactics), Kingdom Hearts 1 and 2, and Shin Megami Tensei IV. The games were selected based on availability of game transcripts on Gamefaqs. I would have loved to include Dragon Quest XI and the Bravely games, but transcripts for these games don’t exist in an easy-to-process format.

Once I had the transcripts saved as text files, I dissected them to collect all dialog belonging to individual characters. For each game, I only considered the top 10 characters based on highest line count. In total, we have 15*10 = 150 JRPG characters, mostly the main cast for each game, but some baddies and chatty side characters as well.

Now the tricky part. The main objective is to compare different characters based on patterns of semantic and syntactic similarity in their dialog, which would become our basis to define JRPG tropes. How do we distill the *essence* of the character from the dialog and subsequently represent it in a vector? 

We will be using the `Doc2Vec` algorithm. 

I don’t want to get too deep on algorithms, so I won’t elaborate too much. There are tons of tutorials and articles on the web explaining the inner workings of the algorithm. Just to give a taste of it, `Doc2Vec` is an extension of the renowned `Word2Vec` algorithm. While `Word2Vec` transforms words into vectors (hence the name), `Doc2Vec` transforms documents, i.e. sets of words, into vectors.

`Word2Vec` looks at a huge set of texts in order to do the translation into vectors. The basic assumption of Word2Vec is the *Distributional Hypothesis*, which argues that the meaning of a word is based on the company it keeps. In other words, words that occur in the same context usually have similar meanings. By going over a huge set of texts and looking at each word (the target word), one at a time, and keeping track of its surrounding words (the context), one can build a simple neural network model to predict context from the target (or the target from context). Once trained, this neural network can be dissected, and one of its layers will contain an encoding for each word appearing in the training text. 

A cool thing about `Word2Vec` is that arithmetic on word vectors is interpretable (assuming that we have good quality vectors), so one can do things like king + woman - man = queen. 

![](/images/vgtranscript/extra/word2vec.png)

However, character dialog usually doesn't consist of a single word (unless it's a Pokemon). What we actually have are lines for each character: sets of words, phrases, even sentences. We can't use `Word2Vec` directly on these lines, so what do we do?

Enter `Doc2Vec`. 

The inner workings of `Doc2Vec` are very similar to `Word2Vec`, except for a small difference in the input data. Instead of training on one huge chunk of text, we use a set of labeled documents. The documents, in our case, are the different video game characters. 

What's unique about `Doc2Vec` is that the algorithm uses the document label as part of the context, and in terms of output we also get a vector for each document. The document vector is a representation of the syntactic and semantic tendencies of the document, and it can be used for similarity queries for other documents. For our problem, the document vector translates into a *character vector* which can be used to look for similar characters.

We pass in the 150 character dialog transcripts as the training data for `Doc2Vec`. As the output, we get a 50-dimensional vector for each character. Using this set of vectors, we can compute distances with `cosine similarity`, query similar characters, and explore parallels in different JRPGs.

## B. Parallels

Using our character vectors, we can query for parallel characters for a particular seed character. For example, let’s see who Yuna (FF X) is closest to in each game in the dataset. (Feel free to check the results for your favorite character using the dropdown below the chart.)

<div id="lollipopdiv" class="graphcontainer fullwidth" style="margin:0 auto"></div>
<div id="fakediv1"></div>
<div style="text-align: left; display: block">
<form style="display: inline-block; text-align: left; margin: 0 auto;"><select id="lollipop_selection" style="border:3px #ff5e5b;outline:3px; font-size:130%; margin-top:10px" name = "dropdown"><option value = "ff_02_Firion">Firion (FF 02)</option><option value = "ff_02_Gordon">Gordon (FF 02)</option><option value = "ff_02_Hilda">Hilda (FF 02)</option><option value = "ff_02_Josef">Josef (FF 02)</option><option value = "ff_02_King">King (FF 02)</option><option value = "ff_02_Leila">Leila (FF 02)</option><option value = "ff_02_Mindu">Mindu (FF 02)</option><option value = "ff_02_Pavel">Pavel (FF 02)</option><option value = "ff_02_Soldier">Soldier (FF 02)</option><option value = "ff_02_Wizard">Wizard (FF 02)</option><option value = "ff_04_Cecil">Cecil (FF 04)</option><option value = "ff_04_Cid">Cid (FF 04)</option><option value = "ff_04_Edge">Edge (FF 04)</option><option value = "ff_04_Edward">Edward (FF 04)</option><option value = "ff_04_Elder">Elder (FF 04)</option><option value = "ff_04_Kain">Kain (FF 04)</option><option value = "ff_04_Rosa">Rosa (FF 04)</option><option value = "ff_04_Rydia">Rydia (FF 04)</option><option value = "ff_04_Tellah">Tellah (FF 04)</option><option value = "ff_04_Yang">Yang (FF 04)</option><option value = "ff_05_Bartz">Bartz (FF 05)</option><option value = "ff_05_Cid">Cid (FF 05)</option><option value = "ff_05_Exdeath">Exdeath (FF 05)</option><option value = "ff_05_Faris">Faris (FF 05)</option><option value = "ff_05_Galuf">Galuf (FF 05)</option><option value = "ff_05_Ghido">Ghido (FF 05)</option><option value = "ff_05_Gilgamesh">Gilgamesh (FF 05)</option><option value = "ff_05_Krile">Krile (FF 05)</option><option value = "ff_05_Lenna">Lenna (FF 05)</option><option value = "ff_05_Mid">Mid (FF 05)</option><option value = "ff_06_Celes">Celes (FF 06)</option><option value = "ff_06_Cyan">Cyan (FF 06)</option><option value = "ff_06_Edgar">Edgar (FF 06)</option><option value = "ff_06_Gesthal">Gesthal (FF 06)</option><option value = "ff_06_Kefka">Kefka (FF 06)</option><option value = "ff_06_Locke">Locke (FF 06)</option><option value = "ff_06_Sabin">Sabin (FF 06)</option><option value = "ff_06_Setzer">Setzer (FF 06)</option><option value = "ff_06_Strago">Strago (FF 06)</option><option value = "ff_06_Terra">Terra (FF 06)</option><option value = "ff_07_Aerith">Aerith (FF 07)</option><option value = "ff_07_Barret">Barret (FF 07)</option><option value = "ff_07_Bugenhagen">Bugenhagen (FF 07)</option><option value = "ff_07_Cait Sith">Cait Sith (FF 07)</option><option value = "ff_07_Cid">Cid (FF 07)</option><option value = "ff_07_Cloud">Cloud (FF 07)</option><option value = "ff_07_Red Xiii">Red Xiii (FF 07)</option><option value = "ff_07_Sephiroth">Sephiroth (FF 07)</option><option value = "ff_07_Tifa">Tifa (FF 07)</option><option value = "ff_07_Yuffie">Yuffie (FF 07)</option><option value = "ff_08_Edea">Edea (FF 08)</option><option value = "ff_08_Headmaster Cid">Headmaster Cid (FF 08)</option><option value = "ff_08_Irvine">Irvine (FF 08)</option><option value = "ff_08_Laguna">Laguna (FF 08)</option><option value = "ff_08_Quistis">Quistis (FF 08)</option><option value = "ff_08_Rinoa">Rinoa (FF 08)</option><option value = "ff_08_Seifer">Seifer (FF 08)</option><option value = "ff_08_Selphie">Selphie (FF 08)</option><option value = "ff_08_Squall">Squall (FF 08)</option><option value = "ff_08_Zell">Zell (FF 08)</option><option value = "ff_09_Dagger">Dagger (FF 09)</option><option value = "ff_09_Eiko">Eiko (FF 09)</option><option value = "ff_09_Freya">Freya (FF 09)</option><option value = "ff_09_Kuja">Kuja (FF 09)</option><option value = "ff_09_Quina">Quina (FF 09)</option><option value = "ff_09_Regent Cid">Regent Cid (FF 09)</option><option value = "ff_09_Steiner">Steiner (FF 09)</option><option value = "ff_09_Tot">Tot (FF 09)</option><option value = "ff_09_Vivi">Vivi (FF 09)</option><option value = "ff_09_Zidane">Zidane (FF 09)</option><option value = "ff_10_2_Brother">Brother (FF 10 2)</option><option value = "ff_10_2_Buddy">Buddy (FF 10 2)</option><option value = "ff_10_2_Gippal">Gippal (FF 10 2)</option><option value = "ff_10_2_Leblanc">Leblanc (FF 10 2)</option><option value = "ff_10_2_Nooj">Nooj (FF 10 2)</option><option value = "ff_10_2_Paine">Paine (FF 10 2)</option><option value = "ff_10_2_Rikku">Rikku (FF 10 2)</option><option value = "ff_10_2_Rin">Rin (FF 10 2)</option><option value = "ff_10_2_Wakka">Wakka (FF 10 2)</option><option value = "ff_10_2_Yuna">Yuna (FF 10 2)</option><option value = "ff_10_Auron">Auron (FF 10)</option><option value = "ff_10_Crusader">Crusader (FF 10)</option><option value = "ff_10_Jecht">Jecht (FF 10)</option><option value = "ff_10_Lulu">Lulu (FF 10)</option><option value = "ff_10_Monk">Monk (FF 10)</option><option value = "ff_10_Rikku">Rikku (FF 10)</option><option value = "ff_10_Tidus">Tidus (FF 10)</option><option value = "ff_10_Wakka">Wakka (FF 10)</option><option value = "ff_10_Woman">Woman (FF 10)</option><option value = "ff_10_Yuna" selected>Yuna (FF 10)</option><option value = "ff_12_Al Cid">Al Cid (FF 12)</option><option value = "ff_12_Ashe">Ashe (FF 12)</option><option value = "ff_12_Balthier">Balthier (FF 12)</option><option value = "ff_12_Basch">Basch (FF 12)</option><option value = "ff_12_Fran">Fran (FF 12)</option><option value = "ff_12_Larsa">Larsa (FF 12)</option><option value = "ff_12_Penelo">Penelo (FF 12)</option><option value = "ff_12_Vaan">Vaan (FF 12)</option><option value = "ff_12_Vayne">Vayne (FF 12)</option><option value = "ff_12_Vossler">Vossler (FF 12)</option><option value = "ff_13_2_Alyssa">Alyssa (FF 13 2)</option><option value = "ff_13_2_Caius">Caius (FF 13 2)</option><option value = "ff_13_2_Chocolina">Chocolina (FF 13 2)</option><option value = "ff_13_2_Hope">Hope (FF 13 2)</option><option value = "ff_13_2_Lightning">Lightning (FF 13 2)</option><option value = "ff_13_2_Mog">Mog (FF 13 2)</option><option value = "ff_13_2_Noel">Noel (FF 13 2)</option><option value = "ff_13_2_Serah">Serah (FF 13 2)</option><option value = "ff_13_2_Snow">Snow (FF 13 2)</option><option value = "ff_13_2_Yeul">Yeul (FF 13 2)</option><option value = "ff_tactics_Agrias">Agrias (FF TACTICS)</option><option value = "ff_tactics_Algus">Algus (FF TACTICS)</option><option value = "ff_tactics_Delita">Delita (FF TACTICS)</option><option value = "ff_tactics_Dycedarg">Dycedarg (FF TACTICS)</option><option value = "ff_tactics_Gafgarion">Gafgarion (FF TACTICS)</option><option value = "ff_tactics_Olan">Olan (FF TACTICS)</option><option value = "ff_tactics_Ramza">Ramza (FF TACTICS)</option><option value = "ff_tactics_Vormav">Vormav (FF TACTICS)</option><option value = "ff_tactics_Wiegraf">Wiegraf (FF TACTICS)</option><option value = "ff_tactics_Zalbag">Zalbag (FF TACTICS)</option><option value = "kh_2_Donald">Donald (KH 2)</option><option value = "kh_2_Goofy">Goofy (KH 2)</option><option value = "kh_2_Hayner">Hayner (KH 2)</option><option value = "kh_2_Jack Sparrow">Jack Sparrow (KH 2)</option><option value = "kh_2_Mickey">Mickey (KH 2)</option><option value = "kh_2_Pence">Pence (KH 2)</option><option value = "kh_2_Pete">Pete (KH 2)</option><option value = "kh_2_Roxas">Roxas (KH 2)</option><option value = "kh_2_Sora">Sora (KH 2)</option><option value = "kh_2_Tron">Tron (KH 2)</option><option value = "kh_Cid">Cid (KH)</option><option value = "kh_Donald">Donald (KH)</option><option value = "kh_Goofy">Goofy (KH)</option><option value = "kh_Kairi">Kairi (KH)</option><option value = "kh_Leon">Leon (KH)</option><option value = "kh_Maleficent">Maleficent (KH)</option><option value = "kh_Philoctetes">Philoctetes (KH)</option><option value = "kh_Pooh">Pooh (KH)</option><option value = "kh_Riku">Riku (KH)</option><option value = "kh_Sora">Sora (KH)</option><option value = "smt_4_Akira">Akira (SMT 4)</option><option value = "smt_4_Burroughs">Burroughs (SMT 4)</option><option value = "smt_4_Demon">Demon (SMT 4)</option><option value = "smt_4_Hope">Hope (SMT 4)</option><option value = "smt_4_Isabeau">Isabeau (SMT 4)</option><option value = "smt_4_Jonathan">Jonathan (SMT 4)</option><option value = "smt_4_Merkabah">Merkabah (SMT 4)</option><option value = "smt_4_Task">Task (SMT 4)</option><option value = "smt_4_Tayama">Tayama (SMT 4)</option><option value = "smt_4_Walter">Walter (SMT 4)</option></select></form>
​</div>

It’s quite reassuring to see the results. Yuna is closest to Terra, Red XIII, Dagger, and herself (FF X-2). All these characters are soft-spoken, eloquent, and the "smart" one in the party. They have a silent confidence and are laser-focused on their goal.

The closeness rankings are satisfyingly very intuitive. Try it out on your favorite character. For example, if you select Cloud from FF VII, you'd see that Squall is at the top. They’re both angsty guys with a lot of baggage and self-conflict. Sora is close, as well as other angsty characters like Paine and Cecil.

Let’s look at Zell from FF 8, the comic relief of the party and a tough guy with a heart of gold. Barret, Zidane, Snow, Wakka and Goofy are the closest to Zell, and it’s hard to argue against this grouping.

Lastly, let’s try a villain, Merkabah from Shin Megami Tensei 4. We retrieve mostly villains from the other games, with some protagonists thrown into the mix like Auron and Donald. Thinking about it, Auron and Doanld are quite cold and cruel in their manner of speaking and can probably be mistaken as villains, just basing on the dialog.

## C. Trope Clusters

Getting parallels across games was a fun exercise. What we want to do now is visualize the character vector space and locate areas belonging to specific tropes. Since our character vectors live in a 50-dimensional space, we have to bring them down to two dimensions to make sense of them easily. We will visualize the clusters with `tSNE`.

Let’s try it out on our character vectors. 

<div id="scatterdiv" class="graphcontainer fullwidth" style="margin:0 auto"></div>
<div id="fakediv2"></div>
<div style="margin:0 auto; text-align: center; display: block">
<p id = "number" style="font-style: italic; font-size: 80%; display: inline-block; margin: 0px; margin-bottom: 10px">1. Each character vector needs to be decentered from its game cluster.</p>
</div>
<div id="buttons" style="margin:0 auto; text-align: center; display: block">
    <img id = "backButton" style="display: inline-block; width:5%; margin-right: 1%; cursor: pointer " src="../images/vgtranscript/left-chevron.svg"/>
    <img id = "nextButton" style="display: inline-block; width:5%; margin-left: 1%; cursor: pointer" src="../images/vgtranscript/right-chevron.svg"/>
</div>

(*The viz is quite crowded as there are 150 characters competing for space. If you want to enlarge a particular character bubble, click on it and it'll also bring up the name and game of origin. Click again to minimize.*)

What we see makes sense but isn't really what we want. Just acting on the raw character vectors, we see that characters of a particular game all cluster together. (Color indicates the game of origin.) Why is this the case? Characters in a particular game all talk to one another, hence the content of their dialog is probably very similar. 

There are some [intricacies in reading `tSNE` charts](https://distill.pub/2016/misread-tsne/), but the gist is that it's safe to interpret close pairs as more similar than far pairs.

Some interesting observations:  
1. Final Fantasy X/X-2 and Kingdom Hearts I/II are close in the vector space. Even though we didn't pass information that the pair are direct sequels, `Doc2Vec` was able to pick up this relationship just from the dialog.
2. Final Fantasy VI and IX are close, as they share elements of high fantasy.
3. Cyan from Final Fantasy VI is closer to Final Fantasy XII, while Kuja (FF IX) and ExDeath (FF V) are close to VI.

The `tSNE` visualization suggests that each game clusters together and has a center of mass. Therefore, if we subtract each character vector from its respective game's center of mass, we will be able to tease out the character-dependent factor in the character vector. This character-dependent factor would be more indicative of the character's role in the story (hero, villain) and personality (goofball, silent-type, aloof), allowing a more game-independent view of tropes.

If you click on the *NEXT* button in the viz, you would arrive at game-independent vectors. Notice that there are now areas belonging to certain tropes. Some examples:
1. An area in the lower right contains the villain trope.
2. An area in the upper right contains the female hero archetype (ex. Yuna, Aerith, Terra, Dagger)
3. An area in the upper left contains the "bubbly" archetype (ex. Selphie, Rikku, Rinoa)
4. An area in the upper left contains the "goofball" archetype (ex. Zell, Wakka, Barrett)

Clicking on the *NEXT* button one last time shades the characters based on nearest neighbors with `DBSCAN`, making it easier to inspect these character groups.

There are lots of interesting things in the visual, like the relatively loud Cids of KH, FF IV and VII being clustered together, far from the wise Cid of FF V (closer to Yuna), the regal Cid of IX (closer to kings) and the schoolmaster Cid of FF VIII (closer to school figures); Balthier and Irvine being close; the assistants Alyssa (FF XII-2) and Burrough (SMT 4) being close; and the lead characters in SMT IV still being close to one another after decentering, which suggests that they don't have much of a personality to begin with (which I agree with).

## D. Improvements

There are a few things that can be done to improve this project.
1. A more careful preprocessing pipeline for the dialog might do wonders on the results. I took a lazy approach here and didn't really do a lot of cleaning, so there could be some artifacts. In addition, I only considered the top 10 characters per game based on dialog line count. This means that non-chatty main characters like Kimahri (FF X) and Vincent Valentine (FF VII) were filtered out. Maybe a whitelist of characters to include would be better than just basing on the top 10?
2. Adding more games would be amazing. In particular, I want to include all the mainline Final Fantasy and Dragon Quest games in the analysis.
4. Improving the clustering procedure might reveal interesting tropes.

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
        font-size: 100%;
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
    stroke-width: 3px;
                
    }

    .link.unselected {

    stroke: gray;
    stroke-width: 3px;
                
    }

</style>
<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="/assets/jrpg_lollipop.js"></script>
<script src="/assets/jrpg_scatter.js"></script>
