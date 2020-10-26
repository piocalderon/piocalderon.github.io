---
layout: post
title: Topical Harry Potter Text Generation with GPT-2 and PPLM
categories: [Data, NLP, Harry Potter]
excerpt: <img src="https://img1.looper.com/img/gallery/things-that-make-no-sense-about-harry-potter/intro-1550086067.jpg">Testing GPT-2 and Plug and Play Language Models by generating Harry Potter text steered towards certain topics.

---

Recently I've been playing around with text generation. One of the most popular (and powerful) models out there that can be leveraged for the task is OpenAI's GPT-2. 

In a nutshell, GPT-2 is a language model which predict the next word given a text prompt. The special sauce here is that the model is very large, is trained on a large dataset, and required immense computational power (~$43K of cloud computing power) to train.

What are some of the possible applications? Off the top of the head, the one we see almost everyday is our phone keyboard's autocorrect. Another common one is conversational AI, chatbots.

![](https://www.uctoday.com/wp-content/uploads/2019/09/Difference-Bots-Chatbots.jpg)

For applications, one doesn't usually train the GPT-2 model from scratch or start from zero, but finetune the off-the-shelf GPT-2 model on a smaller dataset. This smaller dataset is a snapshot of what you want GPT-2 to emulate. So if one wants to generate blog headlines, finetune GPT-2 on a set of blog headlines.

One can feed in a text prompt to GPT-2 and it will complete the sentence, the paragraph or whatever until the end of thought is reached. However, a big drawback to this is that you cannot control the generated text in an intuitive or easy way. What if we want GPT-2 to write spamm-y negative text or write about politics? Yes, you can curate a dataset for the specific goal and finetune on that, but isn't there an easier way?

Last year, Uber released their Plug-and-Play Language Models (PPLM), which combine GPT-2 with a small attribute model that you train on top of GPT-2. A fun analogy that they provide for PPLM is a mouse on top of a woolly mammoth, with the mouse steering the direction of the mammoth's trail.

![](https://1fykyq3mdn5r21tpna3wkdyi-wpengine.netdna-ssl.com/wp-content/uploads/2019/12/image14-1-1024x806.png)

The mammoth is the language generator (GPT-2) and the mouse, substantially smaller, is an attribute model steering the generated text towards the specific objective. An attribute model can be specified in two ways: through a topic (the bag-of-word approach) or a style (the discriminator approach).

Learning all about PPLM got me all excited, and so I started to use it for a small task at work. However, I quickly realized that there's a great deal of parameter tuning to get the text generation right.

I'm writing this short blog post to share some results on PPLM via a simple exercise: generating paragraphs of Harry Potter text steered towards certain topics. Finetuning data was sourced from [here](https://github.com/formcept/whiteboard/tree/master/nbviewer/notebooks/data/harrypotter), and the topics for the attribute model were taken from [here](https://github.com/uber-research/PPLM).

![](https://img1.looper.com/img/gallery/things-that-make-no-sense-about-harry-potter/intro-1550086067.jpg)

# Some Results
I ran a parameter sweep across three PPLM parameters (27 combinations) that the authors suggested to manipulate to get better results: the stepsize, which controls topic intensity, the KL coefficient, and the grad length. I tried out three topics: tech, kitchen, and politics.

Here are some results that made sense and somewhat fell under the respective topics.

## Tech / Computers
> “You are the first to be sent to Hogwarts for the purpose of studying,” said the wizard in charge of security. He was dressed in a green jacket with security guards and a security watch, and his wand-security system was still inoperable.

> “I’ve told him you can get back at him, I can get him back at his cabin and I’ve given him a free pass on everything, I don’t think you can get him back at your house. It’s a nightmare for him, he can no longer sleep outside with his family.” The house-elf owner had a home security system, but he had to live with a security system for his home.

## Kitchen
> “I’m going to get a bit of sleep,” Hermione assured them, as he turned away from the window and peered out through the window at the sky. “I’m not a big fan of raindrops, you know....” Harry had only a minute to get up and make his bed, and Ron told him to go to the window to take off the raincoat. He got it from a small windowpane, then threw it into the bin, and then, when he sat down, he found the kitchen sink. 

> “Oh — and I'm not going to tell you how I got into the castle, because it’s been all over the front page of the Daily Prophet for some time.” The door was open, though no sign of an oven. Hermione and I were both looking at the same tin pot. 

> “I’m sorry, she's been so kind!” said Mrs. Cole, as the twins looked around, looking shocked by the sight of a cat on her dinner table. “I just can’t imagine a good excuse to have a baby, Harry Potter....” “But what are we going to do with that food?” “There are food,” said Mrs. Cole.

> “Oh,” said Mrs. Weasley, looking rather alarmed. “We’ve had to make a very careful list of all the food we’ve eaten for the last week, and if you can do something about that we can put some on the table and put a plate of soup.” “Oh, I don’t know what it is, it’s pudding."

## Politics

> “I’m going to go and find out if you’ve been able to find my parents.” “I don’t know what you mean by parents, Harry, but I am not a bad person.” “Oh, well... I’m sorry...” said Harry. “I don’t really like it. I don’ know how I got in... I can wait until I can get permission to go. I don’t think I can get to the house of record. And you — I — er, order the execution of a state security order. That was my Order of Protection order.

> “But the Dursleys — who have had many enemies — have also, of course, had a number of enemies. I am afraid we have reached the point where we should not have been surprised, therefore, to see that you were expelled from Hogsmeade.” Dumbledore raised his hand to the top of the castle wall. The Dursleys were standing in a circle around the Great Hall, and the Minister of Magic seemed unable to make the Minister of state look into the country. 

> “You’ll see it when you’re back at the station, Potter!” she told Harry as she led her fellow students back to the dormitories where they awaited the next news. "And if you need a reminder, you can call for the International Confederation of Wizards.” She paused and said, in a low, low voice, “We’re here to tell you that we have a law that bans all state-sponsored violence within the state — ” But then a voice from the state department of health warned that it was to be monitored for any outbreak of violence. 

> “I don’t believe it,” said Snape, looking from Snape ’s desk to Harry’s and back again. “I don’t believe the prophecy.” “What?” said Harry quickly. “The prophecy?” "I dunno — Dumbledore’s gone.” There was a long pause of which Harry, Snape, and Dumbledore were discussing the state of the Department of Magical Cooperation under the Ministry, then Harry realized that the Ministry was in full operation, and so did the Ministry itself. 

PPLM is promising, but it requires a ton of effort to finetune to get good results. 

Some observations.

First, a larger parameter sweep must be done to get better results. The optimal parameters change depending on the topic, and there's really no easy way to find good output text unless you run the model with the parameters. Maybe find a way to automate this parameter search?

Second, it seems that the difficulty of topical text generation is related to the closeness of the topic to the finetuning data. I tried out religion and space as topics as well, but I couldn't arrive at good results.

Overall, I don't see PPLM being used in an online environment anytime soon (assuming topics change) but in offline environments where offline training is possible I can see it having its use.