*originally created by JMH on October 31, 2026 at 8:30 AM*

# Goal

* Add scrolling pictures of me from every year of my life to the site's home page.

# Details

* The pictures to display are specified in file `ThruTheYears-CaptionList.json`.

* The display will change every 3 seconds to the next picture listed in that JSON file.

* Ignore the `"comment"` object at the top of the JSON file.

* Each key is the name of a file located at https://jesseheines.com/~heines/images/Jesse/. Therefore, when using these images in the `src` attribute of an `img` tag, you need to prepend the file name with that URL.
  
  * Each picture is 400 pixels square.

* Associated with each key are a title, age, and date that make up the caption for the picture.
  
  * The `title` text is to be displayed in boldface below the picture.
  
  * The `age` text is to be displayed in boldface on a second line below the picture.
  
  * The `date` text is to be displayed 2 spaces to the right of the age text in normal weight and enclosed in parentheses.
  
  * The third line below the picture should say, in normal weight italics, "Hover over a picture to pause auto-advancing."
  
  * All of this text should be in a small font so that it fits within the horizontal width of the picture, i.e., 400 pixels.

* To to left of the caption should be the blue arrow at https://jesseheines.com/~heines/images/arrows/LucidaArrows193-Left-LightBlue_transparent.png that the user can click to move to the previous picture.

* To to right of the caption should be the blue arrow at https://jesseheines.com/~heines/images/arrows/LucidaArrows193-Right-LightBlue_transparent.png that the user can click to move to the next picture.

* When the user hovers over any picture, advancing stops and the two arrows turn red by replacing them with https://jesseheines.com/~heines/images/arrows/LucidaArrows193-Left-Red_transparent.png and https://jesseheines.com/~heines/images/arrows/LucidaArrows193-Right-Red_transparent.png, respectively.
  
  * At the same time, the line "Hover of a picture to pause auto-advancing" should change to "Move the mouse off the picture to resume auto-advancing" in red, boldface, italics.
  
  * When the user moves the mouse off the picture, auto-advancing should resume.

* The pictures should all be displayed in a frame with a solid black 1-pixel border and 5-pixel rounded corners.
  
  * The frame should be located to the left of the text in the `hero-home` section, replacing the template's profile headshot.
  
  * The frame can be positioned farther to the left of the text and closer to the sidebar.

* Overlayed on the frame, in white letters on a black background in the bottom right-hand corner, should be a text block that displays the number of the current picture and the total number of pictures in the form "77 or 102".

# Constraints

* All of your code and documentation pertaining to displaying the pictures, including all CSS and JavaScript, should be placed in this folder. 
* There is one more element to add, but let's leave that for later.

# Changes: Round 2

*updated by JMH on October 31, 2026 at 9:40 PM*

* In the desktop version, move the entire structure carousel left so that there are only 10 pixels between the border with the sidebar and the left edge of the carousel structure.

* One problem that has been introduced is that the text in the hero section that is not part of the carousel structure is now centered. That text should be left-justified as it was before, just 10 pixels to the right of the right edge of the carousel structure.

* Increase the rounded corners of the carouself picture frame to 10 pixels.

* Replace https://jesseheines.com/~heines/images/arrows/LucidaArrows193-Left-LightBlue_transparent.png with https://jesseheines.com/~heines/images/arrows/LucidaArrows193-Left-LightGreen_transparent.png.

* Replace https://jesseheines.com/~heines/images/arrows/LucidaArrows193-Right-LightBlue_transparent.png with https://jesseheines.com/~heines/images/arrows/LucidaArrows193-Right-LightGreen_transparent.png.

* Make the "Hover of a picture to pause auto-advancing" text light green as well, using RGB( 150, 211, 95 ).

* Note that in some of the objects in ThruTheYears-CaptionList.json I have added the name:value pair "omit":true,.  This indicates that that picture should not be displayed. That is, since I can't comment out code in a JSON file, please just omit those pictures from the display.

* I agree that the entire carousel display may be a bit to big. Let's reduce the picture frame size to 350 pixels. The width of the caption section below the pictures can stay at 400 pixels for now.

# Changes: Round 3

*updated by JMH on November 1, 2026 at 8:00 AM*

* The spacing of the carousel block and the site text is now perfect, but I would still like you to move the entire hero section to the left. I believe that the carousel block is the DIV with class="container aos-init aos-animate". I asked that it be only 10 pixels from the sidebar (header id="navigation", I think), but it seems to be about 50 pixels from the sidebar. 10 pixels is probably too small a margin, so let's try 20 pixels, please.

* Note that the spacing in the previous instruction is just for the desktop version. In the mobile version, the carousel stands alone, so it should be centered.

* Change the "Hover over a picture to pause auto-advancing." text to boldface and change its color to RGB( 159, 214, 109 ).

