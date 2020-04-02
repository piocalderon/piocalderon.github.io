---
layout: post
title: Can You Read My Mind? The Killers / Lana Del Rey Discography Analysis
categories: [Data, NLP, The Killers, Lana Del Rey]
excerpt: <img src="/images/20180709/03.png"> We utilize basic natural language processing to probe the lyrics of The Killers and Lana Del Rey.

---
# The Killers
![](/images/20180709/01.jpeg)

The Killers have released five full-length albums since 2004, a few new wave and disco rock, like *Hot Fuss* and *Day and Age*, and some Americana-influenced, like *Sam’s Town* and *Battle Born*. I’ve been a massive fan of The Killers over the years, though I didn’t appreciate their latest work, *Wonderful Wonderful*, that much. Hoping that they find a way back to their roots.

For this article, we aim to do two things to analyze the discography of The Killers.
1. Word frequency analysis per album
2. Lyrics embedding analysis

## Word Frequency Analysis
We check which words appear most frequently in the songs of each album. We do not account for repeat lyrics in the same song, i.e. multiple occurrences of the word ‘baby’ in a song are only counted once. The word frequency of x then refers to the number of songs that the word x appeared in. We pass all the words through a stop word filter (i.e. NLTK’s english filter) and we only consider nouns in our analysis.

Below is a visualization of the top 10 words per album. The size in this case is proportional to the frequency of the word in the album’s songs.

![](/images/20180709/02.png)

Interestingly, the top words in Hot Fuss and Day and Age are most similar, as well as Sam’s Town and Battle Born. Personally, I feel like Hot Fuss and Day and Age are quite similar since they both contain dance-y tunes, whereas Sam’s Town and Battle Born steer more towards rock. The first pair talks more about time, mind, tonight, while the second pair talks about heart and the world. Wonderful Wonderful focuses more on man and money, quite different from the previous records.

## Lyrics Embedding Analysis
Next, let’s look at the semantic similarity of the songs and albums. For this, we’ll be using the 300-dimensional [`slim Word2vec`](https://github.com/eyaler/word2vec-slim/) model.

For those of you who aren’t familiar with [`Word2vec`](http://mccormickml.com/2016/04/19/word2vec-tutorial-the-skip-gram-model/), it is a type of “embedding” model whose goal is to transform words into N-dimensional dense vectors. This representation has been found to retain the semantics/ associations of the words, and so operations on these vectors retain analogies. For example, adding the vectors of “king” and “woman” and subtracting the vector of “man” would get you “queen”.

`Word2vec` takes as input a word, but what we actually want is a “song” embedding which converts a song into a dense vector. In this case, we will simply average the vectors of each word in a song to get a “song” vector. Personally, I find this method a bit crude, since there is a massive loss of information involved, but I haven’t really found a better way of going from word to song. There is an embedding called `Doc2vec` which transforms documents to vectors, but taking into consideration our small sample set and the fact that we have to train our own `Doc2vec` model, I think averaging the word vectors is our current best bet.

OK, given “song” vectors, which are 300-dimensional, we have to find a way to project them in a 2-dimensional space for easy viewing. For this, we will be using a nonlinear transform called [`t-SNE`](https://lvdmaaten.github.io/tsne/).

Below is a t-SNE visualization of the songs and albums. For the album vector, I basically took a mean over the song vectors in the album. Since they’re averaged-out vectors, they appear in the center.

![](/images/20180709/03.png)

How do you read the graph? Songs in the center can be thought of as “usual” in the sense of semantic content. Songs distant from the center have “unusual” semantic content. Songs that are close to one another are lyrically semantically similar.

Thus, we see here that Sam’s Town’s Enterlude and Exitlude are close and far from the center, Somebody Told Me and Jenny Was a Friend of Mine close together, Heart of a Girl and Runaways, etc.
We also see here how Battle Born songs tend to be close to one another, while songs from Wonderful Wonderful are all over the place. Personally, I think that Battle Born was a conceptually cohesive album, while Wonderful Wonderful was not.

Overall, I think that the analysis is still a bit raw. One big hurdle is going from word vector to song vector, since the current method throws out a lot of information. Nevertheless, this is a good first effort, follow-up should expound on a better song representation.

# Lana Del Rey
![](/images/20180709/04.jpeg)

A preamble. I find Lana Del Rey to be such an intriguing artist. She has this very cinematic and old-fashioned quality to her, but she manages to sound fresh and contemporary at the same time. I enjoyed her Ultraviolence album, which I consider her best work, and disliked Honeymoon, which I consider to be quite boring.

## Word Frequency Analysis

![](/images/20180709/05.png)

It’s quite funny but not at all surprising to see that love, life and baby appear in the top words across all albums. Well, Lana Del Rey is a torch singer, so it’s to be expected.

## Lyrics Embedding Analysis

![](/images/20180709/06.png)

Brite Lights, Sad Girl, Flipside, Money Power Glory appear to be in the periphery, and can be considered to be the most unusual songs, semantically speaking. Looking per album, songs from Born to Die seems to be the closest ones overall, while AKA Lizzy Grant and Ultraviolence are all over the place.