* Replace https://jesseheines.com/~heines/images/arrows/LucidaArrows193-Left-Red_transparent.png with https://jesseheines.com/~heines/images/arrows/LucidaArrows193-Left-Yellow_transparent.png.
- Replace https://jesseheines.com/~heines/images/arrows/LucidaArrows193-Right-Red_transparent.png with https://jesseheines.com/~heines/images/arrows/LucidaArrows193-Right-Yellow_transparent.png.

- Change the "Move the mouse off the picture to resume auto-advancing." text (including adding a period at the end) to boldface and change its color to RGB( 245, 236, 0 ).

- Please add a 5-pixel drop shadow to the right and bottom of the picture frame on the desktop version.

- I would like the pictures to flow into one another more smoothly. Can you make the current picture fade out while the next one fades in over perhaps half a second?

- And finally for this set of changes, can you make the first line of the caption wider in the mobile version so that the text doesn't wrap for longer captions

# Changes: Round 4

*updated by JMH on November 3, 2026 at 9:54 AM*

- In the `hero-home` section, on the iPhone, the 10-pixel separator between the carousel container and the text container seems to be at the right of the carousel. This makes the carousel off-center in that small format. In addition, it makes the text container flush with the left-hand margin of the iPhone. The spacing is fine in the desktop version, so on `X-Small` devices please associate the 10-pixel separator with the text container, not the carousel container.

- The drop shadow that you put on `img class="tty-photo"` is the right size, but it's a solid color. Please make this a gradient from black to fading out.

- The transition between photos that you implemented is a fade-through-black, not a true crossfade. Can you make the new picture fade in at the same time that the old one is fading out? I know that jQuery can do that, so I'm thinking that it can be done with some combination of JavaScript and CSS.

- The `div class="tty-title"` has to be a wider because some title are wrapping. I think that if you make it as wide as `div="tty-caption-row"` it'll be good. Please try that width.

- On the iPhone, that is, on `X-Small` devices, we need to change "Hover over a picture to pause auto-advancing." to "Tap a picture to pause auto-advancing." Likewise, we neet to change "Move the mouse off the picture to resume auto-advancing." to "Tap the picture to resume auto-advancing."

- You will notice that I added a `"menu" : integer` name:value pair to some of the entries in the ThruTheYears-CaptionList.json file. The purpose of these entries is to created a menu below the picture captions containing these integers. When the user clicks one of the integers in the menu, the carousel should jump to that picture and then continuing running normally from there. The menu itself should be a horizontal bar in the same color as the instructional text just above it with the numbers spaced evenly across that bar. The numbers should be preceded by the text: ***Age Links:*** in boldface italics. The numbers themselves should also be in boldface white text.

- More changes and page additions are to come, but I think that this is enough for now!

# Changes: Round 5

*updated by JMH on November 3, 2026 at 10:52 AM*

- Nice job. Really. I love the crossfade now. And the captions don't wrap anymore. Yay! :) Just a few more tweaks to this aspect of the website and then we're ready to move on to other aspects of it.

- Please make the ***Age Links:*** text white and please make the space between that text and the `1` the same as the space between the numbers.

- On the iPhone, tapping a picture indeed pauses the auto-advancing, but tapping the picture a second time does not resume auto-advancing. Please fix that.

- When I resize the browser on my laptop to step through the various Bootstrap breakpoints, the carousel, that is, `div id="thru-the-years"` gets much too wide. Please keep the width of the carousel and its associated captions and arrows constant throughout all breakpoints. This will prevent the text in the `hero` section from having to wrap excessively.

- One last thing: I would like you to please always print the clock time that you started processing and the clock time that you ended processing and state how many actual minutes elapsed between these two events. Please correct me if I'm wrong, but when you display a message at the end of a processing session such as "Brewed for 6m 14s" that's actually your processing time, not clock time, right? If I'm correct, I'd like to know the actual clock time, too.

# Changes: Round 6

updated by JMH on November 3, 2026 at 11:20 AM

- OK, a couple of tiny changes and we'll commit everything and move on to another aspet of the website.

- The main problem that remains with the carousel DIV is that it is still not centered on the iPhone. In addition, in the middle breakpoints on the desktop the left arrow and age menu bar are flush with the left-hand margin of `section id="hero-home"`. I would prefer that there is always at least 10px margin at the left of the carousel regardless of the breakpoint size. I'm not sure what that margin should be on the iPhone, but perhaps we could try 10px to see if that works there, too.

- Given everything that we've added to the carousel DIV, we now need to increase the vertical size of the `hero-home` section both on the desktop and iPhone versions. I think that adding 10px to whatever that section's current height is now and centering everything vertically (which I think is already done) should give us just a bit of space at the top and bottom of the carousel and make it look a bit cleaner.
